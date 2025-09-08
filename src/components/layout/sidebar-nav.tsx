
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
  Trash2,
  Clock,
  Briefcase,
} from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { useSidebar } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useSchedule, EmployeeRole } from '@/hooks/use-schedule';

type NavItem = {
    href: string;
    icon: React.ElementType;
    label: string;
    roles: EmployeeRole[];
    subItems?: NavItem[];
}

const navItems: NavItem[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
  { 
    href: '/dashboard/yard-management', 
    icon: Warehouse, 
    label: 'Yard Management',
    roles: ['Admin', 'Dispatcher'],
    subItems: [
        { href: '/dashboard/yard-management', icon: LayoutDashboard, label: 'Overview', roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/search', label: 'Load Search', icon: Search, roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/check-in', label: 'Check In/Out', roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/dock-doors', label: 'Dock Doors', icon: Warehouse, roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/parking-lanes', label: 'Parking Lanes', icon: ParkingCircle, roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/history', label: 'Yard History', icon: History, roles: ['Admin', 'Dispatcher'] },
    ]
  },
  { href: '/dashboard/dispatch', icon: Send, label: 'Dispatch', roles: ['Admin', 'Dispatcher'] },
  { href: '/dashboard/loads', icon: ClipboardList, label: 'Loads Board', roles: ['Driver'] },
  { href: '/dashboard/tracking', icon: MapPin, label: 'Tracking', roles: ['Admin', 'Dispatcher'] },
  { href: '/dashboard/alerts', icon: AlertTriangle, label: 'Alerts', roles: ['Admin', 'Dispatcher'] },
  { 
    href: '#', 
    icon: Briefcase, 
    label: 'My Workspace',
    roles: ['Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'],
    subItems: [
        { href: '/dashboard/schedule', icon: Calendar, label: 'My Schedule', roles: ['Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/time-clock', icon: Clock, label: 'Time Clock', roles: ['Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/time-off', icon: CalendarCheck, label: 'Time Off', roles: ['Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/resources', icon: Book, label: 'Training', roles: ['Driver', 'Admin', 'Dispatcher', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
    ]
  },
];

const adminNavItems: NavItem[] = [
    { href: '/dashboard/administration', icon: Shield, label: 'Overview', roles: ['Admin'] },
    { 
        href: '/dashboard/administration/time-clock', 
        icon: Clock, 
        label: 'Time & Attendance',
        roles: ['Admin'],
        subItems: [
            { href: '/dashboard/administration/time-clock', icon: Clock, label: 'Time Clock', roles: ['Admin'] },
            { href: '/dashboard/administration/shifts', icon: CalendarCog, label: 'Shift Management', roles: ['Admin'] },
        ]
    },
    { href: '/dashboard/administration/time-off', icon: CalendarCheck, label: 'Time Off Requests', roles: ['Admin'] },
    { href: '/dashboard/administration/registrations', icon: UserPlus, label: 'Registrations', roles: ['Admin'] },
    { href: '/dashboard/administration/personnel', icon: Users, label: 'Personnel', roles: ['Admin'] },
    { href: '/dashboard/administration/expense-report', icon: CreditCard, label: 'Expense Reports', roles: ['Admin'] },
    { href: '/dashboard/administration/training', icon: GraduationCap, label: 'Training Management', roles: ['Admin'] },
    { href: '/dashboard/administration/trash', icon: Trash2, label: 'Trash', roles: ['Admin'] },
    { href: '/dashboard/administration/print', icon: Printer, label: 'Print/Email', roles: ['Admin'] },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { currentUser } = useSchedule();
  const { state } = useSidebar();
  const [isYardManagementOpen, setIsYardManagementOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [openAdminSubMenus, setOpenAdminSubMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsYardManagementOpen(pathname.startsWith('/dashboard/yard-management'));
    setIsAdminOpen(pathname.startsWith('/dashboard/administration'));
    setIsWorkspaceOpen(
        pathname.startsWith('/dashboard/schedule') ||
        pathname.startsWith('/dashboard/time-clock') ||
        pathname.startsWith('/dashboard/time-off') ||
        pathname.startsWith('/dashboard/resources')
    );
     // Auto-open admin sub-menus if the current path is inside them
     const newOpenAdminSubMenus: Record<string, boolean> = {};
     adminNavItems.forEach(item => {
         if (item.subItems) {
            const isActive = item.subItems.some(sub => pathname.startsWith(sub.href));
            newOpenAdminSubMenus[item.label] = isActive;
         }
     });
     setOpenAdminSubMenus(newOpenAdminSubMenus);
  }, [pathname]);

  if (!currentUser) {
    // Or a loading spinner
    return null;
  }
  const { role } = currentUser;

  // Function to determine if a sub-item is active
  const isSubItemActive = (href: string) => {
    // Exact match for overview pages to prevent matching parent layout routes
    if (href === '/dashboard/yard-management' || href === '/dashboard/administration') {
        return pathname === href;
    }
    return pathname.startsWith(href);
  }
  
  const filteredNavItems = navItems.filter(item => item.roles.includes(role));
  const filteredAdminNavItems = adminNavItems.filter(item => item.roles.includes(role));


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
          {filteredNavItems.map((item) => {
            const filteredSubItems = item.subItems?.filter(sub => sub.roles.includes(role));

            if (item.subItems && filteredSubItems && filteredSubItems.length > 0) {
                 const isOpen = item.label === 'Yard Management' ? isYardManagementOpen : isWorkspaceOpen;
                 const setIsOpen = item.label === 'Yard Management' ? setIsYardManagementOpen : setIsWorkspaceOpen;

                 return (
                 <Collapsible key={item.href} asChild open={isOpen} onOpenChange={setIsOpen}>
                     <SidebarMenuItem>
                         <CollapsibleTrigger asChild>
                             <SidebarMenuButton
                                 isActive={isSubItemActive(item.href)}
                                 tooltip={item.label}
                                 className="justify-start w-full group"
                             >
                                 <div className="w-full flex items-center justify-between">
                                     <div className="flex items-center gap-2">
                                         <item.icon />
                                         <span>{item.label}</span>
                                     </div>
                                     <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                                 </div>
                             </SidebarMenuButton>
                         </CollapsibleTrigger>
                         {filteredSubItems && (
                             <CollapsibleContent>
                                 <SidebarMenuSub>
                                     {filteredSubItems.map((subItem) => (
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
                );
            }
             
            return (
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
             );
          })}
        </SidebarMenu>
        
        {filteredAdminNavItems.length > 0 && (
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
                             {filteredAdminNavItems.map((item) => {
                                 if (item.subItems) {
                                     const isOpen = openAdminSubMenus[item.label] || false;
                                     const setIsOpen = (open: boolean) => setOpenAdminSubMenus(prev => ({...prev, [item.label]: open}));
                                     return (
                                         <Collapsible key={item.href} open={isOpen} onOpenChange={setIsOpen}>
                                             <CollapsibleTrigger asChild>
                                                 <SidebarMenuSubButton isActive={item.subItems.some(si => pathname.startsWith(si.href))}>
                                                     <item.icon />
                                                     <span>{item.label}</span>
                                                     <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                                                 </SidebarMenuSubButton>
                                             </CollapsibleTrigger>
                                             <CollapsibleContent>
                                                 <SidebarMenuSub>
                                                     {item.subItems.map((subItem) => (
                                                          <SidebarMenuSubItem key={subItem.href}>
                                                            <SidebarMenuSubButton asChild isActive={isSubItemActive(subItem.href)} size="sm">
                                                                <Link href={subItem.href}>
                                                                    <subItem.icon />
                                                                    <span>{subItem.label}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                         </SidebarMenuSubItem>
                                                     ))}
                                                 </SidebarMenuSub>
                                             </CollapsibleContent>
                                         </Collapsible>
                                     )
                                 }
                                 return (
                                     <SidebarMenuSubItem key={item.href}>
                                        <SidebarMenuSubButton asChild isActive={isSubItemActive(item.href)}>
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                     </SidebarMenuSubItem>
                                 )
                             })}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
            </SidebarMenu>
        )}

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
