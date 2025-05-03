import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { notFound } from 'next/navigation';

import ShortsDetailPage from '@/app/(dashboard)/shorts/[id]/ShortsDetailPage';
import { dynamoDbClient } from '@/lib/aws';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getShortsJob(id: string) {
  try {
    const command = new GetItemCommand({
      TableName: process.env.GENERATE_SHORTS_JOBS_TABLE_NAME,
      Key: {
        id: { S: id },
      },
    });

    const response = await dynamoDbClient.send(command);

    if (!response.Item) {
      return null;
    }

    // Extract settings from the M type if it exists
    let settings = {};
    if (response.Item.settings?.M) {
      const settingsM = response.Item.settings.M;
      settings = {
        captionStyle: settingsM.captionStyle?.S,
        backgroundColor: settingsM.backgroundColor?.S,
        backgroundStyle: settingsM.backgroundStyle?.S,
        aspectRatio: settingsM.aspectRatio?.S,
        captionColor: settingsM.captionColor?.S,
        captionSize: settingsM.captionSize?.S,
        captionPosition: settingsM.captionPosition?.S,
        clipDuration: settingsM.clipDuration?.N
          ? Number(settingsM.clipDuration.N)
          : undefined,
        presetId: settingsM.presetId?.S,
      };
    }

    let shorts: any[] = [];
    if (response.Item.shorts?.L) {
      shorts = response.Item.shorts.L.map((short: any) => ({
        id: short.M.id.S,
        status: short.M.status.S,
        startTime: short.M.startTime.S,
        endTime: short.M.endTime.S,
        durationSeconds: Number(short.M.durationSeconds.N),
        hook: short.M.hook.S,
        outputKey: short.M.outputKey?.S
          ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${short.M.outputKey.S}`
          : undefined,
        completedAt: short.M.completedAt?.S,
        confidence: Number(short.M.confidence.N),
        processingTime: short.M.processingTime?.M
          ? {
              ffmpeg: Number(short.M.processingTime.M.ffmpeg.N),
              upload: Number(short.M.processingTime.M.upload.N),
              total: Number(short.M.processingTime.M.total.N),
            }
          : undefined,
      }));
    }

    return {
      id: response.Item.id.S!,
      userId: response.Item.userId.S!,
      status: response.Item.status.S!,
      sourceUrl: response.Item.sourceUrl.S!,
      outputUrl: response.Item.outputUrl?.S,
      createdAt: Number(response.Item.createdAt.N!),
      updatedAt: response.Item.updatedAt?.N
        ? Number(response.Item.updatedAt.N)
        : undefined,
      settings,
      shorts,
    };
  } catch (error) {
    console.error('Failed to fetch short:', error);
    return null;
  }
}

export default async function ShortsPage({ params }: PageProps) {
  const { id } = await params;
  const shortsJob = await getShortsJob(id);

  if (!shortsJob) {
    notFound();
  }

  return <ShortsDetailPage shortsJob={shortsJob} />;
}
