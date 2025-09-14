
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function StoreRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the overview page by default
    router.replace('/dashboard/store/overview');
  }, [router]);

  return (
     <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-48" />
        </div>
    </div>
  );
}
