

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
  Search,
  History,
  CreditCard,
  GraduationCap,
  ParkingCircle,
} from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { useSidebar } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { 
    href: '/dashboard/yard-management', 
    icon: Warehouse, 
    label: 'Yard Management',
    subItems: [
        { href: '/dashboard/yard-management', label: 'Overview' },
        { href: '/dashboard/yard-management/search', label: 'Load Search', icon: Search },
        { href: '/dashboard/yard-management/check-in', label: 'Check In/Out' },
        { href: '/dashboard/yard-management/dock-doors', label: 'Dock Doors', icon: Warehouse },
        { href: '/dashboard/yard-management/parking-lanes', label: 'Parking Lanes', icon: ParkingCircle },
        { href: '/dashboard/yard-management/history', label: 'Yard History', icon: History },
    ]
  },
  { href: '/dashboard/dispatch', icon: Send, label: 'Dispatch' },
  { href: '/dashboard/loads', icon: ClipboardList, label: 'Loads Board' },
  { href: '/dashboard/tracking', icon: MapPin, label: 'Tracking' },
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
    { href: '/dashboard/administration/expense-report', icon: CreditCard, label: 'Expense Reports' },
    { href: '/dashboard/administration/training', icon: GraduationCap, label: 'Training Management' },
    { href: '/dashboard/administration/print', icon: Printer, label: 'Print/Email' },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [isYardManagementOpen, setIsYardManagementOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    setIsYardManagementOpen(pathname.startsWith('/dashboard/yard-management'));
    setIsAdminOpen(pathname.startsWith('/dashboard/administration'));
  }, [pathname]);

  // Function to determine if a sub-item is active
  const isSubItemActive = (href: string) => {
    // Exact match for overview pages to prevent matching parent layout routes
    if (href === '/dashboard/yard-management' || href === '/dashboard/administration') {
        return pathname === href;
    }
    return pathname.startsWith(href);
  }

  const isYardManagementActive = pathname.startsWith('/dashboard/yard-management');


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
                                     {item.subItems.map((subItem) => (
                                         <SidebarMenuSubItem key={subItem.href}>
                                             <SidebarMenuSubButton asChild isActive={isSubItemActive(subItem.href)}>
                                                 <Link href={subItem.href}>
                                                     {subItem.icon && <subItem.icon />}
                                                     <span>{subItem.label}</span>
                                                 </Link>
                                             </SidebarMenuSubButton>
                                         </SidebarMenuSubItem>
                                     ))}
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
                                <SidebarMenuSubButton asChild isActive={isSubItemActive(item.href)}>
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
