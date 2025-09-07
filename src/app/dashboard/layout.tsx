import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { ScheduleProvider } from '@/hooks/use-schedule';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScheduleProvider>
        <SidebarProvider>
            <SidebarNav />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    </ScheduleProvider>
  );
}
