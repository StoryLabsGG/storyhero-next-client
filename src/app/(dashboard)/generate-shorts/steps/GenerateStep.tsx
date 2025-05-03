'use client';

import { CheckCircleIcon, Loader2Icon, SparklesIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';

import { StepComponentProps } from './UploadStep';

export default function GenerateStep({ setLoading, prev }: StepComponentProps) {
  const form = useFormContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formData = form.getValues();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setLoading(true);
    setError(null);

    // Start progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          return 95; // Hold at 95% until actual completion
        }
        return prev + 5;
      });
    }, 300);

    try {
      const response = await fetch('/api/generate-shorts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: formData.url,
          settings: formData.settings || {},
          compositionId: formData.compositionId || 'DefaultShort',
          cookiesKey: formData.cookiesKey || '',
          maxShorts: formData.maxShorts || 3,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate shorts');
      }

      const data = await response.json();

      console.log(data);

      // Complete the progress
      clearInterval(interval);
      setProgress(100);

      // After a short delay, mark as complete
      setTimeout(() => {
        setIsComplete(true);
        setLoading(false);
      }, 500);

      return data.requestId;
    } catch (error) {
      clearInterval(interval);
      setIsGenerating(false);
      setLoading(false);
      setError(
        error instanceof Error ? error.message : 'Failed to generate shorts'
      );
      console.error('Generation error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-storyhero-bg-elevated rounded-lg p-6">
        <h3 className="mb-4 text-lg font-medium">Review and generate</h3>

        <div className="mb-6 grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-storyhero-text-secondary mb-2 text-sm font-medium">
              Video Source
            </h4>
            <p className="text-sm">
              {formData.file
                ? `File: ${(formData.file as File).name}`
                : formData.url
                  ? `URL: ${formData.url}`
                  : 'No source selected'}
            </p>
          </div>

          <div>
            <h4 className="text-storyhero-text-secondary mb-2 text-sm font-medium">
              Style
            </h4>
            <p className="text-sm">{formData.style || 'Classic'}</p>
          </div>

          <div>
            <h4 className="text-storyhero-text-secondary mb-2 text-sm font-medium">
              Flow type
            </h4>
            <p className="text-sm">{formData.flow || 'Story'}</p>
          </div>

          <div>
            <h4 className="text-storyhero-text-secondary mb-2 text-sm font-medium">
              Aspect ratio
            </h4>
            <p className="text-sm">{formData.aspectRatio || '9:16'}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-red-800">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!isGenerating && !isComplete ? (
          <Button
            onClick={handleGenerate}
            className="bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigoHover text-storyhero-text-primary flex w-full items-center justify-center gap-2 py-6"
          >
            <SparklesIcon className="h-5 w-5" />
            Generate video
          </Button>
        ) : isComplete ? (
          <div className="bg-storyhero-bg-higher rounded-lg p-4 text-center">
            <CheckCircleIcon className="mx-auto mb-2 h-10 w-10 text-green-500" />
            <h3 className="mb-1 text-xl font-medium">Generation complete!</h3>
            <p className="text-storyhero-text-secondary mb-4 text-sm">
              Your video has been generated successfully.
            </p>
            <Button
              className="bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigoHover text-storyhero-text-primary"
              onClick={() => router.push('/dashboard')}
            >
              View your videos
            </Button>
          </div>
        ) : (
          <div className="bg-storyhero-bg-higher rounded-lg p-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">Generating your video</h3>
              <span className="text-storyhero-text-secondary text-sm">
                {progress}%
              </span>
            </div>
            <div className="bg-storyhero-bg-base h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-storyhero-accent-indigo h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-storyhero-text-secondary mt-4 text-sm">
              {progress < 30
                ? 'Analyzing content...'
                : progress < 60
                  ? 'Creating segments...'
                  : progress < 90
                    ? 'Applying style...'
                    : 'Finalizing video...'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
