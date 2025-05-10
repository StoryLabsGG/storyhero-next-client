'use client';

import { DefaultShortProps } from '@storylabsgg/storybox-remotion/src/compositions/default-short';
import { LoaderCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { PresetData } from '@/types/preset';

import PresetsCreator from './PresetsCreator/PresetsCreator';

export default function PresetsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [presets, setPresets] = useState<PresetData[]>([]);

  const { data: session } = useSession();

  const fetchPresets = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/list-presets`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch presets');
      }

      const data = await response.json();
      setPresets(data.presets || []);
    } catch (err) {
      console.error('Error fetching presets:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchPresets();
    }
  }, [fetchPresets, session?.user?.id]);

  const handlePresetCreate = async (preset: PresetData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/create-preset`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: preset.name,
            description: preset.description,
            compositionId: 'DefaultShort',
            inputProps: preset.inputProps,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create preset');
      }

      const data = await response.json();

      const savedPreset: PresetData = {
        ...preset,
        ...data.preset,
      };

      setPresets([...presets, savedPreset]);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating preset:', error);
      alert('Failed to create preset. Please try again.');
    }
  };

  if (isCreating) {
    return (
      <PresetsCreator
        onPresetCreate={handlePresetCreate}
        onClose={() => setIsCreating(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Presets</h1>
        <Button onClick={() => setIsCreating(true)}>Create Preset</Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <p className="text-storyhero-text-secondary">
            <LoaderCircle className="animate-spin" />
          </p>
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {presets.length === 0 ? (
            <div className="text-storyhero-text-secondary col-span-full py-10 text-center">
              <p>No presets found. Create your first preset!</p>
            </div>
          ) : (
            presets.map((preset: any) => (
              <div
                key={preset.id}
                className="border-storyhero-bg-elevated bg-storyhero-bg-base rounded-lg border p-4"
              >
                <h3 className="text-lg font-semibold">{preset.name}</h3>
                <p className="text-storyhero-text-secondary text-sm">
                  {preset.description}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
