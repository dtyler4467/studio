
"use client";

import { useSchedule } from "@/hooks/use-schedule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Printer, Mail, FileDown } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export function PrintSchedule() {
    const { shifts, employees } = useSchedule();
    const { toast } = useToast();

    const handlePrintCalendar = () => {
        const printContents = document.getElementById('shift-calendar-printable')?.innerHTML;
        const calendarExists = document.getElementById('shift-calendar-printable');

        if (!calendarExists) {
            toast({
                variant: "destructive",
                title: "Print Error",
                description: "The schedule calendar is not on this page. Please navigate to Shift Management to print.",
            });
            return;
        }

        if (printContents) {
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = `<style>
                @media print {
                    body * { visibility: hidden; }
                    #shift-calendar-printable, #shift-calendar-printable * { visibility: visible; }
                    #shift-calendar-printable { position: absolute; left: 0; top: 0; width: 100%; }
                    .rdp { display: block !important; }
                }
            </style>${printContents}`;
            window.print();
            document.body.innerHTML = originalContents;
            // A full reload can be jarring, let's just restore state.
            // This might need more complex state management in a real app.
            window.location.reload(); 
        } else {
            toast({
                variant: "destructive",
                title: "Print Error",
                description: "Could not find the calendar content to print.",
            });
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

        toast({
            title: "Export Successful",
            description: "The schedule has been exported to a CSV file.",
        });
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
                    Select an option below to print the monthly calendar, export shift data to a CSV file, or email the schedule. Note: Printing requires you to be on the 'Shift Management' page.
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
