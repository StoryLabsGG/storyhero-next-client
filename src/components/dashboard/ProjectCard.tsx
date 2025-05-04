'use client';

import { generateVideoThumbnails } from 'generate-video-thumbnail';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';

interface ProjectCardProps {
  id: string;
  sourceUrl?: string;
  videoTitle?: string;
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
  createdAt,
  daysLeft = 5,
  isLoading = false,
  onClick,
}: ProjectCardProps) {
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);

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

  useEffect(() => {
    if (sourceUrl) {
      if (sourceUrl.includes('youtube.com') || sourceUrl.includes('youtu.be')) {
        // Fetch thumbnail from API for YouTube videos
        fetch(`/api/get-video-metadata?url=${encodeURIComponent(sourceUrl)}`)
          .then((response) => {
            if (!response.ok) throw new Error('Failed to fetch video metadata');
            return response.json();
          })
          .then((data) => {
            setThumbnail(data.thumbnail);
          })
          .catch((error) => {
            console.error('Error fetching thumbnail:', error);
            // Extract YouTube ID for fallback thumbnail
            try {
              let videoId;
              if (sourceUrl.includes('youtu.be')) {
                videoId = sourceUrl.split('/').pop()?.split('?')[0];
              } else {
                videoId = new URL(sourceUrl).searchParams.get('v');
              }
              if (videoId) {
                setThumbnail(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
              }
            } catch (e) {
              console.error('Error extracting video ID:', e);
            }
          });
      }
    }
  }, [sourceUrl]);

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
            {thumbnail ? (
              <div className="relative h-full w-full">
                <img
                  src={thumbnail}
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
