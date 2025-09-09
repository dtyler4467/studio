
"use client";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export const formSchema = z.object({
  transactionType: z.enum(["inbound", "outbound"], {
    required_error: "You need to select a transaction type.",
  }),
  trailerId: z.string().min(3, "Trailer ID must be at least 3 characters."),
  sealNumber: z.string().optional(),
  carrier: z.string().min(2, "Carrier name is required."),
  scac: z.string().length(4, "SCAC must be 4 letters.").optional().or(z.literal("")),
  driverName: z.string().min(2, "Driver name is required."),
  loadNumber: z.string().min(1, "Load/BOL number is required."),
  assignmentType: z.enum(["bobtail", "empty", "material", "door_assignment", "lane_assignment"]),
  assignmentValue: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

type YardCheckInFormProps = {
    form: UseFormReturn<FormValues>;
    onTransactionTypeChange: (value: 'inbound' | 'outbound') => void;
}

// In a real app, this would come from the authenticated user's session
const currentClerk = { name: "Admin User" };

const ClientFormattedDate = () => {
    const [date, setDate] = useState<Date | null>(null);

    useEffect(() => {
        setDate(new Date());
        const timer = setInterval(() => setDate(new Date()), 1000 * 60); // Update every minute
        return () => clearInterval(timer);
    }, []);

    if (!date) {
        return <Skeleton className="h-4 w-[150px]" />;
    }

    return <>{format(date, 'PPP p')}</>
}

export function YardCheckInForm({ form, onTransactionTypeChange }: YardCheckInFormProps) {

  const assignmentType = form.watch("assignmentType");

  return (
    <Form {...form}>
      <form id="yard-check-in-form" className="space-y-6">
         <div className="flex justify-between items-center bg-muted p-3 rounded-md">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Clerk: <span className="font-semibold text-foreground">{currentClerk.name}</span></span>
            </div>
             <div className="text-sm text-muted-foreground">
                <ClientFormattedDate />
            </div>
        </div>
        <FormField
          control={form.control}
          name="transactionType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Transaction Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => onTransactionTypeChange(value as 'inbound' | 'outbound')}
                  value={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="inbound" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Inbound (Arrival)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="outbound" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Outbound (Departure)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="trailerId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Trailer ID</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. 53123" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="sealNumber"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Seal Number (Optional)</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. S123456" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="carrier"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Carrier</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. Swift Logistics" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="scac"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>SCAC</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. SWFT" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
         <FormField
          control={form.control}
          name="driverName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Driver Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
            control={form.control}
            name="loadNumber"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Load/BOL Number</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. LD004, BOL12345" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="assignmentType"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Assignment</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an assignment type" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="bobtail">Bobtail</SelectItem>
                        <SelectItem value="empty">Empty</SelectItem>
                        <SelectItem value="material">Material</SelectItem>
                        <SelectItem value="door_assignment">Door Assignment</SelectItem>
                        <SelectItem value="lane_assignment">Lane Assignment</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
             {(assignmentType === 'door_assignment' || assignmentType === 'lane_assignment') && (
                <FormField
                control={form.control}
                name="assignmentValue"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{assignmentType === 'door_assignment' ? "Door Number" : "Lane Number"}</FormLabel>
                    <FormControl>
                        <Input placeholder={assignmentType === 'door_assignment' ? "e.g. 42" : "e.g. B3"} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
             )}
        </div>
      </form>
    </Form>
  );
}
