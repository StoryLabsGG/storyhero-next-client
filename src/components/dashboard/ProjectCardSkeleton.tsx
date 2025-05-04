'use client';

import { Card } from '@/components/ui/card';

export default function ProjectCardSkeleton() {
  return (
    <Card className="bg-storyhero-bg-elevated h-full w-full animate-pulse overflow-hidden border-0 !py-0">
      <div className="bg-storyhero-bg-higher aspect-video w-full rounded-t-lg"></div>
      <div className="px-3 py-4">
        <div className="bg-storyhero-bg-highest mb-2 h-5 w-3/4 rounded"></div>
        <div className="bg-storyhero-bg-highest h-4 w-1/2 rounded"></div>
      </div>
    </Card>
  );
}
