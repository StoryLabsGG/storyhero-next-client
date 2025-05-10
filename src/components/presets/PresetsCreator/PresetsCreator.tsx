import { DefaultShortProps } from '@storylabsgg/storybox-remotion/src/compositions/default-short';
import { MoveLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { defaultTextStyles } from '@/lib/constants';
import { PresetData } from '@/types/preset';

import PresetFields from './PresetFields';
import PresetPreview from './PresetPreview';

interface PresetsCreatorProps {
  onPresetCreate: (preset: PresetData) => void;
  onClose: () => void;
}

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

  const { data: session } = useSession();

  const inputProps: DefaultShortProps = {
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
    // captionStyle: presetFields.captions.style || 'normal',
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
    if (!session?.user?.id) {
      console.error('User not authenticated');
      return;
    }

    onPresetCreate({
      name: presetFields.name,
      description: presetFields.description,
      inputProps: inputProps,
      id: Date.now().toString(),
      userId: session.user.id,
      compositionId: 'DefaultShort',
      createdAt: Date.now(),
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
