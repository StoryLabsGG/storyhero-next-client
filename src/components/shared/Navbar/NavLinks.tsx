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
      <Link href="/pricing" className="hover:text-primary transition-colors">
        Pricing
      </Link>
      <Link
        href="https://storyhero.tolt.io"
        className="hover:text-primary transition-colors"
      >
        Affiliate
      </Link>
    </div>
  );
}
