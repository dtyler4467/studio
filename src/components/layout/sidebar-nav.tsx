

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
  Tv,
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
  Pencil,
  MinusCircle,
  PlusCircle,
  Library,
} from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { useSidebar } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useSchedule, EmployeeRole, LocalLoadBoard } from '@/hooks/use-schedule';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

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
  { href: '/dashboard/load-board-hub', icon: Library, label: 'Load board hub', roles: ['Admin', 'Dispatcher'] },
  { href: '/dashboard/loads', icon: ClipboardList, label: 'Loads Board', roles: ['Driver'] },
  { href: '/dashboard/tracking', icon: MapPin, label: 'Tracking', roles: ['Admin', 'Dispatcher'] },
  { href: '/dashboard/time-clock', icon: Clock, label: 'Time Clock', roles: ['Driver', 'Manager', 'Employee', 'Forklift', 'Laborer', 'Admin', 'Dispatcher'] },
  { href: '/dashboard/alerts', icon: AlertTriangle, label: 'Alerts', roles: ['Admin', 'Dispatcher'] },
  { 
    href: '#', 
    icon: Briefcase, 
    label: 'My Workspace',
    roles: ['Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'],
    subItems: [
        { href: '/dashboard/schedule', icon: Calendar, label: 'My Schedule', roles: ['Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/time-off', icon: CalendarCheck, label: 'Time Off', roles: ['Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/resources', icon: Book, label: 'Training', roles: ['Driver', 'Admin', 'Dispatcher', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
    ]
  },
];

const adminNavItems: NavItem[] = [
    { href: '/dashboard/administration', icon: Shield, label: 'Overview', roles: ['Admin'] },
    { 
        href: '#', 
        icon: Clock, 
        label: 'Time & Attendance',
        roles: ['Admin'],
        subItems: [
            { href: '/dashboard/administration/time-clock', icon: Clock, label: 'Time Clock', roles: ['Admin'] },
            { href: '/dashboard/administration/shifts', icon: CalendarCog, label: 'Shift Management', roles: ['Admin'] },
            { href: '/dashboard/administration/time-off', icon: CalendarCheck, label: 'Time Off Requests', roles: ['Admin'] },
        ]
    },
    { href: '/dashboard/administration/registrations', icon: UserPlus, label: 'Registrations', roles: ['Admin'] },
    { href: '/dashboard/administration/personnel', icon: Users, label: 'Personnel', roles: ['Admin'] },
    { href: '/dashboard/administration/expense-report', icon: CreditCard, label: 'Expense Reports', roles: ['Admin'] },
    { href: '/dashboard/administration/training', icon: GraduationCap, label: 'Training Management', roles: ['Admin'] },
    { href: '/dashboard/administration/trash', icon: Trash2, label: 'Trash', roles: ['Admin'] },
    { href: '/dashboard/administration/print', icon: Printer, label: 'Print/Email', roles: ['Admin'] },
];

const loadBoardHubSubItems: NavItem[] = [
    { href: '/dashboard/dispatch', icon: Tv, label: 'O.T.R. Load Board', roles: ['Admin', 'Dispatcher'] },
]

const EditLoadBoardDialog = ({ board, onOpenChange, isOpen }: { board: LocalLoadBoard | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    const { updateLocalLoadBoard } = useSchedule();
    const { toast } = useToast();
    const [name, setName] = useState(board?.name || '');
    const [number, setNumber] = useState(board?.number?.toString() || '');

    useEffect(() => {
        if (board) {
            setName(board.name);
            setNumber(board.number?.toString() || '');
        }
    }, [board]);

    const handleSave = () => {
        if (board) {
            const num = parseInt(number, 10);
            if (number && isNaN(num)) {
                toast({ variant: 'destructive', title: 'Invalid Number', description: 'Please enter a valid number for the board.' });
                return;
            }
            updateLocalLoadBoard(board.id, name, isNaN(num) ? undefined : num);
            toast({ title: 'Load Board Updated', description: 'The load board has been successfully updated.' });
            onOpenChange(false);
        }
    }

    if (!board) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Load Board</DialogTitle>
                    <DialogDescription>
                        Change the name and number for this load board.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                    </div>
                    {board.number !== undefined && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="number" className="text-right">Number</Label>
                            <Input id="number" type="number" value={number} onChange={e => setNumber(e.target.value)} className="col-span-3" />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function SidebarNav() {
  const pathname = usePathname();
  const { currentUser, localLoadBoards, addLocalLoadBoard, deleteLocalLoadBoard, loadBoardHub, updateLoadBoardHubName } = useSchedule();
  const { state } = useSidebar();
  const [isYardManagementOpen, setIsYardManagementOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoadBoardHubOpen, setIsLoadBoardHubOpen] = useState(false);
  const [openAdminSubMenus, setOpenAdminSubMenus] = useState<Record<string, boolean>>({});
  const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<LocalLoadBoard | null>(null);
  
  const handleOpenEditDialog = (board: LocalLoadBoard) => {
      setSelectedBoard(board);
      setIsEditBoardOpen(true);
  };


  useEffect(() => {
    setIsYardManagementOpen(pathname.startsWith('/dashboard/yard-management'));
    setIsLoadBoardHubOpen(pathname.startsWith('/dashboard/dispatch') || pathname.startsWith('/dashboard/local-loads'));
    setIsAdminOpen(pathname.startsWith('/dashboard/administration'));
    setIsWorkspaceOpen(
        pathname.startsWith('/dashboard/schedule') ||
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
    if (href === '/dashboard/yard-management' || href === '/dashboard/administration' || href === '/dashboard/load-board-hub') {
        return pathname === href;
    }
    if (href === '/dashboard/local-loads') {
        return pathname.startsWith(href);
    }
    return pathname.startsWith(href);
  }
  
  const filteredNavItems = navItems.filter(item => item.roles.includes(role));
  const filteredAdminNavItems = adminNavItems.filter(item => item.roles.includes(role));
  const canManageLocalLoadBoards = role === 'Admin' || role === 'Dispatcher';


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

            if (item.href === '/dashboard/load-board-hub') {
                const hubSubItems = loadBoardHubSubItems.filter(sub => sub.roles.includes(role));
                return (
                     <Collapsible key={item.href} asChild open={isLoadBoardHubOpen} onOpenChange={setIsLoadBoardHubOpen}>
                         <SidebarMenuItem>
                             <CollapsibleTrigger asChild>
                                 <SidebarMenuButton
                                     isActive={isSubItemActive(item.href)}
                                     tooltip={loadBoardHub.name}
                                     className="justify-start w-full group"
                                 >
                                     <div className="w-full flex items-center justify-between">
                                         <div className="flex items-center gap-2">
                                             <item.icon />
                                             <span>{loadBoardHub.name}</span>
                                         </div>
                                         <div className="flex items-center">
                                            <Button variant="ghost" size="icon" className="h-7 w-7 mr-1 group-data-[collapsible=icon]:hidden" onClick={(e) => {e.preventDefault(); e.stopPropagation(); handleOpenEditDialog(loadBoardHub)}}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <ChevronDown className={cn("h-4 w-4 transition-transform", isLoadBoardHubOpen && "rotate-180")} />
                                         </div>
                                     </div>
                                 </SidebarMenuButton>
                             </CollapsibleTrigger>
                             <CollapsibleContent>
                                 <SidebarMenuSub>
                                     {hubSubItems.map((subItem) => (
                                         <SidebarMenuSubItem key={subItem.href}>
                                             <SidebarMenuSubButton asChild isActive={isSubItemActive(subItem.href)}>
                                                 <Link href={subItem.href}>
                                                     {subItem.icon && <subItem.icon />}
                                                     <span>{subItem.label}</span>
                                                 </Link>
                                             </SidebarMenuSubButton>
                                         </SidebarMenuSubItem>
                                     ))}
                                     {canManageLocalLoadBoards && localLoadBoards.map(board => (
                                        <SidebarMenuSubItem key={board.id}>
                                            <div className="flex items-center gap-1 w-full">
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={pathname === `/dashboard/local-loads/${board.id}`}
                                                    className="justify-start group flex-grow"
                                                >
                                                    <Link href={`/dashboard/local-loads/${board.id}`}>
                                                        <ClipboardList />
                                                        <span>{`${board.name} ${board.number}`}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                                <div className="flex group-data-[collapsible=icon]:hidden">
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => {e.stopPropagation(); handleOpenEditDialog(board)}}>
                                                        <Pencil className="h-3 w-3" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={(e) => {e.stopPropagation(); deleteLocalLoadBoard(board.id)}} disabled={localLoadBoards.length <= 1}>
                                                        <MinusCircle className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </SidebarMenuSubItem>
                                     ))}
                                     {canManageLocalLoadBoards && (
                                        <SidebarMenuSubItem>
                                            <Button variant="outline" size="sm" className="w-full justify-center group-data-[collapsible=icon]:justify-start mt-1" onClick={() => addLocalLoadBoard()}>
                                                <PlusCircle className="group-data-[collapsible=icon]:mx-auto h-4 w-4" />
                                                <span className="group-data-[collapsible=icon]:hidden ml-2">Add Board</span>
                                            </Button>
                                        </SidebarMenuSubItem>
                                    )}
                                 </SidebarMenuSub>
                             </CollapsibleContent>
                         </SidebarMenuItem>
                     </Collapsible>
                );
            }

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
       <EditLoadBoardDialog board={selectedBoard} isOpen={isEditBoardOpen} onOpenChange={setIsEditBoardOpen} />
    </Sidebar>
  );
}
