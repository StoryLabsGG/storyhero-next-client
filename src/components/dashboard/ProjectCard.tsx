'use client';

import { generateVideoThumbnails } from 'generate-video-thumbnail';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';

interface ProjectCardProps {
  id: string;
  sourceUrl?: string;
  videoTitle?: string;
  thumbnailUrl?: string;
  videoAuthor?: string;
  createdAt: number;
  daysLeft?: number;
  isLoading?: boolean;
  onClick?: () => void;
}

/**
 * ProjectCard component to display project details in a card format
 */
export default function ProjectCard({
  id,
  sourceUrl,
  videoTitle,
  videoAuthor,
  thumbnailUrl,
  createdAt,
  daysLeft = 5,
  isLoading = false,
  onClick,
}: ProjectCardProps) {
  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Extract domain name from URL
  const getSourceName = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch (e) {
      return 'Unknown Source';
    }
  };

  return (
    <Link
      href={`/shorts/${id}`}
      className="group block h-full w-full"
      onClick={onClick}
    >
      <Card className="bg-storyhero-bg-elevated hover:border-storyhero-accent-indigo/50 flex h-full min-h-[210px] w-full min-w-[250px] cursor-pointer flex-col gap-0 overflow-hidden border-0 !py-0 transition-all group-hover:-translate-y-1 group-hover:shadow-md hover:border">
        <div className="relative aspect-video w-full overflow-hidden">
          {daysLeft !== undefined && (
            <div className="absolute top-2 right-2 z-10 rounded bg-black/40 px-2 py-1 text-xs text-white">
              {daysLeft} days left
            </div>
          )}

          <div className="from-storyhero-bg-higher to-storyhero-bg-base absolute inset-0 bg-gradient-to-br">
            {thumbnailUrl ? (
              <div className="relative h-full w-full">
                <img
                  src={thumbnailUrl}
                  alt={videoTitle || 'Video thumbnail'}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : sourceUrl ? (
              <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500"></div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500"></div>
            )}
          </div>
        </div>
        <div className="flex-grow p-2">
          <h3 className="text-storyhero-text-primary mb-1 overflow-hidden text-base font-medium text-ellipsis whitespace-nowrap">
            {videoTitle || 'Untitled Video'}
          </h3>
          <p className="text-storyhero-text-secondary overflow-hidden text-xs text-ellipsis whitespace-nowrap">
            Created {formatDate(createdAt)}
          </p>
        </div>
      </Card>
    </Link>
  );
}
