import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { dynamoDbClient } from '@/lib/aws';
import { PRESETS_TABLE } from '@/lib/constants';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User authentication required' },
        { status: 401 }
      );
    }

    const command = new QueryCommand({
      TableName: PRESETS_TABLE,
      IndexName: 'UserIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: userId },
      },
      ScanIndexForward: false,
    });

    const response = await dynamoDbClient.send(command);

    if (!response.Items || response.Items.length === 0) {
      return NextResponse.json({ presets: [] });
    }

    const presets = response.Items.map((item) => {
      let inputProps = {};
      if (item.inputProps?.M) {
        inputProps = unmarshall(item.inputProps.M); // DynamoDB -> JS object
      }

      return {
        id: item.id.S,
        name: item.name.S,
        description: item.description?.S || '',
        compositionId: item.compositionId.S,
        inputProps: inputProps,
        createdAt: Number(item.createdAt.N),
        updatedAt: item.updatedAt?.N ? Number(item.updatedAt.N) : undefined,
      };
    });

    return NextResponse.json({ presets });
  } catch (error) {
    console.error('Failed to fetch presets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch presets' },
      { status: 500 }
    );
  }
}
