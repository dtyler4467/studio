
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { addDays, formatISO } from 'date-fns';

type Shift = {
    id: string;
    date: string; // ISO date string
    employeeId: string;
    title: string;
    startTime: string;
    endTime: string;
};

type Employee = {
    id: string;
    name: string;
    email?: string;
}

type Holiday = {
    date: Date;
    name: string;
}

type TimeOffRequest = {
    id: string;
    employeeId: string;
    startDate: Date;
    endDate: Date;
    reason: string;
    status: 'Pending' | 'Approved' | 'Denied';
}

type Registration = {
    id: string;
    name: string;
    email: string;
    status: 'Pending' | 'Approved' | 'Denied';
}

type ScheduleContextType = {
  shifts: Shift[];
  employees: Employee[];
  holidays: Holiday[];
  timeOffRequests: TimeOffRequest[];
  registrations: Registration[];
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (shift: Shift) => void;
  deleteShift: (shiftId: string) => void;
  addTimeOffRequest: (request: Omit<TimeOffRequest, 'id' | 'status' | 'employeeId'>) => void;
  approveTimeOffRequest: (requestId: string) => void;
  denyTimeOffRequest: (requestId: string) => void;
  registerUser: (user: Omit<Registration, 'id' | 'status'>) => void;
  approveRegistration: (registrationId: string) => void;
  denyRegistration: (registrationId: string) => void;
};

const initialShifts: Shift[] = [
    { id: 'SH001', date: formatISO(new Date(), { representation: 'date' }), employeeId: 'USR001', title: 'Opening Shift', startTime: '08:00', endTime: '16:00' },
    { id: 'SH002', date: formatISO(new Date(), { representation: 'date' }), employeeId: 'USR002', title: 'Closing Shift', startTime: '14:00', endTime: '22:00' },
    { id: 'SH003', date: formatISO(addDays(new Date(), 2), { representation: 'date' }), employeeId: 'USR001', title: 'Day Shift', startTime: '09:00', endTime: '17:00' },
    { id: 'SH004', date: formatISO(addDays(new Date(), 2), { representation: 'date' }), employeeId: 'USR003', title: 'Day Shift', startTime: '09:00', endTime: '17:00' },
];


const mockEmployees: Employee[] = [
    { id: "USR001", name: "John Doe", email: "john.doe@example.com" },
    { id: "USR002", name: "Jane Doe", email: "jane.doe@example.com" },
    { id: "USR003", name: "Mike Smith", email: "mike.smith@example.com" },
    { id: "USR004", name: "Emily Jones", email: "emily.jones@example.com" },
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
    { id: 'REG001', name: 'New User 1', email: 'new.user1@example.com', status: 'Pending' },
    { id: 'REG002', name: 'New User 2', email: 'new.user2@example.com', status: 'Pending' },
]


const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>(initialTimeOffRequests);
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);

  const addShift = (shift: Omit<Shift, 'id'>) => {
    const newShift = { ...shift, id: `SH${Date.now()}` };
    setShifts(prev => [...prev, newShift]);
  };

  const updateShift = (updatedShift: Shift) => {
    setShifts(prev => prev.map(shift => shift.id === updatedShift.id ? updatedShift : shift));
  };

  const deleteShift = (shiftId: string) => {
    setShifts(prev => prev.filter(shift => shift.id !== shiftId));
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

        setRegistrations(prev => prev.map(reg => reg.id === registrationId ? { ...reg, status: 'Approved' as const } : reg));
        
        const newEmployee = {
            id: `USR${Date.now()}`,
            name: registration.name,
            email: registration.email,
        };
        setEmployees(prev => [...prev, newEmployee]);
    }

    const denyRegistration = (registrationId: string) => {
        setRegistrations(prev => prev.map(reg => reg.id === registrationId ? { ...reg, status: 'Denied' as const } : reg));
    }

  return (
    <ScheduleContext.Provider value={{ shifts, employees, holidays, timeOffRequests, registrations, addShift, updateShift, deleteShift, addTimeOffRequest, approveTimeOffRequest, denyTimeOffRequest, registerUser, approveRegistration, denyRegistration }}>
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
