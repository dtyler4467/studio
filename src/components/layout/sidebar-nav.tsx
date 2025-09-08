

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
  Shield,
  CalendarCheck,
  ChevronDown,
  UserPlus,
  Printer,
  CalendarCog,
  Users,
  Upload,
} from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { useSidebar } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { 
    href: '/dashboard/yard-management', 
    icon: Warehouse, 
    label: 'Yard Management',
    subItems: [
        { href: '/dashboard/yard-management', label: 'Overview' },
        { href: '/dashboard/yard-management/check-in', label: 'Inbound/Outbound' },
        { href: '/dashboard/yard-management/history', label: 'Yard History' },
        { href: '/dashboard/yard-management/upload', label: 'Upload Documents' },
        { href: '/dashboard/dispatch', label: 'Dispatch', icon: Send },
        { href: '/dashboard/tracking', label: 'Tracking', icon: MapPin },
    ]
  },
  { href: '/dashboard/loads', icon: ClipboardList, label: 'Loads Board' },
  { href: '/dashboard/alerts', icon: AlertTriangle, label: 'Alerts' },
  { href: '/dashboard/schedule', icon: Calendar, label: 'Schedule' },
  { href: '/dashboard/time-off', icon: CalendarCheck, label: 'Time Off' },
  { href: '/dashboard/resources', icon: Book, label: 'Training' },
];

const adminNavItems = [
    { href: '/dashboard/administration', icon: Shield, label: 'Overview' },
    { href: '/dashboard/administration/shifts', icon: CalendarCog, label: 'Shift Management' },
    { href: '/dashboard/administration/time-off', icon: CalendarCheck, label: 'Time Off Requests' },
    { href: '/dashboard/administration/registrations', icon: UserPlus, label: 'Registrations' },
    { href: '/dashboard/administration/personnel', icon: Users, label: 'Personnel' },
    { href: '/dashboard/administration/print', icon: Printer, label: 'Print/Email' },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [isYardManagementOpen, setIsYardManagementOpen] = useState(pathname.startsWith('/dashboard/yard-management') || pathname.startsWith('/dashboard/dispatch') || pathname.startsWith('/dashboard/tracking'));
  const [isAdminOpen, setIsAdminOpen] = useState(pathname.startsWith('/dashboard/administration'));

  // Function to determine if a sub-item is active
  const isSubItemActive = (href: string) => {
    if (href === '/dashboard/yard-management') return pathname === href;
    return pathname.startsWith(href);
  }

  const isYardManagementActive = pathname.startsWith('/dashboard/yard-management') || pathname.startsWith('/dashboard/dispatch') || pathname.startsWith('/dashboard/tracking');


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
             item.subItems ? (
                 <Collapsible key={item.href} asChild open={isYardManagementOpen} onOpenChange={setIsYardManagementOpen}>
                     <SidebarMenuItem>
                         <CollapsibleTrigger asChild>
                             <SidebarMenuButton
                                 isActive={isYardManagementActive}
                                 tooltip={item.label}
                                 className="justify-start w-full group"
                             >
                                 <div className="w-full flex items-center justify-between">
                                     <div className="flex items-center gap-2">
                                         <item.icon />
                                         <span>{item.label}</span>
                                     </div>
                                     <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", isYardManagementOpen && "rotate-180")} />
                                 </div>
                             </SidebarMenuButton>
                         </CollapsibleTrigger>
                         {item.subItems && (
                             <CollapsibleContent>
                                 <SidebarMenuSub>
                                     {item.subItems.map((subItem) => {
                                        const Icon = subItem.icon ? subItem.icon : subItem.href.endsWith('upload') ? Upload : subItem.href.endsWith('history') ? 'div' : 'div'
                                        return (
                                         <SidebarMenuSubItem key={subItem.href}>
                                             <SidebarMenuSubButton asChild isActive={isSubItemActive(subItem.href)}>
                                                 <Link href={subItem.href}>
                                                     {subItem.icon && <subItem.icon />}
                                                     <span>{subItem.label}</span>
                                                 </Link>
                                             </SidebarMenuSubButton>
                                         </SidebarMenuSubItem>
                                     )}
                                     )}
                                 </SidebarMenuSub>
                             </CollapsibleContent>
                         )}
                     </SidebarMenuItem>
                 </Collapsible>
             ) : (
                <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="justify-start w-full group"
                >
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
             )
          ))}
        </SidebarMenu>
        
        <SidebarMenu className="mt-auto">
             <Collapsible open={isAdminOpen} onOpenChange={setIsAdminOpen}>
                <CollapsibleTrigger asChild>
                     <SidebarMenuButton
                        variant="default"
                        className="justify-start w-full group"
                        isActive={pathname.startsWith('/dashboard/administration')}
                        >
                        <Shield />
                        <span>Administration</span>
                        <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", isAdminOpen && "rotate-180")} />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {adminNavItems.map((item) => (
                            <SidebarMenuSubItem key={item.href}>
                                <SidebarMenuSubButton asChild isActive={pathname === item.href}>
                                    <Link href={item.href}>
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
             </Collapsible>
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
