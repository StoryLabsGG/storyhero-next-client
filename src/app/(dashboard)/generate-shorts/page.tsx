'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import GenerateShortsFlow from './GenerateShortsFlow';

function GenerateShortsContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');

  return (
    <div className="w-full">
      <GenerateShortsFlow initialUrl={url || ''} />
    </div>
  );
}

export default function GenerateShorts() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-10">
      <Suspense fallback={<div>Loading...</div>}>
        <GenerateShortsContent />
      </Suspense>
    </div>
  );
}
