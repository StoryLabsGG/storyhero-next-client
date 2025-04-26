import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { S3Client } from '@aws-sdk/client-s3';
import { SFNClient } from '@aws-sdk/client-sfn';

export const awsConfig = {
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

export const s3Client = new S3Client(awsConfig);
export const dynamoDbClient = new DynamoDBClient(awsConfig);
export const sfnClient = new SFNClient(awsConfig);
export const eventBridgeClient = new EventBridgeClient(awsConfig);
