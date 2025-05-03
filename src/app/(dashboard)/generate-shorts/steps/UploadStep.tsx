'use client';

import { ArrowRightIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import VideoConfigurer from '@/app/(dashboard)/generate-shorts/VideoConfigurer';
import { VideoData } from '@/components/dashboard/VideoUploader';
import { Button } from '@/components/ui/button';

export interface StepComponentProps {
  setLoading: (loading: boolean) => void;
  next?: () => void;
  prev?: () => void;
}

export default function UploadStep({ setLoading, next }: StepComponentProps) {
  const form = useFormContext();
  const initialUrl = form.getValues('url');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [isComponentLoading, setIsComponentLoading] = useState(false);
  const [isReadyForNextStep, setIsReadyForNextStep] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);

  // Mock presets for demonstration - replace with actual presets from your application
  const presets = [
    {
      id: 'preset-1',
      name: 'Viral TikTok',
      description: 'Perfect for trending TikTok content',
      captionStyle: 'minimal',
      backgroundColor: '#000000',
      backgroundStyle: 'blur',
      aspectRatio: '9:16',
      previewUrl: `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/public-assets/presets/tiktok.mp4`,
    },
    {
      id: 'preset-2',
      name: 'Professional YouTube',
      description: 'Clean, professional look for YouTube shorts',
      captionStyle: 'subtitles',
      backgroundColor: '#ffffff',
      backgroundStyle: 'solid',
      aspectRatio: '9:16',
    },
    {
      id: 'preset-3',
      name: 'Instagram Story',
      description: 'Stylish format for Instagram stories',
      captionStyle: 'captions',
      backgroundColor: '#f0f0f0',
      backgroundStyle: 'gradient',
      aspectRatio: '9:16',
    },
  ];

  // Set initial URL if it exists
  useEffect(() => {
    if (initialUrl) {
      form.setValue('url', initialUrl);
      setHasVideo(true);
    }
  }, [initialUrl, form]);

  // Update parent loading state whenever component loading state changes
  useEffect(() => {
    setLoading(isComponentLoading);
  }, [isComponentLoading, setLoading]);

  // Memoize callback functions to prevent unnecessary renders
  const handleVideoChange = useCallback(
    (videoData: VideoData) => {
      // Update form values based on the submitted data
      if (videoData.file) {
        form.setValue('file', videoData.file);
        setHasVideo(true);
      }

      if (videoData.url) {
        form.setValue('url', videoData.url);
        setHasVideo(true);
      }

      // Store other metadata in the form
      form.setValue('thumbnail', videoData.thumbnail);
      form.setValue('videoTitle', videoData.title);
      form.setValue('videoDuration', videoData.duration);

      // Check if we're ready for the next step
      checkReadyForNextStep();
    },
    [form]
  );

  const handlePresetChange = useCallback(
    (presetId: string) => {
      setSelectedPresetId(presetId);
      form.setValue('selectedPresetId', presetId);

      // Find the selected preset
      const selectedPreset = presets.find((preset) => preset.id === presetId);
      if (selectedPreset) {
        // Update form with preset values
        form.setValue('aspectRatio', selectedPreset.aspectRatio);
        form.setValue('captionStyle', selectedPreset.captionStyle);
        form.setValue('backgroundColor', selectedPreset.backgroundColor);
        form.setValue('backgroundStyle', selectedPreset.backgroundStyle);
      }

      // Check if we're ready for the next step
      checkReadyForNextStep();
    },
    [form, presets]
  );

  const handleTrimChange = useCallback(
    (startTime: number, endTime: number) => {
      setTrimStart(startTime);
      setTrimEnd(endTime);
      form.setValue('trimStart', startTime);
      form.setValue('trimEnd', endTime);
    },
    [form]
  );

  // Memoize the setIsComponentLoading function
  const handleSetLoading = useCallback((loading: boolean) => {
    setIsComponentLoading(loading);
  }, []);

  // Check if all required fields are filled
  const checkReadyForNextStep = useCallback(() => {
    const url = form.getValues('url');
    const file = form.getValues('file');
    const preset = form.getValues('selectedPresetId');

    // Check if we have either a URL or a file, and a preset is selected
    const isReady = Boolean((url || file) && preset);
    setIsReadyForNextStep(isReady);
  }, [form]);

  // Check ready state when component mounts and when selectedPresetId changes
  useEffect(() => {
    checkReadyForNextStep();
  }, [selectedPresetId, checkReadyForNextStep]);

  const handleNextClick = () => {
    if (next && isReadyForNextStep) {
      next();
    }
  };

  return (
    <div className="space-y-6">
      <VideoConfigurer
        onVideoChange={handleVideoChange}
        onPresetChange={handlePresetChange}
        onTrimChange={handleTrimChange}
        isLoading={isComponentLoading}
        setIsLoading={handleSetLoading}
        initialUrl={initialUrl}
        availableCredits={100} // Replace with actual credits from your application
        presets={presets} // Replace with actual presets from your application
      />

      {/* Next button - only shown when ready */}
      {hasVideo && isReadyForNextStep && (
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleNextClick}
            className="bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigoHover text-storyhero-text-primary flex items-center gap-2"
            disabled={isComponentLoading}
          >
            Next
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Guidance message when not ready */}
      {hasVideo && !isReadyForNextStep && (
        <div className="bg-storyhero-bg-higher mt-6 rounded-lg p-4">
          <p className="text-storyhero-text-secondary text-center text-sm">
            Please select a preset style to continue
          </p>
        </div>
      )}
    </div>
  );
}
