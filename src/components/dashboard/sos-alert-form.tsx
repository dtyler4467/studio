
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSchedule } from '@/hooks/use-schedule';
import { useToast } from '@/hooks/use-toast';
import { MultiSelect, MultiSelectOption } from '../ui/multi-select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Siren } from 'lucide-react';
import React from 'react';

const alertFormSchema = z.object({
  type: z.string({ required_error: 'Please select an alert type.' }),
  location: z.string().min(3, 'Location is required.'),
  urgency: z.enum(['High', 'Critical']),
  personnel: z.array(z.string()).min(1, 'You must select at least one person to notify.'),
  details: z.string().min(10, 'Details must be at least 10 characters.'),
});

type AlertFormValues = z.infer<typeof alertFormSchema>;

export function SosAlertForm() {
  const { employees, currentUser } = useSchedule();
  const { toast } = useToast();

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      urgency: 'High',
      personnel: [],
    },
  });

  const employeeOptions: MultiSelectOption[] = React.useMemo(() => employees
    .filter(e => e.email)
    .map(e => ({ value: e.email!, label: e.name })),
  [employees]);


  const onSubmit = (data: AlertFormValues) => {
    const subject = `** ${data.urgency.toUpperCase()} SOS ALERT: ${data.type} **`;
    const body = `
URGENT SOS ALERT ISSUED BY: ${currentUser?.name || 'Unknown User'}

Alert Type: ${data.type}
Urgency: ${data.urgency}
Location: ${data.location}

Details:
${data.details}

---
This is an automated SOS alert. Please respond accordingly.
    `.trim();

    window.location.href = `mailto:${data.personnel.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    toast({
      title: 'SOS Alert Sent',
      description: 'The emergency alert email has been prepared for sending.',
    });

    form.reset();
  };

  return (
     <Card className="border-destructive bg-destructive/5">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2 text-destructive">
                        <Siren />
                        Send SOS Alert
                    </CardTitle>
                    <CardDescription className="text-destructive/80">
                       Use this form only for critical incidents requiring immediate attention. An email will be sent to the selected personnel.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alert Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select the type of emergency..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Accident">Accident</SelectItem>
                                        <SelectItem value="Mechanical Breakdown">Mechanical Breakdown</SelectItem>
                                        <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
                                        <SelectItem value="Security Threat">Security Threat</SelectItem>
                                        <SelectItem value="Other Urgent">Other Urgent</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="urgency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Urgency Level</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select the urgency level..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Critical">Critical</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location of Incident</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., I-80 East, Mile Marker 45" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="personnel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Personnel to Notify</FormLabel>
                                <FormControl>
                                    <MultiSelect
                                        options={employeeOptions}
                                        selected={field.value}
                                        onChange={field.onChange}
                                        placeholder="Select employees or type emails..."
                                        allowOther
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Details</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Provide a detailed description of the incident..."
                                    className="resize-y min-h-[100px]"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" variant="destructive" size="lg">Send Alert</Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
