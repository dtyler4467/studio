
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSchedule } from '@/hooks/use-schedule';
import { Skeleton } from '@/components/ui/skeleton';

export default function LocalLoadsRedirectPage() {
  const router = useRouter();
  const { localLoadBoards } = useSchedule();

  useEffect(() => {
    // Redirect to the first available local load board
    if (localLoadBoards.length > 0) {
      router.replace(`/dashboard/local-loads/${localLoadBoards[0].id}`);
    }
  }, [router, localLoadBoards]);

  return (
     <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-48" />
        </div>
    </div>
  );
}
