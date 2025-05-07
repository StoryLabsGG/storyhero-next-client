'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

import PresetsCreator from './PresetsCreator';

export default function PresetsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [presets, setPresets] = useState<any>([]);

  const handlePresetCreate = (preset: any) => {
    setPresets([...presets, preset]);
    setIsCreating(false);
  };

  if (isCreating) {
    return <PresetsCreator onPresetCreate={handlePresetCreate} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Presets</h1>
        <Button onClick={() => setIsCreating(true)}>Create Preset</Button>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {presets.map((preset: any) => (
          <div
            key={preset.id}
            className="border-storyhero-bg-elevated bg-storyhero-bg-base rounded-lg border p-4"
          >
            <h3 className="text-lg font-semibold">{preset.name}</h3>
            <p className="text-storyhero-text-secondary text-sm">
              {preset.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
