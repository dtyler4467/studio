
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/icons/logo';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation
    const showTimer = setTimeout(() => setShow(true), 500);
    
    // Redirect to dashboard after a delay
    const redirectTimer = setTimeout(() => {
      router.replace('/dashboard');
    }, 4000); // 4 seconds total

    return () => {
        clearTimeout(showTimer);
        clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
        <video 
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-40"
            poster="https://picsum.photos/seed/matrix/1920/1080"
        >
            {/* 
                NOTE: This is a placeholder video.
                You should replace this with a URL to your own hosted video file.
                For example, you could upload a video to Firebase Storage.
                A good free option can be found at: https://www.pexels.com/video/a-digital-matrix-3052494/
            */}
            <source src="https://videos.pexels.com/video-files/3052494/3052494-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>

      <div className={cn(
          "relative z-10 flex flex-col items-center justify-center text-center text-white transition-opacity duration-1000",
          show ? "opacity-100" : "opacity-0"
      )}>
        <Logo className="h-24 w-24 text-primary" />
        <h1 className="mt-4 text-5xl font-bold font-headline tracking-wider text-shadow-lg">
          LogiFlow
        </h1>
        <p className="mt-2 text-lg text-primary-foreground/80">
          Streamlining Logistics for the Modern Age
        </p>
      </div>
    </div>
  );
}
