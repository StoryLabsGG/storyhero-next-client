'use client';

import { Coins } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CreditsModuleProps {
  credits: number;
}

export function CreditsModule({ credits }: CreditsModuleProps) {
  // Calculate expiration date (15 days from now for this example)
  const expirationDays = 15;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center gap-1.5 rounded-md bg-transparent px-3 py-1 text-white hover:bg-zinc-800">
                <Coins className="h-5 w-5 text-amber-400" />
                <span className="font-medium">{credits}</span>
              </div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="border-zinc-700 bg-zinc-800 text-white"
          >
            <span className="text-sm">1 credit = 1 minute</span>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent
          className="w-80 border-zinc-700 bg-zinc-900 p-5 text-white"
          sideOffset={10}
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Free Plan</span>
              <Badge className="border-none bg-green-800 text-green-300">
                Active
              </Badge>
            </div>
          </div>

          <div className="mb-1 flex items-center justify-between">
            <span className="text-zinc-400">Free credits</span>
            <div className="flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-amber-400" />
              <span className="text-lg font-semibold">{credits}</span>
            </div>
          </div>

          <div className="mb-5">
            <span className="text-sm text-zinc-500">
              Expires in {expirationDays} days
            </span>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              size="lg"
              className="w-full border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
              asChild
            >
              <Link href="/buy-credits">Add more credits</Link>
            </Button>

            {/* <Button
              variant="ghost"
              size="lg"
              className="w-full text-zinc-400 hover:text-white hover:bg-transparent"
              asChild
            >
              <Link href="/credits-info">Learn how credits work</Link>
            </Button> */}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
