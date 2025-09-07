
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
import { Calendar as CalendarIcon, PartyPopper } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

export function ScheduleCalendar() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [mode, setMode] = React.useState<"single" | "range">("single")
  const { shifts, holidays } = useSchedule();

  // Assuming a single user for now with ID USR001 (John Doe)
  const currentUserId = "USR001"; 

  const selectedDayShifts = React.useMemo(() => {
    if (!selectedDate) return [];
    return shifts.filter(shift => isSameDay(new Date(shift.date), selectedDate) && shift.employeeId === currentUserId);
  }, [shifts, selectedDate, currentUserId]);
  
  const holidayDates = holidays.map(h => h.date);

  const modifiers = {
    scheduled: shifts.filter(s => s.employeeId === currentUserId).map(shift => new Date(shift.date)),
    holiday: holidayDates,
  }
  const modifiersStyles = {
    scheduled: {
      border: "2px solid hsl(var(--primary))",
      borderRadius: 'var(--radius)',
    },
    holiday: {
      backgroundColor: 'hsl(var(--accent) / 0.2)',
      color: 'hsl(var(--accent-foreground))',
      fontWeight: 'bold',
    },
  }

  const HolidayFooter = () => {
    const holiday = holidays.find(h => selectedDate && isSameDay(h.date, selectedDate));
    if (!holiday) return null;
    return (
        <div className="text-center text-sm mt-2 p-2 bg-accent/20 rounded-md flex items-center justify-center gap-2">
            <PartyPopper className="w-4 h-4 text-accent-foreground" />
            <span className="font-semibold text-accent-foreground">{holiday.name} (Holiday)</span>
        </div>
    )
  }

  return (
    <TooltipProvider>
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
                        footer={<HolidayFooter />}
                        components={{
                            Day: ({ date, ...props }) => {
                                const holiday = holidays.find(h => isSameDay(h.date, date));
                                const dayModifiers = props.modifiers || {};
                                if (holiday) {
                                    return (
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <div 
                                                    className={cn(
                                                        "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20",
                                                        dayModifiers.today && "bg-accent text-accent-foreground",
                                                        dayModifiers.selected && "bg-primary text-primary-foreground",
                                                        dayModifiers.scheduled && "border-2 border-primary rounded-md",
                                                        dayModifiers.holiday && "bg-accent/20 text-accent-foreground font-bold"
                                                    )}
                                                >
                                                    <span className="flex items-center justify-center h-full w-full">{format(date, 'd')}</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{holiday.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                }
                                return <div className={cn("h-9 w-9 p-0 text-center text-sm", dayModifiers.today && "bg-accent text-accent-foreground", dayModifiers.selected && "bg-primary text-primary-foreground", dayModifiers.scheduled && "border-2 border-primary rounded-md")}>{format(date, 'd')}</div>;
                            }
                        }}
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
                                modifiers={modifiers}
                                modifiersStyles={modifiersStyles}
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
    </TooltipProvider>
  )
}
