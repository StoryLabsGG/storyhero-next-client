'use client';

import { Button } from '@/components/ui/button';

export default function NavButtons() {
  return (
    <div className="flex flex-row gap-4">
      <Button
        variant="default"
        className="bg-storyhero hover:bg-storyhero/80 text-white"
      >
        Sign In
      </Button>
    </div>
  );
}
