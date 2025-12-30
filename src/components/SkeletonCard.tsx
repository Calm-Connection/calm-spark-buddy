import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  variant?: 'insight' | 'tool' | 'stat' | 'avatar' | 'default';
  className?: string;
}

export function SkeletonCard({ variant = 'default', className }: SkeletonCardProps) {
  if (variant === 'insight') {
    return (
      <Card className={cn('p-4 sm:p-6', className)}>
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'tool') {
    return (
      <Card className={cn('p-4 sm:p-5', className)}>
        <div className="flex items-center gap-3 sm:gap-4">
          <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'stat') {
    return (
      <Card className={cn('p-4 text-center', className)}>
        <Skeleton className="h-8 w-12 mx-auto mb-2" />
        <Skeleton className="h-3 w-16 mx-auto" />
      </Card>
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  // Default card
  return (
    <Card className={cn('p-4 sm:p-6', className)}>
      <div className="space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </Card>
  );
}
