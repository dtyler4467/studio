
'use server';

import { ai } from '@/ai/genkit';
import { dataService } from '@/services/data-service';
import { z } from 'zod';
import { format, isSameDay, isWithinInterval } from 'date-fns';

const getActiveTrailersInYard = ai.defineTool(
    {
        name: 'getActiveTrailersInYard',
        description: 'Returns the list of trailers currently in the yard, including their location (door or lane).',
        outputSchema: z.array(z.object({
            trailerId: z.string(),
            location: z.string(),
            carrier: z.string(),
            arrivedAt: z.string().datetime(),
        })),
    },
    async () => {
        const yardEvents = await dataService.getYardEvents();
        const assignments: Record<string, any> = {};
        const seenTrailers: Record<string, any> = {};

        const sortedEvents = [...yardEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        for (const event of sortedEvents) {
            if (seenTrailers[event.trailerId]) continue;
            
            seenTrailers[event.trailerId] = event;

            if (event.transactionType === 'inbound' && event.assignmentValue) {
                 if (!assignments[event.assignmentValue]) {
                    assignments[event.assignmentValue] = event;
                }
            }
        }

        return Object.values(assignments).map(e => ({
            trailerId: e.trailerId,
            location: `${e.assignmentType.includes('door') ? 'Door' : 'Lane'} ${e.assignmentValue}`,
            carrier: e.carrier,
            arrivedAt: e.timestamp.toISOString(),
        }));
    }
);

const getEmployeeSchedule = ai.defineTool(
    {
        name: 'getEmployeeSchedule',
        description: "Returns an employee's shift schedule for a given date range. If no date is provided, returns today's schedule.",
        inputSchema: z.object({
            employeeName: z.string().describe("The name of the employee."),
            date: z.string().optional().describe("A specific date in YYYY-MM-DD format. Defaults to today if not provided."),
            endDate: z.string().optional().describe("The end date for a range in YYYY-MM-DD format. If provided, `date` is the start date."),
        }),
        outputSchema: z.array(z.object({
            date: z.string(),
            title: z.string(),
            startTime: z.string(),
            endTime: z.string(),
        })),
    },
    async ({ employeeName, date, endDate }) => {
        const [employees, shifts] = await Promise.all([
            dataService.getEmployees(),
            dataService.getShifts(),
        ]);

        const employee = employees.find(e => e.name.toLowerCase() === employeeName.toLowerCase());
        if (!employee) {
            throw new Error(`Employee ${employeeName} not found.`);
        }

        const startDateObj = date ? new Date(date) : new Date();
        const endDateObj = endDate ? new Date(endDate) : startDateObj;
        
        return shifts.filter(shift => {
            const shiftDate = new Date(shift.date);
            const matchesEmployee = shift.employeeId === employee.id;
            const isInRange = isWithinInterval(shiftDate, { start: startDateObj, end: endDateObj }) || isSameDay(shiftDate, startDateObj);
            return matchesEmployee && isInRange;
        }).map(({ date, title, startTime, endTime }) => ({ date, title, startTime, endTime }));
    }
);

const getPendingRequests = ai.defineTool(
    {
        name: 'getPendingRequests',
        description: 'Returns a list of all pending time off requests or user registrations.',
        inputSchema: z.object({
            requestType: z.enum(['timeOff', 'registration']),
        }),
        outputSchema: z.array(z.object({
            id: z.string(),
            name: z.string(),
            details: z.string(),
        }))
    },
    async ({ requestType }) => {
        if (requestType === 'timeOff') {
            const [requests, employees] = await Promise.all([
                dataService.getTimeOffRequests(),
                dataService.getEmployees(),
            ]);
            return requests
                .filter(r => r.status === 'Pending')
                .map(r => ({
                    id: r.id,
                    name: employees.find(e => e.id === r.employeeId)?.name || 'Unknown',
                    details: `From ${format(r.startDate, 'P')} to ${format(r.endDate, 'P')}. Reason: ${r.reason}`,
                }));
        } else {
             const registrations = await dataService.getRegistrations();
             return registrations
                .filter(r => r.status === 'Pending')
                .map(r => ({
                    id: r.id,
                    name: r.name,
                    details: `Requested role: ${r.role}, Email: ${r.email}`,
                }));
        }
    }
);

const getAllLoads = ai.defineTool(
    {
        name: 'getAllLoads',
        description: 'Returns a list of all available loads, including their origin, destination, and rate.',
        outputSchema: z.array(z.object({
            id: z.string(),
            origin: z.string(),
            destination: z.string(),
            rate: z.number(),
        }))
    },
    async () => {
        const loads = await dataService.getLoads();
        return loads
            .filter(load => load.status === 'Available')
            .map(load => ({
                id: load.id,
                origin: load.origin,
                destination: load.destination,
                rate: load.rate,
            }));
    }
);

const getLoadDetails = ai.defineTool(
    {
        name: 'getLoadDetails',
        description: 'Returns the full details for a specific load ID.',
        inputSchema: z.object({
            loadId: z.string().describe('The ID of the load, e.g., LD001.'),
        }),
        outputSchema: z.object({
            id: z.string(),
            origin: z.string(),
            destination: z.string(),
            pickupDate: z.string(),
            deliveryDate: z.string(),
            rate: z.number(),
            status: z.string(),
            assignedTo: z.string().optional(),
            carrier: z.string().optional(),
            scac: z.string().optional(),
            dispatcher: z.string().optional(),
        })
    },
    async ({ loadId }) => {
        const loads = await dataService.getLoads();
        const load = loads.find(l => l.id.toLowerCase() === loadId.toLowerCase());
        if (!load) {
            throw new Error(`Load with ID ${loadId} not found.`);
        }
        return load;
    }
);

const getTrainingModules = ai.defineTool(
    {
        name: 'getTrainingModules',
        description: 'Returns a list of all available training modules and the programs they belong to.',
        outputSchema: z.array(z.object({
            program: z.string(),
            moduleId: z.string(),
            title: z.string(),
            description: z.string(),
        }))
    },
    async () => {
        const programs = await dataService.getTrainingPrograms();
        return programs.flatMap(program => 
            program.modules.map(module => ({
                program: program.title,
                moduleId: module.id,
                title: module.title,
                description: module.description,
            }))
        );
    }
);

const getTrainingModuleContent = ai.defineTool(
    {
        name: 'getTrainingModuleContent',
        description: 'Returns the full content for a specific training module ID.',
        inputSchema: z.object({
            moduleId: z.string().describe('The ID of the training module, e.g., MOD001.'),
        }),
        outputSchema: z.object({
            title: z.string(),
            type: z.string(),
            content: z.string(),
        })
    },
    async ({ moduleId }) => {
        const programs = await dataService.getTrainingPrograms();
        for (const program of programs) {
            const module = program.modules.find(m => m.id.toLowerCase() === moduleId.toLowerCase());
            if (module) {
                return {
                    title: module.title,
                    type: module.type,
                    content: module.content,
                };
            }
        }
        throw new Error(`Training module with ID ${moduleId} not found.`);
    }
);


export async function getTools() {
  return [
    getActiveTrailersInYard, 
    getEmployeeSchedule, 
    getPendingRequests,
    getAllLoads,
    getLoadDetails,
    getTrainingModules,
    getTrainingModuleContent,
  ];
}
