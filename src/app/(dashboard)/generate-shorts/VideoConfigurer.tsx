'use client';

import { useDebounce } from '@uidotdev/usehooks';
import { generateVideoThumbnails } from 'generate-video-thumbnail';
import {
  ClockIcon,
  CloudUploadIcon,
  ScissorsIcon,
  SparklesIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { VideoData } from '@/components/dashboard/VideoUploader';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface VideoConfigurerProps {
  onVideoChange: (videoData: VideoData) => void;
  onPresetChange: (presetId: string) => void;
  onTrimChange: (startTime: number, endTime: number) => void;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  initialUrl?: string;
  presets?: any[];
}

export default function VideoConfigurer({
  onVideoChange,
  onPresetChange,
  onTrimChange,
  isLoading = false,
  setIsLoading,
  initialUrl = '',
  presets = [],
}: VideoConfigurerProps) {
  const [placeholder, setPlaceholder] = useState('Paste a YouTube link here');
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState(initialUrl || '');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>(
    presets.length > 0 ? presets[0].id : ''
  );
  const [trimStartTime, setTrimStartTime] = useState(0);
  const [trimEndTime, setTrimEndTime] = useState(0);
  const debouncedUrl = useDebounce(videoUrl, 1000);

  // Add a ref to track if a fetch is already in progress
  const isFetchingRef = useRef(false);
  // Add a ref to track the last URL that was successfully processed
  const lastProcessedUrlRef = useRef('');

  // Set initial URL from prop
  useEffect(() => {
    if (initialUrl) {
      setVideoUrl(initialUrl);
    }
  }, [initialUrl]);

  useEffect(() => {
    const placeholders = [
      'Paste a YouTube link here',
      'Paste a Twitch link here',
      'Or upload your own video',
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
            setTrimEndTime(estimatedDuration);
            setIsProcessing(false);

            // Notify parent about video change
            onVideoChange({
              file,
              thumbnail: thumbUrl,
              title: file.name,
              duration: estimatedDuration,
            });
          });
        }
      };
      setFileInput(input);
    }
  }, [onVideoChange]);

  // Modified URL processing effect
  useEffect(() => {
    // Only proceed if we have a URL and it's different from the last processed URL
    if (
      debouncedUrl &&
      debouncedUrl !== lastProcessedUrlRef.current &&
      !isFetchingRef.current
    ) {
      // Check if it's a YouTube URL
      if (
        debouncedUrl.includes('youtube.com') ||
        debouncedUrl.includes('youtu.be')
      ) {
        setIsProcessing(true);
        if (setIsLoading) setIsLoading(true);

        // Mark that we're fetching to prevent duplicate calls
        isFetchingRef.current = true;

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
              setTrimEndTime(data.duration);
            } else {
              // Set a placeholder duration
              setVideoDuration(0);
              setTrimEndTime(0);
            }

            // Save this URL as successfully processed
            lastProcessedUrlRef.current = debouncedUrl;

            // Notify parent about video change
            onVideoChange({
              url: debouncedUrl,
              thumbnail: data.thumbnail,
              title: data.title || `YouTube Video`,
              duration: data.duration || 0,
            });
          })
          .catch((error) => {
            console.error('Error fetching video data:', error);
            // Set default values on error
            setThumbnail(
              `https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`
            );
            setVideoTitle('YouTube Video');
            setVideoDuration(0);
            setTrimEndTime(0);
          })
          .finally(() => {
            setIsProcessing(false);
            if (setIsLoading) setIsLoading(false);
            // Mark that we're done fetching
            isFetchingRef.current = false;
          });
      } else if (debouncedUrl) {
        // Not a YouTube URL but still a URL
        setIsProcessing(false);
        if (setIsLoading) setIsLoading(false);

        // Set as processed to avoid repeated checks
        lastProcessedUrlRef.current = debouncedUrl;

        // Optional: Set an error state or message for non-YouTube URLs
        setThumbnail(undefined);
        setVideoTitle('Please enter a valid YouTube URL');
        setVideoDuration(0);
        setTrimEndTime(0);
      }
    } else if (!debouncedUrl) {
      // Reset when URL is cleared
      setIsProcessing(false);
      if (setIsLoading) setIsLoading(false);
      // Clear the last processed URL
      lastProcessedUrlRef.current = '';
    }
  }, [debouncedUrl, setIsLoading, onVideoChange]);

  // Handle preset selection
  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    onPresetChange(value);
  };

  // Handle trim time input changes
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const [minutes, seconds] = inputValue
      .split(':')
      .map((part) => parseInt(part) || 0);
    const totalSeconds = minutes * 60 + seconds;

    // Ensure start time is valid
    if (
      !isNaN(totalSeconds) &&
      totalSeconds >= 0 &&
      totalSeconds < videoDuration &&
      totalSeconds < trimEndTime
    ) {
      setTrimStartTime(totalSeconds);
      onTrimChange(totalSeconds, trimEndTime);
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const [minutes, seconds] = inputValue
      .split(':')
      .map((part) => parseInt(part) || 0);
    const totalSeconds = minutes * 60 + seconds;

    // Ensure end time is valid
    if (
      !isNaN(totalSeconds) &&
      totalSeconds > trimStartTime &&
      totalSeconds <= videoDuration
    ) {
      setTrimEndTime(totalSeconds);
      onTrimChange(trimStartTime, totalSeconds);
    }
  };

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Add this function to handle slider changes
  const handleSliderChange = (values: number[]) => {
    if (values.length === 2) {
      const [start, end] = values;
      // Convert percentage values to seconds
      const startSeconds = Math.floor((start / 100) * videoDuration);
      const endSeconds = Math.floor((end / 100) * videoDuration);

      setTrimStartTime(startSeconds);
      setTrimEndTime(endSeconds);
      onTrimChange(startSeconds, endSeconds);
    }
  };

  // Calculate slider values (as percentages of total duration)
  const sliderValues = videoDuration
    ? [
        (trimStartTime / videoDuration) * 100,
        (trimEndTime / videoDuration) * 100,
      ]
    : [0, 100];

  // When component mounts, notify parent about initial preset selection
  useEffect(() => {
    if (presets.length > 0 && selectedPreset === presets[0].id) {
      onPresetChange(presets[0].id);
    }
  }, [presets, selectedPreset, onPresetChange]);

  return (
    <div className="bg-background mx-auto max-w-3xl space-y-8">
      {/* Video Source Box */}
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
            'border-storyhero-bg-elevated bg-storyhero-bg-base relative space-y-6 rounded-lg border-2 p-6',
            'z-[1]'
          )}
        >
          {/* Video URL Input Section */}
          <div className="space-y-4">
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
              <span className="text-storyhero-text-primary">Video Source</span>
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
          </div>

          {/* Video Preview Section - MODIFIED LAYOUT */}
          {thumbnail && (
            <div className="border-storyhero-bg-elevated border-t pt-4">
              <div className="flex flex-col gap-4">
                {/* Center the thumbnail */}
                <div className="flex justify-center">
                  <div className="w-full max-w-xs">
                    {' '}
                    {/* Control thumbnail width */}
                    <div className="relative overflow-hidden rounded-lg shadow-md">
                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 to-transparent"></div>

                      <AspectRatio
                        className="border-storyhero-bg-elevated overflow-hidden rounded-lg border"
                        ratio={16 / 9}
                      >
                        <img
                          src={thumbnail}
                          alt={videoTitle || 'Video thumbnail'}
                          className="h-full w-full object-cover"
                        />
                      </AspectRatio>

                      {/* Duration indicator */}
                      {videoDuration > 0 && (
                        <div className="absolute right-2 bottom-2 z-20 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
                          {Math.floor(videoDuration / 60)}:
                          {(videoDuration % 60).toString().padStart(2, '0')}
                        </div>
                      )}
                    </div>
                    <h3 className="text-storyhero-text-primary mt-2 truncate text-center text-sm font-medium">
                      {videoTitle}
                    </h3>
                  </div>
                </div>

                {/* Trim controls below thumbnail */}
                <div className="mt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ScissorsIcon className="text-storyhero-text-muted h-4 w-4" />
                      <span className="text-storyhero-text-primary text-sm font-medium">
                        Trim video
                      </span>
                    </div>
                    <div className="bg-storyhero-bg-higher text-storyhero-accent-indigo rounded px-2 py-1 text-xs font-medium">
                      {Math.floor((trimEndTime - trimStartTime) / 60)}m{' '}
                      {(trimEndTime - trimStartTime) % 60}s selected
                    </div>
                  </div>

                  <div className="text-storyhero-text-secondary text-xs italic">
                    <span className="text-storyhero-accent-indigo font-medium">
                      Tip:
                    </span>{' '}
                    Processing only the relevant part of the video can save
                    credits!
                  </div>

                  <div className="py-2">
                    <Slider
                      defaultValue={[0, 100]}
                      value={sliderValues}
                      onValueChange={handleSliderChange}
                      min={0}
                      max={100}
                      step={1}
                      className="py-4"
                    />
                  </div>

                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <label className="text-storyhero-text-secondary text-xs">
                        Start time
                      </label>
                      <Input
                        type="text"
                        value={formatTime(trimStartTime)}
                        onChange={handleStartTimeChange}
                        className="bg-storyhero-bg-higher focus:ring-storyhero-accent-indigo w-24 border-none text-center font-mono focus:ring-1"
                        pattern="[0-9]+:[0-5][0-9]"
                        placeholder="0:00"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-storyhero-text-secondary text-xs">
                        End time
                      </label>
                      <Input
                        type="text"
                        value={formatTime(trimEndTime)}
                        onChange={handleEndTimeChange}
                        className="bg-storyhero-bg-higher focus:ring-storyhero-accent-indigo w-24 border-none text-center font-mono focus:ring-1"
                        pattern="[0-9]+:[0-5][0-9]"
                        placeholder="0:00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Credits indicator */}
          <div className="border-storyhero-bg-elevated flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="text-storyhero-text-muted h-4 w-4" />
              <span className="text-storyhero-text-secondary text-sm">
                Credits Cost:
              </span>
            </div>
            <div className="text-storyhero-accent-indigo text-sm font-semibold">
              {Math.max(1, Math.ceil((trimEndTime - trimStartTime) / 60))}
            </div>
          </div>

          <p className="text-storyhero-text-secondary text-center text-xs">
            Using a video you don&apos;t own may violate copyright laws. By
            continuing, you confirm you are transforming the video for fair use.
          </p>
        </div>
      </div>

      {/* Preset Selection Section - Now including Custom option */}
      {thumbnail && (
        <div className="bg-storyhero-bg-base border-storyhero-bg-elevated rounded-lg border-2 p-6">
          <div className="mb-4 flex items-center gap-2">
            <SparklesIcon className="text-storyhero-accent-indigo h-5 w-5" />
            <h3 className="text-storyhero-text-primary text-lg font-medium">
              Choose a Preset Style
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {/* Custom Preset Option */}
            <Card
              key="custom-preset"
              className={cn(
                'cursor-pointer overflow-hidden border-dashed py-0 transition-all',
                selectedPreset === 'custom-preset'
                  ? 'ring-storyhero-accent-indigo ring-2'
                  : 'border-storyhero-bg-elevated hover:shadow-md'
              )}
              onClick={() => handlePresetChange('custom-preset')}
            >
              <div className="bg-storyhero-bg-higher relative aspect-[9/16] overflow-hidden">
                <div className="flex h-full items-center justify-center">
                  <div className="text-storyhero-text-muted flex flex-col items-center">
                    <div className="border-storyhero-bg-elevated mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed">
                      <span className="text-xl font-medium">+</span>
                    </div>
                    <span className="text-sm font-medium">Create your own</span>
                    <span className="mt-1 text-xs">Customize all settings</span>
                  </div>
                </div>

                {/* Show selected indicator */}
                {selectedPreset === 'custom-preset' && (
                  <div className="bg-storyhero-accent-indigo absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-white">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
            </Card>

            {/* Existing Presets */}
            {presets.map((preset) => (
              <Card
                key={preset.id}
                className={cn(
                  'cursor-pointer overflow-hidden py-0 transition-all',
                  selectedPreset === preset.id
                    ? 'ring-storyhero-accent-indigo ring-2'
                    : 'hover:shadow-md'
                )}
                onClick={() => handlePresetChange(preset.id)}
              >
                <div className="bg-storyhero-bg-higher relative aspect-[9/16] overflow-hidden">
                  {/* Sample TikTok Preview */}
                  {preset.previewUrl ? (
                    <video
                      className="h-full w-full object-cover"
                      loop
                      muted
                      autoPlay
                      playsInline
                    >
                      <source src={preset.previewUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-storyhero-text-muted flex flex-col items-center">
                        <SparklesIcon className="mb-2 h-8 w-8" />
                        <span className="text-xs">Preview</span>
                      </div>
                    </div>
                  )}

                  {/* Show selected indicator */}
                  {selectedPreset === preset.id && (
                    <div className="bg-storyhero-accent-indigo absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-white">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}

                  {/* Info overlay at bottom */}
                  <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black to-transparent p-3">
                    <h4 className="text-sm font-medium text-white">
                      {preset.name}
                    </h4>
                    <p className="text-xs text-white/80">
                      {preset.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
