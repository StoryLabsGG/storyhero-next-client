'use client';

import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { ReactElement, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import CustomizationStep from '@/app/(dashboard)/generate-shorts/steps/CustomizationStep';
import GenerateStep from '@/app/(dashboard)/generate-shorts/steps/GenerateStep';
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
    <div className="grid grid-cols-4 gap-3">
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
  const [currentStep, setCurrentStep] = useState(0);
  const form = useForm({
    defaultValues: {
      url: initialUrl,
      file: null,
      title: '',
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
        <SettingsStep
          setLoading={setIsLoading}
          next={() => nextStep()}
          prev={() => prevStep()}
        />
      ),
    },
    {
      label: 'Generate your video',
      icon: '✨',
      component: (
        <GenerateStep setLoading={setIsLoading} prev={() => prevStep()} />
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

          <div className="flex justify-between">
            {currentStep > 0 ? (
              <Button
                variant="outline"
                onClick={prevStep}
                className="bg-storyhero-bg-elevated hover:bg-storyhero-bg-higher text-storyhero-text-primary flex items-center gap-2"
                disabled={isLoading}
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Previous
              </Button>
            ) : (
              <div />
            )}

            {currentStep > 0 && currentStep < steps.length - 1 && (
              <Button
                onClick={nextStep}
                className="bg-storyhero-accent-indigo hover:bg-storyhero-accent-indigoHover text-storyhero-text-primary flex items-center gap-2"
                disabled={isLoading}
              >
                Next
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
