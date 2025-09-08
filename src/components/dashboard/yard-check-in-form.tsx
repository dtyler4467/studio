
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { ArrowLeftRight } from "lucide-react";

const formSchema = z.object({
  transactionType: z.enum(["inbound", "outbound"], {
    required_error: "You need to select a transaction type.",
  }),
  trailerId: z.string().min(3, "Trailer ID must be at least 3 characters."),
  carrier: z.string().min(2, "Carrier name is required."),
  driverName: z.string().min(2, "Driver name is required."),
  loadNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function YardCheckInForm() {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionType: "inbound",
      trailerId: "",
      carrier: "",
      driverName: "",
      loadNumber: "",
    },
  });

  function onSubmit(data: FormValues) {
    const direction = data.transactionType === 'inbound' ? 'Inbound' : 'Outbound';
    toast({
      title: `${direction} Event Logged`,
      description: (
        <div className="text-sm">
          <p><strong>Trailer:</strong> {data.trailerId}</p>
          <p><strong>Carrier:</strong> {data.carrier}</p>
          <p><strong>Driver:</strong> {data.driverName}</p>
        </div>
      ),
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="transactionType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Transaction Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="inbound" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Inbound (Arrival)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
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
              <FormLabel>Load/BOL Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. LD004, BOL12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
            <ArrowLeftRight className="mr-2" />
            Submit Gate Record
        </Button>
      </form>
    </Form>
  );
}
