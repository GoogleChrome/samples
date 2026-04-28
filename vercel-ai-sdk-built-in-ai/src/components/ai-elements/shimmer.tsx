import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export const Shimmer = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span
    className={cn('bg-clip-text text-transparent', className)}
    style={{
      backgroundImage: 'linear-gradient(90deg, hsl(var(--foreground)) 0%, hsl(var(--muted-foreground)) 40%, hsl(var(--foreground)) 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 2s linear infinite',
    }}
  >
    {children}
  </span>
);
