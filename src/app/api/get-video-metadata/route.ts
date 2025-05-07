import { NextResponse } from 'next/server';

import {
  extractYoutubeVideoId,
  getYouTubeVideoDetailsWithAPI,
} from '@/lib/youtube';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    const videoId = extractYoutubeVideoId(url);

    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    const videoDetails = await getYouTubeVideoDetailsWithAPI(videoId);

    return NextResponse.json(videoDetails);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video details' },
      { status: 500 }
    );
  }
}
