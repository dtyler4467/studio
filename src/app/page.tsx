

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProPantheonLogo } from '@/components/icons/propantheon-logo';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-4">
            <ProPantheonLogo />
            <Skeleton className="h-4 w-48" />
        </div>
    </div>
  );
}
