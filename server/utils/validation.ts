export function validateYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return youtubeRegex.test(url);
}

export function validateTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  return timeRegex.test(time);
}

export function timeToSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

export function validateTimeRange(start: string, end: string): boolean {
  if (!validateTimeFormat(start) || !validateTimeFormat(end)) {
    return false;
  }
  return timeToSeconds(start) < timeToSeconds(end);
}

export interface ClipRequest {
  url: string;
  start: string;
  end: string;
  format: 'mp4' | 'mp3';
  quality?: '720p' | '1080p';
}

export function validateClipRequest(data: unknown): { valid: boolean; error?: string; data?: ClipRequest } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const req = data as Partial<ClipRequest>;

  if (!req.url || typeof req.url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }

  if (!validateYouTubeUrl(req.url)) {
    return { valid: false, error: 'Invalid YouTube URL' };
  }

  if (!req.start || typeof req.start !== 'string') {
    return { valid: false, error: 'Start time is required' };
  }

  if (!req.end || typeof req.end !== 'string') {
    return { valid: false, error: 'End time is required' };
  }

  if (!validateTimeFormat(req.start)) {
    return { valid: false, error: 'Invalid start time format (use HH:MM:SS)' };
  }

  if (!validateTimeFormat(req.end)) {
    return { valid: false, error: 'Invalid end time format (use HH:MM:SS)' };
  }

  if (!validateTimeRange(req.start, req.end)) {
    return { valid: false, error: 'Start time must be before end time' };
  }

  if (!req.format || !['mp4', 'mp3'].includes(req.format)) {
    return { valid: false, error: 'Format must be mp4 or mp3' };
  }

  if (req.format === 'mp4' && req.quality && !['720p', '1080p'].includes(req.quality)) {
    return { valid: false, error: 'Quality must be 720p or 1080p' };
  }

  return {
    valid: true,
    data: {
      url: req.url,
      start: req.start,
      end: req.end,
      format: req.format,
      quality: req.quality,
    },
  };
}
