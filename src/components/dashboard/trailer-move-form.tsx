
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchedule, YardEvent } from "@/hooks/use-schedule";
import { useToast } from "@/hooks/use-toast";
import { useMemo } from "react";
import { Move } from "lucide-react";

const FormSchema = z.object({
  trailerEventId: z.string({ required_error: "Please select a trailer." }),
  destinationLane: z.string({ required_error: "Please select a destination lane." }),
});

export function TrailerMoveForm() {
  const { yardEvents, parkingLanes, moveTrailer } = useSchedule();
  const { toast } = useToast();

  const occupiedTrailers = useMemo(() => {
    const assignments: Record<string, YardEvent> = {};
    const seenTrailers: Record<string, YardEvent> = {};

    const sortedEvents = [...yardEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    for (const event of sortedEvents) {
        if (event.assignmentType !== 'lane_assignment' || !event.assignmentValue) continue;
        
        if (seenTrailers[event.trailerId]) {
             if (seenTrailers[event.trailerId].timestamp > event.timestamp) {
                continue;
             }
        }
        seenTrailers[event.trailerId] = event;

        if (event.transactionType === 'inbound') {
             assignments[event.assignmentValue] = event;
        }
    }
    return Object.values(assignments);
  }, [yardEvents]);

  const availableLanes = useMemo(() => {
    const occupiedLaneValues = occupiedTrailers.map(e => e.assignmentValue);
    return parkingLanes.filter(lane => !occupiedLaneValues.includes(lane));
  }, [parkingLanes, occupiedTrailers]);


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
        moveTrailer(data.trailerEventId, data.destinationLane);
        toast({
            title: "Move Initiated",
            description: `Trailer move to lane ${data.destinationLane} has been logged.`
        });
        form.reset();
    } catch (error: any) {
         toast({
            variant: "destructive",
            title: "Move Failed",
            description: error.message
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto space-y-6">
        <FormField
          control={form.control}
          name="trailerEventId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trailer to Move</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trailer currently in a lane" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {occupiedTrailers.map(event => (
                    <SelectItem key={event.id} value={event.id}>
                      Trailer: {event.trailerId} (in Lane {event.assignmentValue})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="destinationLane"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination Lane</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an empty lane" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableLanes.map(lane => (
                     <SelectItem key={lane} value={lane}>
                       {lane}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
            <Move className="mr-2" />
            Move Trailer
        </Button>
      </form>
    </Form>
  )
}
