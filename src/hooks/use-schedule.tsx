
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
}

type Holiday = {
    date: Date;
    name: string;
}

type ScheduleContextType = {
  shifts: Shift[];
  employees: Employee[];
  holidays: Holiday[];
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (shift: Shift) => void;
  deleteShift: (shiftId: string) => void;
};

const initialShifts: Shift[] = [
    { id: 'SH001', date: formatISO(new Date(), { representation: 'date' }), employeeId: 'USR001', title: 'Opening Shift', startTime: '08:00', endTime: '16:00' },
    { id: 'SH002', date: formatISO(new Date(), { representation: 'date' }), employeeId: 'USR002', title: 'Closing Shift', startTime: '14:00', endTime: '22:00' },
    { id: 'SH003', date: formatISO(addDays(new Date(), 2), { representation: 'date' }), employeeId: 'USR001', title: 'Day Shift', startTime: '09:00', endTime: '17:00' },
    { id: 'SH004', date: formatISO(addDays(new Date(), 2), { representation: 'date' }), employeeId: 'USR003', title: 'Day Shift', startTime: '09:00', endTime: '17:00' },
];


const mockEmployees: Employee[] = [
    { id: "USR001", name: "John Doe" },
    { id: "USR002", name: "Jane Doe" },
    { id: "USR003", name: "Mike Smith" },
    { id: "USR004", name: "Emily Jones" },
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


const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const employees = mockEmployees;

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

  return (
    <ScheduleContext.Provider value={{ shifts, employees, holidays, addShift, updateShift, deleteShift }}>
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
