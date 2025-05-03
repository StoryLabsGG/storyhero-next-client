'use client';

import { useDebounce } from '@uidotdev/usehooks';
import { generateVideoThumbnails } from 'generate-video-thumbnail';
import { CloudUploadIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Type for the video data that will be submitted
export interface VideoData {
  file?: File;
  url?: string;
  thumbnail?: string;
  title?: string;
  duration?: number;
}

interface VideoUploaderProps {
  onSubmit: (videoData: VideoData) => void;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  initialUrl?: string;
}

function PreviewYTVideo({
  thumbnail,
  isLoading = false,
  title = '',
  lengthInSeconds = 0,
}: {
  thumbnail?: string;
  isLoading?: boolean;
  title?: string;
  lengthInSeconds?: number;
}) {
  if (!thumbnail) return null;

  return (
    <div className="relative mt-6 flex w-full items-center justify-center">
      <div className="w-full space-y-2 sm:w-[50%] md:w-[50%] lg:w-[40%]">
        <div className="relative overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg">
          {/* Gradient overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 to-transparent"></div>

          <AspectRatio
            className="border-storyhero-bg-elevated overflow-hidden rounded-lg border"
            ratio={16 / 9}
          >
            <img
              src={thumbnail}
              alt={title || 'Video thumbnail'}
              className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
            />
          </AspectRatio>

          {/* Duration indicator */}
          {lengthInSeconds > 0 && (
            <div className="absolute right-2 bottom-2 z-20 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
              {Math.floor(lengthInSeconds / 60)}:
              {(lengthInSeconds % 60).toString().padStart(2, '0')}
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
              <div className="border-storyhero-bg-elevated border-r-storyhero-accent-indigo h-8 w-8 animate-spin rounded-full border-3"></div>
            </div>
          )}
        </div>

        {title && (
          <h3 className="text-storyhero-text-primary truncate text-sm font-medium">
            {title}
          </h3>
        )}
      </div>
    </div>
  );
}

export default function VideoUploader({
  onSubmit,
  isLoading = false,
  setIsLoading,
  initialUrl = '',
}: VideoUploaderProps) {
  const [placeholder, setPlaceholder] = useState('Enter a YouTube URL link');
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState(initialUrl || '');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const debouncedUrl = useDebounce(videoUrl, 1000);

  // Set initial URL from prop
  useEffect(() => {
    if (initialUrl) {
      setVideoUrl(initialUrl);
    }
  }, [initialUrl]);

  useEffect(() => {
    const placeholders = [
      'Enter a YouTube URL link',
      'Or upload your own video',
      'Paste video link here',
    ] as const;
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % placeholders.length;
      setPlaceholder(placeholders[index] as string);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Set up file input for upload
  useEffect(() => {
    if (!fileInput) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          const file = target.files[0];
          setVideoFile(file);
          setVideoUrl('');

          // Generate thumbnail and estimate duration
          setIsProcessing(true);
          generateVideoThumbnails(file, 1, 'file', (thumbUrl) => {
            setThumbnail(thumbUrl);
            setVideoTitle(file.name);
            // Rough estimate of duration based on file size (1MB ≈ 10 seconds)
            const estimatedDuration = Math.round((file.size / 1000000) * 10);
            setVideoDuration(estimatedDuration);
            setIsProcessing(false);
          });
        }
      };
      setFileInput(input);
    }
  }, []);

  // Process URL when it changes
  useEffect(() => {
    if (debouncedUrl) {
      setIsProcessing(true);
      if (setIsLoading) setIsLoading(true);

      // Check if it's a YouTube URL
      if (
        debouncedUrl.includes('youtube.com') ||
        debouncedUrl.includes('youtu.be')
      ) {
        // Call our API endpoint to get video details
        fetch(`/api/get-video-metadata?url=${encodeURIComponent(debouncedUrl)}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to fetch video data');
            }
            return response.json();
          })
          .then((data) => {
            setThumbnail(data.thumbnail);
            // If title is available from API (requires YouTube API key)
            if (data.title) {
              setVideoTitle(data.title);
            } else {
              // Extract title from URL or set a placeholder
              const urlObj = new URL(debouncedUrl);
              const videoId =
                urlObj.searchParams.get('v') ||
                debouncedUrl.split('/').pop()?.split('?')[0] ||
                'Unknown';
              setVideoTitle(`YouTube Video (${videoId})`);
            }

            // If duration is available from API (requires YouTube API key)
            if (data.duration) {
              setVideoDuration(data.duration);
            } else {
              // Set a placeholder duration
              setVideoDuration(0);
            }
          })
          .catch((error) => {
            console.error('Error fetching video data:', error);
            // Set default values on error
            setThumbnail(
              `https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`
            );
            setVideoTitle('YouTube Video');
            setVideoDuration(0);
          })
          .finally(() => {
            setIsProcessing(false);
            if (setIsLoading) setIsLoading(false);
          });
      } else {
        // Not a YouTube URL
        setIsProcessing(false);
        if (setIsLoading) setIsLoading(false);
      }
    }
  }, [debouncedUrl, setIsLoading]);

  const handleSubmit = () => {
    onSubmit({
      file: videoFile || undefined,
      url: videoUrl || undefined,
      thumbnail,
      title: videoTitle,
      duration: videoDuration || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Animated border when processing */}
        {isProcessing && (
          <div
            className="absolute -inset-[2px] overflow-hidden rounded-lg"
            style={{ zIndex: 0 }}
          >
            <div
              className={cn(
                'h-full w-[200%]',
                'absolute top-0 left-0',
                'from-storyhero-bg-elevated via-storyhero-accent-indigo to-storyhero-bg-elevated bg-gradient-to-r',
                'animate-[shimmer_2s_linear_infinite]'
              )}
            />
          </div>
        )}

        {/* Main content box */}
        <div
          className={cn(
            'border-storyhero-bg-elevated bg-storyhero-bg-base relative space-y-4 rounded-lg border-2 p-6',
            'z-[1]'
          )}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {isProcessing ? (
                <div className="animate-spin">
                  <div className="border-storyhero-bg-elevated border-r-storyhero-accent-indigo h-4 w-4 rounded-full border-2" />
                </div>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="text-storyhero-text-muted h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 12c2.5-5 7.5-5 10 0-2.5 5-7.5 5-10 0Z M12 12c-2.5-5-7.5-5-10 0 2.5 5 7.5 5 10 0Z" />
                </svg>
              )}
            </div>
            <span className="text-storyhero-text-primary">
              YouTube Video Link
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder={placeholder}
              className="bg-storyhero-bg-higher focus:ring-storyhero-accent-indigo border-none focus:ring-1"
            />
            <Button
              variant="ghost"
              className="text-storyhero-text-secondary hover:text-storyhero-text-secondary hover:bg-storyhero-bg-higher flex items-center gap-2"
              onClick={() => fileInput?.click()}
            >
              <CloudUploadIcon className="h-4 w-4" />
              <span className="text-sm">Upload</span>
            </Button>
          </div>

          <Button
            disabled={isProcessing || (!thumbnail && !videoFile && !videoUrl)}
            onClick={handleSubmit}
            className="bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigoHover text-storyhero-text-primary w-full"
          >
            {isProcessing ? 'Processing...' : 'Generate Clips'}
          </Button>

          <p className="text-storyhero-text-secondary mt-4 text-center text-sm">
            Using video you don't own may violate copyright laws. By continuing,
            you confirm this is your own original content.
          </p>
        </div>
      </div>

      <PreviewYTVideo
        thumbnail={thumbnail}
        isLoading={isProcessing}
        title={videoTitle}
        lengthInSeconds={videoDuration}
      />
    </div>
  );
}
