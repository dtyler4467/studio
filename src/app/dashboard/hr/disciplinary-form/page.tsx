
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSchedule, Employee } from '@/hooks/use-schedule';
import { useToast } from '@/hooks/use-toast';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { Gavel } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';


const disciplinaryFormSchema = z.object({
  employeeId: z.string().min(1, 'You must select an employee.'),
  incidentDate: z.date({ required_error: 'Please select the date of the incident.' }),
  infractionType: z.string().min(1, 'Please select the type of infraction.'),
  description: z.string().min(20, 'The description must be at least 20 characters long.'),
  actionTaken: z.string().min(1, 'Please select the action taken.'),
  managerName: z.string().min(1, 'Manager name is required.'),
  employeeComments: z.string().optional(),
  documentUri: z.string().optional().nullable(),
});

type DisciplinaryFormValues = z.infer<typeof disciplinaryFormSchema>;

export default function DisciplinaryFormPage() {
    const { employees, currentUser } = useSchedule();
    const { toast } = useToast();
    const [documentUri, setDocumentUri] = useState<string | null>(null);

    const form = useForm<DisciplinaryFormValues>({
        resolver: zodResolver(disciplinaryFormSchema),
        defaultValues: {
            employeeId: '',
            incidentDate: new Date(),
            infractionType: '',
            description: '',
            actionTaken: '',
            managerName: currentUser?.name || '',
            employeeComments: '',
            documentUri: null,
        },
    });

    const onSubmit = (data: DisciplinaryFormValues) => {
        const finalData = { ...data, documentUri };
        console.log(finalData); // In a real app, you would send this to a backend.
        toast({
            title: "Disciplinary Action Recorded",
            description: `The action for the selected employee has been documented.`,
        });
        form.reset();
        setDocumentUri(null);
    };

    return (
        <div className="flex flex-col w-full">
        <Header pageTitle="Disciplinary Actions" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Gavel />
                        Disciplinary Action Form
                    </CardTitle>
                    <CardDescription>
                        Create, manage, and document employee disciplinary actions. All submissions are confidential.
                    </CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="employeeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Employee</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select an employee..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {employees.map(emp => (
                                                        <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="incidentDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date of Incident</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                             <FormField
                                control={form.control}
                                name="infractionType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type of Infraction</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Attendance">Attendance (Tardiness, No-show)</SelectItem>
                                                <SelectItem value="Performance">Poor Work Performance</SelectItem>
                                                <SelectItem value="Conduct">Insubordination/Unprofessional Conduct</SelectItem>
                                                <SelectItem value="Safety">Safety Violation</SelectItem>
                                                <SelectItem value="Policy">Company Policy Violation</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                             <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description of Incident</FormLabel>
                                        <FormControl>
                                            <Textarea
                                            placeholder="Provide a detailed, objective account of the incident, including date, time, location, and any witnesses."
                                            className="resize-y min-h-[120px]"
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                             <FormField
                                control={form.control}
                                name="actionTaken"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Action Taken</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select disciplinary action..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Verbal Warning">Verbal Warning</SelectItem>
                                                <SelectItem value="Written Warning">Written Warning</SelectItem>
                                                <SelectItem value="Suspension">Suspension</SelectItem>
                                                <SelectItem value="Termination">Termination</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="employeeComments"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employee Comments (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                            placeholder="Allow the employee to provide their perspective on the incident."
                                            className="resize-y"
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                             <div>
                                <FormLabel>Attach Supporting Documents (Optional)</FormLabel>
                                <div className="mt-2">
                                     <DocumentUpload onDocumentChange={setDocumentUri} currentDocument={documentUri} />
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Submit Disciplinary Action</Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </main>
        </div>
    );
}
