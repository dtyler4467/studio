
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, DropdownProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { ScrollArea } from "./scroll-area"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium hidden",
        caption_dropdowns: "flex gap-1",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
        Dropdown: (props: DropdownProps) => {
          const { fromYear, fromMonth, fromDate, toYear, toMonth, toDate } =
            props.from || {};
          const {
            toYear: toYear_to,
            toMonth: toMonth_to,
            toDate: toDate_to,
          } = props.to || {};

          const currentYear = new Date().getFullYear();
          const from = fromDate
            ? fromDate.getFullYear()
            : fromYear || currentYear - 100;
          const to = toDate ? toDate.getFullYear() : toYear || currentYear;
          let years = [];
          for (let i = from; i <= to; i++) {
            years.push(i);
          }
          
           const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
           ];

          if (props.name === "months") {
            const selectedMonth = props.value !== undefined ? new Date(props.value).getMonth() : new Date().getMonth();
            return (
              <Select
                onValueChange={(newValue) => {
                  const newDate = props.value ? new Date(props.value) : new Date();
                  newDate.setMonth(parseInt(newValue));
                  props.onChange?.(newDate);
                }}
                value={String(selectedMonth)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-48">
                    {months.map((month, index) => (
                      <SelectItem
                        key={month}
                        value={String(index)}
                      >
                        {month}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            );
          } else if (props.name === "years") {
            const selectedYear = props.value !== undefined ? new Date(props.value).getFullYear() : new Date().getFullYear();
            return (
              <Select
                onValueChange={(newValue) => {
                   const newDate = props.value ? new Date(props.value) : new Date();
                  newDate.setFullYear(parseInt(newValue));
                  props.onChange?.(newDate);
                }}
                value={String(selectedYear)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-48">
                    {years.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            );
          }
          return null;
        }
      }}
      {...props}
      captionLayout={props.captionLayout || 'dropdown-buttons'}
      fromYear={props.fromYear || new Date().getFullYear() - 100}
      toYear={props.toYear || new Date().getFullYear()}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
