'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  label: string;
  colorClass: string;
  className?: string;
}

export function StatusBadge({ label, colorClass, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-medium', colorClass, className)}>
      {label}
    </Badge>
  );
}
