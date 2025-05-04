// src/app/shorts/[id]/ShortsDetailPage.tsx
'use client';

import {
  ArrowLeftIcon,
  CheckIcon,
  ClipboardIcon,
  DownloadIcon,
  Loader2Icon,
  ShareIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Short {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  hook: string;
  outputKey?: string;
  completedAt?: string;
  confidence?: number;
  processingTime?: {
    ffmpeg: number;
    upload: number;
    total: number;
  };
}

interface ShortsJob {
  id: string;
  userId: string;
  status: string;
  sourceUrl: string;
  videoTitle?: string;
  createdAt: number;
  updatedAt?: number;
  settings: {
    captionStyle?: string;
    backgroundColor?: string;
    backgroundStyle?: string;
    aspectRatio?: string;
    captionColor?: string;
    captionSize?: string;
    captionPosition?: string;
    clipDuration?: number;
    presetId?: string;
  };
  shorts: Short[];
}

interface ShortsDetailPageProps {
  shortsJob: ShortsJob;
}

export default function ShortsDetailPage({ shortsJob }: ShortsDetailPageProps) {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const completedShort = shortsJob.shorts.find(
      (s) => s.status === 'completed' && s.outputKey
    );
    if (completedShort?.outputKey) {
      window.open(completedShort.outputKey, '_blank');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return (
          <span className="bg-storyhero-accent-yellow/20 text-storyhero-accent-yellow rounded-full px-2 py-1 text-xs font-medium">
            Processing
          </span>
        );
      case 'completed':
        return (
          <span className="bg-storyhero-accent-green/20 text-storyhero-accent-green rounded-full px-2 py-1 text-xs font-medium">
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="bg-storyhero-accent-red/20 text-storyhero-accent-red rounded-full px-2 py-1 text-xs font-medium">
            Failed
          </span>
        );
      default:
        return (
          <span className="bg-storyhero-bg-higher text-storyhero-text-secondary rounded-full px-2 py-1 text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  // Determine overall job status
  const getOverallJobStatus = () => {
    // Check if the job itself has a status
    if (shortsJob.status) {
      return shortsJob.status.toLowerCase();
    }

    // Otherwise determine based on individual shorts
    if (shortsJob.shorts.some((s) => s.status === 'failed')) {
      return 'failed';
    }
    if (shortsJob.shorts.some((s) => s.status === 'processing')) {
      return 'processing';
    }
    if (shortsJob.shorts.every((s) => s.status === 'completed')) {
      return 'completed';
    }
    return 'unknown';
  };

  const overallStatus = getOverallJobStatus();

  // Check if user is authorized to view this short
  const isAuthorized = session?.user?.id === shortsJob.userId;

  if (!isAuthorized) {
    return (
      <div className="bg-storyhero-bg-base flex min-h-screen items-center justify-center">
        <Card className="bg-storyhero-bg-elevated w-full max-w-md border-0 p-6">
          <h2 className="text-storyhero-text-primary mb-4 text-xl font-bold">
            Unauthorized
          </h2>
          <p className="text-storyhero-text-secondary mb-6">
            You don't have permission to view this short.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-storyhero-text-primary text-2xl font-bold">
              {shortsJob.videoTitle || 'Untitled Video'}
            </h1>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-storyhero-text-secondary">
              Created on {formatDate(shortsJob.createdAt)}
            </span>
          </div>
        </div>

        {/* Job Information Card */}
        {/* <Card className="bg-storyhero-bg-elevated mb-6 border-0">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-storyhero-text-primary text-lg font-semibold">
                Job Information
              </h3>
              {(overallStatus === 'processing' ||
                overallStatus === 'failed') && (
                <div>{getStatusBadge(overallStatus)}</div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-storyhero-text-secondary text-sm">Job ID</p>
                <p className="text-storyhero-text-primary font-medium">
                  {shortsJob.id}
                </p>
              </div>
              <div>
                <p className="text-storyhero-text-secondary text-sm">Source</p>
                <a
                  href={shortsJob.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-storyhero-accent-blue hover:text-storyhero-accent-blue/80 block truncate font-medium"
                >
                  {shortsJob.sourceUrl}
                </a>
              </div>
              <div>
                <p className="text-storyhero-text-secondary text-sm">
                  Total Shorts
                </p>
                <p className="text-storyhero-text-primary font-medium">
                  {shortsJob.shorts.length}
                </p>
              </div>
              <div>
                <p className="text-storyhero-text-secondary text-sm">
                  Settings
                </p>
                <p className="text-storyhero-text-primary font-medium">
                  {shortsJob.settings.aspectRatio} •{' '}
                  {shortsJob.settings.captionStyle}
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Shorts Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shortsJob.shorts.map((shortItem) => (
            <Card
              key={shortItem.id}
              className="bg-storyhero-bg-elevated group overflow-hidden border-0 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <CardContent className="p-0">
                {/* Video Preview */}
                <div className="bg-storyhero-bg-higher relative aspect-[9/16] w-full">
                  {shortItem.status.toLowerCase() === 'completed' &&
                  shortItem.outputKey ? (
                    <video
                      src={shortItem.outputKey}
                      controls
                      className="h-full w-full object-contain"
                    />
                  ) : shortItem.status === 'processing' ? (
                    <div className="bg-storyhero-bg-higher absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Loader2Icon className="text-storyhero-accent-indigo mx-auto h-8 w-8 animate-spin" />
                        <p className="text-storyhero-text-secondary mt-4">
                          Processing...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-storyhero-bg-higher absolute inset-0 flex items-center justify-center">
                      <p className="text-storyhero-text-secondary">
                        {shortItem.status === 'failed'
                          ? 'Processing failed'
                          : 'Video not available'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Short Info */}
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-storyhero-text-primary truncate font-medium">
                      {shortItem.id.substring(0, 10)}...
                    </span>
                    {getStatusBadge(shortItem.status)}
                  </div>
                  <p className="text-storyhero-text-secondary mb-2 line-clamp-2 text-sm">
                    {shortItem.hook}
                  </p>
                  <div className="text-storyhero-text-muted space-y-1 text-xs">
                    <p>
                      Duration: {shortItem.durationSeconds}s (
                      {shortItem.startTime} - {shortItem.endTime})
                    </p>
                    {shortItem.completedAt && (
                      <p>
                        Completed:{' '}
                        {new Date(shortItem.completedAt).toLocaleString()}
                      </p>
                    )}
                    {shortItem.processingTime && (
                      <p>
                        Processing: {Math.round(shortItem.processingTime.total)}
                        s
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    {shortItem.status === 'completed' &&
                      shortItem.outputKey && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(shortItem.outputKey, '_blank')
                            }
                            className="border-storyhero-bg-higher text-storyhero-text-secondary hover:text-storyhero-text-primary bg-transparent"
                          >
                            <DownloadIcon className="mr-1 h-4 w-4" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-storyhero-bg-higher text-storyhero-text-secondary hover:text-storyhero-text-primary bg-transparent"
                          >
                            <ShareIcon className="mr-1 h-4 w-4" />
                            Share
                          </Button>
                        </>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
