import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { dynamoDbClient } from '@/lib/aws';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const command = new GetItemCommand({
      TableName: process.env.USERS_TABLE_NAME,
      Key: {
        id: { S: userId },
      },
      ProjectionExpression: 'credits',
    });

    const response = await dynamoDbClient.send(command);

    // If credits field doesn't exist, return 0
    const credits = response.Item?.credits?.N
      ? parseInt(response.Item.credits.N, 10)
      : 0;

    return NextResponse.json({ credits });
  } catch (error) {
    console.error('Failed to fetch user credits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user credits', credits: 0 },
      { status: 500 }
    );
  }
}
