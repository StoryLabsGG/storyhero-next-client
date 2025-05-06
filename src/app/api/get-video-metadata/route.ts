import { NextResponse } from 'next/server';

import { getSecret } from '@/lib/clients/ssmClient';

// Helper function to extract YouTube video ID from various URL formats
function extractYoutubeVideoId(url: string): string | null {
  // Handle youtu.be format
  if (url.includes('youtu.be')) {
    const parts = url.split('/');
    return parts[parts.length - 1].split('?')[0];
  }

  // Handle youtube.com format
  if (url.includes('youtube.com')) {
    const urlParams = new URL(url).searchParams;
    return urlParams.get('v');
  }

  return null;
}

// Function to get YouTube video details using YouTube Data API
async function getYouTubeVideoDetailsWithAPI(videoId: string) {
  try {
    const apiKey = await getSecret('YOUTUBE_API_KEY');

    if (!apiKey) {
      console.warn(
        'YouTube API key is not set. Falling back to basic metadata.'
      );
      return getYouTubeVideoDetailsBasic(videoId);
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`YouTube API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('No video found with the provided ID');
    }

    const videoData = data.items[0];
    const title = videoData.snippet.title;
    const thumbnailUrl =
      videoData.snippet.thumbnails.maxres?.url ||
      videoData.snippet.thumbnails.high?.url ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    // Parse ISO 8601 duration format to seconds
    const duration = parseDuration(videoData.contentDetails.duration);

    return {
      videoId,
      title,
      thumbnail: thumbnailUrl,
      duration,
    };
  } catch (error) {
    console.error('Error fetching YouTube video details with API:', error);
    // Fall back to basic method if API call fails
    return getYouTubeVideoDetailsBasic(videoId);
  }
}

// Parse ISO 8601 duration format to seconds
function parseDuration(isoDuration: string): number {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return 0;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  return hours * 3600 + minutes * 60 + seconds;
}

// Basic method without API key for fallback
async function getYouTubeVideoDetailsBasic(videoId: string) {
  try {
    // Get video thumbnail
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

    // Fetch the YouTube video page to extract info
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(videoUrl);
    const html = await response.text();

    // Extract title using regex
    let title = null;
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(' - YouTube', '').trim();
    }

    // Try to extract duration from the page HTML
    let duration = null;
    try {
      // Look for structured data in the page
      const structuredDataMatch = html.match(
        /"duration":"PT([0-9]+H)?([0-9]+M)?([0-9]+S)?"/
      );
      if (structuredDataMatch) {
        const durationString = `PT${structuredDataMatch[1] || ''}${structuredDataMatch[2] || ''}${structuredDataMatch[3] || ''}`;
        duration = parseDuration(durationString);
      }

      // If we couldn't find it in structured data, try the watch-time info
      if (!duration) {
        const lengthMatch = html.match(/lengthSeconds\\?":\\?"([0-9]+)\\?"/);
        if (lengthMatch && lengthMatch[1]) {
          duration = parseInt(lengthMatch[1], 10);
        }
      }
    } catch (e) {
      console.error('Error parsing duration:', e);
    }

    return {
      videoId,
      title,
      thumbnail: thumbnailUrl,
      duration,
    };
  } catch (error) {
    console.error(
      'Error fetching YouTube video details with basic method:',
      error
    );
    return {
      videoId,
      title: null,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      duration: null,
    };
  }
}

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

    // Try to get details with API first, falls back to basic method if needed
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
