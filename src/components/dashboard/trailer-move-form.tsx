
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
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { useSchedule, YardEvent } from "@/hooks/use-schedule";
import { useToast } from "@/hooks/use-toast";
import { useMemo } from "react";
import { Move } from "lucide-react";

const FormSchema = z.object({
  trailerEventId: z.string({ required_error: "Please select a trailer." }),
  destinationLane: z.string({ required_error: "Please select a destination." }),
});

export function TrailerMoveForm() {
  const { yardEvents, parkingLanes, warehouseDoors, moveTrailer } = useSchedule();
  const { toast } = useToast();

  const { laneTrailers, doorTrailers } = useMemo(() => {
    const laneAssignments: Record<string, YardEvent> = {};
    const doorAssignments: Record<string, YardEvent> = {};
    const seenTrailers: Record<string, YardEvent> = {};

    const sortedEvents = [...yardEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    for (const event of sortedEvents) {
        if (seenTrailers[event.trailerId]) continue;
        
        seenTrailers[event.trailerId] = event;

        if (event.transactionType === 'inbound' && event.assignmentValue) {
            if (event.assignmentType === 'lane_assignment') {
                if (!laneAssignments[event.assignmentValue]) {
                    laneAssignments[event.assignmentValue] = event;
                }
            } else if (event.assignmentType === 'door_assignment') {
                 if (!doorAssignments[event.assignmentValue]) {
                    doorAssignments[event.assignmentValue] = event;
                }
            }
        }
    }
    return { laneTrailers: Object.values(laneAssignments), doorTrailers: Object.values(doorAssignments) };
  }, [yardEvents]);


  const availableLanes = useMemo(() => {
    const occupiedLanes = new Set(laneTrailers.map(t => t.assignmentValue));
    return parkingLanes.filter(lane => !occupiedLanes.has(lane));
  }, [parkingLanes, laneTrailers]);


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
        moveTrailer(data.trailerEventId, data.destinationLane);
        toast({
            title: "Move Initiated",
            description: `Trailer move to ${data.destinationLane === 'lost_and_found' ? 'Lost & Found' : `lane ${data.destinationLane}`} has been logged.`
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
                    <SelectValue placeholder="Select a trailer..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {doorTrailers.length > 0 && (
                        <SelectGroup>
                            <SelectLabel>From Dock Door</SelectLabel>
                            {doorTrailers.map(event => (
                                <SelectItem key={event.id} value={event.id}>
                                  Trailer: {event.trailerId} (in Door {event.assignmentValue})
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    )}
                    {laneTrailers.length > 0 && (
                       <SelectGroup>
                            <SelectLabel>From Parking Lane</SelectLabel>
                            {laneTrailers.map(event => (
                                <SelectItem key={event.id} value={event.id}>
                                Trailer: {event.trailerId} (in Lane {event.assignmentValue})
                                </SelectItem>
                            ))}
                       </SelectGroup>
                    )}
                    {doorTrailers.length === 0 && laneTrailers.length === 0 && (
                        <SelectItem value="" disabled>No trailers available to move</SelectItem>
                    )}
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
              <FormLabel>Destination</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a destination" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Parking Lanes</SelectLabel>
                    {availableLanes.length > 0 ? (
                      availableLanes.map(lane => (
                          <SelectItem key={lane} value={lane}>
                            {lane}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>No available lanes</SelectItem>
                    )}
                  </SelectGroup>
                   <SelectGroup>
                        <SelectLabel>Other</SelectLabel>
                        <SelectItem value="lost_and_found">
                            Lost & Found
                       </SelectItem>
                   </SelectGroup>
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
