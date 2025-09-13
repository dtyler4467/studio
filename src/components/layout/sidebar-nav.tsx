

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
  CalendarPlus,
  Truck,
  ArchiveRestore,
  Sparkles,
  MessageSquare,
  FileQuestion,
  FileText,
  Database,
  DatabaseBackup,
  Boxes,
  ArrowDownToLine,
  ArrowUpFromLine,
  ShoppingCart,
  Banknote,
  Gauge,
  Siren,
  ShieldCheck,
  Gamepad2,
  ClipboardCheck,
  Receipt,
  UploadCloud,
  Folder,
  Tablet,
  BookOpen,
  Fence,
  Share2,
  Building2,
  Contact,
  ClipboardPaste,
  Map,
  Wrench,
  Store,
  BarChart,
  CheckSquare,
  UserCheck as UserCheckIcon,
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
  { 
    href: '#', 
    icon: Sparkles, 
    label: 'AI',
    roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'],
    subItems: [
        { href: '/dashboard/ai-assistant', icon: MessageSquare, label: 'Assistant', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/ai-prompts', icon: FileQuestion, label: 'Prompts', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
    ]
  },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
  { 
    href: '/dashboard/warehouse-hub-manager', 
    icon: Warehouse, 
    label: 'Warehouse Hub Manager', 
    roles: ['Admin', 'Dispatcher', 'Manager', 'Forklift', 'Laborer'],
    subItems: [
        { href: '/dashboard/warehouse-hub-manager', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin', 'Dispatcher', 'Manager', 'Forklift', 'Laborer'] },
        { 
            href: '#', 
            icon: Warehouse, 
            label: 'Dock Hub', 
            roles: ['Admin', 'Dispatcher', 'Manager', 'Forklift', 'Laborer'],
            subItems: [
                { href: '/dashboard/yard-management/dock-doors', icon: Warehouse, label: 'Dock Doors', roles: ['Admin', 'Dispatcher', 'Manager', 'Forklift', 'Laborer'] },
                { 
                    href: '#', 
                    icon: Users, 
                    label: 'Warehouse Associates', 
                    roles: ['Admin', 'Dispatcher', 'Manager', 'Forklift', 'Laborer'],
                    subItems: [
                         { href: '/dashboard/warehouse-hub-manager/associates', icon: Users, label: 'Load Picker Dashboard', roles: ['Admin', 'Dispatcher', 'Manager', 'Forklift', 'Laborer'] },
                         { href: '/dashboard/warehouse-hub-manager/associates/assigner', icon: UserCheckIcon, label: 'Warehouse Associate Assigner', roles: ['Admin', 'Manager'] },
                    ]
                },
            ]
        },
        { href: '/dashboard/warehouse-hub-manager/inventory', icon: Boxes, label: 'Inventory', roles: ['Admin', 'Dispatcher', 'Manager', 'Forklift', 'Laborer'] },
        { href: '/dashboard/warehouse-hub-manager/receiving', icon: ArrowDownToLine, label: 'Receiving', roles: ['Admin', 'Dispatcher', 'Manager', 'Forklift', 'Laborer'] },
        { href: '/dashboard/warehouse-hub-manager/shipping', icon: ArrowUpFromLine, label: 'Shipping', roles: ['Admin', 'Dispatcher', 'Manager', 'Forklift', 'Laborer'] },
        { href: '/dashboard/warehouse-hub-manager/load-planner', icon: ClipboardList, label: 'Load Planner', roles: ['Admin', 'Dispatcher', 'Manager'] },
        { href: '/dashboard/warehouse-hub-manager/procurement', icon: ShoppingCart, label: 'Procurement', roles: ['Admin', 'Dispatcher', 'Manager'] },
        { 
            href: '#', 
            icon: CheckSquare, 
            label: 'Quality Control', 
            roles: ['Admin', 'Dispatcher', 'Manager'],
            subItems: [
                 { href: '/dashboard/warehouse-hub-manager/quality-control/overview', icon: BarChart, label: 'Overview', roles: ['Admin', 'Dispatcher', 'Manager'] },
                 { href: '/dashboard/warehouse-hub-manager/quality-control', icon: ShieldCheck, label: 'Management', roles: ['Admin', 'Dispatcher', 'Manager'] },
            ]
        },
        { 
            href: '#', 
            icon: FileText, 
            label: 'Bill of Lading', 
            roles: ['Admin', 'Dispatcher', 'Manager'],
            subItems: [
                { href: '/dashboard/warehouse-hub-manager/bol', icon: PlusCircle, label: 'Create BOL', roles: ['Admin', 'Dispatcher', 'Manager'] },
                { href: '/dashboard/warehouse-hub-manager/bol/templates', icon: FileText, label: 'BOL created templates', roles: ['Admin', 'Dispatcher', 'Manager'] },
                { href: '/dashboard/warehouse-hub-manager/bol/history', icon: History, label: 'BOL History', roles: ['Admin', 'Dispatcher', 'Manager'] },
            ]
        },
        { href: '/dashboard/warehouse-hub-manager/customers', icon: Users, label: 'Customers', roles: ['Admin', 'Dispatcher', 'Manager'] },
        { href: '/dashboard/warehouse-hub-manager/carriers', icon: Truck, label: 'Carriers', roles: ['Admin', 'Dispatcher', 'Manager'] },
    ]
  },
  { 
    href: '/dashboard/yard-management', 
    icon: Fence, 
    label: 'Yard Management',
    roles: ['Admin', 'Dispatcher'],
    subItems: [
        { href: '/dashboard/yard-management', icon: LayoutDashboard, label: 'Overview', roles: ['Admin', 'Dispatcher'] },
        { 
            href: '/dashboard/yard-management/appointment', 
            label: 'Appointment', 
            icon: CalendarPlus, 
            roles: ['Admin', 'Dispatcher'],
            subItems: [
                { href: '/dashboard/yard-management/appointment/office', label: 'Office', icon: Briefcase, roles: ['Admin', 'Dispatcher'] },
                { href: '/dashboard/yard-management/appointment/gate', label: 'Gate', icon: Truck, roles: ['Admin', 'Dispatcher'] },
                { href: '/dashboard/yard-management/appointment/trash', label: 'Trash', icon: Trash2, roles: ['Admin', 'Dispatcher'] },
            ]
        },
        { href: '/dashboard/yard-management/search', label: 'Load Search', icon: Search, roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/check-in', label: 'Inbound', roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/outbound', label: 'Outbound', roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/dock-doors', label: 'Dock Doors', icon: Warehouse, roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/parking-lanes', label: 'Parking Lanes', icon: ParkingCircle, roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/history', label: 'Yard History', icon: History, roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/lost-and-found', label: 'Lost & Found', icon: ArchiveRestore, roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/reports', icon: BarChart, label: 'Reports', roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/trash', label: 'Trash', icon: Trash2, roles: ['Admin', 'Dispatcher'] },
    ]
  },
   {
    href: '#',
    icon: Truck,
    label: 'Fleet Management',
    roles: ['Admin', 'Dispatcher', 'Manager'],
    subItems: [
        { href: '/dashboard/fleet-management', icon: LayoutDashboard, label: 'Overview', roles: ['Admin', 'Dispatcher', 'Manager'] },
        { href: '/dashboard/fleet-management/vendor', icon: Building2, label: 'Vendor', roles: ['Admin', 'Dispatcher', 'Manager'] },
        { href: '/dashboard/fleet-management/customer', icon: Contact, label: 'Customer', roles: ['Admin', 'Dispatcher', 'Manager'] },
        { href: '/dashboard/fleet-management/equipment-assignment', icon: ClipboardPaste, label: 'Equipment Assignment', roles: ['Admin', 'Dispatcher', 'Manager'] },
        { href: '/dashboard/fleet-management/location', icon: Map, label: 'Location', roles: ['Admin', 'Dispatcher', 'Manager'] },
    ]
  },
  { href: '/dashboard/safety-hub', icon: ShieldCheck, label: 'Safety Hub', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager'] },
  { 
    href: '/dashboard/driver-hub', 
    icon: Gamepad2, 
    label: 'Driver Hub', 
    roles: ['Admin', 'Dispatcher', 'Driver'],
    subItems: [
        { href: '/dashboard/driver-hub', icon: LayoutDashboard, label: 'Overview', roles: ['Admin', 'Dispatcher', 'Driver'] },
        { href: '/dashboard/driver-hub/dvir', icon: ClipboardCheck, label: 'D.V.I.R', roles: ['Admin', 'Dispatcher', 'Driver'] },
        { href: '/dashboard/driver-hub/insurance', icon: ShieldCheck, label: 'Insurance', roles: ['Admin', 'Dispatcher', 'Driver'] },
        { href: '/dashboard/driver-hub/registration', icon: FileText, label: 'Registration', roles: ['Admin', 'Dispatcher', 'Driver'] },
        { href: '/dashboard/driver-hub/receipts', icon: Receipt, label: 'Receipts', roles: ['Admin', 'Dispatcher', 'Driver'] },
        { href: '/dashboard/driver-hub/chat', icon: MessageSquare, label: 'Chat', roles: ['Admin', 'Dispatcher', 'Driver'] },
        { href: '/dashboard/driver-hub/document-uploader', icon: UploadCloud, label: 'Document Uploader', roles: ['Admin', 'Dispatcher', 'Driver'] },
        { href: '/dashboard/driver-hub/company-documents', icon: Folder, label: 'Company Documents', roles: ['Admin', 'Dispatcher', 'Driver'] },
        { href: '/dashboard/driver-hub/eld', icon: Tablet, label: 'ELD', roles: ['Admin', 'Dispatcher', 'Driver'] },
        { href: '/dashboard/driver-hub/paper-logs', icon: BookOpen, label: 'Paper Logs', roles: ['Admin', 'Dispatcher', 'Driver'] },
        { href: '/dashboard/driver-hub/training', icon: GraduationCap, label: 'Training', roles: ['Admin', 'Dispatcher', 'Driver'] },
    ]
  },
  { href: '/dashboard/load-board-hub', icon: Library, label: 'Load board hub', roles: ['Admin', 'Dispatcher'] },
  { href: '/dashboard/loads', icon: ClipboardList, label: 'Loads Board', roles: ['Driver'] },
  { href: '/dashboard/tracking', icon: MapPin, label: 'Tracking', roles: ['Admin', 'Dispatcher'] },
  { 
    href: '#', 
    icon: Clock, 
    label: 'Time Tracker HUB', 
    roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'],
    subItems: [
        { href: '/dashboard/time-tracker-hub/overview', icon: LayoutDashboard, label: 'Overview', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/time-clock', icon: Clock, label: 'Time Clock', roles: ['Driver', 'Manager', 'Employee', 'Forklift', 'Laborer', 'Admin', 'Dispatcher'] },
        { href: '/dashboard/time-tracker-hub/settings', icon: Settings, label: 'Settings', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
    ]
  },
  { href: '/dashboard/alerts', icon: AlertTriangle, label: 'Alerts', roles: ['Admin', 'Dispatcher'] },
  { href: '/dashboard/sos-alerts', icon: Siren, label: 'SOS Alerts', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager'] },
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
  { 
    href: '#', 
    icon: CreditCard, 
    label: 'Accountant', 
    roles: ['Admin', 'Manager'],
    subItems: [
        { href: '/dashboard/accountant', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/budget', icon: Banknote, label: 'Budget', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/mileage-tracker', icon: Gauge, label: 'Mileage Tracker', roles: ['Admin', 'Manager'] },
    ]
  },
  { href: '/dashboard/recruitment-hub', icon: Briefcase, label: 'Recruitment Hub', roles: ['Admin', 'Manager'] },
  { href: '/dashboard/repair-shop', icon: Wrench, label: 'Repair Shop', roles: ['Admin', 'Manager', 'Dispatcher'] },
  { href: '/dashboard/store', icon: Store, label: 'Store', roles: ['Admin', 'Manager', 'Dispatcher', 'Driver'] },
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
    { href: '/dashboard/administration/training', icon: GraduationCap, label: 'Assign Task Hub', roles: ['Admin'] },
    { 
        href: '#', 
        icon: Folder, 
        label: 'Files', 
        roles: ['Admin'],
        subItems: [
            { href: '/dashboard/administration/files', icon: Folder, label: 'All Files', roles: ['Admin'] },
            { href: '/dashboard/administration/files/share-history', icon: History, label: 'Share History', roles: ['Admin'] },
            { href: '/dashboard/administration/files/trash', icon: Trash2, label: 'Trash', roles: ['Admin'] },
        ]
    },
    { href: '/dashboard/administration/billing', icon: CreditCard, label: 'Billing', roles: ['Admin'] },
    { href: '/dashboard/administration/data-plan', icon: Database, label: 'Data Plan', roles: ['Admin'] },
    { href: '/dashboard/administration/storage-backup', icon: DatabaseBackup, label: 'Storage & Backup', roles: ['Admin'] },
    { href: '/dashboard/administration/terms-and-agreements', icon: FileText, label: 'Terms & Agreements', roles: ['Admin'] },
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
  const { currentUser, localLoadBoards, addLocalLoadBoard, deleteLocalLoadBoard, loadBoardHub, updateLocalLoadBoard } = useSchedule();
  const { state } = useSidebar();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isWarehouseHubOpen, setIsWarehouseHubOpen] = useState(false);
  const [isYardManagementOpen, setIsYardManagementOpen] = useState(false);
  const [isFleetManagementOpen, setIsFleetManagementOpen] = useState(false);
  const [isDriverHubOpen, setIsDriverHubOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAccountantOpen, setIsAccountantOpen] = useState(false);
  const [isLoadBoardHubOpen, setIsLoadBoardHubOpen] = useState(false);
  const [isTimeTrackerHubOpen, setIsTimeTrackerHubOpen] = useState(false);
  const [openAdminSubMenus, setOpenAdminSubMenus] = useState<Record<string, boolean>>({});
  const [openYardSubMenus, setOpenYardSubMenus] = useState<Record<string, boolean>>({});
  const [openWarehouseSubMenus, setOpenWarehouseSubMenus] = useState<Record<string, boolean>>({});
  const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<LocalLoadBoard | null>(null);
  
  const handleOpenEditDialog = (board: LocalLoadBoard) => {
      setSelectedBoard(board);
      setIsEditBoardOpen(true);
  };


  useEffect(() => {
    setIsAiOpen(pathname.startsWith('/dashboard/ai-'));
    setIsWarehouseHubOpen(pathname.startsWith('/dashboard/warehouse-hub-manager'));
    setIsYardManagementOpen(pathname.startsWith('/dashboard/yard-management'));
    setIsFleetManagementOpen(pathname.startsWith('/dashboard/fleet-management') || pathname.startsWith('/dashboard/repair-shop'));
    setIsDriverHubOpen(pathname.startsWith('/dashboard/driver-hub'));
    setIsLoadBoardHubOpen(pathname.startsWith('/dashboard/dispatch') || pathname.startsWith('/dashboard/local-loads'));
    setIsTimeTrackerHubOpen(pathname.startsWith('/dashboard/time-tracker-hub') || pathname.startsWith('/dashboard/time-clock'));
    setIsAdminOpen(pathname.startsWith('/dashboard/administration'));
    setIsAccountantOpen(pathname.startsWith('/dashboard/accountant'));
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

     const newOpenYardSubMenus: Record<string, boolean> = {};
        navItems.find(i => i.href === '/dashboard/yard-management')?.subItems?.forEach(item => {
            if (item.subItems) {
                const isActive = item.subItems.some(sub => pathname.startsWith(sub.href));
                newOpenYardSubMenus[item.label] = isActive;
            }
        });
    setOpenYardSubMenus(newOpenYardSubMenus);

    const newOpenWarehouseSubMenus: Record<string, boolean> = {};
        navItems.find(i => i.href === '/dashboard/warehouse-hub-manager')?.subItems?.forEach(item => {
            if (item.subItems) {
                const isActive = item.subItems.some(sub => pathname.startsWith(sub.href));
                newOpenWarehouseSubMenus[item.label] = isActive;
            }
        });
    setOpenWarehouseSubMenus(newOpenWarehouseSubMenus);
  }, [pathname]);

  if (!currentUser) {
    // Or a loading spinner
    return null;
  }
  const { role } = currentUser;

  // Function to determine if a sub-item is active
  const isSubItemActive = (href: string) => {
    // Exact match for overview pages to prevent matching parent layout routes
    if (href === '/dashboard/yard-management' || href === '/dashboard/administration' || href === '/dashboard/load-board-hub' || href === '/dashboard/yard-management/appointment' || href === '/dashboard/ai-assistant' || href === '/dashboard/warehouse-hub-manager' || href === '/dashboard/accountant' || href === '/dashboard/fleet-management' || href === '/dashboard/driver-hub' || href === '/dashboard/administration/files' || href === '/dashboard/warehouse-hub-manager/bol' || href === '/dashboard/time-tracker-hub' || href === '/dashboard/warehouse-hub-manager/quality-control' || href === '/dashboard/warehouse-hub-manager/associates') {
        return pathname === href;
    }
    return pathname.startsWith(href);
  }
  
  const filteredNavItems = navItems.filter(item => item.roles.includes(role));
  const filteredAdminNavItems = adminNavItems.filter(item => item.roles.includes(role));
  const canManageLocalLoadBoards = role === 'Admin' || role === 'Dispatcher';


  const renderNavSubItems = (subItems: NavItem[], parentLabel: string) => {
    const openSubMenus = parentLabel === 'Yard Management' ? openYardSubMenus : parentLabel === 'Warehouse Hub Manager' ? openWarehouseSubMenus : {};
    const setOpenSubMenus = parentLabel === 'Yard Management' ? setOpenYardSubMenus : parentLabel === 'Warehouse Hub Manager' ? setOpenWarehouseSubMenus : () => {};

    return subItems.map(subItem => {
      const isSubOverview = subItem.label === 'Dashboard' || subItem.label === 'Overview';
      if (subItem.subItems) {
        const isOpen = openSubMenus[subItem.label] || false;
        const setIsOpen = (open: boolean) => setOpenSubMenus(prev => ({ ...prev, [subItem.label]: open }));

        return (
          <Collapsible key={subItem.label} open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <SidebarMenuSubButton isActive={subItem.subItems.some(si => pathname.startsWith(si.href))}>
                <subItem.icon />
                <span>{subItem.label}</span>
                <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", isOpen && "rotate-180")} />
              </SidebarMenuSubButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {subItem.subItems.map(nestedSubItem => (
                  <SidebarMenuSubItem key={nestedSubItem.label}>
                    <SidebarMenuSubButton asChild isActive={isSubItemActive(nestedSubItem.href)} size="sm">
                      <Link href={nestedSubItem.href}>
                        {nestedSubItem.icon && <nestedSubItem.icon />}
                        <span>{nestedSubItem.label}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        );
      }

      return (
        <SidebarMenuSubItem key={subItem.label}>
          <SidebarMenuSubButton asChild isActive={isSubItemActive(subItem.href)}>
            <Link href={subItem.href} target={isSubOverview ? "_blank" : undefined} rel={isSubOverview ? "noopener noreferrer" : undefined}>
              {subItem.icon && <subItem.icon />}
              <span>{subItem.label}</span>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      );
    });
  };

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
            const isOverview = item.label === 'Dashboard' || item.label === 'Overview';

            if (item.href === '/dashboard/load-board-hub') {
                const hubSubItems = loadBoardHubSubItems.filter(sub => sub.roles.includes(role));
                return (
                     <Collapsible key={item.label} asChild open={isLoadBoardHubOpen} onOpenChange={setIsLoadBoardHubOpen}>
                         <SidebarMenuItem>
                            <div className="flex items-center w-full">
                               <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                       isActive={isSubItemActive(item.href)}
                                       tooltip={loadBoardHub.name}
                                       className="justify-start w-full group flex-grow"
                                   >
                                       <div className="flex items-center gap-2">
                                         <item.icon />
                                         <span>{loadBoardHub.name}</span>
                                       </div>
                                       <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", isLoadBoardHubOpen && "rotate-180")} />
                                   </SidebarMenuButton>
                               </CollapsibleTrigger>
                               <Button variant="ghost" size="icon" className="h-7 w-7 mr-1 group-data-[collapsible=icon]:hidden shrink-0" onClick={(e) => {e.preventDefault(); e.stopPropagation(); handleOpenEditDialog(loadBoardHub)}}>
                                    <Pencil className="h-4 w-4" />
                               </Button>
                            </div>
                             <CollapsibleContent>
                                 <SidebarMenuSub>
                                     {hubSubItems.map((subItem) => (
                                         <SidebarMenuSubItem key={subItem.label}>
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
                                                        <Pencil className="h-3 h-3" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={(e) => {e.stopPropagation(); deleteLocalLoadBoard(board.id)}} disabled={localLoadBoards.length <= 1}>
                                                        <MinusCircle className="h-3 h-3" />
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
                 const isOpenMap = {
                     'Warehouse Hub Manager': isWarehouseHubOpen,
                     'Yard Management': isYardManagementOpen,
                     'Fleet Management': isFleetManagementOpen,
                     'Driver Hub': isDriverHubOpen,
                     'My Workspace': isWorkspaceOpen,
                     'AI': isAiOpen,
                     'Accountant': isAccountantOpen,
                     'Time Tracker HUB': isTimeTrackerHubOpen,
                 };
                 const setIsOpenMap = {
                    'Warehouse Hub Manager': setIsWarehouseHubOpen,
                    'Yard Management': setIsYardManagementOpen,
                    'Fleet Management': setIsFleetManagementOpen,
                    'Driver Hub': setIsDriverHubOpen,
                    'My Workspace': setIsWorkspaceOpen,
                    'AI': setIsAiOpen,
                    'Accountant': setIsAccountantOpen,
                    'Time Tracker HUB': setIsTimeTrackerHubOpen,
                 }
                 const isOpen = isOpenMap[item.label as keyof typeof isOpenMap];
                 const setIsOpen = setIsOpenMap[item.label as keyof typeof setIsOpenMap];

                 if(isOpen === undefined || setIsOpen === undefined) {
                     // Fallback for items not in the map
                     return null;
                 }


                 return (
                 <Collapsible key={item.label} asChild open={isOpen} onOpenChange={setIsOpen}>
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
                                    {renderNavSubItems(filteredSubItems, item.label)}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                         )}
                     </SidebarMenuItem>
                 </Collapsible>
                );
            }
             

            return (
                <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                    asChild
                    isActive={isSubItemActive(item.href)}
                    tooltip={item.label}
                    className="justify-start w-full group"
                >
                    <Link href={item.href} target={isOverview ? "_blank" : undefined} rel={isOverview ? "noopener noreferrer" : undefined}>
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
                                 const isSubOverview = item.label === 'Overview';
                                 if (item.subItems) {
                                     const isOpen = openAdminSubMenus[item.label] || false;
                                     const setIsOpen = (open: boolean) => setOpenAdminSubMenus(prev => ({...prev, [item.label]: open}));
                                     return (
                                         <Collapsible key={item.label} open={isOpen} onOpenChange={setIsOpen}>
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
                                                          <SidebarMenuSubItem key={subItem.label}>
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
                                     <SidebarMenuSubItem key={item.label}>
                                        <SidebarMenuSubButton asChild isActive={isSubItemActive(item.href)}>
                                            <Link href={item.href} target={isSubOverview ? "_blank" : undefined} rel={isSubOverview ? "noopener noreferrer" : undefined}>
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
