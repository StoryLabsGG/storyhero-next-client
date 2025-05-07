import { Player } from '@remotion/player';
import {
  DefaultShort,
  DefaultShortProps,
} from '@storylabsgg/storybox-remotion/src/compositions/default-short';
import { useState } from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  initialPreset?: PresetData;
}

export default function PresetsCreator({
  onPresetCreate,
  initialPreset,
}: PresetsCreatorProps) {
  const [presetName, setPresetName] = useState(initialPreset?.name || '');
  const [presetDescription, setPresetDescription] = useState(
    initialPreset?.description || ''
  );

  // Add states for input props
  const [title, setTitle] = useState('Your Title Here');
  const [titleSize, setTitleSize] = useState(80);
  const [titleColor, setTitleColor] = useState('white');
  const [captionStyle, setCaptionStyle] =
    useState<DefaultShortProps['captionStyle']>('default');

  const inputProps = {
    videoUrl:
      'https://ddgwsqpgp6ybu.cloudfront.net/generate-shorts/e545de26-1f17-4301-a8e7-11376d0f8e59/raw-download/1745201891-e545de26-1f17-4301-a8e7-11376d0f8e59.mp4',
    title,
    titleSize,
    titleColor,
    addCaptions: true,
    captionStyle,
    transcriptionUrl:
      'https://ddgwsqpgp6ybu.cloudfront.net/public-assets/presets/sample-transcription.json',
    startTime: '00:00:00',
    endTime: '01:50:00',
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold">Create Preset</h1>

        {/* Main container with left (2/3) and right (1/3) sections */}
        <div className="bg-muted/50 flex gap-6 rounded-lg p-6">
          {/* Left section - Configuration (2/3) */}
          <div className="flex-[2] space-y-8">
            {/* Section 1 - Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">1.</span>
                <h2 className="font-semibold">Basic Info</h2>
              </div>
              <div className="bg-background space-y-4 rounded-lg p-4">
                <div className="space-y-2">
                  <Label>Preset Name</Label>
                  <Input
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Enter preset name"
                    className="bg-muted/50 border-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={presetDescription}
                    onChange={(e) => setPresetDescription(e.target.value)}
                    placeholder="Enter preset description"
                    className="bg-muted/50 border-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 - Title Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">2.</span>
                <h2 className="font-semibold">Title Configuration</h2>
              </div>
              <div className="bg-background space-y-4 rounded-lg p-4">
                <div className="space-y-2">
                  <Label>Title Text</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title text"
                    className="bg-muted/50 border-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title Size</Label>
                    <Input
                      type="number"
                      value={titleSize}
                      onChange={(e) => setTitleSize(Number(e.target.value))}
                      min={10}
                      max={200}
                      className="bg-muted/50 border-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Title Color</Label>
                    <Select value={titleColor} onValueChange={setTitleColor}>
                      <SelectTrigger className="bg-muted/50 border-none">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 - Caption Style */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">3.</span>
                <h2 className="font-semibold">Caption Style</h2>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="space-y-2">
                  <Label>Style</Label>
                  <Select
                    value={captionStyle}
                    onValueChange={(value) =>
                      setCaptionStyle(
                        value as DefaultShortProps['captionStyle']
                      )
                    }
                  >
                    <SelectTrigger className="bg-muted/50 border-none">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="subtitle">Subtitle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Right section - Preview (1/3) */}
          <div className="flex-1">
            <div className="sticky top-6">
              <Card className="bg-muted/50 overflow-hidden">
                <AspectRatio ratio={9 / 16}>
                  <Player
                    component={DefaultShort}
                    durationInFrames={300}
                    fps={30}
                    compositionWidth={1080}
                    compositionHeight={1920}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    inputProps={inputProps}
                    autoPlay
                    controls
                    initiallyMuted
                  />
                </AspectRatio>
              </Card>

              {/* Save button at the bottom */}
              <div className="mt-4">
                <Button
                  className="w-full"
                  onClick={() =>
                    onPresetCreate({
                      id: Date.now().toString(),
                      name: presetName,
                      description: presetDescription,
                      composition: {
                        durationInFrames: 300,
                        fps: 30,
                        width: 1080,
                        height: 1920,
                        component: DefaultShort,
                        inputProps,
                      },
                    })
                  }
                  disabled={!presetName}
                >
                  Save Preset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
