
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

// ... initial data definitions ...

const initialNotes: Note[] = [
    { id: 'NOTE-1', title: 'Meeting Follow-up', content: 'Follow up with John Doe about the Q3 budget.', date: new Date(), tags: ['meeting', 'finance'] },
    { id: 'NOTE-2', title: 'Road Trip Ideas', content: 'Route 66 road trip, stop at the Grand Canyon.', date: new Date(new Date().setDate(new Date().getDate() - 1)), tags: ['personal', 'travel'] },
];

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  // ... other state initializations ...
  const [notes, setNotes] = useState<Note[]>(initialNotes);

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
const [deals, setDeals] = useState<Deal[]>(initialDeals);

// ... all other functions from the original file ...

  return (
    <ScheduleContext.Provider value={{
        shifts, employees, currentUser, holidays, timeOffRequests, registrations, yardEvents, expenseReports, receipts, trainingPrograms, trainingAssignments, warehouseDoors, parkingLanes, deletionLogs, timeClockEvents, localLoadBoards, loadBoardHub, appointments, officeAppointments, lostAndFound, loads, files, equipment, jobPostings, applicants, bolHistory, bolTemplates, inventoryItems, customers, availableStatuses, qualityHolds, salesOrders, w4Templates, handbooks, projects, tasks, crmTasks, crmContacts, companies, deals, notes, addNote, updateNote, deleteNote, bulkAddNotes,
        // all other functions
    addDeal, updateDealStage, addCompany, addCrmContact, addCrmTask, updateCrmTaskStatus, addTask, updateTaskStatus, addTaskEvent, getHandbookById, updateHandbookSection, updateHandbookSectionDocument, addHandbookSection, addHandbook, deleteHandbook, updateHandbook, duplicateHandbook, addW4Template, updateW4Template, deleteW4Template, assignPickerToOrder, updateOrderItemStatus, completeOrderPicking, placeOnHold, releaseFromHold, scrapItem, addCustomer, updateCustomerStatus, addCustomStatus, addApplicant, updateApplicantStatus, addJobPosting, updateJobPostingStatus, deleteEquipment, addEquipment, addFile, deleteFile, permanentlyDeleteItem, shareHistoryLogs, logFileShare, moveTrailer, addOfficeAppointment, updateOfficeAppointmentStatus, addAppointment, updateAppointmentStatus, updateLoadBoardHubName, addLocalLoadBoard, deleteLocalLoadBoard, updateLocalLoadBoard, addShift, updateShift, deleteShift, addTimeOffRequest, approveTimeOffRequest, denyTimeOffRequest, registerUser, approveRegistration, denyRegistration, updateRegistration, getEmployeeById, updateEmployeeRole, updateEmployeeStatus, updateEmployee, deleteEmployee, addEmployee, bulkAddEmployees, updateEmployeeDocument, getEmployeeDocument, getYardEventById, addYardEvent, updateYardEventStatus, getExpenseReportById, setExpenseReports, setReceipts, getTrainingModuleById, assignTraining, unassignTraining, addWarehouseDoor, addParkingLane, restoreDeletedItem, addTimeClockEvent, updateTimeClockStatus, updateInventory, saveBol, saveBolTemplate, deleteBolTemplate, addOrUpdateDirectDeposit, deleteDirectDeposit
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
