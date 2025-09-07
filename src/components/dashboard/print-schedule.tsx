
"use client";

import { useSchedule } from "@/hooks/use-schedule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Printer, Mail, FileDown } from "lucide-react";
import { format } from "date-fns";

export function PrintSchedule() {
    const { shifts, employees } = useSchedule();

    const handlePrintCalendar = () => {
        const printContents = document.getElementById('shift-calendar-printable')?.innerHTML;
        if (printContents) {
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
        } else {
            alert("Could not find the calendar to print.");
        }
    };
    
    const handleExportCsv = () => {
        const headers = ["Shift ID", "Employee Name", "Date", "Start Time", "End Time", "Title"];
        const rows = shifts.map(shift => {
            const employee = employees.find(e => e.id === shift.employeeId);
            return [
                shift.id,
                employee ? `"${employee.name}"` : "N/A",
                shift.date,
                shift.startTime,
                shift.endTime,
                `"${shift.title}"`
            ].join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `schedule_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link); 
        link.click();
        document.body.removeChild(link);
    };

    const handleEmailSchedule = () => {
        const subject = "Team Schedule";
        const body = "Please find the latest team schedule attached.";
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Print or Email Schedule</CardTitle>
                <CardDescription>
                    Select an option below to print the monthly calendar, export shift data to a CSV file, or email the schedule.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handlePrintCalendar}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Calendar
                </Button>
                 <Button onClick={handleExportCsv} variant="secondary">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export to CSV
                </Button>
                <Button onClick={handleEmailSchedule} variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Schedule
                </Button>
            </CardContent>
        </Card>
    );
}
