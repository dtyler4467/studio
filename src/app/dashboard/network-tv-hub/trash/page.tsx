
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

export default function NetworkTvTrashPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Network TV Trash" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Trash2 />
                    Media Trash
                </CardTitle>
                <CardDescription>
                    Review and restore deleted media assets from your library.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Deleted media assets will be shown here.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
