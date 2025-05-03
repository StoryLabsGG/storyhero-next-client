'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';

export default function NavButtons() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex flex-row gap-4">
      {session ? (
        <Button
          onClick={() => router.push('/dashboard')}
          variant="default"
          className="bg-storyhero hover:bg-storyhero/80 text-white"
        >
          Dashboard
        </Button>
      ) : (
        <Button
          onClick={() => router.push('/sign-in')}
          variant="default"
          className="bg-storyhero hover:bg-storyhero/80 text-white"
        >
          Sign In
        </Button>
      )}
    </div>
  );
}
