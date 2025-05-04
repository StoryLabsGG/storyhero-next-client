'use client';

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactElement, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import CustomizationStep from '@/app/(dashboard)/generate-shorts/steps/CustomizationStep';
import SettingsStep from '@/app/(dashboard)/generate-shorts/steps/SettingsStep';
import UploadStep from '@/app/(dashboard)/generate-shorts/steps/UploadStep';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
  icons: string[];
  onStepClick: (step: number) => void;
}

interface DashboardFlowProps {
  initialUrl?: string;
}

const StepIndicator = ({
  currentStep,
  totalSteps,
  labels,
  icons,
  onStepClick,
}: StepIndicatorProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'cursor-pointer rounded-lg border p-4 text-center transition-all duration-200',
            index === currentStep
              ? 'border-storyhero-accent-indigo bg-storyhero-bg-base/80'
              : 'border-storyhero-bg-elevated hover:border-storyhero-bg-highest'
          )}
          onClick={() => onStepClick(index)}
        >
          <div className="mb-2">{icons[index]}</div>
          <h3 className="mb-1 font-medium">Step {index + 1}</h3>
          <p className="text-storyhero-text-secondary text-sm">
            {labels[index]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default function GenerateShortsFlow({
  initialUrl = '',
}: DashboardFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const form = useForm({
    defaultValues: {
      url: initialUrl,
      file: null,
      videoTitle: 'Untitled Video',
      style: 'classic',
      flow: 'clips',
      aspectRatio: '9:16',
      backgroundMusic: 'none',
      audioVolume: '100',
      captions: 'auto',
      generateDescription: false,
      props: {
        narrationStyle: 'exciting',
        narrationPov: 'first_person',
        narrationVoice: '1',
      },
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  // Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const formData = form.getValues();
    console.log('Form data before submission:', formData);
    setIsGenerating(true);
    setIsLoading(true);
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
          videoTitle: formData.videoTitle || 'Untitled Video',
          settings: {},
          compositionId: 'DefaultShort',
          cookiesKey: '',
          maxShorts: 6,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate shorts');
      }

      const data = await response.json();
      console.log(data);

      // Clear the progress interval
      clearInterval(interval);

      // Show success toast
      toast.success('Your clips are being generated!', {
        description: "We'll notify you when they're ready to view.",
        duration: 5000,
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

      return data.requestId;
    } catch (error) {
      clearInterval(interval);
      setIsGenerating(false);
      setIsLoading(false);

      // Show error toast
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to generate shorts';
      toast.error('Generation failed', {
        description: errorMessage,
        duration: 5000,
      });

      setError(errorMessage);
      console.error('Generation error:', error);
    }
  };

  const steps = [
    {
      label: 'Paste your YouTube link',
      icon: '📝',
      component: (
        <UploadStep setLoading={setIsLoading} next={() => nextStep()} />
      ),
    },
    {
      label: 'Choose your style',
      icon: '🎨',
      component: (
        <CustomizationStep
          setLoading={setIsLoading}
          next={() => nextStep()}
          prev={() => prevStep()}
        />
      ),
    },
    {
      label: 'Configure settings',
      icon: '⚙️',
      component: (
        <SettingsStep setLoading={setIsLoading} prev={() => prevStep()} />
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  };

  const renderGenerationProgress = () => {
    if (!isGenerating) return null;

    if (isComplete) {
      return (
        <div className="bg-storyhero-bg-higher mt-6 rounded-lg p-4 text-center">
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
      );
    }

    return (
      <div className="bg-storyhero-bg-higher mt-6 rounded-lg p-6">
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
    );
  };

  return (
    <FormProvider {...form}>
      <div className="mb-8 flex w-full justify-center">
        <div className="w-full space-y-8">
          {/* <StepIndicator 
            currentStep={currentStep}
            totalSteps={steps.length}
            labels={steps.map(s => s.label)}
            icons={steps.map(s => s.icon)}
            onStepClick={goToStep}
          /> */}

          <div className="relative transition-all duration-300">
            {steps[currentStep].component}
          </div>

          {/* Generation progress display */}
          {renderGenerationProgress()}

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-red-800">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-between">
            {currentStep > 0 ? (
              <Button
                variant="ghost"
                onClick={prevStep}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Previous
              </Button>
            ) : (
              <div />
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                variant="storyhero"
                onClick={nextStep}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                Next
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="storyhero"
                onClick={handleGenerate}
                className="flex items-center gap-2"
                disabled={isLoading || isGenerating}
              >
                <SparklesIcon className="h-4 w-4" />
                Get your clips!
              </Button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
