
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function WarehousePickerAssignerPage() {
  return (
    <div className="flex flex-col w-full">
       <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <h1 className="text-lg font-semibold font-headline md:text-2xl">Picker Assigner</h1>
            <div className="ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Navigate To <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild><Link href="/dashboard/warehouse-hub-manager/associates/my-pick">My Active Pick</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/dashboard/warehouse-hub-manager/associates/order-queue">Order Queue</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/dashboard/warehouse-hub-manager/associates/productivity">Productivity</Link></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
       </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Assign Picker</CardTitle>
                <CardDescription>
                    Assign warehouse associates to specific orders or tasks.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Picker assigner content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
