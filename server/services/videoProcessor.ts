import ytDlp from 'yt-dlp-exec';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ensureTmpDir, cleanupFile } from '../utils/cleanup';
import { timeToSeconds } from '../utils/validation';

export interface ProcessVideoOptions {
  url: string;
  start: string;
  end: string;
  format: 'mp4' | 'mp3';
  quality?: '720p' | '1080p';
}

export async function processVideo(options: ProcessVideoOptions) {
  const { url, start, end, format, quality } = options;
  const tmpDir = await ensureTmpDir();
  const uniqueId = uuidv4();
  const tempFiles: string[] = [];

  try {
    console.log('[yt-dlp] Starting download...');
    const downloadedVideoPath = path.join(tmpDir, `${uniqueId}_original.mp4`);

    let ytDlpFormat = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
    if (format === 'mp4' && quality) {
      if (quality === '720p') {
        ytDlpFormat = 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best';
      } else if (quality === '1080p') {
        ytDlpFormat = 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best';
      }
    }

    await ytDlp(url, {
      output: downloadedVideoPath,
      format: ytDlpFormat,
      mergeOutputFormat: 'mp4',
    });

    console.log('[yt-dlp] Download complete');
    tempFiles.push(downloadedVideoPath);

    const startSeconds = timeToSeconds(start);
    const endSeconds = timeToSeconds(end);
    const duration = endSeconds - startSeconds;

    const outputExtension = format === 'mp3' ? 'mp3' : 'mp4';
    const outputPath = path.join(tmpDir, `${uniqueId}_clip.${outputExtension}`);
    const outputFilename = `clip_${Date.now()}.${outputExtension}`;

    console.log('[ffmpeg] Starting processing...');

    await new Promise<void>((resolve, reject) => {
      let command = ffmpeg(downloadedVideoPath)
        .setStartTime(startSeconds)
        .setDuration(duration);

      if (format === 'mp3') {
        command = command.audioCodec('libmp3lame').audioBitrate('192k').noVideo();
      } else {
        command = command.videoCodec('libx264').audioCodec('aac');
      }

      command
        .output(outputPath)
        .on('end', () => {
          console.log('[ffmpeg] Complete');
          resolve();
        })
        .on('error', (err) => {
          console.error('[ffmpeg] Error:', err.message);
          reject(err);
        })
        .run();
    });

    return { outputPath, outputFilename, tempFiles };
  } catch (error) {
    for (const file of tempFiles) {
      await cleanupFile(file);
    }
    throw error;
  }
}
