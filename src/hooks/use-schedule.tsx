

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
    itemType: 'Shift' | 'User' | 'File' | 'Equipment' | 'BolTemplate' | 'W4Template' | 'Handbook' | 'Note';
    deletedAt: Date;
    deletedBy: string; // User ID
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

export type DealStage = 'New' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export type Deal = {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: DealStage;
  closeDate: Date;
  ownerId: string; // Employee ID
}

export type Note = {
    id: string;
    title: string;
    content: string;
    date: Date;
    tags: string[];
}

export type Visitor = {
    id: string;
    name: string;
    company: string;
    visiting: string; // Employee name
    reason?: string;
    checkInTime: Date;
    checkOutTime?: Date;
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
  deals: Deal[];
  notes: Note[];
  visitors: Visitor[];
  addVisitor: (visitorData: Omit<Visitor, 'id' | 'checkInTime'>) => void;
  checkOutVisitor: (visitorId: string) => void;
  addNote: (note: Omit<Note, 'id' | 'date'>) => Note;
  updateNote: (noteId: string, updates: Partial<Omit<Note, 'id' | 'date'>>) => void;
  deleteNote: (noteId: string) => void;
  bulkAddNotes: (importedNotes: Partial<Note>[]) => void;
  addDeal: (dealData: Omit<Deal, 'id'>) => void;
  updateDealStage: (dealId: string, stage: DealStage) => void;
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

const initialNotes: Note[] = [
    { id: 'NOTE-1', title: 'Meeting Follow-up', content: 'Follow up with John Doe about the Q3 budget.', date: new Date(), tags: ['meeting', 'finance'] },
    { id: 'NOTE-2', title: 'Road Trip Ideas', content: 'Route 66 road trip, stop at the Grand Canyon.', date: new Date(new Date().setDate(new Date().getDate() - 1)), tags: ['personal', 'travel'] },
];

const mockEmployees: Employee[] = [
    { id: 'USR001', name: 'John Doe', role: 'Driver', status: 'Active', personnelId: 'JD-001', email: 'john.d@example.com', phoneNumber: '555-0101', workLocation: ['Site 1', 'Mobile'], payType: 'Hourly', payRate: 25.50 },
    { id: 'USR002', name: 'Jane Doe', role: 'Dispatcher', status: 'Active', personnelId: 'JD-002', email: 'jane.d@example.com', phoneNumber: '555-0102', workLocation: ['Work From Home'], payType: 'Salary', payRate: 60000 },
    { id: 'USR003', name: 'Mike Smith', role: 'Forklift', status: 'Active', personnelId: 'MS-001', email: 'mike.s@example.com', phoneNumber: '555-0103', workLocation: ['Warehouse'], payType: 'Hourly', payRate: 22.00 },
    { id: 'USR004', name: 'Emily Jones', role: 'Admin', status: 'Active', personnelId: 'EJ-001', email: 'emily.j@example.com', phoneNumber: '555-0104', workLocation: ['Site 1'], payType: 'Salary', payRate: 75000 },
    { id: 'USR005', name: 'Robert Brown', role: 'Manager', status: 'Active', personnelId: 'RB-001', email: 'robert.b@example.com', phoneNumber: '555-0105', workLocation: ['Site 1', 'Site 2'], payType: 'Salary', payRate: 90000 },
];

const today = new Date();
const initialShifts: Shift[] = [
    { id: 'S1', date: formatISO(today, { representation: 'date' }), employeeId: 'USR001', title: 'Route 101', startTime: '08:00', endTime: '16:00' },
    { id: 'S2', date: formatISO(today, { representation: 'date' }), employeeId: 'USR002', title: 'Dispatch AM', startTime: '06:00', endTime: '14:00' },
    { id: 'S3', date: formatISO(addDays(today, 1), { representation: 'date' }), employeeId: 'USR001', title: 'Route 202', startTime: '09:00', endTime: '17:00' },
];

const initialHolidays: Holiday[] = [
    { date: new Date(today.getFullYear(), 0, 1), name: 'New Year\'s Day' },
    { date: new Date(today.getFullYear(), 6, 4), name: 'Independence Day' },
    { date: new Date(today.getFullYear(), 11, 25), name: 'Christmas Day' },
];

const initialTimeOffRequests: TimeOffRequest[] = [
    { id: 'TOR001', employeeId: 'USR003', startDate: addDays(today, 10), endDate: addDays(today, 14), reason: 'Vacation', status: 'Approved' },
    { id: 'TOR002', employeeId: 'USR001', startDate: addDays(today, 5), endDate: addDays(today, 5), reason: 'Doctor\'s Appointment', status: 'Pending' },
];

const initialRegistrations: Registration[] = [
    { id: 'REG001', name: 'New Driver', email: 'new.driver@example.com', phoneNumber: '555-9999', role: 'Driver', status: 'Pending' },
];

const initialYardEvents: YardEvent[] = [
  { id: 'EVT001', transactionType: 'inbound', trailerId: 'TR53123', sealNumber: 'S12345', carrier: 'Knight-Swift', scac: 'KNX', driverName: 'John Doe', clerkName: 'Admin User', loadNumber: 'LD004', assignmentType: 'door_assignment', assignmentValue: 'D3', timestamp: new Date(new Date().setHours(new Date().getHours() - 3)), status: 'Loaded', history: [{type: 'status', change: 'Loaded', changedBy: 'Admin User', timestamp: new Date()}] },
  { id: 'EVT002', transactionType: 'inbound', trailerId: 'TR48991', sealNumber: 'S67890', carrier: 'J.B. Hunt', scac: 'JBHT', driverName: 'Jane Smith', clerkName: 'Admin User', loadNumber: 'LD002', assignmentType: 'lane_assignment', assignmentValue: 'L5', timestamp: new Date(new Date().setHours(new Date().getHours() - 2))},
  { id: 'EVT003', transactionType: 'inbound', trailerId: 'TR53456', sealNumber: 'S11223', carrier: 'Schneider', scac: 'SNDR', driverName: 'Mike Johnson', clerkName: 'Admin User', loadNumber: 'LD005', assignmentType: 'lost_and_found', timestamp: new Date(new Date().setHours(new Date().getHours() - 1))},
  { id: 'EVT004', transactionType: 'outbound', trailerId: 'TR12345', sealNumber: 'S33445', carrier: 'Werner', scac: 'WERN', driverName: 'Emily Davis', clerkName: 'Admin User', loadNumber: 'LD006', assignmentType: 'empty', timestamp: new Date(new Date().setHours(new Date().getHours() - 4)), dwellDays: 3 },
];

const initialExpenseReports: ExpenseReport[] = [
    { id: 'EXP001', employeeName: 'John Doe', date: '2024-07-20', description: 'Fuel for Trip #123', category: 'Fuel', amount: 150.75, status: 'Approved' },
    { id: 'EXP002', employeeName: 'Jane Doe', date: '2024-07-21', description: 'Team Lunch', category: 'Food', amount: 85.50, status: 'Pending' },
];

const initialReceipts: Receipt[] = [
    { id: 'REC001', employeeId: 'USR001', date: new Date(new Date().setDate(new Date().getDate() - 1)), vendor: 'Pilot', amount: 150.75, category: 'Fuel', receiptUri: 'https://picsum.photos/seed/receipt1/400/600', status: 'Approved', uploadDate: new Date(), reviewedBy: 'Emily Jones', reviewedAt: new Date() },
    { id: 'REC002', employeeId: 'USR002', date: new Date(new Date().setDate(new Date().getDate() - 2)), vendor: "Denny's", amount: 25.50, category: 'Food', receiptUri: null, status: 'Pending', uploadDate: new Date() },
];

const initialTrainingPrograms: TrainingProgram[] = [
    {
        id: 'PROG001',
        title: 'Driver Onboarding',
        description: 'Essential training for all new drivers.',
        modules: [
            { id: 'MOD001', title: 'Welcome to LogiFlow', description: 'Company overview and culture.', type: 'video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
            { id: 'MOD002', title: 'Safety Procedures', description: 'Detailed guide on yard and road safety.', type: 'document', content: 'Safety is our top priority. Always wear a high-visibility vest in the yard. Maintain a safe following distance on the road. Report all incidents immediately.', exam: [ { question: 'What is the first priority?', options: ['Speed', 'Safety', 'Fuel'], correctAnswer: 'Safety'}] },
        ]
    },
     {
        id: 'PROG002',
        title: 'Annual Compliance',
        description: 'Required annual training for all personnel.',
        modules: [
            { id: 'MOD003', title: 'Cybersecurity Awareness', description: 'Protecting company and personal data.', type: 'video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ]
    }
];

const initialTrainingAssignments: TrainingAssignment[] = [
    { id: 'TA001', employeeId: 'USR001', moduleId: 'MOD002', status: 'In Progress', assignedDate: new Date() },
];

const initialWarehouseDoors: string[] = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'];
const initialParkingLanes: string[] = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10'];
const initialDeletionLogs: DeletionLog[] = [];
const initialTimeClockEvents: TimeClockEvent[] = [
    { id: 'TCK001', employeeId: 'USR001', timestamp: new Date(new Date().setHours(new Date().getHours() - 8)).toISOString(), type: 'in', status: 'Approved' },
    { id: 'TCK002', employeeId: 'USR001', timestamp: new Date(new Date().setHours(new Date().getHours() - 4)).toISOString(), type: 'out', status: 'Approved'},
    { id: 'TCK003', employeeId: 'USR002', timestamp: new Date(new Date().setHours(new Date().getHours() - 9)).toISOString(), type: 'in', status: 'Approved' },
    { id: 'TCK004', employeeId: 'USR002', timestamp: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(), type: 'out', status: 'Approved' },
];
const initialLocalLoadBoards: LocalLoadBoard[] = [ { id: 'local-1', name: 'Local', number: 1 }];
const initialLoadBoardHub: LocalLoadBoard = { id: 'hub-1', name: 'Load Board HUB'};

const initialAppointments: Appointment[] = [
    { id: 'APP001', status: 'Scheduled', type: 'Inbound', carrier: 'Knight-Swift', scac: 'KNX', bolNumber: 'BOL123', poNumber: 'PO456', sealNumber: 'S789', driverName: 'John Smith', appointmentTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000) },
    { id: 'APP002', status: 'Arrived', type: 'Outbound', carrier: 'J.B. Hunt', scac: 'JBHT', bolNumber: 'BOL456', poNumber: 'PO789', sealNumber: 'S012', driverName: 'Jane Smith', appointmentTime: new Date(new Date().getTime() - 1 * 60 * 60 * 1000), door: 'D5' },
];

const initialOfficeAppointments: OfficeAppointment[] = [
    { id: 'OFF001', title: 'Q3 Planning Meeting', type: 'Meeting', attendees: ['Jane Doe', 'Mike Smith'], startTime: new Date(new Date().getTime() + 4 * 60 * 60 * 1000), endTime: new Date(new Date().getTime() + 5 * 60 * 60 * 1000), status: 'Scheduled' },
];

const initialLostAndFound: YardEvent[] = [];
const initialLoads: Load[] = [
    { id: "LD001", origin: "Los Angeles, CA", destination: "Phoenix, AZ", pickupDate: "2024-08-01", deliveryDate: "2024-08-02", rate: 1200, status: "Available", carrier: "Knight-Swift", scac: "KNX" },
    { id: "LD002", origin: "Chicago, IL", destination: "New York, NY", pickupDate: "2024-08-03", deliveryDate: "2024-08-05", rate: 2500, status: "Available", carrier: "J.B. Hunt", scac: "JBHT" },
    { id: "LD003", origin: "Dallas, TX", destination: "Atlanta, GA", pickupDate: "2024-08-05", deliveryDate: "2024-08-07", rate: 1800, status: "Pending", assignedTo: "Jane Doe", carrier: "Swift Logistics", scac: "SWFT", dispatcher: "Dispatcher Name" },
    { id: "LD004", origin: "Seattle, WA", destination: "Denver, CO", pickupDate: "2024-08-06", deliveryDate: "2024-08-08", rate: 2200, status: "In-Transit", assignedTo: "Mike Smith", carrier: "Knight-Swift", scac: "KNX", dispatcher: "Dispatcher Name" },
    { id: "LD005", origin: "Miami, FL", destination: "Houston, TX", pickupDate: "2024-08-08", deliveryDate: "2024-08-10", rate: 2000, status: "Delivered", assignedTo: "Jane Doe", carrier: "Swift Logistics", scac: "SWFT", dispatcher: "Dispatcher Name" },
];
const initialFiles: File[] = [
    { id: 'FILE001', name: 'Q2_Financials.xlsx', type: 'Excel', size: 1200000, path: '/documents/financials/', dateAdded: new Date(2024, 6, 15) },
    { id: 'FILE002', name: 'Safety_Manual_v3.pdf', type: 'PDF', size: 2500000, path: '/documents/safety/', dateAdded: new Date(2024, 5, 20) },
    { id: 'FILE003', name: 'Truck_Inspection.jpg', type: 'Image', size: 4500000, path: '/uploads/images/', dateAdded: new Date() },
];

const initialEquipment: Equipment[] = [
    { id: 'EQ001', name: 'TRK-101', type: 'Truck', make: 'Freightliner', model: 'Cascadia', vin: '1ABC123XYZ', fuelType: 'Diesel', registrationExpiry: new Date('2025-08-31'), inspectionExpiry: new Date('2025-02-28') },
    { id: 'EQ002', name: 'TRL-502', type: 'Trailer', make: 'Wabash', model: 'Duraplate', vin: '2DEF456ABC', fuelType: 'Diesel', registrationExpiry: new Date('2025-06-30'), inspectionExpiry: new Date('2025-01-31') },
    { id: 'EQ003', name: 'VAN-03', type: 'Van', make: 'Ford', model: 'Transit', vin: '3GHI789DEF', fuelType: 'Gasoline', registrationExpiry: new Date('2024-12-15'), inspectionExpiry: new Date('2024-11-30') },
];

const initialJobPostings: JobPosting[] = [
    { id: 'JOB001', title: 'Long-Haul Driver', location: 'Remote', type: 'Full-time', description: 'Seeking experienced long-haul drivers for cross-country routes.', status: 'Open', datePosted: new Date(new Date().setDate(new Date().getDate() - 10)) },
    { id: 'JOB002', title: 'Warehouse Associate', location: 'Site 1', type: 'Part-time', description: 'Part-time warehouse associate needed for evening shifts.', status: 'Open', datePosted: new Date(new Date().setDate(new Date().getDate() - 5)) },
];

const initialApplicants: Applicant[] = [
    { id: 'APP001', name: 'Alice Johnson', email: 'alice.j@email.com', phone: '555-1111', applyingFor: 'JOB001', status: 'Applied', applicationDate: new Date() },
    { id: 'APP002', name: 'Bob Williams', email: 'bob.w@email.com', phone: '555-2222', applyingFor: 'JOB002', status: 'Interview', applicationDate: new Date(new Date().setDate(new Date().getDate() - 2)) },
];

const initialBolHistory: BillOfLading[] = [
    { id: 'BOL-1625101', bolNumber: 'BOL-1625101', customer: 'Customer A', origin: 'New York, NY', destination: 'Los Angeles, CA', deliveryDate: '2024-09-01', carrier: 'LogiFlow Transport', documentUri: "data:text/html;base64,PHA+SGVsbG8sIFdvcmxkITwvcD4=" },
];
const initialBolTemplates: BolTemplate[] = [];

const initialInventoryItems: InventoryItem[] = [
    { sku: 'SKU12345', description: '1/2" Steel Bolts', location: 'Aisle 3, Bin 4', qty: 1250, reorderPoint: 500, status: 'In Stock', price: 0.50 },
    { sku: 'SKU67890', description: '3/4" Nylon Washers', location: 'Aisle 5, Bin 2', qty: 450, reorderPoint: 500, status: 'Low Stock', price: 0.10 },
    { sku: 'SKU54321', description: '2" Wood Screws', location: 'Aisle 1, Bin 1', qty: 3000, reorderPoint: 1000, status: 'In Stock', price: 0.25 },
    { sku: 'SKU98765', description: 'M8 Hex Nuts', location: 'Aisle 3, Bin 5', qty: 0, reorderPoint: 200, status: 'Out of Stock', price: 0.15 },
];

const initialCustomers: Customer[] = [
    { id: 'CUST-001', name: 'John Smith', company: 'Smith Construction', email: 'john@smithcon.com', phone: '555-1234', status: 'Active', dateAdded: new Date('2023-05-10'), items: ['Screws', 'Bolts'], destination: '123 Main St, Anytown, USA' },
    { id: 'CUST-002', name: 'Jane Williams', company: 'Williams Manufacturing', email: 'jane@williamsmfg.com', phone: '555-5678', status: 'Active', dateAdded: new Date('2023-08-15'), items: ['Washers', 'Nuts'], destination: '456 Oak Ave, Otherville, USA' },
];

const initialAvailableStatuses: YardEventStatus[] = ['Checked In', 'Loaded', 'Empty', 'Blocked', 'Repair Needed', 'Rejected', 'Late', 'Early', 'Product on hold', 'Exited', 'Waiting for dock', 'At Dock Door', 'At Parking Lane'];

const initialShareHistoryLogs: ShareHistoryLog[] = [];

const initialQualityHolds: QualityHold[] = [
    { id: 'QH001', itemId: 'SKU67890', reason: 'Damaged Goods', holdDate: new Date(), placedBy: 'Admin User', status: 'On Hold', notes: 'Packaging was torn on arrival.' },
];

const initialSalesOrders: SalesOrder[] = [
    { id: 'SO-12345', customer: 'Smith Construction', destination: 'Los Angeles, CA', shipDate: new Date(), status: 'Pending', items: [{ sku: 'SKU12345', description: '1/2" Steel Bolts', quantity: 100, location: 'A3-B4', picked: false }, { sku: 'SKU67890', description: '3/4" Nylon Washers', quantity: 200, location: 'A5-B2', picked: false }] },
    { id: 'SO-12346', customer: 'Williams Manufacturing', destination: 'Chicago, IL', shipDate: new Date(), status: 'Picking', assignedPicker: 'USR003', items: [{ sku: 'SKU54321', description: '2" Wood Screws', quantity: 50, location: 'A1-B1', picked: true }], pickStartTime: new Date(Date.now() - 30 * 60000) },
    { id: 'SO-12347', customer: 'Rapid Builders', destination: 'Miami, FL', shipDate: new Date(), status: 'Staged', assignedPicker: 'USR003', items: [{ sku: 'SKU98765', description: 'M8 Hex Nuts', quantity: 1000, location: 'A3-B5', picked: true }], pickStartTime: new Date(Date.now() - 60 * 60000), pickEndTime: new Date(Date.now() - 45 * 60000), bolNumber: 'BOL-12347' },
];

const initialW4Templates: W4Template[] = [
  { id: 'W4-2024-FED', name: '2024 Federal W-4', documentUri: 'https://www.irs.gov/pub/irs-pdf/fw4.pdf', uploadedAt: new Date('2024-01-01') },
];

const initialHandbooks: Handbook[] = [
    { id: 'HB-2024', name: '2024 Employee Handbook', documentUri: null, uploadedAt: new Date('2024-01-01'), content: { lastUpdated: 'January 1, 2024', sections: [{ title: 'Introduction', content: 'Welcome to LogiFlow!'}, { title: 'Code of Conduct', content: 'All employees are expected to maintain professional behavior.'}] } },
];

const initialProjects: Project[] = [
    { id: 'PROJ-1', name: 'Q3 Marketing Campaign', description: 'Launch campaign for new logistics services.', team: ['USR002', 'USR004'], dueDate: new Date('2024-09-30') },
    { id: 'PROJ-2', name: 'Website V2 Development', description: 'Complete redesign and development of the company website.', team: ['USR005'], dueDate: new Date('2024-12-31') },
];

const initialTasks: Task[] = [
    { id: 'TASK-1', title: 'Design new ad creative', description: 'Create visuals for social media.', assigneeIds: ['USR004'], status: 'In Progress', projectId: 'PROJ-1', dueDate: new Date('2024-08-15'), events: [{id: 'EVT-1', type: 'note', author: 'Admin User', content: 'Initial draft looks great!', timestamp: new Date()}] },
    { id: 'TASK-2', title: 'Develop landing page', description: 'Code the new landing page from Figma designs.', assigneeIds: ['USR005'], status: 'To Do', projectId: 'PROJ-2', dueDate: new Date('2024-09-01'), events: [] },
];

const initialCrmTasks: CrmTask[] = [
    { id: 'CRM-TASK-1', title: 'Follow up with Acme Inc.', status: 'To Do', priority: 'High', dueDate: new Date(), taskType: 'Call', assignedTo: 'USR005', associatedWith: 'Acme Inc.' },
];

const initialCrmContacts: CrmContact[] = [
  { id: 'CRM-CONT-1', name: 'John Smith', email: 'john@acme.com', phone: '555-1111', company: 'Acme Inc.', status: 'Customer', dateAdded: new Date() },
];

const initialCompanies: Company[] = [
    { id: 'COMP-1', name: 'Acme Inc.', industry: 'Manufacturing', status: 'Customer', primaryContact: 'John Smith', dateAdded: new Date(), website: 'https://acme.com' },
];

const initialDeals: Deal[] = [
    { id: 'DEAL-001', title: 'Q4 Logistics Contract', company: 'Acme Inc.', value: 50000, stage: 'Proposal', closeDate: new Date('2024-09-30'), ownerId: 'USR005' },
    { id: 'DEAL-002', title: 'New Warehouse Services', company: 'Globex Corp.', value: 75000, stage: 'Qualification', closeDate: new Date('2024-10-15'), ownerId: 'USR005' },
    { id: 'DEAL-003', title: 'West Coast Distribution', company: 'Stark Industries', value: 120000, stage: 'New', closeDate: new Date('2024-09-20'), ownerId: 'USR005' },
];

const initialVisitors: Visitor[] = [
    { id: 'VISIT-001', name: 'Laura Palmer', company: 'One-Eyed Jacks', visiting: 'Emily Jones', checkInTime: new Date(Date.now() - 30 * 60000), reason: 'Quarterly Review' },
];


const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [crmContacts, setCrmContacts] = useState<CrmContact[]>(initialCrmContacts);
  const [crmTasks, setCrmTasks] = useState<CrmTask[]>(initialCrmTasks);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [handbooks, setHandbooks] = useState<Handbook[]>(initialHandbooks);
  const [w4Templates, setW4Templates] = useState<W4Template[]>(initialW4Templates);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(initialSalesOrders);
  const [qualityHolds, setQualityHolds] = useState<QualityHold[]>(initialQualityHolds);
  const [availableStatuses, setAvailableStatuses] = useState<YardEventStatus[]>(initialAvailableStatuses);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [bolTemplates, setBolTemplates] = useState<BolTemplate[]>(initialBolTemplates);
  const [bolHistory, setBolHistory] = useState<BillOfLading[]>(initialBolHistory);
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(initialJobPostings);
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [loads, setLoads] = useState<Load[]>(initialLoads);
  const [lostAndFound, setLostAndFound] = useState<YardEvent[]>(initialLostAndFound);
  const [officeAppointments, setOfficeAppointments] = useState<OfficeAppointment[]>(initialOfficeAppointments);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [loadBoardHub, setLoadBoardHub] = useState<LocalLoadBoard>(initialLoadBoardHub);
  const [localLoadBoards, setLocalLoadBoards] = useState<LocalLoadBoard[]>(initialLocalLoadBoards);
  const [timeClockEvents, setTimeClockEvents] = useState<TimeClockEvent[]>(initialTimeClockEvents);
  const [deletionLogs, setDeletionLogs] = useState<DeletionLog[]>(initialDeletionLogs);
  const [parkingLanes, setParkingLanes] = useState<string[]>(initialParkingLanes);
  const [warehouseDoors, setWarehouseDoors] = useState<string[]>(initialWarehouseDoors);
  const [trainingAssignments, setTrainingAssignments] = useState<TrainingAssignment[]>(initialTrainingAssignments);
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>(initialTrainingPrograms);
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts);
  const [expenseReports, setExpenseReports] = useState<ExpenseReport[]>(initialExpenseReports);
  const [yardEvents, setYardEvents] = useState<YardEvent[]>(initialYardEvents);
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>(initialTimeOffRequests);
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [currentUser, setCurrentUser] = useState<Employee | null>(mockEmployees.find(e => e.role === 'Admin') || null);
  const [shareHistoryLogs, setShareHistoryLogs] = useState<ShareHistoryLog[]>(initialShareHistoryLogs);
  const [visitors, setVisitors] = useState<Visitor[]>(initialVisitors);

  const addVisitor = (visitorData: Omit<Visitor, 'id' | 'checkInTime'>) => {
    const newVisitor: Visitor = {
        ...visitorData,
        id: `VISITOR-${Date.now()}`,
        checkInTime: new Date(),
    };
    setVisitors(prev => [newVisitor, ...prev]);
  };
  
  const checkOutVisitor = (visitorId: string) => {
    setVisitors(prev => prev.map(v => v.id === visitorId ? { ...v, checkOutTime: new Date() } : v));
  };

  const addNote = (note: Omit<Note, 'id' | 'date'>) => {
    const newNote = { ...note, id: `NOTE-${Date.now()}`, date: new Date() };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (noteId: string, updates: Partial<Omit<Note, 'id' | 'date'>>) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, ...updates, date: new Date() } : note
    ));
  };

  const deleteNote = (noteId: string) => {
    const noteToDelete = notes.find(n => n.id === noteId);
    if (noteToDelete) {
        const logEntry: DeletionLog = {
            id: `LOG${Date.now()}`,
            deletedItemId: noteId,
            itemType: 'Note',
            deletedBy: currentUser?.id || 'system',
            deletedAt: new Date(),
            originalData: noteToDelete,
        };
        setDeletionLogs(prev => [logEntry, ...prev]);
        setNotes(prev => prev.filter(note => note.id !== noteId));
    }
  };
  
   const bulkAddNotes = (importedNotes: Partial<Note>[]) => {
        const newNotes = importedNotes.map((note, index) => ({
            id: `NOTE-IMP-${Date.now()}-${index}`,
            title: note.title || 'Untitled Note',
            content: note.content || '',
            date: note.date ? new Date(note.date) : new Date(),
            tags: note.tags || [],
        }));
        setNotes(prev => [...prev, ...newNotes]);
    };

// ... other context provider logic ...
// NOTE: This is a simplified representation. The full `useSchedule` file is very long.
// I will just add the new state and functions to the existing context value.
  const addDeal = (dealData: Omit<Deal, 'id'>) => {
    const newDeal = { ...dealData, id: `DEAL-${Date.now()}` };
    setDeals(prev => [...prev, newDeal]);
  };

  const updateDealStage = (dealId: string, stage: DealStage) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage } : d));
  };

  const addCompany = (companyData: Omit<Company, 'id' | 'dateAdded'>) => {
    const newCompany: Company = { ...companyData, id: `COMP-${Date.now()}`, dateAdded: new Date() };
    setCompanies(prev => [newCompany, ...prev]);
  };

  const addCrmContact = (contactData: Omit<CrmContact, 'id' | 'dateAdded'>) => {
    const newContact: CrmContact = { ...contactData, id: `CRM-CONT-${Date.now()}`, dateAdded: new Date() };
    setCrmContacts(prev => [newContact, ...prev]);
  };

  const addCrmTask = (taskData: Omit<CrmTask, 'id' | 'status'>) => {
    const newTask: CrmTask = { ...taskData, id: `CRM-TASK-${Date.now()}`, status: 'To Do' };
    setCrmTasks(prev => [newTask, ...prev]);
  };

  const updateCrmTaskStatus = (taskId: string, status: CrmTaskStatus) => {
    setCrmTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'events'>) => {
    const newTask: Task = { ...taskData, id: `TASK-${Date.now()}`, events: [] };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const addTaskEvent = (taskId: string, eventData: Omit<TaskEvent, 'id' | 'author'>) => {
    const newEvent: TaskEvent = {
        ...eventData,
        id: `EVT-${Date.now()}`,
        author: currentUser?.name || 'System',
    };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, events: [...(t.events || []), newEvent] } : t));
  };

  const getHandbookById = (id: string) => handbooks.find(hb => hb.id === id) || null;

  const updateHandbookSection = (handbookId: string, sectionTitle: string, content: string) => {
    setHandbooks(prev => prev.map(hb => 
        hb.id === handbookId && hb.content 
        ? { ...hb, content: { ...hb.content, sections: hb.content.sections.map(s => s.title === sectionTitle ? {...s, content} : s), lastUpdated: format(new Date(), 'MMMM d, yyyy') } }
        : hb
    ));
  };

  const addHandbookSection = (handbookId: string, title: string, content: string) => {
    setHandbooks(prev => prev.map(hb => 
      hb.id === handbookId && hb.content
      ? { ...hb, content: { ...hb.content, sections: [...hb.content.sections, { title, content }], lastUpdated: format(new Date(), 'MMMM d, yyyy') } }
      : hb
    ));
  };
  
  const updateHandbookSectionDocument = (handbookId: string, sectionTitle: string, documentUri: string | null) => {
    setHandbooks(prev => prev.map(hb => 
      hb.id === handbookId && hb.content
      ? { ...hb, content: { ...hb.content, sections: hb.content.sections.map(s => s.title === sectionTitle ? { ...s, documentUri } : s) } }
      : hb
    ));
  };

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
      setDeletionLogs(prev => [...prev, { id: `LOG-${Date.now()}`, deletedItemId: id, itemType: 'Handbook', deletedAt: new Date(), deletedBy: currentUser?.id || 'system', originalData: handbookToDelete }]);
      setHandbooks(prev => prev.filter(hb => hb.id !== id));
    }
  };

  const duplicateHandbook = (id: string) => {
    const original = handbooks.find(hb => hb.id === id);
    if (original) {
        const newHandbook: Handbook = {
            ...original,
            id: `HB-${Date.now()}`,
            name: `${original.name} (Copy)`,
            uploadedAt: new Date(),
        };
        setHandbooks(prev => [newHandbook, ...prev]);
    }
  };

  const updateHandbook = (updatedHandbook: Handbook) => {
    setHandbooks(prev => prev.map(hb => hb.id === updatedHandbook.id ? updatedHandbook : hb));
  };
  
  const addW4Template = (name: string, documentUri: string) => {
    const newTemplate: W4Template = {
        id: `W4-${Date.now()}`,
        name,
        documentUri,
        uploadedAt: new Date(),
    };
    setW4Templates(prev => [newTemplate, ...prev]);
  };
  
  const updateW4Template = (id: string, name: string) => {
    setW4Templates(prev => prev.map(t => t.id === id ? { ...t, name } : t));
  };

  const deleteW4Template = (id: string) => {
     const templateToDelete = w4Templates.find(t => t.id === id);
     if (templateToDelete) {
         setDeletionLogs(prev => [...prev, { id: `LOG-${Date.now()}`, deletedItemId: id, itemType: 'W4Template', deletedAt: new Date(), deletedBy: currentUser?.id || 'system', originalData: templateToDelete }]);
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
                items: o.items.map(item => item.sku === sku ? { ...item, picked } : item)
            }
        }
        return o;
    }));
  };
  
  const completeOrderPicking = (orderId: string) => {
      setSalesOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Staged', pickEndTime: new Date() } : o));
  };

  const placeOnHold = (itemId: string, reason: string, notes?: string) => {
    const newHold: QualityHold = {
        id: `QH-${Date.now()}`,
        itemId,
        reason,
        notes,
        holdDate: new Date(),
        placedBy: currentUser?.name || 'System',
        status: 'On Hold',
    };
    setQualityHolds(prev => [newHold, ...prev]);
    // Also update inventory item status
    setInventoryItems(prev => prev.map(item => item.sku === itemId ? { ...item, status: 'Low Stock' } : item));
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
        id: `CUST-${Date.now()}`,
        dateAdded: new Date(),
    };
    setCustomers(prev => [newCustomer, ...prev]);
  };
  
  const updateCustomerStatus = (customerId: string, status: Customer['status']) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, status } : c));
  };

  const addCustomStatus = (newStatus: string) => {
    if (!availableStatuses.includes(newStatus as YardEventStatus)) {
      setAvailableStatuses(prev => [...prev, newStatus as YardEventStatus]);
    }
  };
  
  const addApplicant = (applicantData: Omit<Applicant, 'id' | 'applicationDate'>) => {
    const newApplicant: Applicant = {
        ...applicantData,
        id: `APP-${Date.now()}`,
        applicationDate: new Date(),
    };
    setApplicants(prev => [newApplicant, ...prev]);
  };

  const updateApplicantStatus = (applicantId: string, status: ApplicantStatus) => {
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status } : a));
  };

  const addJobPosting = (jobPostingData: Omit<JobPosting, 'id' | 'datePosted'>) => {
      const newPosting: JobPosting = {
          ...jobPostingData,
          id: `JOB-${Date.now()}`,
          datePosted: new Date(),
      };
      setJobPostings(prev => [newPosting, ...prev]);
  };
  
  const updateJobPostingStatus = (jobPostingId: string, status: JobPosting['status']) => {
    setJobPostings(prev => prev.map(j => j.id === jobPostingId ? { ...j, status } : j));
  };

  const addEquipment = (equipmentData: Omit<Equipment, 'id'>) => {
    const newEquipment: Equipment = {
        ...equipmentData,
        id: `EQ-${Date.now()}`,
    };
    setEquipment(prev => [newEquipment, ...prev]);
  };

  const deleteEquipment = (equipmentId: string, deletedBy: string) => {
    const itemToDelete = equipment.find(eq => eq.id === equipmentId);
    if (itemToDelete) {
        setDeletionLogs(prev => [...prev, { id: `LOG-${Date.now()}`, deletedItemId: equipmentId, itemType: 'Equipment', deletedAt: new Date(), deletedBy, originalData: itemToDelete }]);
        setEquipment(prev => prev.filter(eq => eq.id !== equipmentId));
    }
  };

  const addFile = (fileData: Omit<File, 'id'>) => {
    const newFile: File = {
        ...fileData,
        id: `FILE-${Date.now()}`,
    };
    setFiles(prev => [newFile, ...prev]);
  };

  const deleteFile = (fileId: string, deletedBy: string) => {
    const itemToDelete = files.find(f => f.id === fileId);
    if (itemToDelete) {
        setDeletionLogs(prev => [...prev, { id: `LOG-${Date.now()}`, deletedItemId: fileId, itemType: 'File', deletedAt: new Date(), deletedBy, originalData: itemToDelete }]);
        setFiles(prev => prev.filter(f => f.id !== fileId));
    }
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
  
  const moveTrailer = (eventId: string, toLocationType: 'lane' | 'door', toLocationId: string, fromLost: boolean = false) => {
    const event = fromLost ? lostAndFound.find(e => e.id === eventId) : yardEvents.find(e => e.id === eventId);
    if (!event) throw new Error("Trailer event not found.");

    const destinationIsOccupied = yardEvents.some(
      (e) => e.assignmentType.startsWith(toLocationType) && e.assignmentValue === toLocationId && e.transactionType === 'inbound'
    );
    
    if (destinationIsOccupied) {
        const movedToLost: YardEvent = {
            ...event,
            id: `EVT-MV-L-${Date.now()}`,
            transactionType: 'move',
            assignmentType: 'lost_and_found',
            assignmentValue: undefined,
            timestamp: new Date(),
            history: [...(event.history || []), { type: 'assignment', change: `Moved from ${event.assignmentType.replace(/_/g, ' ')} ${event.assignmentValue} to Lost & Found`, notes: `Destination ${toLocationId} was occupied.`, changedBy: 'System', timestamp: new Date() }]
        };
        setLostAndFound(prev => [...prev, movedToLost]);
        // Remove from current location
        setYardEvents(prev => prev.map(e => e.id === event.id ? { ...e, transactionType: 'outbound' } : e));
        
        throw new Error(`Destination ${toLocationId} is occupied. Trailer has been moved to Lost & Found.`);
    }

    const newMoveEvent: YardEvent = {
        ...event,
        id: `EVT-MV-${Date.now()}`,
        transactionType: 'inbound', // it's now inbound at the new location
        assignmentType: `${toLocationType}_assignment`,
        assignmentValue: toLocationId,
        timestamp: new Date(),
        history: [...(event.history || []), { type: 'assignment', change: `Moved to ${toLocationType.replace('_', ' ')} ${toLocationId}`, changedBy: currentUser?.name || 'System', timestamp: new Date() }]
    };
    
    // Set old location as outbound
    setYardEvents(prev => prev.map(e => e.id === eventId ? {...e, transactionType: 'outbound'} : e));
    setYardEvents(prev => [newMoveEvent, ...prev]);
    
    if (fromLost) {
        setLostAndFound(prev => prev.filter(e => e.id !== eventId));
    }
  };
  
  const addOfficeAppointment = (appointment: Omit<OfficeAppointment, 'id' | 'status'>) => {
    const newAppointment = { ...appointment, id: `OFF-APP-${Date.now()}`, status: 'Scheduled' as const };
    setOfficeAppointments(prev => [newAppointment, ...prev]);
    return newAppointment;
  };
  
  const updateOfficeAppointmentStatus = (appointmentId: string, status: OfficeAppointment['status']) => {
    setOfficeAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status } : a));
  };
  
  const addAppointment = (appointment: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment = { ...appointment, id: `APP-${Date.now()}`, status: 'Scheduled' as const };
    setAppointments(prev => [newAppointment, ...prev]);
    return newAppointment;
  };

  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status } : a));
  };
  
  const updateLoadBoardHubName = (name: string) => {
      setLoadBoardHub(prev => ({ ...prev, name }));
  };

  const addLocalLoadBoard = () => {
    const newBoardNumber = Math.max(0, ...localLoadBoards.map(b => b.number || 0)) + 1;
    const newBoard: LocalLoadBoard = {
      id: `local-${Date.now()}`,
      name: 'Local',
      number: newBoardNumber
    };
    setLocalLoadBoards(prev => [...prev, newBoard]);
  };

  const deleteLocalLoadBoard = (id: string) => {
    if (localLoadBoards.length > 1) {
      setLocalLoadBoards(prev => prev.filter(b => b.id !== id));
    }
  };

  const updateLocalLoadBoard = (id: string, name: string, number?: number) => {
    setLocalLoadBoards(prev => prev.map(b => b.id === id ? { ...b, name, number } : b));
  };
  
  const addShift = (shift: Omit<Shift, 'id'>) => {
    const newShift = { ...shift, id: `S${Date.now()}` };
    setShifts(prev => [...prev, newShift]);
  };
  
  const updateShift = (updatedShift: Shift) => {
      setShifts(shifts.map(shift => shift.id === updatedShift.id ? updatedShift : shift));
  };
  
  const deleteShift = (shiftId: string, deletedBy: string) => {
    const shiftToDelete = shifts.find(s => s.id === shiftId);
    if(shiftToDelete) {
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
        setShifts(shifts.filter(s => s.id !== shiftId));
    }
  };

  const addTimeOffRequest = (request: Omit<TimeOffRequest, 'id' | 'status' | 'employeeId'>) => {
    if (!currentUser) return;
    const newRequest = { ...request, id: `TOR${Date.now()}`, status: 'Pending' as const, employeeId: currentUser.id };
    setTimeOffRequests(prev => [newRequest, ...prev]);
  };
  
  const approveTimeOffRequest = (requestId: string) => {
    setTimeOffRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'Approved' } : req));
  };
  
  const denyTimeOffRequest = (requestId: string) => {
    setTimeOffRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'Denied' } : req));
  };

  const registerUser = (user: Omit<Registration, 'id' | 'status'>) => {
    const newRegistration = { ...user, id: `REG${Date.now()}`, status: 'Pending' as const };
    setRegistrations(prev => [newRegistration, ...prev]);
  };

  const approveRegistration = (registrationId: string) => {
    const registration = registrations.find(r => r.id === registrationId);
    if (registration) {
      const newEmployee: Employee = {
        id: `USR${Date.now()}`,
        personnelId: `${registration.name.split(' ').map(n=>n[0]).join('')}-${String(employees.length).padStart(3, '0')}`,
        name: registration.name,
        email: registration.email,
        phoneNumber: registration.phoneNumber,
        role: registration.role,
        status: 'Active',
      };
      setEmployees(prev => [newEmployee, ...prev]);
      setRegistrations(prev => prev.filter(r => r.id !== registrationId));
    }
  };

  const denyRegistration = (registrationId: string) => {
    setRegistrations(prev => prev.filter(r => r.id !== registrationId));
  };
  
  const updateRegistration = (updatedRegistration: Registration) => {
      setRegistrations(prev => prev.map(r => r.id === updatedRegistration.id ? updatedRegistration : r));
  };
  
  const getEmployeeById = (id: string): Employee | null => {
      return employees.find(e => e.id === id) || null;
  }

  const updateEmployeeRole = (employeeId: string, role: EmployeeRole) => {
    setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, role } : emp));
  };

  const updateEmployeeStatus = (employeeId: string, status: 'Active' | 'Inactive') => {
    setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, status } : emp));
  };

  const updateEmployee = (updatedEmployee: Employee) => {
      setEmployees(prev => prev.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));
  };
  
  const addEmployee = (employeeData: Omit<Employee, 'id' | 'personnelId' | 'status'>) => {
      const newId = `USR${Date.now()}`;
      const newEmployee: Employee = {
          ...employeeData,
          id: newId,
          personnelId: `${employeeData.name.split(' ').map(n=>n[0]).join('')}-${String(employees.length).padStart(3, '0')}`,
          status: 'Active',
      };
      setEmployees(prev => [newEmployee, ...prev]);
  };
  
  const bulkAddEmployees = (employeeData: Omit<Employee, 'id' | 'personnelId' | 'status'>[]) => {
    const newEmployees = employeeData.map((emp, index) => {
        const newId = `USR${Date.now() + index}`;
        return {
            ...emp,
            id: newId,
            personnelId: `${emp.name.split(' ').map(n=>n[0]).join('')}-${String(employees.length + index).padStart(3, '0')}`,
            status: 'Active' as const
        }
    });
    setEmployees(prev => [...prev, ...newEmployees]);
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
      }
  };

  const updateEmployeeDocument = (employeeId: string, documentDataUri: string | null) => {
      setEmployees(prev => prev.map(e => e.id === employeeId ? { ...e, documentDataUri } : e));
  }

  const getEmployeeDocument = (employeeId: string) => {
      return employees.find(e => e.id === employeeId)?.documentDataUri || null;
  }

  const getYardEventById = (id: string) => {
    return yardEvents.find(event => event.id === id) || null;
  }

  const addYardEvent = (eventData: Omit<YardEvent, 'id' | 'timestamp' | 'clerkName' | 'dwellDays'>, documentDataUri: string | null) => {
    const newEvent: YardEvent = {
      ...eventData,
      id: `EVT${Date.now()}`,
      timestamp: new Date(),
      clerkName: currentUser?.name || 'System',
      documentDataUri,
    };
    
    setYardEvents(prev => {
        // If it's an outbound, find the corresponding inbound and calculate dwell time
        if (newEvent.transactionType === 'outbound') {
            const inboundEvent = prev.find(e => e.trailerId === newEvent.trailerId && e.transactionType === 'inbound');
            if (inboundEvent) {
                const dwellDays = differenceInDays(newEvent.timestamp, new Date(inboundEvent.timestamp));
                // We don't add the outbound as a new event, but update the original inbound one
                return prev.map(e => e.id === inboundEvent.id ? { ...e, transactionType: 'outbound', dwellDays } : e);
            }
        }
        return [newEvent, ...prev];
    });
  };

  const updateYardEventStatus = (eventId: string, status: YardEventStatus, notes?: string) => {
    setYardEvents(prev => prev.map(e => {
        if (e.id === eventId) {
            const historyEntry: YardEventHistory = {
                type: 'status',
                change: `Status changed to ${status}`,
                notes,
                changedBy: currentUser?.name || 'System',
                timestamp: new Date(),
            };
            return { ...e, status, statusNotes: notes, history: [...(e.history || []), historyEntry] };
        }
        return e;
    }));
  };

  const getExpenseReportById = (id: string) => {
    return expenseReports.find(r => r.id === id) || null;
  };
  
  const getTrainingModuleById = (id: string) => {
    for (const program of trainingPrograms) {
        const module = program.modules.find(m => m.id === id);
        if (module) return module;
    }
    return null;
  };

  const assignTraining = (employeeId: string, moduleId: string) => {
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
    const upperId = doorId.toUpperCase();
    if (warehouseDoors.includes(upperId) || parkingLanes.includes(upperId)) {
      throw new Error(`Location ID "${upperId}" already exists.`);
    }
    setWarehouseDoors(prev => [...prev, upperId].sort((a,b) => a.localeCompare(b, undefined, { numeric: true })));
  };

  const addParkingLane = (laneId: string) => {
    const upperId = laneId.toUpperCase();
     if (warehouseDoors.includes(upperId) || parkingLanes.includes(upperId)) {
      throw new Error(`Location ID "${upperId}" already exists.`);
    }
    setParkingLanes(prev => [...prev, upperId].sort((a,b) => a.localeCompare(b, undefined, { numeric: true })));
  };

  const restoreDeletedItem = (logId: string) => {
    const logEntry = deletionLogs.find(l => l.id === logId);
    if (!logEntry) return;

    switch (logEntry.itemType) {
        case 'Shift':
            setShifts(prev => [...prev, logEntry.originalData]);
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
         case 'Note':
            setNotes(prev => [...prev, logEntry.originalData]);
            break;
        // ... add cases for other types
    }
    setDeletionLogs(prev => prev.filter(l => l.id !== logId));
  };
  
  const permanentlyDeleteItem = (logId: string) => {
      setDeletionLogs(prev => prev.filter(l => l.id !== logId));
  };

  const addTimeClockEvent = (event: Omit<TimeClockEvent, 'id' | 'timestamp'>) => {
    const newEvent: TimeClockEvent = {
        ...event,
        id: `TCK${Date.now()}`,
        timestamp: new Date().toISOString(),
    };
    if (event.type === 'in') {
        newEvent.status = 'Pending';
    }

    setTimeClockEvents(prev => [newEvent, ...prev]);
  };
  
  const updateTimeClockStatus = (clockInId: string, status: 'Approved' | 'Denied') => {
      setTimeClockEvents(prev => prev.map(e => e.id === clockInId ? {...e, status} : e));
  };

  const updateInventory = (itemName: string, quantityChange: number) => {
    setInventoryItems(prev => prev.map(item => {
        if (item.description === itemName) {
            const newQty = item.qty + quantityChange;
            let newStatus: InventoryItem['status'] = 'In Stock';
            if (newQty <= 0) newStatus = 'Out of Stock';
            else if (newQty <= item.reorderPoint) newStatus = 'Low Stock';
            return { ...item, qty: newQty, status: newStatus };
        }
        return item;
    }));
  };

  const saveBol = (bolData: Omit<BillOfLading, 'id' | 'documentUri'>, documentUri: string | null): BillOfLading => {
    const newBol: BillOfLading = {
      ...bolData,
      id: bolData.bolNumber,
      documentUri
    };
    setBolHistory(prev => [newBol, ...prev]);
    return newBol;
  };
  
  const saveBolTemplate = (templateData: Omit<BolTemplate, 'id'>) => {
      const newTemplate: BolTemplate = {
          ...templateData,
          id: `BOL-TPL-${Date.now()}`,
      };
      setBolTemplates(prev => [newTemplate, ...prev]);
  };

  const deleteBolTemplate = (templateId: string) => {
      const templateToDelete = bolTemplates.find(t => t.id === templateId);
      if (templateToDelete) {
          setDeletionLogs(prev => [...prev, { id: `LOG-${Date.now()}`, deletedItemId: templateId, itemType: 'BolTemplate', deletedAt: new Date(), deletedBy: currentUser?.id || 'system', originalData: templateToDelete }]);
          setBolTemplates(prev => prev.filter(t => t.id !== templateId));
      }
  };

  const addOrUpdateDirectDeposit = (employeeId: string, account: Omit<DirectDepositAccount, 'id'>) => {
        setEmployees(prev => prev.map(emp => {
            if (emp.id === employeeId) {
                const newAccount = { ...account, id: `dd-${Date.now()}` };
                const existingAccounts = emp.directDeposit || [];
                return { ...emp, directDeposit: [...existingAccounts, newAccount] };
            }
            return emp;
        }));
    };

    const deleteDirectDeposit = (employeeId: string, accountId: string) => {
        setEmployees(prev => prev.map(emp => {
            if (emp.id === employeeId) {
                return { ...emp, directDeposit: emp.directDeposit?.filter(acc => acc.id !== accountId) };
            }
            return emp;
        }));
    };
  

  return (
    <ScheduleContext.Provider value={{ 
        shifts, employees, currentUser, holidays, timeOffRequests, registrations, yardEvents, expenseReports, receipts, trainingPrograms, trainingAssignments, warehouseDoors, parkingLanes, deletionLogs, timeClockEvents, localLoadBoards, loadBoardHub, appointments, officeAppointments, lostAndFound, loads, files, equipment, jobPostings, applicants, bolHistory, bolTemplates, inventoryItems, customers, availableStatuses, qualityHolds, salesOrders, w4Templates, handbooks, projects, tasks, crmTasks, crmContacts, companies, deals, notes, visitors, addVisitor, checkOutVisitor, addNote, updateNote, deleteNote, bulkAddNotes, addDeal, updateDealStage, addCompany, addCrmContact, addCrmTask, updateCrmTaskStatus, addTask, updateTaskStatus, addTaskEvent, getHandbookById, updateHandbookSection, updateHandbookSectionDocument, addHandbookSection, addHandbook, deleteHandbook, updateHandbook, duplicateHandbook, addW4Template, updateW4Template, deleteW4Template, assignPickerToOrder, updateOrderItemStatus, completeOrderPicking, placeOnHold, releaseFromHold, scrapItem, addCustomer, updateCustomerStatus, addCustomStatus, addApplicant, updateApplicantStatus, addJobPosting, updateJobPostingStatus, deleteEquipment, addEquipment, addFile, deleteFile, permanentlyDeleteItem, shareHistoryLogs, logFileShare, moveTrailer, addOfficeAppointment, updateOfficeAppointmentStatus, addAppointment, updateAppointmentStatus, updateLoadBoardHubName, addLocalLoadBoard, deleteLocalLoadBoard, updateLocalLoadBoard, addShift, updateShift, deleteShift, addTimeOffRequest, approveTimeOffRequest, denyTimeOffRequest, registerUser, approveRegistration, denyRegistration, updateRegistration, getEmployeeById, updateEmployeeRole, updateEmployeeStatus, updateEmployee, deleteEmployee, addEmployee, bulkAddEmployees, updateEmployeeDocument, getEmployeeDocument, getYardEventById, addYardEvent, updateYardEventStatus, getExpenseReportById, setExpenseReports, receipts, setReceipts, getTrainingModuleById, assignTraining, unassignTraining, addWarehouseDoor, addParkingLane, restoreDeletedItem, addTimeClockEvent, updateTimeClockStatus, updateInventory, saveBol, saveBolTemplate, deleteBolTemplate, addOrUpdateDirectDeposit, deleteDirectDeposit
    }}>
      {children}
    </ScheduleContext.Provider>
  );
};

// ... same useSchedule hook ...
export const useSchedule = () => {
    const context = useContext(ScheduleContext);
    if (context === undefined) {
      throw new Error('useSchedule must be used within a ScheduleProvider');
    }
    return context;
  };





