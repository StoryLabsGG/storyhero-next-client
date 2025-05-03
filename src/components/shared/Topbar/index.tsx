'use client';

import { ReactNode } from 'react';

interface TopbarProps {
  title?: string;
  children?: ReactNode;
}

export function Topbar({ title, children }: TopbarProps) {
  return (
    <div className="bg-background flex h-[52px] items-center justify-between px-6">
      <h1 className="text-lg font-medium">{title}</h1>
      {children && <div className="flex items-center">{children}</div>}
    </div>
  );
}
