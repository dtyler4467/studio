
"use client";

import { useParams, notFound } from 'next/navigation';
import { useSchedule } from '@/hooks/use-schedule';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LoadsDataTable } from '@/components/dashboard/loads-data-table';
import { useEffect, useState } from 'react';

export default function LocalLoadsPage() {
    const params = useParams();
    const { id } = params;
    const { localLoadBoards } = useSchedule();
    const [boardName, setBoardName] = useState('Local Load Board');

    useEffect(() => {
        const board = localLoadBoards.find(b => b.id === id);
        if (board) {
            setBoardName(`${board.name} ${board.number}`);
        }
    }, [id, localLoadBoards]);

    if (!localLoadBoards.some(b => b.id === id)) {
        notFound();
    }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle={boardName} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{boardName}</CardTitle>
            <CardDescription>
              Manage local routes, assign drivers, and track active shipments for this board.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoadsDataTable isEditable={true} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

