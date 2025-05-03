import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { NextResponse } from 'next/server';

import { dynamoDbClient } from '@/lib/aws';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // If userId is provided, list all jobs for that user
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const command = new QueryCommand({
      TableName: process.env.GENERATE_SHORTS_JOBS_TABLE_NAME,
      IndexName: 'UserIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: userId },
      },
      ScanIndexForward: false,
    });

    const response = await dynamoDbClient.send(command);

    if (!response.Items || response.Items.length === 0) {
      return NextResponse.json({ jobs: [] });
    }

    const jobs = response.Items.map((item) => ({
      id: item.id.S,
      userId: item.userId.S,
      sourceUrl: item.sourceUrl.S,
      createdAt: Number(item.createdAt.N),
    }));

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
