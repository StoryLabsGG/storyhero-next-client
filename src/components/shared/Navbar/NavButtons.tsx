'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function NavButtons() {
  const router = useRouter();

  return (
    <div className="flex flex-row gap-4">
      <Button
        onClick={() => router.push('/sign-in')}
        variant="default"
        className="bg-storyhero hover:bg-storyhero/80 text-white"
      >
        Sign In
      </Button>
    </div>
  );
}
