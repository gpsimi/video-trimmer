# Clip Range - Getting Started Guide

A modern YouTube video and audio clipping tool built with React, Express, and Tailwind CSS.

## What You Have

A fully functional web application that lets you:
- Download clips from YouTube videos
- Choose between MP4 video or MP3 audio format
- Select video quality (720p or 1080p)
- Specify precise start and end times for clips
- Automatically download the clipped file

## Prerequisites

Before running, make sure you have these installed on your system:

1. **Node.js** (v18+) - https://nodejs.org
2. **ffmpeg** - Video processing tool
   - Mac: `brew install ffmpeg`
   - Linux: `sudo apt-get install ffmpeg`
   - Windows: https://ffmpeg.org/download.html
3. **yt-dlp** - YouTube downloader
   - Mac: `brew install yt-dlp`
   - Linux: `pip install yt-dlp`
   - Windows: https://github.com/yt-dlp/yt-dlp/releases

Verify with:
```bash
ffmpeg -version
yt-dlp --version
```

## Quick Start

1. Dependencies are already installed. Start the app:
```bash
npm run dev
```

2. Open your browser to:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001 (runs automatically)

3. Paste a YouTube URL, set start/end times (HH:MM:SS), choose format, and download!

## Project Structure

```
├── server/                    # Backend (Express)
│   ├── index.ts              # Server entry
│   ├── routes/clip.ts        # API endpoint
│   ├── services/             # Business logic
│   └── utils/                # Helpers
├── src/                       # Frontend (React)
│   ├── components/           # React components
│   ├── hooks/                # Custom hooks
│   └── lib/                  # Utilities
├── tmp/                      # Auto-deleted temp files
└── dist/                     # Built frontend
```

## How It Works

1. You submit a YouTube URL with time range and format
2. Backend downloads the video using yt-dlp
3. Backend trims and converts using ffmpeg
4. File is streamed to your browser and auto-downloads
5. Temporary files are automatically cleaned up

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "ffmpeg not found" | Make sure ffmpeg is installed and in PATH |
| "yt-dlp not found" | Make sure yt-dlp is installed and in PATH |
| Port 5173 in use | Change Vite port in `vite.config.ts` |
| Port 3001 in use | Set `PORT` env var: `PORT=3002 npm run dev` |
| Video won't process | Check if video is public and not geo-restricted |

## Development Scripts

- `npm run dev` - Start both frontend and backend
- `npm run server` - Backend only
- `npm run build` - Build frontend for production
- `npm run lint` - Check code quality

## Important Notes

- **Personal use only** - Respect copyright and YouTube's ToS
- Processing large videos takes time - be patient
- Temp files in `./tmp` are auto-deleted after download
- Quality setting only applies to MP4 format
- All processing happens locally on your machine

## Next Steps

The app is ready to use! Just run `npm run dev` and start clipping.

For more details, see SETUP.md
