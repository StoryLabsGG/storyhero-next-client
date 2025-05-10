import { DefaultShort } from '@storylabsgg/storybox-remotion/src/compositions/default-short';
import { MoveLeft } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import PresetFields from './PresetFields';
import PresetPreview from './PresetPreview';

interface PresetData {
  id: string;
  name: string;
  description: string;
  composition: {
    durationInFrames: number;
    fps: number;
    width: number;
    height: number;
    component: React.ComponentType<any>;
    inputProps: any;
  };
}

interface PresetsCreatorProps {
  onPresetCreate: (preset: PresetData) => void;
  onClose: () => void;
}

const defaultTextStyles = {
  text: 'Sample Text',
  position: 25,
  font: 'DM Sans',
  size: 80,
  style: 'default',
  color: {
    text: 'rgba(255, 255, 255, 1)',
    background: 'rgba(0, 0, 0, 1)',
    highlight: 'rgba(255, 215, 0, 1)',
  },
  shadow: true,
  enabled: true,
};

export default function PresetsCreator({
  onPresetCreate,
  onClose,
}: PresetsCreatorProps) {
  const [presetFields, setPresetFields] = useState({
    name: '',
    description: '',
    title: {
      ...defaultTextStyles,
    },
    captions: {
      ...defaultTextStyles,
      multipleWords: false,
      animation: false,
      position: 75,
    },
    videoBackground: 'blur',
    videoZoom: 0,
  });

  const inputProps = {
    videoUrl:
      'https://ddgwsqpgp6ybu.cloudfront.net/generate-shorts/e545de26-1f17-4301-a8e7-11376d0f8e59/raw-download/1745201891-e545de26-1f17-4301-a8e7-11376d0f8e59.mp4',
    title: presetFields.title.text,
    titleSize: presetFields.title.size,
    titleColor: presetFields.title.color.text,
    titlePosition: presetFields.title.position,
    titleFont: presetFields.title.font,
    titleStyle: presetFields.title.style,
    titleShadow: presetFields.title.shadow,
    addCaptions: presetFields.captions.enabled,
    captionStyle: presetFields.captions.style || 'default',
    captionAnimation: presetFields.captions.animation,
    captionMultiple: presetFields.captions.multipleWords,
    captionPosition: presetFields.captions.position,
    videoBackground: presetFields.videoBackground,
    videoZoom: presetFields.videoZoom,
    transcriptionUrl:
      'https://ddgwsqpgp6ybu.cloudfront.net/public-assets/presets/sample-transcription.json',
    startTime: '00:00:00',
    endTime: '01:50:00',
  };

  const handleSave = () => {
    const completeInputProps = {
      ...inputProps,
    };

    onPresetCreate({
      id: Date.now().toString(),
      name: presetFields.name,
      description: presetFields.description,
      composition: {
        durationInFrames: 300,
        fps: 30,
        width: 1080,
        height: 1920,
        component: DefaultShort,
        inputProps: completeInputProps,
      },
    });
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <MoveLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Create Preset</h1>
        </div>

        {/* Main container with left (2/3) and right (1/3) sections */}
        <div className="bg-muted/50 flex gap-6 rounded-lg p-6">
          <PresetFields
            presetFields={presetFields}
            setPresetFields={setPresetFields}
          />

          <PresetPreview
            inputProps={inputProps}
            onSave={handleSave}
            isSaveDisabled={!presetFields.name}
          />
        </div>
      </div>
    </div>
  );
}

export type TextStyles = typeof defaultTextStyles;
export type PresetFieldsState = {
  name: string;
  description: string;
  title: TextStyles;
  captions: TextStyles & {
    multipleWords: boolean;
    animation: boolean;
    enabled: boolean;
  };
  videoBackground: string;
  videoZoom: number;
};
