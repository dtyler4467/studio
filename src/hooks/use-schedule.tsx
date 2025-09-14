

"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { addDays, formatISO, differenceInDays } from 'date-fns';

export type Shift = {
    id: string;
    date: string; // ISO date string
    employeeId: string;
    title: string;
    startTime: string;
    endTime: string;
};

export type EmployeeRole = 'Admin' | 'Dispatcher' | 'Driver' | 'Employee' | 'Forklift' | 'Laborer' | 'Manager' | 'Visitor' | 'Vendor';

export type DirectDepositAccount = {
    id: string;
    accountHolderName: string;
    bankName: string;
    accountType: 'Checking' | 'Savings';
    routingNumber: string;
    accountNumber: string;
}

export type Employee = {
    id: string;
    name: string;
    email?: string;
    role: EmployeeRole;
    status: 'Active' | 'Inactive';
    personnelId?: string;
    phoneNumber?: string;
    documentDataUri?: string | null;
    workLocation?: string[];
    payType?: 'Hourly' | 'Salary';
    payRate?: number;
    directDeposit?: DirectDepositAccount[];
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

export type YardEventStatus = 'Checked In' | 'Loaded' | 'Empty' | 'Blocked' | 'Repair Needed' | 'Rejected' | 'Late' | 'Early' | 'Product on hold' | 'Exited' | 'Waiting for dock' | 'At Dock Door' | 'At Parking Lane';

export type YardEventHistory = {
    type: 'status' | 'assignment' | 'created';
    change: string;
    notes?: string;
    changedBy: string;
    timestamp: Date;
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
    status?: YardEventStatus;
    statusNotes?: string;
    history?: YardEventHistory[];
    dwellDays?: number;
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
};

export type Receipt = {
    id: string;
    employeeId: string;
    date: Date;
    time?: string;
    vendor: string;
    amount: number;
    category: 'Fuel' | 'Food' | 'Maintenance' | 'Lodging' | 'Other';
    notes?: string;
    receiptUri: string | null;
    status: 'Pending' | 'Approved' | 'Denied';
    uploadDate: Date;
    reviewedBy?: string;
    reviewedAt?: Date;
};

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
    moduleId: string; // Changed from programId to moduleId
    status: TrainingAssignmentStatus;
    assignedDate: Date;
    completedDate?: Date;
}

export type DeletionLog = {
    id: string;
    deletedItemId: string;
    itemType: 'Shift' | 'User' | 'File' | 'Equipment' | 'BolTemplate' | 'W4Template' | 'Handbook';
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

export type Load = {
  id: string
  origin: string
  destination: string
  pickupDate: string
  deliveryDate: string
  rate: number
  status: "Available" | "Assigned" | "In-Transit" | "Delivered" | "Pending" | "Deleted"
  assignedTo?: string;
  carrier?: string;
  scac?: string;
  dispatcher?: string;
}

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

export type ShareHistoryLog = {
    id: string;
    fileName: string;
    sharedBy: string;
    sharedWith: string[];
    timestamp: Date;
}

export type File = {
    id: string;
    name: string;
    type: 'PDF' | 'Image' | 'Excel' | 'Word' | 'Other';
    size: number; // in bytes
    path: string;
    dateAdded: Date;
}

export type Equipment = {
    id: string;
    name: string; // e.g., TRK-101, VAN-03
    type: 'Truck' | 'Trailer' | 'Van' | 'Forklift' | 'Other';
    make: string;
    model: string;
    vin: string;
    fuelType: 'Diesel' | 'Gasoline' | 'Electric' | 'Hybrid';
    registrationExpiry: Date;
    inspectionExpiry: Date;
    notes?: string;
    documentUri?: string | null;
};

export type JobPosting = {
    id: string;
    title: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Contract';
    description: string;
    status: 'Open' | 'Closed';
    datePosted: Date;
};

export type ApplicantStatus = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

export type Applicant = {
    id: string;
    name: string;
    email: string;
    phone: string;
    applyingFor: string; // JobPosting ID
    status: ApplicantStatus;
    resumeUri?: string | null;
    applicationDate: Date;
    notes?: string;
};

export type BillOfLading = {
  id: string;
  bolNumber: string;
  customer: string;
  origin: string;
  destination: string;
  deliveryDate: string;
  carrier: string;
  documentUri?: string | null;
  otherDocuments?: { name: string; uri: string }[];
};

export type BolTemplate = {
    id: string;
    name: string;
    shipper: { name: string; address: string; city: string; state: string; zip: string; phone: string; };
    consignee: { name: string; address: string; city: string; state: string; zip: string; phone: string; };
}

export type InventoryItem = {
    sku: string;
    description: string;
    location: string;
    qty: number;
    reorderPoint: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    price?: number;
};

export type Customer = {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    status: 'Active' | 'Inactive';
    dateAdded: Date;
    items?: string[];
    destination?: string;
}

export type QualityHold = {
    id: string;
    itemId: string; // SKU
    reason: string;
    notes?: string;
    holdDate: Date;
    releaseDate?: Date;
    scrappedDate?: Date;
    placedBy: string; // Employee Name
    status: 'On Hold' | 'Released' | 'Scrapped';
};

export type OrderItem = {
    sku: string;
    description: string;
    quantity: number;
    location: string;
    picked: boolean;
};

export type SalesOrder = {
    id: string; // e.g. SO-12345
    customer: string;
    destination: string;
    shipDate: Date;
    status: 'Pending' | 'Picking' | 'Staged' | 'Shipped';
    assignedPicker?: string; // Employee ID
    items: OrderItem[];
    bolNumber?: string;
    pickStartTime?: Date;
    pickEndTime?: Date;
}

export type W4Template = {
  id: string;
  name: string;
  documentUri: string;
  uploadedAt: Date;
};

export type HandbookSection = {
    title: string;
    content: string;
    documentUri?: string | null;
};

export type Handbook = {
    id: string;
    name: string;
    documentUri?: string | null;
    uploadedAt: Date;
    content?: {
        lastUpdated: string;
        sections: HandbookSection[];
    }
};

export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Done';

export type TaskEvent = {
    id: string;
    type: 'note' | 'milestone';
    author: string;
    content: string;
    name?: string;
    timestamp: Date;
    documentUri?: string | null;
};

export type Task = {
    id: string;
    title: string;
    description: string;
    assigneeIds: string[];
    status: TaskStatus;
    projectId: string;
    dueDate?: Date;
    documentUri?: string | null;
    events: TaskEvent[];
};

export type Project = {
    id: string;
    name: string;
    description: string;
    team: string[]; // array of employee IDs
    dueDate?: Date;
}

export type CrmTaskStatus = 'To Do' | 'In Progress' | 'Completed';
export type CrmTaskPriority = 'Low' | 'Medium' | 'High';
export type CrmTaskType = 'Call' | 'Email' | 'Meeting' | 'Follow-up';

export type CrmTask = {
  id: string;
  title: string;
  status: CrmTaskStatus;
  priority: CrmTaskPriority;
  dueDate: Date;
  taskType: CrmTaskType;
  assignedTo: string; // Employee ID
  associatedWith?: string; // Contact or Company Name
};

export type CrmContact = {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: 'Lead' | 'Contact' | 'Customer';
    dateAdded: Date;
};

export type Company = {
  id: string;
  name: string;
  industry: string;
  status: 'Lead' | 'Prospect' | 'Customer' | 'Former';
  primaryContact: string; // Contact Name
  dateAdded: Date;
  website?: string;
};

type ScheduleContextType = {
  shifts: Shift[];
  employees: Employee[];
  currentUser: Employee | null;
  holidays: Holiday[];
  timeOffRequests: TimeOffRequest[];
  registrations: Registration[];
  yardEvents: YardEvent[];
  expenseReports: ExpenseReport[];
  receipts: Receipt[];
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
  loads: Load[];
  files: File[];
  equipment: Equipment[];
  jobPostings: JobPosting[];
  applicants: Applicant[];
  bolHistory: BillOfLading[];
  bolTemplates: BolTemplate[];
  inventoryItems: InventoryItem[];
  customers: Customer[];
  availableStatuses: YardEventStatus[];
  qualityHolds: QualityHold[];
  salesOrders: SalesOrder[];
  w4Templates: W4Template[];
  handbooks: Handbook[];
  projects: Project[];
  tasks: Task[];
  crmTasks: CrmTask[];
  crmContacts: CrmContact[];
  companies: Company[];
  addCompany: (companyData: Omit<Company, 'id' | 'dateAdded'>) => void;
  addCrmContact: (contactData: Omit<CrmContact, 'id' | 'dateAdded'>) => void;
  addCrmTask: (taskData: Omit<CrmTask, 'id' | 'status'>) => void;
  updateCrmTaskStatus: (taskId: string, status: CrmTaskStatus) => void;
  addTask: (taskData: Omit<Task, 'id' | 'events'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addTaskEvent: (taskId: string, eventData: Omit<TaskEvent, 'id' | 'author'>) => void;
  getHandbookById: (id: string) => Handbook | null;
  updateHandbookSection: (handbookId: string, sectionTitle: string, content: string) => void;
  updateHandbookSectionDocument: (handbookId: string, sectionTitle: string, documentUri: string | null) => void;
  addHandbookSection: (handbookId: string, title: string, content: string) => void;
  addHandbook: (name: string, documentUri: string) => void;
  deleteHandbook: (id: string) => void;
  updateHandbook: (updatedHandbook: Handbook) => void;
  duplicateHandbook: (handbookId: string) => void;
  addW4Template: (name: string, documentUri: string) => void;
  updateW4Template: (id: string, name: string) => void;
  deleteW4Template: (id: string) => void;
  assignPickerToOrder: (orderId: string, pickerId: string) => void;
  updateOrderItemStatus: (orderId: string, sku: string, picked: boolean) => void;
  completeOrderPicking: (orderId: string) => void;
  placeOnHold: (itemId: string, reason: string, notes?: string) => void;
  releaseFromHold: (holdId: string) => void;
  scrapItem: (holdId: string) => void;
  addCustomer: (customerData: Omit<Customer, 'id' | 'dateAdded'>) => void;
  updateCustomerStatus: (customerId: string, status: Customer['status']) => void;
  addCustomStatus: (newStatus: string) => void;
  addApplicant: (applicantData: Omit<Applicant, 'id' | 'applicationDate'>) => void;
  updateApplicantStatus: (applicantId: string, status: ApplicantStatus) => void;
  addJobPosting: (jobPostingData: Omit<JobPosting, 'id' | 'datePosted'>) => void;
  updateJobPostingStatus: (jobPostingId: string, status: JobPosting['status']) => void;
  deleteEquipment: (equipmentId: string, deletedBy: string) => void;
  addEquipment: (equipmentData: Omit<Equipment, 'id'>) => void;
  addFile: (fileData: Omit<File, 'id'>) => void;
  deleteFile: (fileId: string, deletedBy: string) => void;
  permanentlyDeleteItem: (logId: string) => void;
  shareHistoryLogs: ShareHistoryLog[];
  logFileShare: (fileName: string, sharedBy: string, sharedWith: string[]) => void;
  moveTrailer: (eventId: string, toLocationType: 'lane' | 'door', toLocationId: string, fromLost?: boolean) => void;
  addOfficeAppointment: (appointment: Omit<OfficeAppointment, 'id' | 'status'>) => OfficeAppointment;
  updateOfficeAppointmentStatus: (appointmentId: string, status: OfficeAppointment['status']) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => Appointment;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
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
  updateEmployeeStatus: (employeeId: string, status: 'Active' | 'Inactive') => void;
  updateEmployee: (updatedEmployee: Employee) => void;
  deleteEmployee: (employeeId: string, deletedBy: string) => void;
  addEmployee: (employeeData: Omit<Employee, 'id' | 'personnelId' | 'status'>) => void;
  bulkAddEmployees: (employeeData: Omit<Employee, 'id' | 'personnelId' | 'status'>[]) => void;
  updateEmployeeDocument: (employeeId: string, documentDataUri: string | null) => void;
  getEmployeeDocument: (employeeId: string) => string | null;
  getYardEventById: (id: string) => YardEvent | null;
  addYardEvent: (eventData: Omit<YardEvent, 'id' | 'timestamp' | 'clerkName' | 'dwellDays'>, documentDataUri: string | null) => void;
  updateYardEventStatus: (eventId: string, status: YardEventStatus, notes?: string) => void;
  getExpenseReportById: (id: string) => ExpenseReport | null;
  setExpenseReports: React.Dispatch<React.SetStateAction<ExpenseReport[]>>;
  receipts: Receipt[];
  setReceipts: React.Dispatch<React.SetStateAction<Receipt[]>>;
  getTrainingModuleById: (id: string) => TrainingModule | null;
  assignTraining: (employeeId: string, moduleId: string) => void;
  unassignTraining: (assignmentId: string) => void;
  addWarehouseDoor: (doorId: string) => void;
  addParkingLane: (laneId: string) => void;
  restoreDeletedItem: (logId: string) => void;
  addTimeClockEvent: (event: Omit<TimeClockEvent, 'id' | 'timestamp'>) => void;
  updateTimeClockStatus: (clockInId: string, status: 'Approved' | 'Denied') => void;
  updateInventory: (itemName: string, quantityChange: number) => void;
  saveBol: (bolData: Omit<BillOfLading, 'id' | 'documentUri'>, documentUri: string | null) => BillOfLading;
  saveBolTemplate: (templateData: Omit<BolTemplate, 'id'>) => void;
  deleteBolTemplate: (templateId: string) => void;
  addOrUpdateDirectDeposit: (employeeId: string, account: Omit<DirectDepositAccount, 'id'>) => void;
  deleteDirectDeposit: (employeeId: string, accountId: string) => void;
};

export const initialShifts: Shift[] = [
    { id: 'SH001', date: formatISO(new Date(), { representation: 'date' }), employeeId: 'USR001', title: 'Opening Shift', startTime: '08:00', endTime: '16:00' },
    { id: 'SH002', date: formatISO(new Date(), { representation: 'date' }), employeeId: 'USR002', title: 'Closing Shift', startTime: '14:00', endTime: '22:00' },
    { id: 'SH003', date: formatISO(addDays(new Date(), 2), { representation: 'date' }), employeeId: 'USR001', title: 'Day Shift', startTime: '09:00', endTime: '17:00' },
    { id: 'SH004', date: formatISO(addDays(new Date(), 2), { representation: 'date' }), employeeId: 'USR003', title: 'Day Shift', startTime: '09:00', endTime: '17:00' },
];


export const mockEmployees: Employee[] = [
    { id: "USR001", name: "John Doe", email: "john.doe@example.com", role: "Driver", status: 'Active', personnelId: "JD-001", phoneNumber: "555-123-4567", workLocation: ["Warehouse"], payType: 'Hourly', payRate: 25.50, directDeposit: [] },
    { id: "USR002", name: "Jane Doe", email: "jane.doe@example.com", role: "Driver", status: 'Active', personnelId: "JD-002", phoneNumber: "555-234-5678", workLocation: ["Mobile"], payType: 'Hourly', payRate: 25.50, directDeposit: [] },
    { id: "USR003", name: "Mike Smith", email: "mike.smith@example.com", role: "Dispatcher", status: 'Active', personnelId: "MS-001", phoneNumber: "555-345-6789", workLocation: ["Site 1", "Work From Home"], payType: 'Salary', payRate: 65000, directDeposit: [] },
    { id: "USR004", name: "Emily Jones", email: "emily.jones@example.com", role: "Admin", status: 'Active', personnelId: "EJ-001", phoneNumber: "555-456-7890", workLocation: ["Work From Home"], payType: 'Salary', payRate: 80000, directDeposit: [] },
];

export const initialHolidays: Holiday[] = [
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

export const initialTimeOffRequests: TimeOffRequest[] = [
    { id: 'PTO001', employeeId: 'USR002', startDate: addDays(new Date(), 5), endDate: addDays(new Date(), 7), reason: 'Family vacation', status: 'Pending' },
    { id: 'PTO002', employeeId: 'USR003', startDate: addDays(new Date(), 10), endDate: addDays(new Date(), 10), reason: 'Doctor appointment', status: 'Approved' },
];

export const initialRegistrations: Registration[] = [
    { id: 'REG001', name: 'New User 1', email: 'new.user1@example.com', phoneNumber: '555-888-1111', role: 'Driver', status: 'Pending' },
    { id: 'REG002', name: 'New User 2', email: 'new.user2@example.com', phoneNumber: '555-888-2222', role: 'Dispatcher', status: 'Pending' },
]

export const initialYardEvents: YardEvent[] = [
    { id: 'EVT001', transactionType: 'inbound', trailerId: 'TR53123', sealNumber: 'S12345', carrier: 'Knight-Swift', scac: 'KNX', driverName: 'John Doe', clerkName: 'Admin User', loadNumber: 'LD004', assignmentType: 'door_assignment', assignmentValue: 'D4', timestamp: new Date('2024-07-28T08:15:00Z'), documentDataUri: "https://picsum.photos/seed/bol/800/1100", status: "Loaded", history: [] },
    { id: 'EVT002', transactionType: 'outbound', trailerId: 'TR48991', sealNumber: 'S67890', carrier: 'J.B. Hunt', scac: 'JBHT', driverName: 'Jane Smith', clerkName: 'Admin User', loadNumber: 'LD002', assignmentType: 'empty', timestamp: new Date('2024-07-28T09:30:00Z'), status: "Exited", history: [] },
    { id: 'EVT003', transactionType: 'inbound', trailerId: 'TR53456', carrier: 'Schneider', scac: 'SNDR', driverName: 'Mike Johnson', clerkName: 'Jane Clerk', loadNumber: 'LD125', assignmentType: 'lane_assignment', assignmentValue: 'L12', timestamp: new Date('2024-07-27T14:00:00Z'), status: "Checked In", history: [] },
    { id: 'EVT004', transactionType: 'outbound', trailerId: 'TR53123', sealNumber: 'S54321', carrier: 'Knight-Swift', scac: 'KNX', driverName: 'Emily Davis', clerkName: 'Jane Clerk', loadNumber: 'LD126', assignmentType: 'material', timestamp: new Date('2024-07-27T16:45:00Z'), status: "Exited", history: [] },
    { id: 'EVT005', transactionType: 'inbound', trailerId: 'TR53789', carrier: 'Werner', scac: 'WERN', driverName: 'Chris Brown', clerkName: 'Admin User', loadNumber: 'LD001', assignmentType: 'bobtail', timestamp: new Date('2024-07-26T11:20:00Z'), documentDataUri: "https://picsum.photos/seed/doc/800/1100", status: "Empty", history: [] },
];

export const initialExpenseReports: ExpenseReport[] = [
    { id: "EXP001", employeeName: "John Doe", date: "2024-07-25", description: "Fuel stop in Nevada", category: "Fuel", amount: 150.75, status: "Approved", documentDataUri: "https://picsum.photos/seed/fuel/800/1100" },
    { id: "EXP002", employeeName: "Jane Doe", date: "2024-07-26", description: "Hotel stay in Denver", category: "Other", amount: 120.00, status: "Approved" },
    { id: "EXP003", employeeName: "Mike Smith", date: "2024-07-27", description: "Dinner with client", category: "Food", amount: 85.50, status: "Pending", documentDataUri: "https://picsum.photos/seed/food/800/1100" },
    { id: "EXP004", employeeName: "John Doe", date: "2024-07-28", description: "Oil change and tire rotation", category: "Repairs", amount: 220.00, status: "Pending" },
    { id: "EXP005", employeeName: "Emily Jones", date: "2024-07-29", description: "Tolls and parking", category: "Other", amount: 45.25, status: "Denied" },
    { id: "EXP006", employeeName: "Admin", date: "2024-07-30", description: "Monthly vehicle lease", category: "Lease", amount: 550.00, status: "Approved" },
    { id: "EXP007", employeeName: "Jane Doe", date: "2024-07-30", description: "Office supplies", category: "Supplies", amount: 75.00, status: "Pending" },
    { id: "EXP008", employeeName: "HR", date: "2024-07-31", description: "Monthly payroll", category: "Payroll", amount: 15000.00, status: "Approved" },
];

export const initialReceipts: Receipt[] = [
    { id: 'REC001', employeeId: 'USR001', date: new Date(new Date().setDate(new Date().getDate() - 1)), vendor: 'Pilot', amount: 150.75, category: 'Fuel', receiptUri: 'https://picsum.photos/seed/receipt1/400/600', status: 'Approved', uploadDate: new Date(), reviewedBy: 'Emily Jones', reviewedAt: new Date() },
    { id: 'REC002', employeeId: 'USR002', date: new Date(new Date().setDate(new Date().getDate() - 2)), vendor: "Denny's", amount: 25.50, category: 'Food', receiptUri: null, status: 'Pending', uploadDate: new Date() },
    { id: 'REC003', employeeId: 'USR001', date: new Date(new Date().setDate(new Date().getDate() - 3)), vendor: 'City Auto Repair', amount: 450.00, category: 'Maintenance', receiptUri: 'https://picsum.photos/seed/receipt2/400/600', status: 'Denied', uploadDate: new Date(), reviewedBy: 'Emily Jones', reviewedAt: new Date(new Date().setDate(new Date().getDate() - 1))},
];


export const initialTrainingPrograms: TrainingProgram[] = [
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
- Contain suspicious links or attachments.
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

export const initialTrainingAssignments: TrainingAssignment[] = [
    { id: 'TA001', employeeId: 'USR001', moduleId: 'MOD001', status: 'Not Started', assignedDate: new Date() },
    { id: 'TA002', employeeId: 'USR001', moduleId: 'MOD002', status: 'In Progress', assignedDate: new Date() },
    { id: 'TA003', employeeId: 'USR002', moduleId: 'MOD001', status: 'Completed', assignedDate: new Date(), completedDate: new Date() },
];

export const initialWarehouseDoors = Array.from({ length: 10 }, (_, i) => `D${i + 1}`);
export const initialParkingLanes = Array.from({ length: 20 }, (_, i) => `L${i + 1}`);

export const initialDeletionLogs: DeletionLog[] = [
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

export const initialTimeClockEvents: TimeClockEvent[] = [
    { id: 'TC001', employeeId: 'USR001', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), type: 'in', status: 'Approved' },
    { id: 'TC002', employeeId: 'USR001', timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(), type: 'out' },
    { id: 'TC003', employeeId: 'USR002', timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), type: 'in', status: 'Pending' },
    { id: 'TC004', employeeId: 'USR002', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), type: 'out' },
    { id: 'TC005', employeeId: 'USR003', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), type: 'in', status: 'Denied' },
];

export const initialLocalLoadBoards: LocalLoadBoard[] = [
    { id: 'llb-1', name: 'Local Load board', number: 1 },
];

export const initialLoadBoardHub: LocalLoadBoard = { id: 'hub-1', name: 'Load board hub' };

export const initialAppointments: Appointment[] = [
    { id: 'APP001', status: 'Scheduled', type: 'Inbound', carrier: 'Knight-Swift', scac: 'KNX', bolNumber: 'BOL123', poNumber: 'PO456', sealNumber: 'S123', driverName: 'John Doe', driverPhoneNumber: '555-111-1111', driverLicenseNumber: 'D1234567', driverLicenseState: 'CA', appointmentTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), door: 'D4' },
    { id: 'APP002', status: 'Arrived', type: 'Inbound', carrier: 'J.B. Hunt', scac: 'JBHT', bolNumber: 'BOL456', poNumber: 'PO789', sealNumber: 'S456', driverName: 'Jane Smith', driverPhoneNumber: '555-222-2222', appointmentTime: new Date(new Date().getTime() - 1 * 60 * 60 * 1000), door: 'D2' },
    { id: 'APP003', status: 'Scheduled', type: 'Outbound', carrier: 'Schneider', scac: 'SNDR', bolNumber: 'BOL789', poNumber: 'PO123', sealNumber: 'S789', driverName: 'Mike Johnson', appointmentTime: new Date(new Date().getTime() + 4 * 60 * 60 * 1000) },
    { id: 'APP004', status: 'Departed', type: 'Outbound', carrier: 'Werner', scac: 'WERN', bolNumber: 'BOL101', poNumber: 'PO112', sealNumber: 'S101', driverName: 'Emily Davis', appointmentTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) },
    { id: 'APP005', status: 'Missed', type: 'Inbound', carrier: 'Swift Logistics', scac: 'SWFT', bolNumber: 'BOL112', poNumber: 'PO113', sealNumber: 'S112', driverName: 'Chris Brown', driverLicenseNumber: 'D7654321', driverLicenseState: 'AZ', appointmentTime: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000) },
];

export const initialOfficeAppointments: OfficeAppointment[] = [
    { id: 'OA001', title: 'Q3 Financial Review', type: 'Meeting', attendees: ['Emily Jones', 'Mike Smith'], startTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), endTime: new Date(new Date().getTime() + (2 * 24 * 60 * 60 + 1 * 60 * 60) * 1000), status: 'Scheduled', notes: 'Conference Room 3' },
    { id: 'OA002', title: 'Visitor: John from Acme Corp', type: 'Visitor', attendees: ['Admin User'], startTime: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), endTime: new Date(new Date().getTime() + (1 * 24 * 60 * 60 + 2 * 60 * 60) * 1000), status: 'Scheduled' },
    { id: 'OA003', title: 'IT Maintenance', type: 'Standard', attendees: ['IT Department'], startTime: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), endTime: new Date(new Date().getTime() - (1 * 24 * 60 * 60 - 4 * 60 * 60) * 1000), status: 'Completed' },
];

export const initialLostAndFound: YardEvent[] = [];

export const initialLoads: Load[] = [
    { id: "LD001", origin: "Los Angeles, CA", destination: "Phoenix, AZ", pickupDate: "2024-08-01", deliveryDate: "2024-08-02", rate: 1200, status: "Available", carrier: "Knight-Swift", scac: "KNX" },
    { id: "LD002", origin: "Chicago, IL", destination: "New York, NY", pickupDate: "2024-08-03", deliveryDate: "2024-08-05", rate: 2500, status: "Available", carrier: "J.B. Hunt", scac: "JBHT" },
    { id: "LD003", origin: "Dallas, TX", destination: "Atlanta, GA", pickupDate: "2024-08-05", deliveryDate: "2024-08-07", rate: 1800, status: "Pending", assignedTo: "Jane Doe", carrier: "Swift Logistics", scac: "SWFT", dispatcher: "Dispatcher Name" },
    { id: "LD004", origin: "Seattle, WA", destination: "Denver, CO", pickupDate: "2024-08-06", deliveryDate: "2024-08-08", rate: 2200, status: "In-Transit", assignedTo: "Mike Smith", carrier: "Knight-Swift", scac: "KNX", dispatcher: "Dispatcher Name" },
    { id: "LD005", origin: "Miami, FL", destination: "Houston, TX", pickupDate: "2024-08-08", deliveryDate: "2024-08-10", rate: 2000, status: "Delivered", assignedTo: "Jane Doe", carrier: "Swift Logistics", scac: "SWFT", dispatcher: "Dispatcher Name" },
    { id: "LD006", origin: "Boston, MA", destination: "Washington, DC", pickupDate: "2024-08-10", deliveryDate: "2024-08-11", rate: 900, status: "Deleted" },
];

export const initialShareHistoryLogs: ShareHistoryLog[] = [];

export const initialFiles: File[] = [
    { id: 'FILE001', name: 'BOL_LD123.pdf', type: 'PDF', size: 1024 * 500, path: '/documents/bol/', dateAdded: new Date('2024-07-28T08:15:00Z') },
    { id: 'FILE002', name: 'Trailer_Damage.jpg', type: 'Image', size: 1024 * 1024 * 2, path: '/images/incidents/', dateAdded: new Date('2024-07-27T14:30:00Z') },
    { id: 'FILE003', name: 'Q3_Expense_Report.xlsx', type: 'Excel', size: 1024 * 150, path: '/reports/expenses/', dateAdded: new Date('2024-07-26T10:00:00Z') },
    { id: 'FILE004', name: 'Driver_Handbook_v3.pdf', type: 'PDF', size: 1024 * 1024 * 5, path: '/hr/documents/', dateAdded: new Date('2024-07-25T11:00:00Z') },
];

export const initialEquipment: Equipment[] = [
    { id: 'EQ001', name: 'TRK-101', type: 'Truck', make: 'Freightliner', model: 'Cascadia', vin: '1FUJGHF56HP000001', fuelType: 'Diesel', registrationExpiry: new Date('2025-12-31'), inspectionExpiry: new Date('2025-06-30') },
    { id: 'EQ002', name: 'TRK-102', type: 'Truck', make: 'Volvo', model: 'VNL 860', vin: '4V4NC9TH7PN000002', fuelType: 'Diesel', registrationExpiry: new Date('2025-10-31'), inspectionExpiry: new Date('2025-04-30') },
    { id: 'EQ003', name: 'VAN-03', type: 'Van', make: 'Ford', model: 'Transit', vin: '1FTYF1C58KKA00003', fuelType: 'Gasoline', registrationExpiry: new Date('2026-02-28'), inspectionExpiry: new Date('2026-02-28') },
    { id: 'EQ004', name: 'FL-005', type: 'Forklift', make: 'Toyota', model: '8FGCU25', vin: 'N/A', fuelType: 'Electric', registrationExpiry: new Date('2099-01-01'), inspectionExpiry: new Date('2025-01-31') },
];

export const initialJobPostings: JobPosting[] = [
    { id: 'JOB001', title: 'Long-Haul Truck Driver', location: 'Remote', type: 'Full-time', description: 'Seeking experienced long-haul drivers for cross-country routes.', status: 'Open', datePosted: new Date('2024-07-15') },
    { id: 'JOB002', title: 'Warehouse Associate', location: 'Anytown, USA', type: 'Full-time', description: 'Responsible for loading/unloading trucks and inventory management.', status: 'Open', datePosted: new Date('2024-07-20') },
    { id: 'JOB003', title: 'Dispatcher', location: 'Anytown, USA', type: 'Full-time', description: 'Manage driver schedules and routes.', status: 'Closed', datePosted: new Date('2024-06-01') },
];

export const initialApplicants: Applicant[] = [
    { id: 'APP001', name: 'Alice Johnson', email: 'alice@email.com', phone: '555-1111', applyingFor: 'JOB001', status: 'Applied', applicationDate: new Date('2024-07-25') },
    { id: 'APP002', name: 'Bob Williams', email: 'bob@email.com', phone: '555-2222', applyingFor: 'JOB002', status: 'Screening', applicationDate: new Date('2024-07-26') },
    { id: 'APP003', name: 'Charlie Brown', email: 'charlie@email.com', phone: '555-3333', applyingFor: 'JOB001', status: 'Interview', applicationDate: new Date('2024-07-22') },
    { id: 'APP004', name: 'Diana Prince', email: 'diana@email.com', phone: '555-4444', applyingFor: 'JOB002', status: 'Offer', applicationDate: new Date('2024-07-20') },
    { id: 'APP005', name: 'Ethan Hunt', email: 'ethan@email.com', phone: '555-5555', applyingFor: 'JOB003', status: 'Hired', applicationDate: new Date('2024-06-10') },
    { id: 'APP006', name: 'Fiona Glenanne', email: 'fiona@email.com', phone: '555-6666', applyingFor: 'JOB001', status: 'Rejected', applicationDate: new Date('2024-07-18') },
];

export const initialBolHistory: BillOfLading[] = [
    { id: 'BOL-HIST-001', bolNumber: 'BOL12345', customer: 'Acme Inc.', origin: 'Los Angeles, CA', destination: 'Phoenix, AZ', deliveryDate: '2024-08-02', carrier: 'Knight-Swift', documentUri: "https://picsum.photos/seed/bol/800/1100" },
    { id: 'BOL-HIST-002', bolNumber: 'BOL67890', customer: 'Globex Corp.', origin: 'Chicago, IL', destination: 'New York, NY', deliveryDate: '2024-08-05', carrier: 'J.B. Hunt', documentUri: "https://picsum.photos/seed/bol2/800/1100" }
];

export const initialBolTemplates: BolTemplate[] = [];

export const initialInventoryItems: InventoryItem[] = [
    { sku: 'SKU12345', description: '1/2" Steel Bolts', location: 'Aisle 3, Bin 4', qty: 1250, reorderPoint: 500, status: 'In Stock', price: 0.50 },
    { sku: 'SKU67890', description: '3/4" Nylon Washers', location: 'Aisle 5, Bin 2', qty: 450, reorderPoint: 500, status: 'Low Stock', price: 0.10 },
    { sku: 'SKU54321', description: '2" Wood Screws', location: 'Aisle 1, Bin 1', qty: 3000, reorderPoint: 1000, status: 'In Stock', price: 0.25 },
    { sku: 'SKU98765', description: 'M8 Hex Nuts', location: 'Aisle 3, Bin 5', qty: 0, reorderPoint: 200, status: 'Out of Stock', price: 0.15 },
    { sku: 'SKU11111', description: 'Pallet of Bricks', location: 'Yard', qty: 10, reorderPoint: 2, status: 'In Stock', price: 100 },
];

export const initialCustomers: Customer[] = [
    { id: "CUST001", name: "John Smith", company: "Acme Inc.", email: "john.smith@acme.com", phone: "555-123-4567", status: "Active", dateAdded: new Date("2023-01-15"), items: ["Bolts", "Screws"], destination: "Phoenix, AZ" },
    { id: "CUST002", name: "Jane Doe", company: "Globex Corporation", email: "jane.doe@globex.com", phone: "555-987-6543", status: "Active", dateAdded: new Date("2023-03-22"), items: ["Washers"], destination: "New York, NY" },
    { id: "CUST003", name: "Mike Johnson", company: "Stark Industries", email: "mike.j@stark.com", phone: "555-555-5555", status: "Inactive", dateAdded: new Date("2022-11-01"), destination: "Atlanta, GA" },
];

export const initialQualityHolds: QualityHold[] = [
    { id: 'QH001', itemId: 'SKU67890', reason: 'Failed Inspection', holdDate: new Date('2024-07-28'), placedBy: 'Emily Jones', status: 'On Hold', notes: 'Visible cracks on surface.' },
    { id: 'QH002', itemId: 'SKU12345', reason: 'Damaged Goods', holdDate: new Date('2024-07-27'), releaseDate: new Date('2024-07-28'), placedBy: 'Mike Smith', status: 'Released', notes: 'Packaging was torn, but items are okay.' },
    { id: 'QH003', itemId: 'SKU98765', reason: 'Supplier Recall', holdDate: new Date('2024-07-29'), scrappedDate: new Date('2024-07-30'), placedBy: 'Emily Jones', status: 'Scrapped', notes: 'Scrapped per recall notice.' },
];

export const initialSalesOrders: SalesOrder[] = [
    { id: 'SO-12345', customer: 'Acme Inc.', destination: 'Phoenix, AZ', shipDate: new Date('2024-08-10'), status: 'Pending', items: [ { sku: 'SKU12345', description: '1/2" Steel Bolts', quantity: 100, location: 'Aisle 3, Bin 4', picked: false } ]},
    { id: 'SO-12346', customer: 'Globex Corporation', destination: 'New York, NY', shipDate: new Date('2024-08-11'), status: 'Pending', items: [ { sku: 'SKU67890', description: '3/4" Nylon Washers', quantity: 200, location: 'Aisle 5, Bin 2', picked: false }, { sku: 'SKU54321', description: '2" Wood Screws', quantity: 50, location: 'Aisle 1, Bin 1', picked: false } ]},
    { id: 'SO-12347', customer: 'Stark Industries', destination: 'Atlanta, GA', shipDate: new Date('2024-08-12'), status: 'Picking', assignedPicker: 'USR001', items: [ { sku: 'SKU98765', description: 'M8 Hex Nuts', quantity: 500, location: 'Aisle 3, Bin 5', picked: true } ], pickStartTime: new Date() },
];

export const initialW4Templates: W4Template[] = [
    { id: 'W4-2024-STD', name: 'Standard 2024 W4', documentUri: '', uploadedAt: new Date() }
];

export const initialHandbooks: Handbook[] = [
    { 
        id: 'HB-2024', 
        name: '2024 Employee Handbook', 
        uploadedAt: new Date('2024-01-01'),
        content: {
            lastUpdated: 'January 1, 2024',
            sections: [
                { title: 'Introduction', content: 'Welcome to LogiFlow! This handbook provides important information about our company policies and procedures.', documentUri: null },
                { title: 'Code of Conduct', content: 'All employees are expected to maintain professional behavior. Harassment and discrimination are not tolerated.', documentUri: null },
                { title: 'Employment Policies', content: 'This section covers attendance, performance reviews, and disciplinary actions.', documentUri: null },
                { title: 'Compensation', content: 'Details on payroll, overtime, and expense reimbursement.', documentUri: null },
                { title: 'Benefits', content: 'Information on health insurance, retirement plans, and paid time off.', documentUri: null },
                { title: 'Conclusion', content: 'We are excited to have you on our team and look forward to a successful working relationship.', documentUri: null },
            ]
        }
    },
    { id: 'HB-2023', name: '2023 Employee Handbook (Archived)', documentUri: 'https://picsum.photos/seed/hb2/800/1100', uploadedAt: new Date('2023-01-01') },
];

export const initialProjects: Project[] = [
    { id: 'PROJ-1', name: 'Q3 Marketing Campaign', description: 'Launch new marketing materials for the third quarter.', team: ['USR004', 'USR003'], dueDate: new Date(new Date().setDate(new Date().getDate() + 30)) },
    { id: 'PROJ-2', name: 'Website V2 Development', description: 'Complete the redesign and development of the new company website.', team: ['USR003', 'USR002'], dueDate: new Date(new Date().setDate(new Date().getDate() + 60)) },
    { id: 'PROJ-3', name: 'Mobile App Feature Update', description: 'Add new features to the driver mobile app.', team: ['USR001', 'USR002'], dueDate: new Date(new Date().setDate(new Date().getDate() + 45)) },
];

export const initialTasks: Task[] = [
    { id: 'TASK-1', projectId: 'PROJ-1', title: 'Design new logo', description: 'Create a modern logo for the new marketing campaign.', assigneeIds: ['USR004'], status: 'In Progress', dueDate: new Date(new Date().setDate(new Date().getDate() + 3)), documentUri: 'https://picsum.photos/seed/logo-design/400/300', events: [] },
    { id: 'TASK-2', projectId: 'PROJ-2', title: 'Develop homepage prototype', description: 'Code a functional prototype using Next.js and Tailwind.', assigneeIds: ['USR003'], status: 'To Do', dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), events: [] },
    { id: 'TASK-3', projectId: 'PROJ-2', title: 'Review Q2 Financials', description: 'Audit the financial statements for the second quarter.', assigneeIds: ['USR004'], status: 'Done', events: [] },
    { id: 'TASK-4', projectId: 'PROJ-3', title: 'Plan team offsite event', description: 'Organize location, catering, and activities for the annual team offsite.', assigneeIds: ['USR002', 'USR004'], status: 'Review', dueDate: new Date(new Date().setDate(new Date().getDate() + 14)), events: [] },
];

export const initialCrmTasks: CrmTask[] = [
    { id: 'CRMTASK-1', title: 'Follow up with Acme Inc.', status: 'To Do', priority: 'High', dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), taskType: 'Call', assignedTo: 'USR004', associatedWith: 'Acme Inc.' },
    { id: 'CRMTASK-2', title: 'Send proposal to Globex Corp.', status: 'In Progress', priority: 'High', dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), taskType: 'Email', assignedTo: 'USR004', associatedWith: 'Globex Corp.' },
    { id: 'CRMTASK-3', title: 'Schedule demo with Stark Industries', status: 'To Do', priority: 'Medium', dueDate: new Date(new Date().setDate(new Date().getDate() + 5)), taskType: 'Meeting', assignedTo: 'USR003', associatedWith: 'Stark Industries' },
];

export const initialCrmContacts: CrmContact[] = [
    { id: 'CRMCONT-1', name: 'John Doe', email: 'john.d@acme.com', phone: '555-0101', company: 'Acme Inc.', status: 'Customer', dateAdded: new Date('2023-05-10') },
    { id: 'CRMCONT-2', name: 'Jane Smith', email: 'jane.s@globex.com', phone: '555-0102', company: 'Globex Corp.', status: 'Customer', dateAdded: new Date('2023-08-15') },
    { id: 'CRMCONT-3', name: 'Peter Jones', email: 'p.jones@stark.com', phone: '555-0103', company: 'Stark Industries', status: 'Contact', dateAdded: new Date('2024-01-20') },
    { id: 'CRMCONT-4', name: 'Susan Reid', email: 'susan@weyland.com', phone: '555-0104', company: 'Weyland-Yutani', status: 'Lead', dateAdded: new Date('2024-03-30') },
];

export const initialCompanies: Company[] = [
    { id: 'COMP-1', name: 'Acme Inc.', industry: 'Manufacturing', status: 'Customer', primaryContact: 'John Doe', dateAdded: new Date('2023-01-15') },
    { id: 'COMP-2', name: 'Globex Corp.', industry: 'Technology', status: 'Customer', primaryContact: 'Jane Smith', dateAdded: new Date('2022-11-20') },
    { id: 'COMP-3', name: 'Stark Industries', industry: 'Defense', status: 'Prospect', primaryContact: 'Peter Jones', dateAdded: new Date('2024-02-10') },
    { id: 'COMP-4', name: 'Weyland-Yutani', industry: 'Biotechnology', status: 'Lead', primaryContact: 'Susan Reid', dateAdded: new Date('2024-03-30') },
];


const initialAvailableStatuses: YardEventStatus[] = ['Checked In', 'Loaded', 'Empty', 'Blocked', 'Repair Needed', 'Rejected', 'Late', 'Early', 'Product on hold', 'Exited', 'Waiting for dock', 'At Dock Door', 'At Parking Lane'];


const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>(initialTimeOffRequests);
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [yardEvents, setYardEvents] = useState<YardEvent[]>(initialYardEvents);
  const [expenseReports, setExpenseReports] = useState<ExpenseReport[]>(initialExpenseReports);
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts);
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
  const [loads, setLoads] = useState<Load[]>(initialLoads);
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(initialJobPostings);
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [bolHistory, setBolHistory] = useState<BillOfLading[]>(initialBolHistory);
  const [bolTemplates, setBolTemplates] = useState<BolTemplate[]>(initialBolTemplates);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [availableStatuses, setAvailableStatuses] = useState<YardEventStatus[]>(initialAvailableStatuses);
  const [shareHistoryLogs, setShareHistoryLogs] = useState<ShareHistoryLog[]>(initialShareHistoryLogs);
  const [qualityHolds, setQualityHolds] = useState<QualityHold[]>(initialQualityHolds);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(initialSalesOrders);
  const [w4Templates, setW4Templates] = useState<W4Template[]>(initialW4Templates);
  const [handbooks, setHandbooks] = useState<Handbook[]>(initialHandbooks);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [crmTasks, setCrmTasks] = useState<CrmTask[]>(initialCrmTasks);
  const [crmContacts, setCrmContacts] = useState<CrmContact[]>(initialCrmContacts);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);

  const addCompany = (companyData: Omit<Company, 'id' | 'dateAdded'>) => {
    const newCompany: Company = {
        ...companyData,
        id: `COMP-${Date.now()}`,
        dateAdded: new Date(),
    };
    setCompanies(prev => [newCompany, ...prev]);
  };

  const addCrmContact = (contactData: Omit<CrmContact, 'id' | 'dateAdded'>) => {
    const newContact: CrmContact = {
        ...contactData,
        id: `CRMCONT-${Date.now()}`,
        dateAdded: new Date(),
    };
    setCrmContacts(prev => [newContact, ...prev]);
  };

  const addCrmTask = (taskData: Omit<CrmTask, 'id' | 'status'>) => {
    const newTask: CrmTask = {
        ...taskData,
        id: `CRMTASK-${Date.now()}`,
        status: 'To Do',
    };
    setCrmTasks(prev => [newTask, ...prev]);
  };

  const updateCrmTaskStatus = (taskId: string, status: CrmTaskStatus) => {
      setCrmTasks(prev => prev.map(task => task.id === taskId ? { ...task, status } : task));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'events'>) => {
    const newTask: Task = {
        ...taskData,
        id: `TASK-${Date.now()}`,
        events: [],
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
      setTasks(prev => prev.map(task => task.id === taskId ? { ...task, status } : task));
  };
  
  const addTaskEvent = (taskId: string, eventData: Omit<TaskEvent, 'id' | 'author'>) => {
    const newEvent: TaskEvent = {
        ...eventData,
        id: `EVT-${Date.now()}`,
        author: currentUser?.name || 'Unknown',
    };
    setTasks(prev => prev.map(task => 
        task.id === taskId 
        ? { ...task, events: [...(task.events || []), newEvent] }
        : task
    ));
  };

  const getHandbookById = (id: string) => {
    return handbooks.find(hb => hb.id.toLowerCase() === id.toLowerCase()) || null;
  }

  const updateHandbookSection = (handbookId: string, sectionTitle: string, content: string) => {
    setHandbooks(prev => prev.map(hb => {
        if (hb.id === handbookId && hb.content) {
            const newSections = hb.content.sections.map(sec => 
                sec.title === sectionTitle ? { ...sec, content } : sec
            );
            return { ...hb, content: { ...hb.content, sections: newSections, lastUpdated: new Date().toLocaleDateString() } };
        }
        return hb;
    }));
  };

  const updateHandbookSectionDocument = (handbookId: string, sectionTitle: string, documentUri: string | null) => {
    setHandbooks(prev => prev.map(hb => {
        if (hb.id === handbookId && hb.content) {
            const newSections = hb.content.sections.map(sec => 
                sec.title === sectionTitle ? { ...sec, documentUri } : sec
            );
            return { ...hb, content: { ...hb.content, sections: newSections, lastUpdated: new Date().toLocaleDateString() } };
        }
        return hb;
    }));
  };


  const addHandbookSection = (handbookId: string, title: string, content: string) => {
      setHandbooks(prev => prev.map(hb => {
          if (hb.id === handbookId && hb.content) {
              const newSection: HandbookSection = { title, content, documentUri: null };
              const newSections = [...hb.content.sections, newSection];
              return { ...hb, content: { ...hb.content, sections: newSections, lastUpdated: new Date().toLocaleDateString() }};
          }
          return hb;
      }));
  }

  const addHandbook = (name: string, documentUri: string) => {
      const newHandbook: Handbook = {
          id: `HB-${Date.now()}`,
          name,
          documentUri,
          uploadedAt: new Date(),
      };
      setHandbooks(prev => [newHandbook, ...prev]);
  };

  const deleteHandbook = (id: string) => {
      const handbookToDelete = handbooks.find(hb => hb.id === id);
      if (handbookToDelete) {
          const logEntry: DeletionLog = {
              id: `LOG${Date.now()}`,
              deletedItemId: id,
              itemType: 'Handbook',
              deletedBy: currentUser?.id || 'system',
              deletedAt: new Date(),
              originalData: handbookToDelete,
          };
          setDeletionLogs(prev => [logEntry, ...prev]);
          setHandbooks(prev => prev.filter(hb => hb.id !== id));
      }
  };

  const updateHandbook = (updatedHandbook: Handbook) => {
    setHandbooks(prev => prev.map(hb => hb.id === updatedHandbook.id ? updatedHandbook : hb));
  };
  
  const duplicateHandbook = (handbookId: string) => {
      const handbookToCopy = handbooks.find(hb => hb.id === handbookId);
      if (handbookToCopy) {
          const newHandbook: Handbook = {
              ...handbookToCopy,
              id: `HB-${Date.now()}`,
              name: `Copy of ${handbookToCopy.name}`,
              uploadedAt: new Date(),
          };
          setHandbooks(prev => [newHandbook, ...prev]);
      }
  };
  
  const addW4Template = (name: string, documentUri: string) => {
    const newTemplate: W4Template = {
        id: `W4-${Date.now()}`,
        name,
        documentUri,
        uploadedAt: new Date(),
    };
    setW4Templates(prev => [...prev, newTemplate]);
  };

  const updateW4Template = (id: string, name: string) => {
    setW4Templates(prev => prev.map(t => t.id === id ? { ...t, name } : t));
  };
  
  const deleteW4Template = (id: string) => {
    const templateToDelete = w4Templates.find(t => t.id === id);
    if (templateToDelete) {
        const logEntry: DeletionLog = {
            id: `LOG${Date.now()}`,
            deletedItemId: id,
            itemType: 'W4Template',
            deletedBy: currentUser?.id || 'system',
            deletedAt: new Date(),
            originalData: templateToDelete,
        };
        setDeletionLogs(prev => [logEntry, ...prev]);
        setW4Templates(prev => prev.filter(t => t.id !== id));
    }
  };

  const assignPickerToOrder = (orderId: string, pickerId: string) => {
    setSalesOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Picking', assignedPicker: pickerId, pickStartTime: new Date() } : o));
  };

  const updateOrderItemStatus = (orderId: string, sku: string, picked: boolean) => {
      setSalesOrders(prev => prev.map(o => {
          if (o.id === orderId) {
              return {
                  ...o,
                  items: o.items.map(item => item.sku === sku ? { ...item, picked } : item),
              };
          }
          return o;
      }));
  };

  const completeOrderPicking = (orderId: string) => {
    setSalesOrders(prev => prev.map(o => {
        if (o.id === orderId) {
            return {
                ...o,
                status: 'Staged',
                pickEndTime: new Date(),
            }
        }
        return o;
    }))
  };

  const placeOnHold = (itemId: string, reason: string, notes?: string) => {
    const newHold: QualityHold = {
        id: `QH${Date.now()}`,
        itemId,
        reason,
        notes,
        holdDate: new Date(),
        placedBy: currentUser?.name || 'System',
        status: 'On Hold',
    };
    setQualityHolds(prev => [newHold, ...prev]);
  };

  const releaseFromHold = (holdId: string) => {
    setQualityHolds(prev => prev.map(h => h.id === holdId ? { ...h, status: 'Released', releaseDate: new Date() } : h));
  };

  const scrapItem = (holdId: string) => {
    setQualityHolds(prev => prev.map(h => h.id === holdId ? { ...h, status: 'Scrapped', scrappedDate: new Date() } : h));
  };


  const addCustomer = (customerData: Omit<Customer, 'id' | 'dateAdded'>) => {
    const newCustomer: Customer = {
        ...customerData,
        id: `CUST${Date.now()}`,
        dateAdded: new Date(),
    };
    setCustomers(prev => [newCustomer, ...prev]);
  };
  
  const updateCustomerStatus = (customerId: string, status: Customer['status']) => {
      setCustomers(prev => prev.map(c => c.id === customerId ? {...c, status} : c));
  }

  const addCustomStatus = (newStatus: string) => {
    if (!availableStatuses.includes(newStatus as YardEventStatus)) {
        setAvailableStatuses(prev => [...prev, newStatus as YardEventStatus]);
    }
  }

  React.useEffect(() => {
    // In a real app, this would be determined by an auth state listener.
    // For now, we'll mock the current user as the first Admin.
    const adminUser = employees.find(e => e.role === 'Admin');
    setCurrentUser(adminUser || null);
  }, [employees]);

    const addApplicant = (applicantData: Omit<Applicant, 'id' | 'applicationDate'>) => {
        const newApplicant: Applicant = {
            ...applicantData,
            id: `APP${Date.now()}`,
            applicationDate: new Date(),
        };
        setApplicants(prev => [newApplicant, ...prev]);
    };

    const updateApplicantStatus = (applicantId: string, status: ApplicantStatus) => {
        setApplicants(prev => prev.map(app => app.id === applicantId ? { ...app, status } : app));
    };

    const addJobPosting = (jobPostingData: Omit<JobPosting, 'id' | 'datePosted'>) => {
        const newJobPosting: JobPosting = {
            ...jobPostingData,
            id: `JOB${Date.now()}`,
            datePosted: new Date(),
        };
        setJobPostings(prev => [newJobPosting, ...prev]);
    };

    const updateJobPostingStatus = (jobPostingId: string, status: JobPosting['status']) => {
        setJobPostings(prev => prev.map(job => job.id === jobPostingId ? { ...job, status } : job));
    };

    const addFile = (fileData: Omit<File, 'id'>) => {
        const newFile = { ...fileData, id: `FILE${Date.now()}` };
        setFiles(prev => [newFile, ...prev]);
        return newFile;
    }

    const deleteFile = (fileId: string, deletedBy: string) => {
        const fileToDelete = files.find(f => f.id === fileId);
        if (fileToDelete) {
            const logEntry: DeletionLog = {
                id: `LOG${Date.now()}`,
                deletedItemId: fileId,
                itemType: 'File',
                deletedBy,
                deletedAt: new Date(),
                originalData: fileToDelete,
            };
            setDeletionLogs(prev => [logEntry, ...prev]);
            setFiles(prev => prev.filter(f => f.id !== fileId));
        }
    }

    const permanentlyDeleteItem = (logId: string) => {
        setDeletionLogs(prev => prev.filter(log => log.id !== logId));
    };

  const logFileShare = (fileName: string, sharedBy: string, sharedWith: string[]) => {
    const newLog: ShareHistoryLog = {
        id: `SHARE-${Date.now()}`,
        fileName,
        sharedBy,
        sharedWith,
        timestamp: new Date(),
    };
    setShareHistoryLogs(prev => [newLog, ...prev]);
  };


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
            status: 'Active',
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
    
    const updateEmployeeStatus = (employeeId: string, status: 'Active' | 'Inactive') => {
        setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, status } : emp));
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

    const addEmployee = (employeeData: Omit<Employee, 'id' | 'personnelId' | 'status'>) => {
        const newId = `USR${Date.now()}`;
        const newPersonnelId = `${employeeData.name.split(' ').map(n => n[0]).join('').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
        const newEmployee: Employee = {
            ...employeeData,
            id: newId,
            status: 'Active',
            personnelId: newPersonnelId,
        };
        setEmployees(prev => [...prev, newEmployee]);
    };

     const bulkAddEmployees = (employeeData: Omit<Employee, 'id' | 'personnelId' | 'status'>[]) => {
        const newEmployees = employeeData.map(emp => {
             const newId = `USR${Date.now()}${Math.random()}`;
            const newPersonnelId = `${emp.name.split(' ').map(n => n[0]).join('').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
            return {
                ...emp,
                id: newId,
                status: 'Active' as const,
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

    const addYardEvent = (eventData: Omit<YardEvent, 'id' | 'timestamp' | 'clerkName' | 'dwellDays'>, documentDataUri: string | null) => {
        const newEventBase: Omit<YardEvent, 'id' | 'timestamp'> = {
            ...eventData,
            clerkName: currentUser?.name || 'Admin User',
            documentDataUri: documentDataUri,
        };

        const newEvents: YardEvent[] = [];
        let finalEvent: YardEvent = { ...newEventBase, id: `EVT${Date.now()}`, timestamp: new Date(), history: [] };

        if ((finalEvent.assignmentType === 'door_assignment' || finalEvent.assignmentType === 'lane_assignment') && finalEvent.assignmentValue && finalEvent.transactionType === 'inbound') {
            const locationId = finalEvent.assignmentValue;
            const lastEventForLocation = yardEvents
                .filter(e => e.assignmentType === finalEvent.assignmentType && e.assignmentValue === locationId && e.transactionType === 'inbound')
                .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

            if (lastEventForLocation) {
                const occupyingEvent = lastEventForLocation;
                // Location is occupied, move occupying trailer to lost and found
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
                    assignmentValue: `displaced from ${locationId}`,
                    timestamp: new Date(),
                    clerkName: currentUser?.name || 'System',
                    history: []
                };
                setLostAndFound(prev => [...prev, lostEvent]);
            }
        }
        
        if (finalEvent.transactionType === 'outbound') {
            const inboundEvent = yardEvents.find(e => e.trailerId === finalEvent.trailerId && e.transactionType === 'inbound');
            if (inboundEvent) {
                finalEvent.dwellDays = differenceInDays(new Date(), inboundEvent.timestamp);
            }
        }

        newEvents.push(finalEvent);
        setYardEvents(prev => [...prev, ...newEvents]);
    };
    
    const updateYardEventStatus = (eventId: string, status: YardEventStatus, notes?: string) => {
        const historyEntry: YardEventHistory = {
            type: 'status',
            change: `Status changed to ${status}`,
            notes,
            changedBy: currentUser?.name || 'System',
            timestamp: new Date(),
        };

        const update = (events: YardEvent[]) => events.map(e => e.id === eventId ? {
            ...e, 
            status, 
            statusNotes: notes ?? e.statusNotes,
            history: [...(e.history || []), historyEntry]
        } : e);
        setYardEvents(update);
        setLostAndFound(update);
    }

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

    const assignTraining = (employeeId: string, moduleId: string) => {
        const alreadyAssigned = trainingAssignments.find(a => a.employeeId === employeeId && a.moduleId === moduleId);
        if (alreadyAssigned) {
            // Silently ignore if already assigned to prevent errors for user.
            return;
        }

        const newAssignment: TrainingAssignment = {
            id: `TA${Date.now()}`,
            employeeId,
            moduleId,
            status: 'Not Started',
            assignedDate: new Date(),
        };
        setTrainingAssignments(prev => [...prev, newAssignment]);
    };

    const unassignTraining = (assignmentId: string) => {
        setTrainingAssignments(prev => prev.filter(a => a.id !== assignmentId));
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
             case 'File':
                setFiles(prev => [...prev, logEntry.originalData]);
                break;
             case 'Equipment':
                setEquipment(prev => [...prev, logEntry.originalData]);
                break;
            case 'BolTemplate':
                setBolTemplates(prev => [...prev, logEntry.originalData]);
                break;
             case 'W4Template':
                setW4Templates(prev => [...prev, logEntry.originalData]);
                break;
            case 'Handbook':
                setHandbooks(prev => [...prev, logEntry.originalData]);
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

    const moveTrailer = (eventId: string, toLocationType: 'lane' | 'door', toLocationId: string, fromLost: boolean = false) => {
        const eventToMove = fromLost 
            ? lostAndFound.find(e => e.id === eventId) 
            : yardEvents.find(e => e.id === eventId);
    
        if (!eventToMove) throw new Error("Trailer event to move not found.");

        const historyEntry: YardEventHistory = {
            type: 'assignment',
            change: `Moved to ${toLocationType.replace(/_/g, ' ')} ${toLocationId}`,
            notes: `Moved from ${eventToMove.assignmentType.replace(/_/g, ' ')} ${eventToMove.assignmentValue}`,
            changedBy: currentUser?.name || 'System',
            timestamp: new Date(),
        };

        const getLatestInboundEventForLocation = (type: 'lane' | 'door', id: string) => {
            const eventsInLocation = yardEvents
                .filter(e => e.assignmentType === `${type}_assignment` && e.assignmentValue === id)
                .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
            const lastEvent = eventsInLocation[0];
            if (lastEvent && lastEvent.transactionType === 'inbound') {
                return lastEvent;
            }
            return null;
        }
        
        const newEvents: YardEvent[] = [];

        // 1. Create outbound event for the trailer being moved from its original location
        const outboundEvent: YardEvent = {
            ...eventToMove,
            id: `EVT${Date.now() + 1}`,
            transactionType: 'outbound',
            timestamp: new Date(),
            clerkName: currentUser?.name || 'System',
            history: [...(eventToMove.history || []), historyEntry],
        };
        newEvents.push(outboundEvent);

        if (toLocationId === 'lost_and_found') {
            const lostEvent: YardEvent = {
                ...eventToMove,
                id: `EVT${Date.now() + 2}`,
                transactionType: 'move',
                assignmentType: 'lost_and_found',
                assignmentValue: `moved from ${eventToMove.assignmentValue}`,
                timestamp: new Date(),
                clerkName: currentUser?.name || 'System',
                history: [...(eventToMove.history || []), historyEntry],
            };
            setLostAndFound(prev => [...prev, lostEvent]);
            setYardEvents(prev => [...prev, outboundEvent]);
            return;
        }

        const occupyingEvent = getLatestInboundEventForLocation(toLocationType, toLocationId);
        if (occupyingEvent) {
            const occupyingOutboundEvent: YardEvent = {
                ...occupyingEvent,
                id: `EVT${Date.now() + 2}`,
                transactionType: 'outbound',
                timestamp: new Date(),
                clerkName: currentUser?.name || 'System',
                 history: [...(occupyingEvent.history || []), {
                    type: 'assignment',
                    change: `Moved to Lost & Found`,
                    notes: `Displaced by trailer ${eventToMove.trailerId} moving to ${toLocationId}`,
                    changedBy: currentUser?.name || 'System',
                    timestamp: new Date()
                }],
            };
            newEvents.push(occupyingOutboundEvent);

            const lostEvent: YardEvent = {
                ...occupyingEvent,
                id: `EVT${Date.now() + 3}`,
                transactionType: 'move',
                assignmentType: 'lost_and_found',
                assignmentValue: `displaced from ${toLocationId}`,
                timestamp: new Date(),
                clerkName: currentUser?.name || 'System',
                history: [...(occupyingEvent.history || []), {
                    type: 'assignment',
                    change: `Moved to Lost & Found`,
                    notes: `Displaced by trailer ${eventToMove.trailerId} moving to ${toLocationId}`,
                    changedBy: currentUser?.name || 'System',
                    timestamp: new Date()
                }],
            };
            setLostAndFound(prev => [...prev, lostEvent]);
        }

        const inboundEvent: YardEvent = {
            ...eventToMove,
            id: `EVT${Date.now()}`,
            transactionType: 'inbound',
            assignmentType: `${toLocationType}_assignment`,
            assignmentValue: toLocationId,
            timestamp: new Date(),
            clerkName: currentUser?.name || 'System',
            history: [...(eventToMove.history || []), historyEntry],
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

    const addEquipment = (equipmentData: Omit<Equipment, 'id'>) => {
        const newEquipment: Equipment = {
            ...equipmentData,
            id: `EQ${Date.now()}`,
        };
        setEquipment(prev => [newEquipment, ...prev]);
    }
    
    const deleteEquipment = (equipmentId: string, deletedBy: string) => {
        const itemToDelete = equipment.find(e => e.id === equipmentId);
        if (itemToDelete) {
            const logEntry: DeletionLog = {
                id: `LOG${Date.now()}`,
                deletedItemId: equipmentId,
                itemType: 'Equipment',
                deletedBy,
                deletedAt: new Date(),
                originalData: itemToDelete,
            };
            setDeletionLogs(prev => [logEntry, ...prev]);
            setEquipment(prev => prev.filter(e => e.id !== equipmentId));
        }
    }

    const updateInventory = (itemName: string, quantityChange: number) => {
        setInventoryItems(prevItems => {
            const newItems = prevItems.map(item => {
                if (item.description === itemName) {
                    const newQty = item.qty + quantityChange;
                    const newStatus = newQty <= 0 ? 'Out of Stock' : newQty <= item.reorderPoint ? 'Low Stock' : 'In Stock';
                    return { ...item, qty: newQty, status: newStatus };
                }
                return item;
            });
            return newItems;
        });
    };

    const saveBol = (bolData: Omit<BillOfLading, 'id' | 'documentUri'>, documentUri: string | null) => {
        const newBol: BillOfLading = {
            ...bolData,
            id: `BOL-HIST-${Date.now()}`,
            documentUri: documentUri
        };
        setBolHistory(prev => [newBol, ...prev]);
        return newBol;
    };

    const saveBolTemplate = (templateData: Omit<BolTemplate, 'id'>) => {
        const newTemplate: BolTemplate = {
            ...templateData,
            id: `BOL-TPL-${Date.now()}`,
        };
        setBolTemplates(prev => [...prev, newTemplate]);
    }

    const deleteBolTemplate = (templateId: string) => {
        const templateToDelete = bolTemplates.find(t => t.id === templateId);
        if (templateToDelete) {
            const logEntry: DeletionLog = {
                id: `LOG${Date.now()}`,
                deletedItemId: templateId,
                itemType: 'BolTemplate',
                deletedBy: currentUser?.id || 'system',
                deletedAt: new Date(),
                originalData: templateToDelete,
            };
            setDeletionLogs(prev => [logEntry, ...prev]);
            setBolTemplates(prev => prev.filter(t => t.id !== templateId));
        }
    }

    const addOrUpdateDirectDeposit = (employeeId: string, account: Omit<DirectDepositAccount, 'id'>) => {
        const newAccount = { ...account, id: `ACCT-${Date.now()}`};
        setEmployees(prev => prev.map(emp => {
            if (emp.id === employeeId) {
                const existingAccounts = emp.directDeposit || [];
                return { ...emp, directDeposit: [...existingAccounts, newAccount] };
            }
            return emp;
        }));
    };

    const deleteDirectDeposit = (employeeId: string, accountId: string) => {
        setEmployees(prev => prev.map(emp => {
            if (emp.id === employeeId) {
                const updatedAccounts = emp.directDeposit?.filter(acc => acc.id !== accountId);
                return { ...emp, directDeposit: updatedAccounts };
            }
            return emp;
        }));
    };


  return (
    <ScheduleContext.Provider value={{ shifts, employees, currentUser, holidays, timeOffRequests, registrations, yardEvents, expenseReports, receipts, trainingPrograms, trainingAssignments, warehouseDoors, parkingLanes, deletionLogs, timeClockEvents, localLoadBoards, loadBoardHub, appointments, officeAppointments, lostAndFound, loads, files, equipment, jobPostings, applicants, bolHistory, bolTemplates, inventoryItems, customers, availableStatuses, qualityHolds, salesOrders, w4Templates, handbooks, projects, tasks, crmTasks, crmContacts, companies, addCompany, addCrmContact, addCrmTask, updateCrmTaskStatus, addTask, updateTaskStatus, addTaskEvent, getHandbookById, updateHandbookSection, updateHandbookSectionDocument, addHandbookSection, addHandbook, deleteHandbook, updateHandbook, duplicateHandbook, addW4Template, updateW4Template, deleteW4Template, assignPickerToOrder, updateOrderItemStatus, completeOrderPicking, placeOnHold, releaseFromHold, scrapItem, addCustomer, updateCustomerStatus, addCustomStatus, addApplicant, updateApplicantStatus, addJobPosting, updateJobPostingStatus, deleteEquipment, addEquipment, addFile, deleteFile, permanentlyDeleteItem, shareHistoryLogs, logFileShare, moveTrailer, addOfficeAppointment, updateOfficeAppointmentStatus, addAppointment, updateAppointmentStatus, updateLoadBoardHubName, addLocalLoadBoard, deleteLocalLoadBoard, updateLocalLoadBoard, addShift, updateShift, deleteShift, addTimeOffRequest, approveTimeOffRequest, denyTimeOffRequest, registerUser, approveRegistration, denyRegistration, updateRegistration, getEmployeeById, updateEmployeeRole, updateEmployeeStatus, updateEmployee, deleteEmployee, addEmployee, bulkAddEmployees, updateEmployeeDocument, getEmployeeDocument, getYardEventById, addYardEvent, updateYardEventStatus, getExpenseReportById, setExpenseReports, receipts, setReceipts, getTrainingModuleById, assignTraining, unassignTraining, addWarehouseDoor, addParkingLane, restoreDeletedItem, addTimeClockEvent, updateTimeClockStatus, updateInventory, saveBol, saveBolTemplate, deleteBolTemplate, addOrUpdateDirectDeposit, deleteDirectDeposit }}>
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
