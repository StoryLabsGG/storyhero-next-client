'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export default function Logo({
  className,
  onClick,
  navigate = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  navigate?: boolean;
}) {
  const router = useRouter();

  return (
    <div
      className={cn('flex cursor-pointer items-center select-none', className)}
      onClick={() => navigate && router.push('/')}
    >
      <Image
        className={cn('aspect-square max-h-16 cursor-pointer')}
        src={'/logo.png'}
        alt="logo"
        width={64}
        height={64}
        {...props}
      />
      <span className="text-xl font-bold">StoryHero</span>
    </div>
  );
}
