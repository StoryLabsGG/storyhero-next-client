import { Player } from '@remotion/player';
import { DefaultShort } from '@storylabsgg/storybox-remotion/src/compositions/default-short';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PresetPreviewProps {
  inputProps: any;
  onSave: () => void;
  isSaveDisabled: boolean;
}

export default function PresetPreview({
  inputProps,
  onSave,
  isSaveDisabled,
}: PresetPreviewProps) {
  return (
    <section className="flex-1">
      <div className="flex h-full flex-col justify-center">
        <Card className="bg-muted/50 overflow-hidden p-0">
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
              loop
              controls
              initiallyMuted
            />
          </AspectRatio>
        </Card>

        {/* Save button at the bottom */}
        <div className="mt-4">
          <Button className="w-full" onClick={onSave} disabled={isSaveDisabled}>
            Save Preset
          </Button>
        </div>
      </div>
    </section>
  );
}
