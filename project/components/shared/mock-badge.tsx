'use client';

import { cn } from '@/lib/utils';

export function MockSandboxBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning',
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-warning" />
      Mock Sandbox
    </span>
  );
}

export function PrototypeBanner() {
  return (
    <div className="bg-accent/10 border-b border-accent/20 px-4 py-1.5 text-center text-xs font-medium text-accent-foreground">
      Synthetic Data · Hackathon Prototype · No live government data is used
    </div>
  );
}
