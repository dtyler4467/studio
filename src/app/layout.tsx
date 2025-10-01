import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { ScheduleProvider } from '@/hooks/use-schedule';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ProPantheon',
  description: 'Streamlining Logistics for the Modern Age',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <ScheduleProvider>
            <SidebarProvider>
                <SidebarNav />
                <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
        </ScheduleProvider>
        <Toaster />
      </body>
    </html>
  );
}
