
import { 
    initialShifts,
    mockEmployees,
    initialHolidays,
    initialTimeOffRequests,
    initialRegistrations,
    initialYardEvents,
    initialExpenseReports,
    initialTrainingPrograms,
    initialTrainingAssignments,
    initialWarehouseDoors,
    initialParkingLanes,
    initialTimeClockEvents,
    initialLocalLoadBoards,
    initialLoadBoardHub,
    initialAppointments,
    initialOfficeAppointments,
    initialLostAndFound
} from "@/hooks/use-schedule";

// In a real application, this would connect to a database or other data source.
// For this prototype, we're using the initial mock data from the useSchedule hook.

export const dataService = {
    getShifts: async () => Promise.resolve(initialShifts),
    getEmployees: async () => Promise.resolve(mockEmployees),
    getHolidays: async () => Promise.resolve(initialHolidays),
    getTimeOffRequests: async () => Promise.resolve(initialTimeOffRequests),
    getRegistrations: async () => Promise.resolve(initialRegistrations),
    getYardEvents: async () => Promise.resolve(initialYardEvents),
    getExpenseReports: async () => Promise.resolve(initialExpenseReports),
    getTrainingPrograms: async () => Promise.resolve(initialTrainingPrograms),
    getTrainingAssignments: async () => Promise.resolve(initialTrainingAssignments),
    getWarehouseDoors: async () => Promise.resolve(initialWarehouseDoors),
    getParkingLanes: async () => Promise.resolve(initialParkingLanes),
    getTimeClockEvents: async () => Promise.resolve(initialTimeClockEvents),
    getLocalLoadBoards: async () => Promise.resolve(initialLocalLoadBoards),
    getLoadBoardHub: async () => Promise.resolve(initialLoadBoardHub),
    getAppointments: async () => Promise.resolve(initialAppointments),
    getOfficeAppointments: async () => Promise.resolve(initialOfficeAppointments),
    getLostAndFound: async () => Promise.resolve(initialLostAndFound),
};
