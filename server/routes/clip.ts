import express, { Request, Response } from 'express';
import { validateClipRequest } from '../utils/validation';
import { processVideo } from '../services/videoProcessor';
import { cleanupFile } from '../utils/cleanup';
import { promises as fs } from 'fs';

export const clipRouter = express.Router();

clipRouter.post('/', async (req: Request, res: Response) => {
  const validation = validateClipRequest(req.body);

  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const { url, start, end, format, quality } = validation.data!;

  try {
    const result = await processVideo({ url, start, end, format, quality });

    res.setHeader('Content-Type', format === 'mp3' ? 'audio/mpeg' : 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${result.outputFilename}"`);

    const fileBuffer = await fs.readFile(result.outputPath);
    res.send(fileBuffer);

    await Promise.all([...result.tempFiles, result.outputPath].map(cleanupFile));
  } catch (error) {
    console.error('[API] Error:', error);
    const msg = error instanceof Error ? error.message : 'Processing failed';
    res.status(500).json({ error: msg });
  }
});
