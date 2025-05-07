import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';

import { authOptions } from '@/lib/auth';
import { dynamoDbClient } from '@/lib/aws';
import { publishEvent } from '@/lib/clients/eventbridge';
import { GENERATE_SHORTS_JOBS_TABLE } from '@/lib/constants';
import {
  extractYoutubeVideoId,
  getYouTubeVideoDetailsWithAPI,
} from '@/lib/youtube';

export async function POST(request: Request) {
  try {
    const { url, settings, compositionId, cookiesKey, maxShorts, maxDuration } =
      await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const requestId = uuidv4();
    const now = Date.now();

    // Create a settings object for DynamoDB
    const settingsMap = settings
      ? {
          M: {
            captionStyle: settings.captionStyle
              ? { S: settings.captionStyle }
              : { NULL: true },
            backgroundColor: settings.backgroundColor
              ? { S: settings.backgroundColor }
              : { NULL: true },
            backgroundStyle: settings.backgroundStyle
              ? { S: settings.backgroundStyle }
              : { NULL: true },
            aspectRatio: settings.aspectRatio
              ? { S: settings.aspectRatio }
              : { NULL: true },
            captionColor: settings.captionColor
              ? { S: settings.captionColor }
              : { NULL: true },
            captionSize: settings.captionSize
              ? { S: settings.captionSize }
              : { NULL: true },
            captionPosition: settings.captionPosition
              ? { S: settings.captionPosition }
              : { NULL: true },
            clipDuration: settings.clipDuration
              ? { N: settings.clipDuration.toString() }
              : { NULL: true },
            presetId: settings.presetId
              ? { S: settings.presetId }
              : { NULL: true },
          },
        }
      : { NULL: true };

    const videoId = extractYoutubeVideoId(url);
    const videoMetadata = await getYouTubeVideoDetailsWithAPI(videoId || '');
    const videoTitle = videoMetadata.title;
    const thumbnailUrl = videoMetadata.thumbnail;

    const putCommand = new PutItemCommand({
      TableName: GENERATE_SHORTS_JOBS_TABLE,
      Item: {
        id: { S: requestId },
        userId: { S: userId },
        videoTitle: { S: videoTitle },
        thumbnailUrl: { S: thumbnailUrl },
        sourceUrl: { S: url },
        compositionId: { S: compositionId },
        status: { S: 'PROCESSING' },
        settings: settingsMap,
        createdAt: { N: now.toString() },
      },
    });

    await dynamoDbClient.send(putCommand);

    // Publish event to EventBridge with settings
    await publishEvent({
      eventType: 'GenerateShorts',
      payload: {
        requestId,
        url,
        userId,
        compositionId: compositionId,
        cookiesKey: cookiesKey ?? null,
        maxShorts: maxShorts ?? 6,
        maxDuration: maxDuration ?? 30,
      },
    });

    return NextResponse.json({
      success: true,
      requestId,
      message: 'Shorts generation started',
    });
  } catch (error) {
    console.error('Failed to create shorts:', error);
    return NextResponse.json(
      { error: 'Failed to create shorts' },
      { status: 500 }
    );
  }
}
