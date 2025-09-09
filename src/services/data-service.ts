
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
    getShifts: () => Promise.resolve(initialShifts),
    getEmployees: () => Promise.resolve(mockEmployees),
    getHolidays: () => Promise.resolve(initialHolidays),
    getTimeOffRequests: () => Promise.resolve(initialTimeOffRequests),
    getRegistrations: () => Promise.resolve(initialRegistrations),
    getYardEvents: () => Promise.resolve(initialYardEvents),
    getExpenseReports: () => Promise.resolve(initialExpenseReports),
    getTrainingPrograms: () => Promise.resolve(initialTrainingPrograms),
    getTrainingAssignments: () => Promise.resolve(initialTrainingAssignments),
    getWarehouseDoors: () => Promise.resolve(initialWarehouseDoors),
    getParkingLanes: () => Promise.resolve(initialParkingLanes),
    getTimeClockEvents: () => Promise.resolve(initialTimeClockEvents),
    getLocalLoadBoards: () => Promise.resolve(initialLocalLoadBoards),
    getLoadBoardHub: () => Promise.resolve(initialLoadBoardHub),
    getAppointments: () => Promise.resolve(initialAppointments),
    getOfficeAppointments: () => Promise.resolve(initialOfficeAppointments),
    getLostAndFound: () => Promise.resolve(initialLostAndFound),
};
