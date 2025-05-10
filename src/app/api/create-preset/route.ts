import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';

import { authOptions } from '@/lib/auth';
import { dynamoDbClient } from '@/lib/aws';
import { PRESETS_TABLE } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const { name, compositionId, inputProps, description } =
      await request.json();

    if (!name || !compositionId || !inputProps) {
      return NextResponse.json(
        { error: 'Name, compositionId and inputProps are required' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User authentication required' },
        { status: 401 }
      );
    }

    const presetId = uuidv4();
    const now = Date.now();

    // convert JavaScript objects to DynamoDB format
    const item = marshall({
      id: presetId,
      userId: userId,
      compositionId: compositionId,
      name: name,
      description: description || '',
      inputProps: inputProps,
      createdAt: now,
      updatedAt: now,
    });

    const putCommand = new PutItemCommand({
      TableName: PRESETS_TABLE,
      Item: item,
    });

    await dynamoDbClient.send(putCommand);

    return NextResponse.json({
      success: true,
      preset: {
        id: presetId,
        userId,
        compositionId,
        name,
        description,
        inputProps,
        createdAt: now,
        updatedAt: now,
      },
      message: 'Preset created successfully',
    });
  } catch (error) {
    console.error('Failed to create preset:', error);
    return NextResponse.json(
      { error: 'Failed to create preset' },
      { status: 500 }
    );
  }
}
