import { QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { NextResponse } from 'next/server';

import { dynamoDbClient } from '@/lib/aws';
import { GENERATE_SHORTS_JOBS_TABLE } from '@/lib/constants';
import {
  extractYoutubeVideoId,
  getYouTubeVideoDetailsWithAPI,
} from '@/lib/youtube';

export async function POST(request: Request) {
  try {
    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const command = new QueryCommand({
      TableName: GENERATE_SHORTS_JOBS_TABLE,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': { S: jobId },
      },
    });

    const response = await dynamoDbClient.send(command);

    if (!response.Items || response.Items.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const job = response.Items[0];

    if (!job.sourceUrl.S) {
      return NextResponse.json(
        { error: 'Job source URL is required' },
        { status: 400 }
      );
    }

    const videoId = extractYoutubeVideoId(job.sourceUrl.S);
    const videoMetadata = await getYouTubeVideoDetailsWithAPI(videoId || '');
    const videoTitle = videoMetadata.title;
    const thumbnailUrl = videoMetadata.thumbnail;

    const updateCommand = new UpdateItemCommand({
      TableName: GENERATE_SHORTS_JOBS_TABLE,
      Key: {
        id: { S: jobId },
      },
      UpdateExpression:
        'set videoTitle = :videoTitle, thumbnailUrl = :thumbnailUrl',
      ExpressionAttributeValues: {
        ':videoTitle': { S: videoTitle },
        ':thumbnailUrl': { S: thumbnailUrl },
      },
      ReturnValues: 'UPDATED_NEW',
    });

    await dynamoDbClient.send(updateCommand);

    return NextResponse.json({
      success: true,
      message: 'Thumbnail updated',
    });
  } catch (error) {
    console.error('Failed to update thumbnail:', error);
    return NextResponse.json(
      { error: 'Failed to update thumbnail' },
      { status: 500 }
    );
  }
}
