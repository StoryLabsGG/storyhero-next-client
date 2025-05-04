'use client';

import { ReactNode } from 'react';

import { CreditsModule } from '@/components/shared/Topbar/CreditsModule';
import { useUserCredits } from '@/hooks/useUserCredits';

interface TopbarProps {
  title?: string;
  children?: ReactNode;
  // Keep the credits prop for backward compatibility or overriding the fetched value
  credits?: number;
}

export function Topbar({
  title,
  children,
  credits: creditsFromProps,
}: TopbarProps) {
  const { credits: fetchedCredits, isLoading } = useUserCredits();

  const creditsToDisplay =
    creditsFromProps !== undefined ? creditsFromProps : fetchedCredits;

  return (
    <div className="bg-background flex h-[52px] items-center justify-between px-6">
      <h1 className="text-lg font-medium">{title}</h1>
      <div className="flex items-center gap-4">
        {!isLoading && <CreditsModule credits={creditsToDisplay} />}
        {children && <div className="flex items-center">{children}</div>}
      </div>
    </div>
  );
}
