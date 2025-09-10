
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Mail, Upload, FileText, Download } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { useSchedule } from '@/hooks/use-schedule';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const LogGrid = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const statuses = [
        { num: 1, label: 'Off Duty' },
        { num: 2, label: 'Sleeper Berth' },
        { num: 3, label: 'Driving' },
        { num: 4, label: 'On Duty' },
    ];
    return (
        <div className="border border-black text-xs">
            <div className="grid grid-cols-27">
                 <div className="col-span-2"></div>
                 {hours.map(hour => {
                    if (hour === 0) return <div key={hour} className="text-center font-bold">Mid Night</div>
                    if (hour === 12) return <div key={hour} className="text-center font-bold">Noon</div>
                    return <div key={hour} className="text-center">{(hour % 12) === 0 ? 12 : hour % 12}</div>
                 })}
                 <div className="col-span-1"></div>
            </div>
            {statuses.map(status => (
                 <div key={status.num} className="grid grid-cols-27 border-t border-black">
                    <div className="col-span-2 border-r border-black p-1 flex items-center gap-2">
                        <span className="font-bold">{status.num}</span>
                        <span>{status.label}</span>
                    </div>
                    {hours.map(hour => (
                        <div key={hour} className="col-span-1 border-r border-black h-8 grid grid-cols-4">
                            <div className="border-r border-dashed border-gray-400"></div>
                            <div className="border-r border-dashed border-gray-400"></div>
                            <div className="border-r border-dashed border-gray-400"></div>
                            <div></div>
                        </div>
                    ))}
                    <div className="col-span-1 border-l border-black"></div>
                 </div>
            ))}
            <div className="grid grid-cols-27 border-t border-black">
                 <div className="col-span-2 border-r border-black p-1 font-bold">Remarks</div>
                 {hours.map(hour => (
                    <div key={hour} className="col-span-1 border-r border-black h-8"></div>
                 ))}
                 <div className="col-span-1 flex items-center justify-center p-1 text-center border-l border-black bg-gray-200">
                    <p className="font-bold leading-tight">Total Hours</p>
                 </div>
            </div>
             <div className="grid grid-cols-27 border-t border-black text-xs text-muted-foreground">
                <div className="col-span-2"></div>
                {hours.map(hour => {
                    if (hour === 0) return <div key={hour} className="text-center font-bold text-black">Mid Night</div>
                    if (hour === 12) return <div key={hour} className="text-center font-bold text-black">Noon</div>
                    return <div key={hour} className="text-center text-black">{(hour % 12) === 0 ? 12 : hour % 12}</div>
                 })}
                 <div className="col-span-1"></div>
            </div>
        </div>
    )
}


const PaperLogTemplate = React.forwardRef<HTMLDivElement, {}>((props, ref) => (
    <div ref={ref} className="bg-white text-black p-4 space-y-2 font-sans">
        <div className="text-center font-bold font-headline">
            <h2 className="text-2xl tracking-wider">DRIVER'S DAILY LOG</h2>
            <p className="text-lg">ONE CALENDAR DAY</p>
        </div>

        <div className="flex gap-4">
            <div className="flex-1 text-center">
                <Input className="h-8 text-xs border-black rounded-none" />
                <Label className="text-xs font-semibold">MONTH/DAY/YEAR</Label>
            </div>
            <div className="flex-1 text-center">
                <Input className="h-8 text-xs border-black rounded-none" />
                <Label className="text-xs font-semibold">TOTAL MILES DRIVEN TODAY</Label>
            </div>
            <div className="flex-1 text-center">
                <Input className="h-8 text-xs border-black rounded-none" />
                <Label className="text-xs font-semibold">VEHICLE NUMBERS</Label>
            </div>
        </div>
        
        <div className="flex gap-4">
            <div className="w-2/3 space-y-2">
                 <div className="text-center">
                    <Input className="h-8 text-xs border-black rounded-none" />
                    <Label className="text-xs font-semibold">NAME OF THE CARRIER</Label>
                 </div>
                  <div className="text-center">
                    <Input className="h-8 text-xs border-black rounded-none" />
                    <Label className="text-xs font-semibold">MAIN OFFICE ADDRESS</Label>
                 </div>
                 <div className="text-center">
                    <Input className="h-8 text-xs border-black rounded-none" />
                    <Label className="text-xs font-semibold">NAME OF THE CO-DRIVER</Label>
                 </div>
            </div>
             <div className="w-1/3 text-center">
                <div className="h-20 border-black border flex items-center justify-center">
                    {/* Placeholder for signature */}
                </div>
                <Label className="text-xs font-semibold">DRIVER'S SIGNATURE</Label>
            </div>
        </div>
        <div className="text-center">
            <Input className="h-8 text-xs border-black rounded-none" />
            <Label className="text-xs font-semibold">PRO OR SHIPPING NUMBER</Label>
        </div>

        <LogGrid />

    </div>
));
PaperLogTemplate.displayName = "PaperLogTemplate";

type UploadedLog = {
    id: string;
    driverName: string;
    logDate: Date;
    uploadDate: Date;
    documentUri: string;
};

const serverSideInitialLogs: UploadedLog[] = [];

export default function PaperLogsPage() {
    const templateRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const { currentUser } = useSchedule();
    const [uploadedLogs, setUploadedLogs] = useState(serverSideInitialLogs);
    const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [newLogData, setNewLogData] = useState<{ logDate: Date | null, documentUri: string | null }>({ logDate: null, documentUri: null });

    useEffect(() => {
        // Initialize state that depends on `new Date()` on the client side
        // to prevent hydration errors.
        const clientSideInitialLogs: UploadedLog[] = [
            { id: 'LOG001', driverName: 'John Doe', logDate: new Date('2024-07-28'), uploadDate: new Date('2024-07-29'), documentUri: 'https://picsum.photos/seed/log1/800/1100' },
            { id: 'LOG002', driverName: 'Jane Doe', logDate: new Date('2024-07-29'), uploadDate: new Date('2024-07-30'), documentUri: 'https://picsum.photos/seed/log2/800/1100' },
        ];
        setUploadedLogs(clientSideInitialLogs);
        setNewLogData({ logDate: new Date(), documentUri: null });
    }, []);

    const handlePrint = () => {
        const content = templateRef.current;
        if (content) {
            const printWindow = window.open('', '', 'height=800,width=1000');
            printWindow?.document.write('<html><head><title>Print Paper Log</title>');
            // A simple way to include Tailwind-like styles for printing
            printWindow?.document.write('<style>body{font-family:sans-serif;}input,textarea{border:1px solid #000;border-radius:0;padding:0.5rem;width:100%;}label{font-size:0.75rem;font-weight:600;text-transform:uppercase;} .font-headline{ font-family: "Space Grotesk", sans-serif;} .font-sans{font-family: sans-serif} .flex{display:flex;} .gap-4{gap:1rem;} .w-1\\/3{width:33.333333%} .w-2\\/3{width:66.666667%} .space-y-2 > * + *{margin-top:0.5rem;} .text-center{text-align:center;} .text-2xl{font-size:1.5rem;} .text-lg{font-size:1.125rem;} .font-bold{font-weight:700;} .tracking-wider{letter-spacing:.05em;} .h-8{height:2rem;} .h-20{height:5rem;} .text-xs{font-size:.75rem;} .border-black{border-color:#000;} .border{border-width:1px;} .items-center{align-items:center;} .justify-center{justify-content:center;} .grid{display:grid;} .grid-cols-27{grid-template-columns: 80px repeat(24, 1fr) 50px;} .grid-cols-4{grid-template-columns:repeat(4,1fr);} .col-span-1{grid-column:span 1 / span 1;} .col-span-2{grid-column:span 2 / span 2;} .border-t{border-top-width:1px;} .border-r{border-right-width:1px;} .border-l{border-left-width:1px;} .border-dashed{border-style:dashed;} .p-1{padding:.25rem;} .bg-gray-200{background-color:#e5e7eb;} .leading-tight{line-height:1.25;} .font-semibold{font-weight:600;} .gap-2{gap:.5rem;}</style>');
            printWindow?.document.write('</head><body style="zoom:0.8;">');
            printWindow?.document.write(content.innerHTML);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            printWindow?.print();
        }
    };
    
    const handleEmail = () => {
        toast({
            title: "Email Client Opening",
            description: "A draft email with the subject 'Blank Log Sheet' will be opened.",
        });
        window.location.href = `mailto:?subject=Blank Log Sheet&body=Please find the blank paper log sheet attached.`;
    };

    const handleSaveUpload = () => {
        if (!newLogData.documentUri || !newLogData.logDate) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a date and upload a document for the log.' });
            return;
        }
        const newLog: UploadedLog = {
            id: `LOG${Date.now()}`,
            driverName: currentUser?.name || 'Unknown Driver',
            logDate: newLogData.logDate,
            uploadDate: new Date(),
            documentUri: newLogData.documentUri,
        }
        setUploadedLogs(prev => [newLog, ...prev]);
        toast({ title: 'Log Uploaded', description: 'The completed paper log has been saved.' });
        setUploadDialogOpen(false);
        setNewLogData({ logDate: new Date(), documentUri: null });
    }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Paper Logs" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle className="font-headline">Paper Log Template</CardTitle>
                    <CardDescription>
                        Use this template to print or email blank logs for manual completion.
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleEmail}><Mail className="mr-2"/>Email</Button>
                    <Button onClick={handlePrint}><Printer className="mr-2"/>Print Blank Log</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="bg-muted p-4 rounded-md">
                    <PaperLogTemplate ref={templateRef} />
                </div>
            </CardContent>
        </Card>

         <Card>
            <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle className="font-headline">Manage Submitted Logs</CardTitle>
                    <CardDescription>
                        Upload and review completed paper logs.
                    </CardDescription>
                </div>
                <Button onClick={() => setUploadDialogOpen(true)}><Upload className="mr-2"/>Upload Completed Log</Button>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Driver</TableHead>
                                <TableHead>Log Date</TableHead>
                                <TableHead>Upload Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {uploadedLogs.length > 0 ? uploadedLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-medium">{log.driverName}</TableCell>
                                    <TableCell>{format(log.logDate, 'PPP')}</TableCell>
                                    <TableCell>{format(log.uploadDate, 'PPP p')}</TableCell>
                                    <TableCell className="text-right">
                                         <Button variant="outline" size="sm" asChild>
                                            <a href={log.documentUri} target="_blank" rel="noopener noreferrer">
                                                <FileText className="mr-2"/> View Document
                                            </a>
                                         </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        No logs have been uploaded yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

        <Dialog open={isUploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Completed Log</DialogTitle>
                    <DialogDescription>
                        Select the date for the log and upload the document.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                            <Label htmlFor="log-date">Log Date</Label>
                            {newLogData.logDate && (
                                <Input 
                                id="log-date" 
                                type="date" 
                                value={format(newLogData.logDate, 'yyyy-MM-dd')}
                                onChange={(e) => setNewLogData(prev => ({...prev, logDate: new Date(e.target.value)}))}
                            />
                            )}
                    </div>
                        <div className="space-y-2">
                        <Label>Document</Label>
                            <DocumentUpload 
                            onDocumentChange={(uri) => setNewLogData(prev => ({...prev, documentUri: uri}))} 
                            currentDocument={newLogData.documentUri}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveUpload}>Save Log</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
