
"use client";

import React from 'react';
import { Header } from '@/components/layout/header';
import { PickerProductivity } from '@/components/dashboard/picker-productivity';

export default function ProductivityPage() {
  return (
    <div className="flex flex-col w-full">
       <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <h1 className="text-lg font-semibold font-headline md:text-2xl">Picker Productivity</h1>
       </header>
       <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <PickerProductivity />
       </main>
    </div>
  );
}
