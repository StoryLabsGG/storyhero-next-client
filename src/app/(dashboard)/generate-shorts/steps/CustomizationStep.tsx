'use client';

import { BookIcon, CameraIcon, CheckIcon, TvIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { StepComponentProps } from './UploadStep';

export default function CustomizationStep({
  setLoading,
  next,
  prev,
}: StepComponentProps) {
  const form = useFormContext();

  // Force set the flow to 'clips' immediately
  useEffect(() => {
    // Set as first effect with immediate execution
    form.setValue('flow', 'clips');
  }, []);

  // Now get the value AFTER we've set it
  const [selectedFlow, setSelectedFlow] = useState('clips');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');

  const handleFlowChange = (flow: string) => {
    setSelectedFlow(flow);
    form.setValue('flow', flow);
  };

  const getPreviewSource = (flow: string) => {
    switch (flow) {
      case 'story':
        return `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL || ''}/public-assets/Story.mp4`;
      case 'clips':
        return `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL || ''}/public-assets/Memes.mp4`;
      case 'episodic':
        return `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL || ''}/public-assets/Parts.mp4`;
      default:
        return '';
    }
  };

  // Initialize video source on component mount
  useEffect(() => {
    setVideoSrc(getPreviewSource('clips'));
  }, []);

  useEffect(() => {
    setIsVideoReady(false);

    const timeout = setTimeout(() => {
      setVideoSrc(getPreviewSource(selectedFlow));
    }, 50);

    return () => clearTimeout(timeout);
  }, [selectedFlow]);

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      try {
        const playPromise = videoRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsVideoReady(true);
            })
            .catch((error) => {
              if (error.name !== 'AbortError') {
                console.error('Video play error:', error);
              }
              setIsVideoReady(true);
            });
        } else {
          setIsVideoReady(true);
        }
      } catch (error) {
        console.error('Video error:', error);
        setIsVideoReady(true);
      }
    }
  };

  const flowOptions = [
    {
      title: 'Clips',
      value: 'clips',
      Icon: CameraIcon,
      description: 'Turn your footage into viral clips.',
    },
    {
      title: 'Parts',
      value: 'episodic',
      Icon: TvIcon,
      description:
        'Turn your edited video into digestible shorts in chronological order.',
    },
    {
      title: 'Story',
      value: 'story',
      Icon: BookIcon,
      description: 'Turn your footage into a cohesive story.',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-storyhero-bg-elevated rounded-lg p-6">
        <h3 className="text-storyhero-text-primary mb-4 text-lg font-medium">
          Choose your content style
        </h3>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {flowOptions.map(({ title, value, Icon, description }) => (
            <Card
              key={`${title}-${value}`}
              className={cn(
                'bg-storyhero-bg-higher flex h-full cursor-pointer flex-col border transition-all',
                selectedFlow === value
                  ? 'border-storyhero-accent-indigo'
                  : 'border-storyhero-bg-higher hover:border-storyhero-text-secondary'
              )}
              onClick={() => handleFlowChange(value)}
            >
              <CardHeader className="flex-grow">
                <div className="flex items-start gap-3">
                  <Icon className="text-storyhero-text-primary mt-0.5 h-5 w-5" />
                  <div>
                    <CardTitle className="text-storyhero-text-primary text-base">
                      {title}
                    </CardTitle>
                    <CardDescription className="text-storyhero-text-secondary mt-1 text-xs">
                      {description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="pt-0 pb-4">
                {selectedFlow === value ? (
                  <Button className="bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigo/90 flex h-10 w-full items-center justify-center gap-1.5 font-medium text-white">
                    <CheckIcon className="h-4 w-4" />
                    <span>Selected</span>
                  </Button>
                ) : (
                  <Button
                    className="bg-storyhero-bg-highest hover:bg-storyhero-bg-highest/90 text-storyhero-text-primary border-storyhero-bg-elevated h-10 w-full border"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlowChange(value);
                    }}
                  >
                    Select
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {selectedFlow && (
          <div className="mt-6 mb-4">
            <h4 className="text-storyhero-text-primary mb-3 text-sm font-medium">
              Preview
            </h4>
            <div className="flex justify-center">
              <div
                className={cn(
                  'max-w-[450px] overflow-hidden rounded-lg bg-black',
                  !isVideoReady && 'hidden'
                )}
              >
                {videoSrc && (
                  <video
                    ref={videoRef}
                    className="mx-auto h-[250px] w-auto rounded-lg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedData={handleVideoLoaded}
                    key={videoSrc}
                  >
                    <source src={videoSrc} type="video/mp4" />
                  </video>
                )}
              </div>

              {!isVideoReady && (
                <div className="bg-storyhero-bg-higher flex h-[250px] w-[450px] items-center justify-center rounded-lg">
                  <div className="border-storyhero-bg-elevated border-r-storyhero-accent-indigo h-8 w-8 animate-spin rounded-full border-2"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
