

"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { addDays, formatISO } from 'date-fns';

export type Shift = {
    id: string;
    date: string; // ISO date string
    employeeId: string;
    title: string;
    startTime: string;
    endTime: string;
};

export type EmployeeRole = 'Admin' | 'Dispatcher' | 'Driver' | 'Employee' | 'Forklift' | 'Laborer' | 'Manager' | 'Visitor' | 'Vendor';

export type Employee = {
    id: string;
    name: string;
    email?: string;
    role: EmployeeRole;
    personnelId?: string;
    phoneNumber?: string;
    documentDataUri?: string | null;
    workLocation?: string[];
}

export type Holiday = {
    date: Date;
    name: string;
}

export type TimeOffRequest = {
    id: string;
    employeeId: string;
    startDate: Date;
    endDate: Date;
    reason: string;
    status: 'Pending' | 'Approved' | 'Denied';
}

export type Registration = {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: EmployeeRole;
    status: 'Pending' | 'Approved' | 'Denied';
}

export type YardEvent = {
    id: string;
    transactionType: 'inbound' | 'outbound' | 'move';
    trailerId: string;
    sealNumber?: string;
    carrier: string;
    scac: string;
    driverName: string;
    clerkName: string;
    loadNumber: string;
    assignmentType: "bobtail" | "empty" | "material" | "door_assignment" | "lane_assignment" | "lost_and_found";
    assignmentValue?: string;
    timestamp: Date;
    documentDataUri?: string | null;
}

export type ExpenseReport = {
    id: string
    employeeName: string
    date: string
    description: string
    category: "Food" | "Fuel" | "Utilities" | "Insurance" | "Supplies" | "Repairs" | "Accidents" | "Payroll" | "Lease" | "Other"
    amount: number
    status: "Pending" | "Approved" | "Denied"
    documentDataUri?: string | null;
}

export type TrainingQuestion = {
    question: string;
    options: string[];
    correctAnswer: string;
};

export type TrainingModule = {
    id: string;
    title: string;
    description: string;
    type: 'video' | 'document';
    content: string; // URL for video, or markdown content for document
    exam?: TrainingQuestion[];
};

export type TrainingProgram = {
    id: string;
    title: string;
    description: string;
    modules: TrainingModule[];
};

export type TrainingAssignmentStatus = 'Not Started' | 'In Progress' | 'Completed';

export type TrainingAssignment = {
    id: string;
    employeeId: string;
    programId: string;
    status: TrainingAssignmentStatus;
    assignedDate: Date;
    completedDate?: Date;
}

export type DeletionLog = {
    id: string;
    deletedItemId: string;
    itemType: 'Shift' | 'User';
    deletedBy: string; // User ID
    deletedAt: Date;
    originalData: any;
}

export type TimeClockEvent = {
    id: string;
    employeeId: string;
    timestamp: string; // ISO string
    type: 'in' | 'out';
    notes?: string;
    status?: 'Pending' | 'Approved' | 'Denied';
}

export type LocalLoadBoard = {
  id: string;
  name: string;
  number?: number;
};

export type Appointment = {
    id: string;
    status: 'Scheduled' | 'Arrived' | 'Departed' | 'Missed';
    type: 'Inbound' | 'Outbound';
    carrier: string;
    scac: string;
    bolNumber: string;
    poNumber: string;
    sealNumber: string;
    driverName: string;
    driverPhoneNumber?: string;
    driverLicenseNumber?: string;
    driverLicenseState?: string;
    appointmentTime: Date;
    door?: string;
};

export type OfficeAppointment = {
    id: string;
    title: string;
    type: 'Meeting' | 'Visitor' | 'Standard';
    attendees: string[];
    startTime: Date;
    endTime: Date;
    status: 'Scheduled' | 'Completed' | 'Canceled';
    notes?: string;
}


type ScheduleContextType = {
  shifts: Shift[];
  employees: Employee[];
  currentUser: Employee | null;
  holidays: Holiday[];
  timeOffRequests: TimeOffRequest[];
  registrations: Registration[];
  yardEvents: YardEvent[];
  expenseReports: ExpenseReport[];
  trainingPrograms: TrainingProgram[];
  trainingAssignments: TrainingAssignment[];
  warehouseDoors: string[];
  parkingLanes: string[];
  deletionLogs: DeletionLog[];
  timeClockEvents: TimeClockEvent[];
  localLoadBoards: LocalLoadBoard[];
  loadBoardHub: LocalLoadBoard;
  appointments: Appointment[];
  officeAppointments: OfficeAppointment[];
  lostAndFound: YardEvent[];
  moveTrailer: (eventId: string, toLaneId: string, fromLost?: boolean) => void;
  addOfficeAppointment: (appointment: Omit<OfficeAppointment, 'id' | 'status'>) => OfficeAppointment;
  updateOfficeAppointmentStatus: (appointmentId: string, status: OfficeAppointment['status']) => void;
  updateLoadBoardHubName: (name: string) => void;
  addLocalLoadBoard: () => void;
  deleteLocalLoadBoard: (id: string) => void;
  updateLocalLoadBoard: (id: string, name: string, number?: number) => void;
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (shift: Shift) => void;
  deleteShift: (shiftId: string, deletedBy: string) => void;
  addTimeOffRequest: (request: Omit<TimeOffRequest, 'id' | 'status' | 'employeeId'>) => void;
  approveTimeOffRequest: (requestId: string) => void;
  denyTimeOffRequest: (requestId: string) => void;
  registerUser: (user: Omit<Registration, 'id' | 'status'>) => void;
  approveRegistration: (registrationId: string) => void;
  denyRegistration: (registrationId: string) => void;
  updateRegistration: (updatedRegistration: Registration) => void;
  getEmployeeById: (id: string) => Employee | null;
  updateEmployeeRole: (employeeId: string, role: EmployeeRole) => void;
  updateEmployee: (updatedEmployee: Employee) => void;
  deleteEmployee: (employeeId: string, deletedBy: string) => void;
  addEmployee: (employeeData: Omit<Employee, 'id' | 'personnelId'>) => void;
  bulkAddEmployees: (employeeData: Omit<Employee, 'id' | 'personnelId'>[]) => void;
  updateEmployeeDocument: (employeeId: string, documentDataUri: string | null) => void;
  getEmployeeDocument: (employeeId: string) => string | null;
  getYardEventById: (id: string) => YardEvent | null;
  addYardEvent: (eventData: Omit<YardEvent, 'id' | 'timestamp' | 'clerkName'>, documentDataUri: string | null) => void;
  getExpenseReportById: (id: string) => ExpenseReport | null;
  setExpenseReports: React.Dispatch<React.SetStateAction<ExpenseReport[]>>;
  getTrainingModuleById: (id: string) => TrainingModule | null;
  assignTraining: (employeeId: string, programId: string) => void;
  addWarehouseDoor: (doorId: string) => void;
  addParkingLane: (laneId: string) => void;
  restoreDeletedItem: (logId: string) => void;
  addTimeClockEvent: (event: Omit<TimeClockEvent, 'id' | 'timestamp'>) => void;
  updateTimeClockStatus: (clockInId: string, status: 'Approved' | 'Denied') => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => Appointment;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
};

const initialShifts: Shift[] = [
    { id: 'SH001', date: formatISO(new Date(), { representation: 'date' }), employeeId: 'USR001', title: 'Opening Shift', startTime: '08:00', endTime: '16:00' },
    { id: 'SH002', date: formatISO(new Date(), { representation: 'date' }), employeeId: 'USR002', title: 'Closing Shift', startTime: '14:00', endTime: '22:00' },
    { id: 'SH003', date: formatISO(addDays(new Date(), 2), { representation: 'date' }), employeeId: 'USR001', title: 'Day Shift', startTime: '09:00', endTime: '17:00' },
    { id: 'SH004', date: formatISO(addDays(new Date(), 2), { representation: 'date' }), employeeId: 'USR003', title: 'Day Shift', startTime: '09:00', endTime: '17:00' },
];


const mockEmployees: Employee[] = [
    { id: "USR001", name: "John Doe", email: "john.doe@example.com", role: "Driver", personnelId: "JD-001", phoneNumber: "555-123-4567", workLocation: ["Warehouse"] },
    { id: "USR002", name: "Jane Doe", email: "jane.doe@example.com", role: "Driver", personnelId: "JD-002", phoneNumber: "555-234-5678", workLocation: ["Mobile"] },
    { id: "USR003", name: "Mike Smith", email: "mike.smith@example.com", role: "Dispatcher", personnelId: "MS-001", phoneNumber: "555-345-6789", workLocation: ["Site 1", "Work From Home"] },
    { id: "USR004", name: "Emily Jones", email: "emily.jones@example.com", role: "Admin", personnelId: "EJ-001", phoneNumber: "555-456-7890", workLocation: ["Work From Home"] },
];

const holidays: Holiday[] = [
    { date: new Date(2024, 0, 1), name: "New Year's Day" },
    { date: new Date(2024, 0, 15), name: "Martin Luther King, Jr. Day" },
    { date: new Date(2024, 1, 19), name: "Presidents' Day" },
    { date: new Date(2024, 2, 29), name: "Good Friday" },
    { date: new Date(2024, 4, 27), name: "Memorial Day" },
    { date: new Date(2024, 5, 19), name: "Juneteenth" },
    { date: new Date(2024, 6, 4), name: "Independence Day" },
    { date: new Date(2024, 8, 2), name: "Labor Day" },
    { date: new Date(2024, 10, 28), name: "Thanksgiving Day" },
    { date: new Date(2024, 11, 25), name: "Christmas Day" },
];

const initialTimeOffRequests: TimeOffRequest[] = [
    { id: 'PTO001', employeeId: 'USR002', startDate: addDays(new Date(), 5), endDate: addDays(new Date(), 7), reason: 'Family vacation', status: 'Pending' },
    { id: 'PTO002', employeeId: 'USR003', startDate: addDays(new Date(), 10), endDate: addDays(new Date(), 10), reason: 'Doctor appointment', status: 'Approved' },
];

const initialRegistrations: Registration[] = [
    { id: 'REG001', name: 'New User 1', email: 'new.user1@example.com', phoneNumber: '555-888-1111', role: 'Driver', status: 'Pending' },
    { id: 'REG002', name: 'New User 2', email: 'new.user2@example.com', phoneNumber: '555-888-2222', role: 'Dispatcher', status: 'Pending' },
]

const initialYardEvents: YardEvent[] = [
    { id: 'EVT001', transactionType: 'inbound', trailerId: 'TR53123', sealNumber: 'S12345', carrier: 'Knight-Swift', scac: 'KNX', driverName: 'John Doe', clerkName: 'Admin User', loadNumber: 'LD123', assignmentType: 'door_assignment', assignmentValue: 'D4', timestamp: new Date('2024-07-28T08:15:00Z'), documentDataUri: "https://picsum.photos/seed/bol/800/1100" },
    { id: 'EVT002', transactionType: 'outbound', trailerId: 'TR48991', sealNumber: 'S67890', carrier: 'J.B. Hunt', scac: 'JBHT', driverName: 'Jane Smith', clerkName: 'Admin User', loadNumber: 'LD124', assignmentType: 'empty', timestamp: new Date('2024-07-28T09:30:00Z') },
    { id: 'EVT003', transactionType: 'inbound', trailerId: 'TR53456', carrier: 'Schneider', scac: 'SNDR', driverName: 'Mike Johnson', clerkName: 'Jane Clerk', loadNumber: 'LD125', assignmentType: 'lane_assignment', assignmentValue: 'L12', timestamp: new Date('2024-07-27T14:00:00Z') },
    { id: 'EVT004', transactionType: 'outbound', trailerId: 'TR53123', sealNumber: 'S54321', carrier: 'Knight-Swift', scac: 'KNX', driverName: 'Emily Davis', clerkName: 'Jane Clerk', loadNumber: 'LD126', assignmentType: 'material', timestamp: new Date('2024-07-27T16:45:00Z') },
    { id: 'EVT005', transactionType: 'inbound', trailerId: 'TR53789', carrier: 'Werner', scac: 'WERN', driverName: 'Chris Brown', clerkName: 'Admin User', loadNumber: 'LD127', assignmentType: 'bobtail', timestamp: new Date('2024-07-26T11:20:00Z'), documentDataUri: "https://picsum.photos/seed/doc/800/1100" },
];

const initialExpenseReports: ExpenseReport[] = [
    { id: "EXP001", employeeName: "John Doe", date: "2024-07-25", description: "Fuel stop in Nevada", category: "Fuel", amount: 150.75, status: "Approved", documentDataUri: "https://picsum.photos/seed/fuel/800/1100" },
    { id: "EXP002", employeeName: "Jane Doe", date: "2024-07-26", description: "Hotel stay in Denver", category: "Other", amount: 120.00, status: "Approved" },
    { id: "EXP003", employeeName: "Mike Smith", date: "2024-07-27", description: "Dinner with client", category: "Food", amount: 85.50, status: "Pending", documentDataUri: "https://picsum.photos/seed/food/800/1100" },
    { id: "EXP004", employeeName: "John Doe", date: "2024-07-28", description: "Oil change and tire rotation", category: "Repairs", amount: 220.00, status: "Pending" },
    { id: "EXP005", employeeName: "Emily Jones", date: "2024-07-29", description: "Tolls and parking", category: "Other", amount: 45.25, status: "Denied" },
    { id: "EXP006", employeeName: "Admin", date: "2024-07-30", description: "Monthly vehicle lease", category: "Lease", amount: 550.00, status: "Approved" },
    { id: "EXP007", employeeName: "Jane Doe", date: "2024-07-30", description: "Office supplies", category: "Supplies", amount: 75.00, status: "Pending" },
    { id: "EXP008", employeeName: "HR", date: "2024-07-31", description: "Monthly payroll", category: "Payroll", amount: 15000.00, status: "Approved" },
];

const initialTrainingPrograms: TrainingProgram[] = [
    {
        id: 'PROG001',
        title: 'New Driver Onboarding',
        description: 'Complete these modules to finalize your onboarding process.',
        modules: [
            {
                id: 'MOD001',
                title: 'Welcome to LogiFlow',
                description: 'An introduction to our company culture, values, and mission.',
                type: 'video',
                content: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder video
            },
            {
                id: 'MOD002',
                title: 'Safety Procedures',
                description: 'Review our standard safety protocols for vehicle operation and site conduct.',
                type: 'document',
                content: `
# Vehicle Safety Checklist

- **Pre-Trip Inspection:** Always perform a full walk-around inspection before starting your route.
- **Hours of Service:** Adhere strictly to all HOS regulations.
- **Defensive Driving:** Maintain safe following distances and be aware of your surroundings.

# Warehouse Safety

- Wear high-visibility clothing at all times.
- Follow all posted speed limits and traffic signs.
- Report any spills or hazards immediately.
                `,
                exam: [
                    {
                        question: 'What is the first step in the vehicle safety checklist?',
                        options: ['Check the radio', 'Pre-Trip Inspection', 'Adjust mirrors', 'Start the engine'],
                        correctAnswer: 'Pre-Trip Inspection'
                    },
                    {
                        question: 'What should you do if you see a spill in the warehouse?',
                        options: ['Ignore it', 'Clean it up yourself', 'Report it immediately', 'Drive around it'],
                        correctAnswer: 'Report it immediately'
                    }
                ]
            }
        ]
    },
    {
        id: 'PROG002',
        title: 'Annual Compliance Training',
        description: 'Required annual training for all personnel.',
        modules: [
             {
                id: 'MOD003',
                title: 'Cybersecurity Awareness',
                description: 'Learn how to identify phishing attempts and protect company data.',
                type: 'document',
                content: `
# Phishing Scams

Be wary of emails that:

- Create a sense of urgency.
- Ask for personal information or passwords.
- Contain suspicious links or attachments.
- Come from unknown or unexpected senders.
                `,
                 exam: [
                    {
                        question: 'Which of the following is a sign of a phishing email?',
                        options: ['A monthly newsletter you subscribed to', 'An email from your manager', 'An email creating a sense of urgency', 'A calendar invite from a coworker'],
                        correctAnswer: 'An email creating a sense of urgency'
                    }
                ]
            }
        ]
    }
];

const initialTrainingAssignments: TrainingAssignment[] = [
    { id: 'TA001', employeeId: 'USR001', programId: 'PROG001', status: 'Not Started', assignedDate: new Date() },
    { id: 'TA002', employeeId: 'USR002', programId: 'PROG001', status: 'In Progress', assignedDate: new Date() },
    { id: 'TA003', employeeId: 'USR004', programId: 'PROG002', status: 'Completed', assignedDate: new Date(), completedDate: new Date() },
];

const initialWarehouseDoors = Array.from({ length: 10 }, (_, i) => `D${i + 1}`);
const initialParkingLanes = Array.from({ length: 20 }, (_, i) => `L${i + 1}`);

const initialDeletionLogs: DeletionLog[] = [
    {
        id: 'LOG1725792480000',
        deletedItemId: 'SH005',
        itemType: 'Shift',
        deletedBy: 'USR004',
        deletedAt: new Date('2025-09-08T12:08:00Z'),
        originalData: {
            id: 'SH005',
            date: '2025-09-13',
            employeeId: 'USR002',
            employeeName: 'Jane Doe',
            title: 'Night Shift',
            startTime: '22:00',
            endTime: '06:00'
        }
    }
];

const initialTimeClockEvents: TimeClockEvent[] = [
    { id: 'TC001', employeeId: 'USR001', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), type: 'in', status: 'Approved' },
    { id: 'TC002', employeeId: 'USR001', timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(), type: 'out' },
    { id: 'TC003', employeeId: 'USR002', timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), type: 'in', status: 'Pending' },
    { id: 'TC004', employeeId: 'USR002', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), type: 'out' },
    { id: 'TC005', employeeId: 'USR003', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), type: 'in', status: 'Denied' },
];

const initialLocalLoadBoards: LocalLoadBoard[] = [
    { id: 'llb-1', name: 'Local Load board', number: 1 },
];

const initialLoadBoardHub: LocalLoadBoard = { id: 'hub-1', name: 'Load board hub' };

const initialAppointments: Appointment[] = [
    { id: 'APP001', status: 'Scheduled', type: 'Inbound', carrier: 'Knight-Swift', scac: 'KNX', bolNumber: 'BOL123', poNumber: 'PO456', sealNumber: 'S123', driverName: 'John Doe', driverPhoneNumber: '555-111-1111', driverLicenseNumber: 'D1234567', driverLicenseState: 'CA', appointmentTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), door: 'D4' },
    { id: 'APP002', status: 'Arrived', type: 'Inbound', carrier: 'J.B. Hunt', scac: 'JBHT', bolNumber: 'BOL456', poNumber: 'PO789', sealNumber: 'S456', driverName: 'Jane Smith', driverPhoneNumber: '555-222-2222', appointmentTime: new Date(new Date().getTime() - 1 * 60 * 60 * 1000), door: 'D2' },
    { id: 'APP003', status: 'Scheduled', type: 'Outbound', carrier: 'Schneider', scac: 'SNDR', bolNumber: 'BOL789', poNumber: 'PO123', sealNumber: 'S789', driverName: 'Mike Johnson', appointmentTime: new Date(new Date().getTime() + 4 * 60 * 60 * 1000) },
    { id: 'APP004', status: 'Departed', type: 'Outbound', carrier: 'Werner', scac: 'WERN', bolNumber: 'BOL101', poNumber: 'PO112', sealNumber: 'S101', driverName: 'Emily Davis', appointmentTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) },
    { id: 'APP005', status: 'Missed', type: 'Inbound', carrier: 'Swift Logistics', scac: 'SWFT', bolNumber: 'BOL112', poNumber: 'PO113', sealNumber: 'S112', driverName: 'Chris Brown', driverLicenseNumber: 'D7654321', driverLicenseState: 'AZ', appointmentTime: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000) },
];

const initialOfficeAppointments: OfficeAppointment[] = [
    { id: 'OA001', title: 'Q3 Financial Review', type: 'Meeting', attendees: ['Emily Jones', 'Mike Smith'], startTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), endTime: new Date(new Date().getTime() + (2 * 24 * 60 * 60 + 1 * 60 * 60) * 1000), status: 'Scheduled', notes: 'Conference Room 3' },
    { id: 'OA002', title: 'Visitor: John from Acme Corp', type: 'Visitor', attendees: ['Admin User'], startTime: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), endTime: new Date(new Date().getTime() + (1 * 24 * 60 * 60 + 2 * 60 * 60) * 1000), status: 'Scheduled' },
    { id: 'OA003', title: 'IT Maintenance', type: 'Standard', attendees: ['IT Department'], startTime: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), endTime: new Date(new Date().getTime() - (1 * 24 * 60 * 60 - 4 * 60 * 60) * 1000), status: 'Completed' },
];

const initialLostAndFound: YardEvent[] = [];


const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>(initialTimeOffRequests);
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [yardEvents, setYardEvents] = useState<YardEvent[]>(initialYardEvents);
  const [expenseReports, setExpenseReports] = useState<ExpenseReport[]>(initialExpenseReports);
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>(initialTrainingPrograms);
  const [trainingAssignments, setTrainingAssignments] = useState<TrainingAssignment[]>(initialTrainingAssignments);
  const [warehouseDoors, setWarehouseDoors] = useState<string[]>(initialWarehouseDoors);
  const [parkingLanes, setParkingLanes] = useState<string[]>(initialParkingLanes);
  const [deletionLogs, setDeletionLogs] = useState<DeletionLog[]>(initialDeletionLogs);
  const [timeClockEvents, setTimeClockEvents] = useState<TimeClockEvent[]>(initialTimeClockEvents);
  const [localLoadBoards, setLocalLoadBoards] = useState<LocalLoadBoard[]>(initialLocalLoadBoards);
  const [loadBoardHub, setLoadBoardHub] = useState<LocalLoadBoard>(initialLoadBoardHub);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [officeAppointments, setOfficeAppointments] = useState<OfficeAppointment[]>(initialOfficeAppointments);
  const [lostAndFound, setLostAndFound] = useState<YardEvent[]>(initialLostAndFound);
  
  React.useEffect(() => {
    // In a real app, this would be determined by an auth state listener.
    // For now, we'll mock the current user as the first Admin.
    const adminUser = employees.find(e => e.role === 'Admin');
    setCurrentUser(adminUser || null);
  }, [employees]);


  const addShift = (shift: Omit<Shift, 'id'>) => {
    const newShift = { ...shift, id: `SH${Date.now()}` };
    setShifts(prev => [...prev, newShift]);
  };

  const updateShift = (updatedShift: Shift) => {
    setShifts(prev => prev.map(shift => shift.id === updatedShift.id ? updatedShift : shift));
  };

  const deleteShift = (shiftId: string, deletedBy: string) => {
    const shiftToDelete = shifts.find(s => s.id === shiftId);
    if (shiftToDelete) {
        const employee = employees.find(e => e.id === shiftToDelete.employeeId);
        const logEntry: DeletionLog = {
            id: `LOG${Date.now()}`,
            deletedItemId: shiftId,
            itemType: 'Shift',
            deletedBy,
            deletedAt: new Date(),
            originalData: { ...shiftToDelete, employeeName: employee?.name || 'Unknown' }
        };
        setDeletionLogs(prev => [logEntry, ...prev]);
        setShifts(prev => prev.filter(shift => shift.id !== shiftId));
    }
  }

  // Assuming the current user is USR001 for now
  const addTimeOffRequest = (request: Omit<TimeOffRequest, 'id' | 'status' | 'employeeId'>) => {
    const newRequest = { ...request, id: `PTO${Date.now()}`, status: 'Pending' as const, employeeId: 'USR001' };
    setTimeOffRequests(prev => [...prev, newRequest]);
  }

  const approveTimeOffRequest = (requestId: string) => {
    setTimeOffRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'Approved' as const } : req));
  }

    const denyTimeOffRequest = (requestId: string) => {
    setTimeOffRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'Denied' as const } : req));
    }

    const registerUser = (user: Omit<Registration, 'id' | 'status'>) => {
        const newRegistration = { ...user, id: `REG${Date.now()}`, status: 'Pending' as const };
        setRegistrations(prev => [...prev, newRegistration]);
    }

    const approveRegistration = (registrationId: string) => {
        const registration = registrations.find(r => r.id === registrationId);
        if (!registration) return;

        setRegistrations(prev => prev.map(reg => reg.id === registrationId ? { ...reg, status: 'Approved' as const } : reg).filter(r => r.id !== registrationId));
        
        const newEmployee: Employee = {
            id: `USR${Date.now()}`,
            name: registration.name,
            email: registration.email,
            role: registration.role,
            personnelId: `TEMP-${Math.floor(100 + Math.random() * 900)}`,
            phoneNumber: registration.phoneNumber,
            workLocation: []
        };
        setEmployees(prev => [...prev, newEmployee]);
    }

    const denyRegistration = (registrationId: string) => {
        setRegistrations(prev => prev.map(reg => reg.id === registrationId ? { ...reg, status: 'Denied' as const } : reg).filter(r => r.id !== registrationId));
    }

    const updateRegistration = (updatedRegistration: Registration) => {
        setRegistrations(prev => prev.map(reg => reg.id === updatedRegistration.id ? updatedRegistration : reg));
    };

    const getEmployeeById = (id: string) => {
        return employees.find(employee => employee.id === id) || null;
    }

    const updateEmployeeRole = (employeeId: string, role: EmployeeRole) => {
        setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, role } : emp));
    };
    
    const updateEmployee = (updatedEmployee: Employee) => {
        setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
    };

    const deleteEmployee = (employeeId: string, deletedBy: string) => {
        const userToDelete = employees.find(e => e.id === employeeId);
        if (userToDelete) {
             const logEntry: DeletionLog = {
                id: `LOG${Date.now()}`,
                deletedItemId: employeeId,
                itemType: 'User',
                deletedBy,
                deletedAt: new Date(),
                originalData: userToDelete,
            };
            setDeletionLogs(prev => [logEntry, ...prev]);
            setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
            // Also remove their shifts, time off requests etc.
            setShifts(prev => prev.filter(s => s.employeeId !== employeeId));
            setTimeOffRequests(prev => prev.filter(t => t.employeeId !== employeeId));
        }
    };

    const addEmployee = (employeeData: Omit<Employee, 'id' | 'personnelId'>) => {
        const newId = `USR${Date.now()}`;
        const newPersonnelId = `${employeeData.name.split(' ').map(n => n[0]).join('').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
        const newEmployee: Employee = {
            ...employeeData,
            id: newId,
            personnelId: newPersonnelId,
        };
        setEmployees(prev => [...prev, newEmployee]);
    };

     const bulkAddEmployees = (employeeData: Omit<Employee, 'id' | 'personnelId'>[]) => {
        const newEmployees = employeeData.map(emp => {
             const newId = `USR${Date.now()}${Math.random()}`;
            const newPersonnelId = `${emp.name.split(' ').map(n => n[0]).join('').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
            return {
                ...emp,
                id: newId,
                personnelId: newPersonnelId,
            }
        });
        setEmployees(prev => [...prev, ...newEmployees]);
    };

    const updateEmployeeDocument = (employeeId: string, documentDataUri: string | null) => {
        setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, documentDataUri } : emp));
    };

    const getEmployeeDocument = (employeeId: string) => {
        const employee = employees.find(e => e.id === employeeId);
        return employee?.documentDataUri || null;
    }

    const getYardEventById = (id: string) => {
        return yardEvents.find(event => event.id === id) || null;
    }

    const addYardEvent = (eventData: Omit<YardEvent, 'id' | 'timestamp' | 'clerkName'>, documentDataUri: string | null) => {
        const newEventBase: Omit<YardEvent, 'id' | 'timestamp'> = {
            ...eventData,
            clerkName: currentUser?.name || 'Admin User',
            documentDataUri: documentDataUri,
        };

        const newEvents: YardEvent[] = [];
        let finalEvent: YardEvent = { ...newEventBase, id: `EVT${Date.now()}`, timestamp: new Date() };

        if (finalEvent.assignmentType === 'door_assignment' && finalEvent.assignmentValue && finalEvent.transactionType === 'inbound') {
            const doorId = finalEvent.assignmentValue;
            const lastEventForDoor = yardEvents
                .filter(e => e.assignmentType === 'door_assignment' && e.assignmentValue === doorId)
                .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

            if (lastEventForDoor && lastEventForDoor.transactionType === 'inbound') {
                const occupyingEvent = lastEventForDoor;
                // Door is occupied, move occupying trailer to lost and found
                const outboundForOccupying: YardEvent = {
                    ...occupyingEvent,
                    id: `EVT${Date.now() + 1}`,
                    transactionType: 'outbound',
                    timestamp: new Date(),
                    clerkName: currentUser?.name || 'System',
                };
                newEvents.push(outboundForOccupying);

                const lostEvent: YardEvent = {
                    ...occupyingEvent,
                    id: `EVT${Date.now() + 2}`,
                    transactionType: 'move',
                    assignmentType: 'lost_and_found',
                    assignmentValue: `displaced from ${doorId}`,
                    timestamp: new Date(),
                    clerkName: currentUser?.name || 'System',
                };
                setLostAndFound(prev => [...prev, lostEvent]);
            }
        }

        newEvents.push(finalEvent);
        setYardEvents(prev => [...prev, ...newEvents]);
    };
    
    const getExpenseReportById = (id: string) => {
        return expenseReports.find(report => report.id === id) || null;
    }

    const getTrainingModuleById = (id: string) => {
        for (const program of trainingPrograms) {
            const module = program.modules.find(m => m.id === id);
            if (module) return module;
        }
        return null;
    }

    const assignTraining = (employeeId: string, programId: string) => {
        const alreadyAssigned = trainingAssignments.find(a => a.employeeId === employeeId && a.programId === programId);
        if (alreadyAssigned) {
            throw new Error("This training program is already assigned to this employee.");
        }

        const newAssignment: TrainingAssignment = {
            id: `TA${Date.now()}`,
            employeeId,
            programId,
            status: 'Not Started',
            assignedDate: new Date(),
        };
        setTrainingAssignments(prev => [...prev, newAssignment]);
    };

    const addWarehouseDoor = (doorId: string) => {
        if (!doorId.trim()) throw new Error("Door ID cannot be empty.");
        if (warehouseDoors.includes(doorId.trim().toUpperCase())) {
            throw new Error("Door ID already exists.");
        }
        setWarehouseDoors(prev => [...prev, doorId.trim().toUpperCase()]);
    };

    const addParkingLane = (laneId: string) => {
        if (!laneId.trim()) throw new Error("Lane ID cannot be empty.");
        if (parkingLanes.includes(laneId.trim().toUpperCase())) {
            throw new Error("Lane ID already exists.");
        }
        setParkingLanes(prev => [...prev, laneId.trim().toUpperCase()]);
    };

    const restoreDeletedItem = (logId: string) => {
        const logEntry = deletionLogs.find(log => log.id === logId);
        if (!logEntry) return;

        switch (logEntry.itemType) {
            case 'Shift':
                // The `originalData` for a shift might not have the full employee object.
                // We just restore what we have.
                const shiftToRestore = {
                    id: logEntry.originalData.id,
                    date: logEntry.originalData.date,
                    employeeId: logEntry.originalData.employeeId,
                    title: logEntry.originalData.title,
                    startTime: logEntry.originalData.startTime,
                    endTime: logEntry.originalData.endTime,
                }
                setShifts(prev => [...prev, shiftToRestore]);
                break;
            case 'User':
                setEmployees(prev => [...prev, logEntry.originalData]);
                break;
            default:
                break;
        }

        setDeletionLogs(prev => prev.filter(log => log.id !== logId));
    };

    const addTimeClockEvent = (event: Omit<TimeClockEvent, 'id' | 'timestamp'>) => {
        const newEvent: TimeClockEvent = {
            ...event,
            id: `TC${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'Pending',
        };
        setTimeClockEvents(prev => [...prev, newEvent]);
    }
    
    const updateTimeClockStatus = (clockInId: string, status: 'Approved' | 'Denied') => {
        setTimeClockEvents(prev => prev.map(e => e.id === clockInId ? { ...e, status } : e));
    }

    const addLocalLoadBoard = () => {
        setLocalLoadBoards(prev => {
            const nextNumber = prev.length > 0 ? Math.max(...prev.map(b => b.number || 0)) + 1 : 1;
            const newBoard: LocalLoadBoard = {
                id: `llb-${Date.now()}`,
                name: 'Local Load board',
                number: nextNumber,
            };
            return [...prev, newBoard];
        });
    };

    const deleteLocalLoadBoard = (id: string) => {
        setLocalLoadBoards(prev => {
            if (prev.length <= 1) return prev; // Don't delete the last one
            return prev.filter(board => board.id !== id);
        });
    };

    const updateLocalLoadBoard = (id: string, name: string, number?: number) => {
        if (id === loadBoardHub.id) {
             updateLoadBoardHubName(name);
             return;
        }
        setLocalLoadBoards(prev => prev.map(board => board.id === id ? { ...board, name, number } : board));
    };
    
    const updateLoadBoardHubName = (name: string) => {
        setLoadBoardHub(prev => ({...prev, name}));
    };

    const addAppointment = (appointment: Omit<Appointment, 'id' | 'status'>) => {
        const newAppointment: Appointment = {
            ...appointment,
            id: `APP${Date.now()}`,
            status: 'Scheduled',
        };
        setAppointments(prev => [newAppointment, ...prev]);
        return newAppointment;
    };

    const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
        setAppointments(prev => prev.map(app => app.id === appointmentId ? { ...app, status } : app));
    };

    const moveTrailer = (eventId: string, toLaneId: string, fromLost: boolean = false) => {
        const eventToMove = fromLost 
            ? lostAndFound.find(e => e.id === eventId) 
            : yardEvents.find(e => e.id === eventId);
    
        if (!eventToMove) throw new Error("Trailer event to move not found.");

        const getLatestInboundEventForLane = (laneId: string) => {
            const eventsInLane = yardEvents
                .filter(e => e.assignmentType === 'lane_assignment' && e.assignmentValue === laneId)
                .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
            const lastEvent = eventsInLane[0];
            if (lastEvent && lastEvent.transactionType === 'inbound') {
                return lastEvent;
            }
            return null;
        }
        
        const occupyingEvent = getLatestInboundEventForLane(toLaneId);
        
        const newEvents: YardEvent[] = [];

        // 1. Create outbound event for the trailer being moved from its original location
        const outboundEvent: YardEvent = {
            ...eventToMove,
            id: `EVT${Date.now() + 1}`,
            transactionType: 'outbound',
            timestamp: new Date(),
            clerkName: currentUser?.name || 'System',
        };
        newEvents.push(outboundEvent);

        // 2. If the destination lane is occupied, move the occupying trailer to Lost & Found
        if (occupyingEvent) {
             // Create an outbound event for the occupying trailer
            const occupyingOutboundEvent: YardEvent = {
                ...occupyingEvent,
                id: `EVT${Date.now() + 2}`,
                transactionType: 'outbound',
                timestamp: new Date(),
                clerkName: currentUser?.name || 'System',
            };
            newEvents.push(occupyingOutboundEvent);

            // Create a lost & found event for the occupying trailer
            const lostEvent: YardEvent = {
                ...occupyingEvent,
                id: `EVT${Date.now() + 3}`,
                transactionType: 'move',
                assignmentType: 'lost_and_found',
                assignmentValue: `displaced from ${toLaneId}`,
                timestamp: new Date(),
                clerkName: currentUser?.name || 'System',
            };
            setLostAndFound(prev => [...prev, lostEvent]);
        }

        // 3. Create inbound event for the trailer being moved to its new lane
        const inboundEvent: YardEvent = {
            ...eventToMove,
            id: `EVT${Date.now()}`,
            transactionType: 'inbound',
            assignmentType: 'lane_assignment',
            assignmentValue: toLaneId,
            timestamp: new Date(),
            clerkName: currentUser?.name || 'System',
        };
        newEvents.push(inboundEvent);
        
        setYardEvents(prev => [...prev, ...newEvents]);
        
        if (fromLost) {
            setLostAndFound(prev => prev.filter(e => e.id !== eventId));
        }
    };
    
    const addOfficeAppointment = (appointment: Omit<OfficeAppointment, 'id' | 'status'>): OfficeAppointment => {
        const newAppointment: OfficeAppointment = {
            ...appointment,
            id: `OA${Date.now()}`,
            status: 'Scheduled',
        };
        setOfficeAppointments(prev => [newAppointment, ...prev]);
        return newAppointment;
    };

    const updateOfficeAppointmentStatus = (appointmentId: string, status: OfficeAppointment['status']) => {
        setOfficeAppointments(prev => prev.map(app => app.id === appointmentId ? { ...app, status } : app));
    };


  return (
    <ScheduleContext.Provider value={{ shifts, employees, currentUser, holidays, timeOffRequests, registrations, yardEvents, expenseReports, trainingPrograms, trainingAssignments, warehouseDoors, parkingLanes, deletionLogs, timeClockEvents, localLoadBoards, loadBoardHub, appointments, officeAppointments, lostAndFound, moveTrailer, addOfficeAppointment, updateOfficeAppointmentStatus, addAppointment, updateAppointmentStatus, updateLoadBoardHubName, addLocalLoadBoard, deleteLocalLoadBoard, updateLocalLoadBoard, addShift, updateShift, deleteShift, addTimeOffRequest, approveTimeOffRequest, denyTimeOffRequest, registerUser, approveRegistration, denyRegistration, updateRegistration, getEmployeeById, updateEmployeeRole, updateEmployee, deleteEmployee, addEmployee, bulkAddEmployees, updateEmployeeDocument, getEmployeeDocument, getYardEventById, addYardEvent, getExpenseReportById, setExpenseReports, getTrainingModuleById, assignTraining, addWarehouseDoor, addParkingLane, restoreDeletedItem, addTimeClockEvent, updateTimeClockStatus }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};



