import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { S3Client } from '@aws-sdk/client-s3';
import { SFNClient } from '@aws-sdk/client-sfn';

const isLocalEnvironment = process.env.NODE_ENV === 'development';

const getAwsConfig = () => {
  const config = {
    region: process.env.AWS_REGION!,
  };

  if (
    isLocalEnvironment &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
  ) {
    return {
      ...config,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    };
  }

  return config;
};

export const dynamoDbClient = new DynamoDBClient(getAwsConfig());
export const s3Client = new S3Client(getAwsConfig());
export const sfnClient = new SFNClient(getAwsConfig());
export const eventBridgeClient = new EventBridgeClient(getAwsConfig());
