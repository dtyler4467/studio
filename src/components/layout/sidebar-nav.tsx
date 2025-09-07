'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Warehouse,
  Send,
  ClipboardList,
  MapPin,
  AlertTriangle,
  Calendar,
  Book,
  Settings,
  CircleHelp,
} from 'lucide-react';
import { Logo } from '@/components/icons/logo';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/yard-management', icon: Warehouse, label: 'Yard Management' },
  { href: '/dashboard/dispatch', icon: Send, label: 'Dispatch' },
  { href: '/dashboard/loads', icon: ClipboardList, label: 'Loads Board' },
  { href: '/dashboard/tracking', icon: MapPin, label: 'Tracking' },
  { href: '/dashboard/alerts', icon: AlertTriangle, label: 'Alerts' },
  { href: '/dashboard/schedule', icon: Calendar, label: 'Schedule' },
  { href: '/dashboard/resources', icon: Book, label: 'Training' },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <span className="text-xl font-semibold font-headline text-primary">LogiFlow</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton asChild isActive={pathname === '/dashboard/settings'} tooltip="Settings">
                    <Link href="/dashboard/settings">
                        <Settings />
                        <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                 <SidebarMenuButton asChild tooltip="Help">
                    <Link href="#">
                        <CircleHelp />
                        <span>Help</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
