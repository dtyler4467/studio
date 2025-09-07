"use client"

import * as React from "react"
import { format, isSameDay } from "date-fns"
import { DateRange } from "react-day-picker"
import { useSchedule } from "@/hooks/use-schedule"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ScheduleCalendar() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [mode, setMode] = React.useState<"single" | "range">("single")
  const { shifts } = useSchedule();

  // Assuming a single user for now with ID USR001 (John Doe)
  const currentUserId = "USR001"; 

  const selectedDayShifts = React.useMemo(() => {
    if (!selectedDate) return [];
    return shifts.filter(shift => isSameDay(new Date(shift.date), selectedDate) && shift.employeeId === currentUserId);
  }, [shifts, selectedDate, currentUserId]);

  const modifiers = {
    scheduled: shifts.filter(s => s.employeeId === currentUserId).map(shift => new Date(shift.date)),
  }
  const modifiersStyles = {
    scheduled: {
      border: "2px solid hsl(var(--primary))",
      borderRadius: 'var(--radius)',
    },
  }


  return (
    <div className="flex flex-col lg:flex-row items-start gap-4">
        <div className="flex flex-col items-center gap-4">
            <Tabs defaultValue="single" onValueChange={(value) => setMode(value as "single" | "range")} className="w-full max-w-sm">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single">Single Day</TabsTrigger>
                    <TabsTrigger value="range">Date Range</TabsTrigger>
                </TabsList>
            </Tabs>

            {mode === 'single' && (
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                />
            )}
            
            {mode === 'range' && (
                <div className="grid gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !dateRange && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                            ) : (
                            <span>Pick a date range</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        </div>
        
        <Card className="w-full lg:flex-1">
            <CardHeader>
                <CardTitle className="font-headline">
                    Schedule for {selectedDate ? format(selectedDate, "PPP") : '...'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {selectedDayShifts.length > 0 ? (
                    <ul className="space-y-2">
                        {selectedDayShifts.map(shift => (
                            <li key={shift.id} className="p-3 bg-muted rounded-md text-sm">
                                <span className="font-semibold">{shift.startTime} - {shift.endTime}</span>
                                <span className="text-muted-foreground ml-2">({shift.title})</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="rounded-md border border-dashed h-48 w-full flex items-center justify-center">
                        <p className="text-muted-foreground">No shifts scheduled for this day.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  )
}
