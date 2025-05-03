'use client';

import { useSearchParams } from 'next/navigation';

import GenerateShortsFlow from './GenerateShortsFlow';

export default function GenerateShorts() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-10">
      <div className="w-full">
        <GenerateShortsFlow initialUrl={url || ''} />
      </div>
    </div>
  );
}
