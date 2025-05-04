'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function VideoInputButton() {
  const [link, setLink] = useState('');
  const [placeholder, setPlaceholder] = useState('Paste a YouTube link here');

  return (
    <div className="flex w-full flex-col justify-center gap-4 px-4 md:w-fit md:flex-row md:items-center md:px-0">
      <Input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="h-14 min-h-12 min-w-full bg-gray-800 text-base placeholder:text-gray-300 md:min-h-full"
        placeholder={placeholder}
      />

      <Link href={'/dashboard'}>
        <Button
          className="min-w-full px-4 md:px-6"
          size={'xl'}
          variant={'gooeyLeft'}
        >
          Get Clips Now
        </Button>
      </Link>
    </div>
  );
}
