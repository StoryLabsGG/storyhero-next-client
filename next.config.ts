import type { NextConfig } from 'next';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const baseConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.youtube.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  transpilePackages: ['@storylabsgg/storybox-remotion'],
};

async function getSecret(name: string): Promise<string> {
  const ssm = new SSMClient({ region: process.env.AWS_REGION });
  const { Parameter } = await ssm.send(
    new GetParameterCommand({ Name: name, WithDecryption: true })
  );
  if (!Parameter?.Value) {
    throw new Error(`SSM parameter ${name} is empty or missing`);
  }
  return Parameter.Value;
}

export default async function (): Promise<NextConfig> {
  const [
    NEXTAUTH_URL,
    NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    YOUTUBE_API_KEY,
    STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY,
    GITHUB_PAT_TOKEN,
  ] = await Promise.all([
    Promise.resolve(process.env.NEXTAUTH_URL!),
    getSecret('NEXTAUTH_SECRET'),
    getSecret('GOOGLE_CLIENT_ID'),
    getSecret('GOOGLE_CLIENT_SECRET'),
    getSecret('YOUTUBE_API_KEY'),
    getSecret('STRIPE_PUBLISHABLE_KEY'),
    getSecret('STRIPE_SECRET_KEY'),
    getSecret('GITHUB_PAT_TOKEN'),
  ]);

  return {
    ...baseConfig,
    env: {
      NEXTAUTH_URL,
      NEXTAUTH_SECRET,
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      YOUTUBE_API_KEY,
      STRIPE_PUBLISHABLE_KEY,
      STRIPE_SECRET_KEY,
      GITHUB_PAT_TOKEN,
    },
  };
}
