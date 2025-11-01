import { useState, FormEvent } from 'react';
import { Download, Scissors } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { validateYouTubeUrl, validateTimeFormat, validateTimeRange } from '../lib/utils';

interface ClipFormProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function ClipForm({ onSuccess, onError }: ClipFormProps) {
  const [url, setUrl] = useState('');
  const [startTime, setStartTime] = useState('00:00:00');
  const [endTime, setEndTime] = useState('00:00:30');
  const [format, setFormat] = useState<'mp4' | 'mp3'>('mp4');
  const [quality, setQuality] = useState<'720p' | '1080p'>('720p');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateYouTubeUrl(url)) {
      onError('Please enter a valid YouTube URL');
      return;
    }

    if (!validateTimeFormat(startTime)) {
      onError('Invalid start time format (use HH:MM:SS)');
      return;
    }

    if (!validateTimeFormat(endTime)) {
      onError('Invalid end time format (use HH:MM:SS)');
      return;
    }

    if (!validateTimeRange(startTime, endTime)) {
      onError('Start time must be before end time');
      return;
    }

    setIsProcessing(true);

    try {
      const requestBody = {
        url,
        start: startTime,
        end: endTime,
        format,
        ...(format === 'mp4' && { quality }),
      };

      const response = await fetch('http://localhost:3001/api/clip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process clip');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `clip_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      onSuccess('Clip downloaded successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="url">YouTube URL</Label>
        <Input
          id="url"
          type="text"
          placeholder="https://youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isProcessing}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start">Start Time (HH:MM:SS)</Label>
          <Input
            id="start"
            type="text"
            placeholder="00:00:00"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={isProcessing}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end">End Time (HH:MM:SS)</Label>
          <Input
            id="end"
            type="text"
            placeholder="00:00:30"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={isProcessing}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="format">Format</Label>
          <Select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value as 'mp4' | 'mp3')}
            disabled={isProcessing}
          >
            <option value="mp4">Video (MP4)</option>
            <option value="mp3">Audio (MP3)</option>
          </Select>
        </div>

        {format === 'mp4' && (
          <div className="space-y-2">
            <Label htmlFor="quality">Quality</Label>
            <Select
              id="quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value as '720p' | '1080p')}
              disabled={isProcessing}
            >
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </Select>
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Scissors className="mr-2 h-4 w-4 animate-spin" />
            Processing your clip...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Download Clip
          </>
        )}
      </Button>
    </form>
  );
}
