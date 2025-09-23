

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  UserCheck as UserCheckIcon,
  Package,
  FolderLock,
  Landmark,
  Gavel,
  FileScan,
  HandCoins,
  Percent,
  Tag,
  HeartHandshake,
  FileSignature,
  FilePlus2,
  UserCog,
  Calculator,
  View,
  KanbanSquare,
  PenSquare,
  Presentation,
  Columns,
  Megaphone,
  AlertCircle as AlertCircleIcon,
  Target,
  ListTodo,
  Languages,
  ConciergeBell,
  Videotape,
  Monitor,
  Mic,
  CheckSquare,
  Award,
  BookCopy,
  FileClock,
  ListRestart,
  Repeat,
  PlusSquare,
  File,
  Scale,
  TrendingUp,
  AreaChart,
  GitCompare,
  TrendingDown,
  ChevronsDown,
  Home,
  Scan,
  ShieldAlert,
  CalendarClock,
} from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { useSidebar, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
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
    href: '#', 
    icon: Tv, 
    label: 'Network TV Hub',
    roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'],
    subItems: [
        { href: '/dashboard/network-tv-hub', icon: Columns, label: 'Management', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/network-tv-hub/screen', icon: Tv, label: 'Screen', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/network-tv-hub/editor', icon: Pencil, label: 'Editor', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/network-tv-hub/history', icon: History, label: 'History', roles: ['Admin', 'Dispatcher', 'Manager'] },
        { href: '/dashboard/network-tv-hub/trash', icon: Trash2, label: 'Trash', roles: ['Admin', 'Dispatcher', 'Manager'] },
    ]
  },
  {
    href: '/dashboard/project-hub',
    icon: Package,
    label: 'Project Hub',
    roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'],
    subItems: [
        { href: '/dashboard/project-hub/overview', icon: View, label: 'Overview', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/project-hub/tasks', icon: KanbanSquare, label: 'Tasks', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/project-hub/calendar', icon: Calendar, label: 'Calendar', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/project-hub/whiteboard', icon: PenSquare, label: 'Whiteboard', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/project-hub/files', icon: Folder, label: 'Files', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/project-hub/issues', icon: AlertCircleIcon, label: 'Issues', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/project-hub/reports', icon: Presentation, label: 'Reports', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
    ]
  },
  {
    href: '#',
    icon: Contact,
    label: 'CRM',
    roles: ['Admin', 'Manager'],
    subItems: [
        { href: '/dashboard/crm/overview', icon: LayoutDashboard, label: 'Overview', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/crm/deals', icon: Target, label: 'Deals', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/crm/companies', icon: Building2, label: 'Companies', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/crm/contacts', icon: Users, label: 'Contacts', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/crm/tasks', icon: ListTodo, label: 'Tasks', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/crm/reports', icon: BarChart, label: 'Reports', roles: ['Admin', 'Manager'] },
    ]
  },
   {
    href: '/dashboard/calendar',
    icon: Calendar,
    label: 'Calendar',
    roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'],
  },
  {
    href: '/dashboard/receptionist',
    icon: ConciergeBell,
    label: 'Receptionist',
    roles: ['Admin', 'Dispatcher', 'Manager', 'Employee'],
  },
  { 
    href: '#', 
    icon: GraduationCap, 
    label: 'Teacher Hub', 
    roles: ['Admin', 'Manager', 'Employee'],
    subItems: [
        { href: '/dashboard/teacher-hub', icon: LayoutDashboard, label: 'Overview', roles: ['Admin', 'Manager', 'Employee'] },
        { href: '/dashboard/teacher-hub/gradebook', icon: BookCopy, label: 'Gradebook', roles: ['Admin', 'Manager', 'Employee'] },
        { href: '/dashboard/teacher-hub/lesson-planner', icon: ClipboardList, label: 'Lesson Planner', roles: ['Admin', 'Manager', 'Employee'] },
        { href: '/dashboard/teacher-hub/report-cards', icon: FileText, label: 'Report Cards', roles: ['Admin', 'Manager', 'Employee'] },
        { href: '/dashboard/teacher-hub/certificates', icon: Award, label: 'Certificates', roles: ['Admin', 'Manager', 'Employee'] },
        { href: '/dashboard/teacher-hub/syllabus-creator', icon: BookOpen, label: 'Syllabus Creator', roles: ['Admin', 'Manager', 'Employee'] },
        { href: '/dashboard/teacher-hub/test-quiz-creator', icon: CheckSquare, label: 'Test/Quiz Creator', roles: ['Admin', 'Manager', 'Employee'] },
    ]
  },
  {
    href: '/dashboard/calculator',
    icon: Calculator,
    label: 'Calculator',
    roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'],
  },
  {
    href: '/dashboard/accountant/mileage-tracker',
    icon: Gauge,
    label: 'Mileage Tracker',
    roles: ['Admin', 'Manager', 'Driver'],
  },
  {
    href: '/dashboard/notes',
    icon: Pencil,
    label: 'Notes',
    roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'],
  },
  {
    href: '/dashboard/translator',
    icon: Languages,
    label: 'Translator',
    roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'],
  },
  {
    href: '#',
    icon: Videotape,
    label: 'Record',
    roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'],
    subItems: [
        { href: '/dashboard/record/overview', icon: LayoutDashboard, label: 'Overview', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/record/screen-record', icon: Monitor, label: 'Screen Record', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
        { href: '/dashboard/record/voice-record', icon: Mic, label: 'Voice Record', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
    ]
  },
  { href: '/dashboard/load-board-hub', icon: Library, label: 'Load Board Hub', roles: ['Admin', 'Dispatcher'] },
  { 
    href: '/dashboard/warehouse-hub-manager', 
    icon: Warehouse, 
    label: 'Warehouse Hub Manager', 
    roles: ['Admin', 'Dispatcher', 'Manager', 'Forklift', 'Laborer'],
    subItems: [
        { href: '/dashboard/warehouse-hub-manager', icon: LayoutDashboard, label: 'Overview', roles: ['Admin', 'Dispatcher', 'Manager', 'Forklift', 'Laborer'] },
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
        { 
            href: '/dashboard/warehouse-hub-manager/associates', 
            icon: Users, 
            label: 'Warehouse Associates', 
            roles: ['Admin', 'Dispatcher', 'Manager', 'Forklift', 'Laborer'],
            subItems: [
                 { href: '/dashboard/warehouse-hub-manager/associates/my-pick', icon: UserCheckIcon, label: 'My Active Pick', roles: ['Admin', 'Dispatcher', 'Manager', 'Forklift', 'Laborer'] },
                 { href: '/dashboard/warehouse-hub-manager/associates/order-queue', icon: Package, label: 'Order Queue', roles: ['Admin', 'Dispatcher', 'Manager', 'Forklift', 'Laborer'] },
                 { href: '/dashboard/warehouse-hub-manager/associates/picker-assigner', icon: Contact, label: 'Picker Assigner', roles: ['Admin', 'Dispatcher', 'Manager'] },
                 { href: '/dashboard/warehouse-hub-manager/associates/productivity', icon: BarChart, label: 'Productivity', roles: ['Admin', 'Dispatcher', 'Manager'] },
            ]
        },
    ]
  },
  { href: '/dashboard/dispatch', icon: ClipboardList, label: 'Dispatch', roles: ['Admin', 'Dispatcher'] },
  { href: '/dashboard/fleet-management', icon: Wrench, label: 'Fleet Management', roles: ['Admin', 'Dispatcher'] },
  { 
    href: '/dashboard/yard-management', 
    icon: Fence, 
    label: 'Yard Management', 
    roles: ['Admin', 'Dispatcher'],
    subItems: [
        { href: '/dashboard/yard-management', icon: LayoutDashboard, label: 'Overview', roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/check-in', icon: PlusCircle, label: 'Inbound', roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/outbound', icon: MinusCircle, label: 'Outbound', roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/search', icon: Search, label: 'Load Search', roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/dock-doors', icon: Warehouse, label: 'Dock Doors', roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/parking-lanes', icon: ParkingCircle, label: 'Parking Lanes', roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/lane-manager', icon: Map, label: 'Lane Manager', roles: ['Admin', 'Dispatcher'] },
        { 
            href: '#',
            icon: Calendar,
            label: 'Appointment',
            roles: ['Admin', 'Dispatcher'],
            subItems: [
                { href: '/dashboard/yard-management/appointment', icon: Calendar, label: 'Scheduler', roles: ['Admin', 'Dispatcher'] },
                { href: '/dashboard/yard-management/appointment/gate', icon: CalendarPlus, label: 'Gate', roles: ['Admin', 'Dispatcher'] },
                { href: '/dashboard/yard-management/appointment/office', icon: Briefcase, label: 'Office', roles: ['Admin', 'Dispatcher'] },
                { href: '/dashboard/yard-management/appointment/trash', icon: Trash2, label: 'Trash', roles: ['Admin', 'Dispatcher'] },
            ]
        },
        { href: '/dashboard/yard-management/history', icon: History, label: 'History', roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/reports', icon: FileText, label: 'Reports', roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/lost-and-found', icon: ArchiveRestore, label: 'Lost & Found', roles: ['Admin', 'Dispatcher'] },
        { href: '/dashboard/yard-management/trash', icon: Trash2, label: 'Trash', roles: ['Admin', 'Dispatcher'] },
    ]
  },
  { href: '/dashboard/tracking', icon: MapPin, label: 'Tracking', roles: ['Admin', 'Dispatcher'] },
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
  { href: '/dashboard/blanket-hub', icon: BookOpen, label: 'Blanket Hub', roles: ['Admin', 'Dispatcher', 'Driver', 'Manager', 'Employee', 'Forklift', 'Laborer'] },
  { href: '/dashboard/loads', icon: ClipboardList, label: 'Loads Board', roles: ['Driver'] },
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
        { href: '/dashboard/accountant/balance-sheet', icon: Scale, label: 'Balance Sheet', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/income-statement', icon: TrendingUp, label: 'Income Statement', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/cash-flow-statement', icon: AreaChart, label: 'Cash Flow Statement', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/trial-balance', icon: GitCompare, label: 'Trial Balance', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/general-ledger', icon: Book, label: 'General Ledger', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/accounts-receivable', icon: TrendingUp, label: 'Accounts Receivable', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/accounts-payable', icon: TrendingDown, label: 'Accounts Payable', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/depreciation', icon: ChevronsDown, label: 'Depreciation', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/amortization', icon: ChevronsDown, label: 'Amortization', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/equity', icon: Home, label: 'Equity', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/liabilities', icon: ShieldAlert, label: 'Liabilities', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/financial-ratios', icon: Percent, label: 'Financial Ratios', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/accounts', icon: Users, label: 'Accounts', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/auditing', icon: Scan, label: 'Auditing', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/quarterly-report', icon: CalendarClock, label: 'Quarterly Report', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/end-of-year-report', icon: CalendarCheck, label: 'End of Year Report', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/accountant/bank-statements', icon: Landmark, label: 'Bank Statements', roles: ['Admin', 'Manager'] },
    ]
  },
   { 
    href: '#', 
    icon: HeartHandshake, 
    label: 'HR HUB', 
    roles: ['Admin', 'Manager'],
    subItems: [
      { href: '/dashboard/hr', icon: LayoutDashboard, label: 'Overview', roles: ['Admin', 'Manager'] },
      { href: '/dashboard/recruitment-hub', icon: Briefcase, label: 'Recruitment', roles: ['Admin', 'Manager'] },
      { 
          href: '#', 
          icon: FilePlus2, 
          label: 'Employment Forms',
          roles: ['Admin', 'Manager'],
          subItems: [
              { href: '/dashboard/hr/applications', icon: ClipboardList, label: 'Job Applications', roles: ['Admin', 'Manager'] },
              { href: '/dashboard/hr/job-offer-letter', icon: FileSignature, label: 'Offer Letters', roles: ['Admin', 'Manager'] },
          ]
      },
       { 
          href: '#', 
          icon: UserPlus, 
          label: 'Onboarding Forms',
          roles: ['Admin', 'Manager'],
          subItems: [
              { href: '/dashboard/hr/w4', icon: FileText, label: 'W-4 Forms', roles: ['Admin', 'Manager'] },
              { href: '/dashboard/hr/i-9', icon: FileText, label: 'I-9 Forms', roles: ['Admin', 'Manager'] },
              { href: '/dashboard/hr/deposit', icon: Landmark, label: 'Direct Deposit', roles: ['Admin', 'Manager'] },
          ]
      },
       { 
          href: '#', 
          icon: UserCog, 
          label: 'Employee Management',
          roles: ['Admin', 'Manager'],
          subItems: [
              { href: '/dashboard/administration/personnel', icon: Users, label: 'Employee Records', roles: ['Admin', 'Manager'] },
              { href: '/dashboard/hr/employee-status-change', icon: Pencil, label: 'Status Change', roles: ['Admin', 'Manager'] },
          ]
      },
       { 
          href: '#', 
          icon: HandCoins, 
          label: 'Compensation', 
          roles: ['Admin', 'Manager'],
          subItems: [
              { href: '/dashboard/hr/payroll', icon: HandCoins, label: 'Payroll', roles: ['Admin', 'Manager'] },
              { href: '/dashboard/hr/deductions', icon: Percent, label: 'Deductions', roles: ['Admin', 'Manager'] },
              { href: '/dashboard/hr/paycheck-stub', icon: Receipt, label: 'Paycheck Stub', roles: ['Admin', 'Manager'] },
          ]
      },
       { 
          href: '#', 
          icon: Shield, 
          label: 'Discipline & Reports', 
          roles: ['Admin', 'Manager'],
          subItems: [
              { href: '/dashboard/hr/disciplinary-form', icon: Gavel, label: 'Disciplinary Actions', roles: ['Admin', 'Manager'] },
              { href: '/dashboard/hr/incident-report-form', icon: FileScan, label: 'Incident Reports', roles: ['Admin', 'Manager'] },
              { href: '/dashboard/hr/accident-reports-form', icon: FileScan, label: 'Accident Reports', roles: ['Admin', 'Manager'] },
          ]
      },
      { 
          href: '#', 
          icon: Search, 
          label: 'Verifications', 
          roles: ['Admin', 'Manager'],
          subItems: [
              { href: '/dashboard/hr/background-check', icon: Search, label: 'Background Check', roles: ['Admin', 'Manager'] },
              { href: '/dashboard/hr/drug-test', icon: Tag, label: 'Drug Testing', roles: ['Admin', 'Manager'] },
              { href: '/dashboard/hr/clearing-house', icon: Search, label: 'Clearinghouse', roles: ['Admin', 'Manager'] },
              { href: '/dashboard/hr/previous-employment', icon: History, label: 'Prev. Employment', roles: ['Admin', 'Manager'] },
              { href: '/dashboard/hr/driver-license', icon: CreditCard, label: 'Driver License', roles: ['Admin', 'Manager'] },
              { href: '/dashboard/hr/credentials', icon: CheckSquare, label: 'Credentials', roles: ['Admin', 'Manager'] },
          ]
      },
      { href: '/dashboard/hr/policies', icon: FolderLock, label: 'Company Policies', roles: ['Admin', 'Manager'] },
      { href: '/dashboard/hr/contracts', icon: FileSignature, label: 'Contracts', roles: ['Admin', 'Manager'] },
      { href: '/dashboard/hr/investigation', icon: FileScan, label: 'Investigation', roles: ['Admin', 'Manager'] },
      { href: '/dashboard/hr/audit', icon: FileScan, label: 'Audit', roles: ['Admin', 'Manager'] },
      { href: '/dashboard/hr/lawsuits', icon: Gavel, label: 'Lawsuits', roles: ['Admin', 'Manager'] },
    ]
  },
  { 
    href: '#', 
    icon: FileText, 
    label: 'Invoice Hub', 
    roles: ['Admin', 'Manager'],
    subItems: [
        { href: '/dashboard/invoice-hub/overview', icon: LayoutDashboard, label: 'Overview', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/invoice-hub/invoices', icon: FileText, label: 'All Invoices', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/invoice-hub/create', icon: PlusSquare, label: 'Create Invoice', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/invoice-hub/recurring', icon: Repeat, label: 'Recurring', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/invoice-hub/customers', icon: Users, label: 'Customers', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/invoice-hub/products', icon: Package, label: 'Products & Services', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/invoice-hub/reports', icon: BarChart, label: 'Reports', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/invoice-hub/settings', icon: Settings, label: 'Settings', roles: ['Admin', 'Manager'] },
    ]
  },
  { 
    href: '/dashboard/store',
    icon: Store, 
    label: 'Store', 
    roles: ['Admin', 'Manager', 'Dispatcher', 'Driver'],
    subItems: [
        { href: '/dashboard/store/overview', icon: LayoutDashboard, label: 'Overview', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/store/products', icon: Package, label: 'Products', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/store/orders', icon: ShoppingCart, label: 'Orders', roles: ['Admin', 'Manager'] },
        { href: '/dashboard/store/customers', icon: Users, label: 'Customers', roles: ['Admin', 'Manager'] },
    ]
   },
    {
    href: '/dashboard/public-relations',
    icon: Megaphone,
    label: 'Public Relations',
    roles: ['Admin', 'Manager'],
    subItems: [
      { href: '/dashboard/public-relations/overview', icon: LayoutDashboard, label: 'Overview', roles: ['Admin', 'Manager'] },
      { href: '/dashboard/public-relations/press-releases', icon: FileText, label: 'Press Releases', roles: ['Admin', 'Manager'] },
      { href: '/dashboard/public-relations/media-contacts', icon: Contact, label: 'Media Contacts', roles: ['Admin', 'Manager'] },
      { href: '/dashboard/public-relations/announcements', icon: Siren, label: 'Announcements', roles: ['Admin', 'Manager'] },
      { href: '/dashboard/public-relations/media-kit', icon: Briefcase, label: 'Media Kit', roles: ['Admin', 'Manager'] },
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

const WarehouseAssociatesDialog = ({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                    <DialogTitle>Warehouse Associates</DialogTitle>
                    <DialogDescription>
                        Select a page to navigate to.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 py-4">
                    <Button asChild variant="outline" onClick={() => onOpenChange(false)}><Link href="/dashboard/warehouse-hub-manager/associates/my-pick">My Active Pick</Link></Button>
                    <Button asChild variant="outline" onClick={() => onOpenChange(false)}><Link href="/dashboard/warehouse-hub-manager/associates/order-queue">Order Queue</Link></Button>
                    <Button asChild variant="outline" onClick={() => onOpenChange(false)}><Link href="/dashboard/warehouse-hub-manager/associates/picker-assigner">Picker Assigner</Link></Button>
                    <Button asChild variant="outline" onClick={() => onOpenChange(false)}><Link href="/dashboard/warehouse-hub-manager/associates/productivity">Productivity</Link></Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}


export function SidebarNav() {
  const pathname = usePathname();
  const { currentUser, localLoadBoards, addLocalLoadBoard, deleteLocalLoadBoard, loadBoardHub, updateLocalLoadBoard } = useSchedule();
  const { state } = useSidebar();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [isWarehouseHubOpen, setIsWarehouseHubOpen] = useState(false);
  const [isDriverHubOpen, setIsDriverHubOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAccountantOpen, setIsAccountantOpen] = useState(false);
  const [isHrOpen, setIsHrOpen] = useState(false);
  const [isTimeTrackerHubOpen, setIsTimeTrackerHubOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isProjectHubOpen, setIsProjectHubOpen] = useState(false);
  const [isPublicRelationsOpen, setIsPublicRelationsOpen] = useState(false);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isNetworkTvHubOpen, setIsNetworkTvHubOpen] = useState(false);
  const [isTeacherHubOpen, setIsTeacherHubOpen] = useState(false);
  const [isInvoiceHubOpen, setIsInvoiceHubOpen] = useState(false);
  const [openAdminSubMenus, setOpenAdminSubMenus] = useState<Record<string, boolean>>({});
  const [openYardSubMenus, setOpenYardSubMenus] = useState<Record<string, boolean>>({});
  const [openWarehouseSubMenus, setOpenWarehouseSubMenus] = useState<Record<string, boolean>>({});
  const [openHrSubMenus, setOpenHrSubMenus] = useState<Record<string, boolean>>({});
  const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<LocalLoadBoard | null>(null);
  const [isAssociatesDialogOpen, setAssociatesDialogOpen] = useState(false);
  
  const handleOpenEditDialog = (board: LocalLoadBoard) => {
      setSelectedBoard(board);
      setIsEditBoardOpen(true);
  };


  useEffect(() => {
    setIsAiOpen(pathname.startsWith('/dashboard/ai-'));
    setIsCrmOpen(pathname.startsWith('/dashboard/crm'));
    setIsDispatchOpen(
        pathname.startsWith('/dashboard/dispatch') ||
        pathname.startsWith('/dashboard/yard-management') ||
        pathname.startsWith('/dashboard/fleet-management') ||
        pathname.startsWith('/dashboard/load-board-hub') ||
        pathname.startsWith('/dashboard/local-loads') ||
        pathname.startsWith('/dashboard/tracking')
    );
    setIsWarehouseHubOpen(pathname.startsWith('/dashboard/warehouse-hub-manager'));
    setIsDriverHubOpen(pathname.startsWith('/dashboard/driver-hub'));
    setIsTimeTrackerHubOpen(pathname.startsWith('/dashboard/time-tracker-hub') || pathname.startsWith('/dashboard/time-clock'));
    setIsAdminOpen(pathname.startsWith('/dashboard/administration'));
    setIsAccountantOpen(pathname.startsWith('/dashboard/accountant'));
    setIsHrOpen(pathname.startsWith('/dashboard/recruitment-hub') || pathname.startsWith('/dashboard/hr'));
    setIsStoreOpen(pathname.startsWith('/dashboard/store'));
    setIsProjectHubOpen(pathname.startsWith('/dashboard/project-hub'));
    setIsPublicRelationsOpen(pathname.startsWith('/dashboard/public-relations'));
    setIsRecordOpen(pathname.startsWith('/dashboard/record'));
    setIsNetworkTvHubOpen(pathname.startsWith('/dashboard/network-tv-hub'));
    setIsTeacherHubOpen(pathname.startsWith('/dashboard/teacher-hub'));
    setIsInvoiceHubOpen(pathname.startsWith('/dashboard/invoice-hub'));
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
        navItems.find(i => i.label === 'Yard Management')?.subItems?.forEach(item => {
            if (item.subItems) {
                const isActive = item.subItems.some(sub => pathname.startsWith(sub.href));
                newOpenYardSubMenus[item.label] = isActive;
            }
        });
    setOpenYardSubMenus(newOpenYardSubMenus);

    const newOpenWarehouseSubMenus: Record<string, boolean> = {};
        navItems.find(i => i.label === 'Warehouse Hub Manager')?.subItems?.forEach(item => {
            if (item.subItems) {
                const isActive = item.subItems.some(sub => pathname.startsWith(sub.href));
                newOpenWarehouseSubMenus[item.label] = isActive;
            }
        });
    setOpenWarehouseSubMenus(newOpenWarehouseSubMenus);

    const newOpenHrSubMenus: Record<string, boolean> = {};
        navItems.find(i => i.label === 'HR HUB')?.subItems?.forEach(item => {
            if (item.subItems) {
                const isActive = item.subItems.some(sub => pathname.startsWith(sub.href));
                newOpenHrSubMenus[item.label] = isActive;
            }
        });
    setOpenHrSubMenus(newOpenHrSubMenus);

  }, [pathname]);

  if (!currentUser) {
    // Or a loading spinner
    return null;
  }
  const { role } = currentUser;

  // Function to determine if a sub-item is active
  const isSubItemActive = (href: string) => {
    // Exact match for overview pages to prevent matching parent layout routes
    if (href === '/dashboard/yard-management' || href === '/dashboard/administration' || href === '/dashboard/load-board-hub' || href === '/dashboard/yard-management/appointment' || href === '/dashboard/ai-assistant' || href === '/dashboard/warehouse-hub-manager' || href === '/dashboard/accountant' || href === '/dashboard/fleet-management' || href === '/dashboard/driver-hub' || href === '/dashboard/administration/files' || href === '/dashboard/warehouse-hub-manager/bol' || href === '/dashboard/time-tracker-hub' || href === '/dashboard/warehouse-hub-manager/quality-control' || href === '/dashboard/warehouse-hub-manager/associates' || href === '/dashboard/recruitment-hub' || href === '/dashboard/hr' || href === '/dashboard/hr/w4/overview' || href === '/dashboard/hr/w4' || href === '/dashboard/hr/i-9/overview' || href === '/dashboard/hr/i-9' || href === '/dashboard/store' || href === '/dashboard/hr/policies' || href === '/dashboard/hr/policies/handbook' || href === '/dashboard/project-hub' || href === '/dashboard/calendar' || href === '/dashboard/calculator' || href === '/dashboard/public-relations' || href === '/dashboard/project-hub/issues' || href === '/dashboard/hr/contracts' || href === '/dashboard/crm' || href === '/dashboard/receptionist' || href === '/dashboard/record' || href === '/dashboard/blanket-hub' || href === '/dashboard/network-tv-hub' || href === '/dashboard/network-tv-hub/editor' || href === '/dashboard/network-tv-hub/history' || href === '/dashboard/network-tv-hub/trash' || href === '/dashboard/teacher-hub' || href === '/dashboard/teacher-hub/syllabus-creator' || href === '/dashboard/teacher-hub/test-quiz-creator' || href === '/dashboard/invoice-hub') {
        return pathname === href;
    }
    return pathname.startsWith(href);
  }
  
  const filteredNavItems = navItems.filter(item => item.roles.includes(role));
  const filteredAdminNavItems = adminNavItems.filter(item => item.roles.includes(role));
  const canManageLocalLoadBoards = role === 'Admin' || role === 'Dispatcher';


  const renderNavSubItems = (subItems: NavItem[], parentLabel: string) => {
    const openSubMenusMap: Record<string, Record<string, boolean>> = {
      'Yard Management': openYardSubMenus,
      'Warehouse Hub Manager': openWarehouseSubMenus,
      'HR HUB': openHrSubMenus,
    };
    const setOpenSubMenusMap: Record<string, React.Dispatch<React.SetStateAction<Record<string, boolean>>>> = {
        'Yard Management': setOpenYardSubMenus,
        'Warehouse Hub Manager': setOpenWarehouseSubMenus,
        'HR HUB': setOpenHrSubMenus,
    }

    const openSubMenus = openSubMenusMap[parentLabel] || {};
    const setOpenSubMenus = setOpenSubMenusMap[parentLabel] || (() => {});

    return subItems.map(subItem => {
      const isSubOverview = subItem.label === 'Dashboard' || subItem.label === 'Overview';
      
      if (subItem.label === 'Warehouse Associates') {
           return (
                <SidebarMenuSubItem key={subItem.label}>
                    <SidebarMenuSubButton asChild isActive={isSubItemActive(subItem.href)} onClick={() => setAssociatesDialogOpen(true)}>
                         <Link href="#">
                            <subItem.icon />
                            <span>{subItem.label}</span>
                        </Link>
                    </SidebarMenuSubButton>
                </SidebarMenuSubItem>
           )
      }

      if (subItem.subItems) {
        const isOpen = openSubMenus[subItem.label] || false;
        const setIsOpen = (open: boolean) => setOpenSubMenus(prev => ({ ...prev, [subItem.label]: open }));

        return (
          <Collapsible key={subItem.label} open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <SidebarMenuSubButton asChild isActive={subItem.subItems.some(si => pathname.startsWith(si.href))}>
                <Link href={subItem.href}>
                  {subItem.icon && <subItem.icon />}
                  <span>{subItem.label}</span>
                  <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                </Link>
              </SidebarMenuSubButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {renderNavSubItems(subItem.subItems, subItem.label)}
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
        <div className="flex items-center justify-center p-2">
            <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Dialog open={isAssociatesDialogOpen} onOpenChange={setAssociatesDialogOpen}>
            <SidebarMenu>
            {filteredNavItems.map((item) => {
                const filteredSubItems = item.subItems?.filter(sub => sub.roles.includes(role));
                const isOverview = item.label === 'Dashboard' || item.label === 'Overview';

                if (item.subItems && filteredSubItems && filteredSubItems.length > 0) {
                    const isOpenMap: Record<string, boolean | undefined> = {
                        'Dispatch': isDispatchOpen,
                        'Warehouse Hub Manager': isWarehouseHubOpen,
                        'Driver Hub': isDriverHubOpen,
                        'My Workspace': isWorkspaceOpen,
                        'AI': isAiOpen,
                        'CRM': isCrmOpen,
                        'Accountant': isAccountantOpen,
                        'HR HUB': isHrOpen,
                        'Time Tracker HUB': isTimeTrackerHubOpen,
                        'Store': isStoreOpen,
                        'Project Hub': isProjectHubOpen,
                        'Public Relations': isPublicRelationsOpen,
                        'Record': isRecordOpen,
                        'Network TV Hub': isNetworkTvHubOpen,
                        'Teacher Hub': isTeacherHubOpen,
                        'Invoice Hub': isInvoiceHubOpen,
                        'Yard Management': isDispatchOpen,
                    };
                    const setIsOpenMap: Record<string, React.Dispatch<React.SetStateAction<boolean>> | undefined> = {
                        'Dispatch': setIsDispatchOpen,
                        'Warehouse Hub Manager': setIsWarehouseHubOpen,
                        'Driver Hub': setIsDriverHubOpen,
                        'My Workspace': setIsWorkspaceOpen,
                        'AI': setIsAiOpen,
                        'CRM': setIsCrmOpen,
                        'Accountant': setIsAccountantOpen,
                        'HR HUB': setIsHrOpen,
                        'Time Tracker HUB': setIsTimeTrackerHubOpen,
                        'Store': setIsStoreOpen,
                        'Project Hub': setIsProjectHubOpen,
                        'Public Relations': setIsPublicRelationsOpen,
                        'Record': setIsRecordOpen,
                        'Network TV Hub': setIsNetworkTvHubOpen,
                        'Teacher Hub': setIsTeacherHubOpen,
                        'Invoice Hub': setIsInvoiceHubOpen,
                        'Yard Management': setIsDispatchOpen,
                    }
                    const isOpen = isOpenMap[item.label];
                    const setIsOpen = setIsOpenMap[item.label];

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
            <WarehouseAssociatesDialog isOpen={isAssociatesDialogOpen} onOpenChange={setAssociatesDialogOpen} />
        </Dialog>
        
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
