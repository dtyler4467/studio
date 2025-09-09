
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LostAndFoundTable } from '@/components/dashboard/lost-and-found-table';

export default function LostAndFoundPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Lost & Found" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Lost & Found Trailers</CardTitle>
                <CardDescription>
                    This section contains trailers that were moved from a lane that was already occupied.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LostAndFoundTable />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
