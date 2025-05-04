'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';

export default function NavLinks() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex gap-6">
      <Button variant="ghost" asChild>
        <Link href="/pricing">Pricing</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="https://storyhero.tolt.io">Affiliate</Link>
      </Button>
    </div>
  );
}
