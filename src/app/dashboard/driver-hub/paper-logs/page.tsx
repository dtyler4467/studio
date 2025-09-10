
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
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const statuses = [
        { num: 1, label: 'OFF DUTY' },
        { num: 2, label: 'SLEEPER BERTH' },
        { num: 3, label: 'DRIVING' },
        { num: 4, label: 'ON DUTY (NOT DRIVING)' },
    ];
    return (
        <div className="border-l border-r border-black text-xs">
            <div className="grid grid-cols-25 border-b border-black bg-gray-100">
                 <div className="col-span-1 text-center font-bold border-r border-black flex items-center justify-center text-[10px] leading-tight px-1">MIDNIGHT</div>
                 {hours.map(hour => <div key={`top-${hour}`} className="col-span-1 text-center font-semibold border-r border-black">{hour}</div>)}
                 <div className="col-span-1 text-center font-bold border-r border-black flex items-center justify-center text-[10px] leading-tight px-1">NOON</div>
                 {hours.map(hour => <div key={`bottom-${hour}`} className="col-span-1 text-center font-semibold border-r border-black">{hour}</div>)}
                 <div className="col-span-1"></div>
            </div>
            {statuses.map(status => (
                <div key={status.num} className="grid grid-cols-25 border-b border-black min-h-[32px]">
                    <div className="col-span-1 text-center py-0.5 border-r border-black text-[9px] font-semibold flex items-center justify-center leading-tight">{status.label}</div>
                    {Array.from({ length: 24 }).map((_, i) => (
                         <div key={i} className="col-span-1 border-r border-dashed border-gray-300"></div>
                    ))}
                    <div className="col-span-1"></div>
                </div>
            ))}
             <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                <div className="col-span-9 p-1 border-r border-black">
                    <Label className="text-[9px] font-semibold">REMARKS</Label>
                </div>
                <div className="col-span-3 p-1">
                     <Label className="text-[9px] font-semibold">TOTAL HOURS</Label>
                </div>
            </div>
             <div className="grid grid-cols-12 h-20">
                <div className="col-span-9 p-1 border-r border-black"></div>
                <div className="col-span-3 p-1 space-y-0.5">
                     <p className="text-[9px]">1. OFF DUTY ______</p>
                     <p className="text-[9px]">2. SLEEPER ______</p>
                     <p className="text-[9px]">3. DRIVING ______</p>
                     <p className="text-[9px]">4. ON DUTY ______</p>
                     <p className="text-[9px] font-semibold">TOTAL HRS. ______ (Must equal 24)</p>
                </div>
            </div>
        </div>
    )
}

const SingleLogTemplate = () => (
    <div className="bg-white text-black p-4 space-y-2 font-sans text-[10px]">
        <div className="text-center mb-2">
            <h2 className="text-base font-bold font-headline tracking-wider">DRIVER'S DAILY LOG</h2>
        </div>

        <div className="grid grid-cols-3 gap-x-2">
            <div className="text-center flex-grow space-y-1">
                <Input className="h-5 text-xs border-b border-black rounded-none px-1 text-center" />
                <Label className="text-[8px] font-semibold tracking-wider">1. DATE</Label>
            </div>
            <div className="text-center flex-grow space-y-1">
                <Input className="h-5 text-xs border-b border-black rounded-none px-1 text-center" />
                <Label className="text-[8px] font-semibold tracking-wider">2. TOTAL MILES DRIVING TODAY</Label>
            </div>
            <div className="text-center flex-grow space-y-1">
                <Input className="h-5 text-xs border-b border-black rounded-none px-1 text-center" />
                <Label className="text-[8px] font-semibold tracking-wider">3. TRUCK/TRACTOR AND TRAILER(S) NO.</Label>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-2">
            <div className="space-y-1 border border-black p-1">
                 <div className="text-center space-y-1">
                    <Input className="h-5 text-xs border-b border-black rounded-none px-1 text-center" />
                    <Label className="text-[8px] font-semibold tracking-wider">4. NAME OF CARRIER</Label>
                 </div>
                  <div className="text-center space-y-1">
                    <Input className="h-5 text-xs border-b border-black rounded-none px-1 text-center" />
                    <Label className="text-[8px] font-semibold tracking-wider">5. CARRIER'S ADDRESS</Label>
                 </div>
            </div>
             <div className="space-y-1 border border-black p-1">
                <div className="text-center space-y-1">
                    <Input className="h-5 text-xs border-b border-black rounded-none px-1 text-center" />
                    <Label className="text-[8px] font-semibold tracking-wider">6. NAME OF CO-DRIVER</Label>
                </div>
                 <div className="text-center space-y-1">
                    <Input className="h-5 text-xs border-b border-black rounded-none px-1 text-center" />
                    <Label className="text-[8px] font-semibold tracking-wider">8. HOME TERMINAL ADDRESS</Label>
                </div>
            </div>
        </div>
         <div className="text-center space-y-1">
            <Input className="h-5 text-xs border-b border-black rounded-none px-1 text-center" />
            <Label className="text-[8px] font-semibold tracking-wider">9. SHIPPING DOCUMENT NUMBER(S) OR NAME OF SHIPPER & COMMODITY</Label>
        </div>

        <LogGrid />
        
        <div className="grid grid-cols-2 gap-x-2 items-end pt-1">
             <div className="text-center space-y-1">
                <Input className="h-5 text-xs border-b border-black rounded-none px-1 text-center" />
                <Label className="text-[8px] font-semibold tracking-wider">7. I CERTIFY THESE ENTRIES ARE TRUE AND CORRECT</Label>
            </div>
            <div className="text-center space-y-1">
                <Input className="h-5 text-xs border-b border-black rounded-none px-1 text-center" />
                <Label className="text-[8px] font-semibold tracking-wider">10. NAME OF DRIVER (PRINT)</Label>
            </div>
        </div>
    </div>
);


const PaperLogTemplate = React.forwardRef<HTMLDivElement, {}>((props, ref) => (
    <div ref={ref}>
        <SingleLogTemplate />
        <Separator className="my-4 border-dashed bg-black" />
        <SingleLogTemplate />
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

export default function PaperLogsPage() {
    const templateRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const { currentUser } = useSchedule();
    const [uploadedLogs, setUploadedLogs] = useState<UploadedLog[]>([]);
    const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [newLogData, setNewLogData] = useState<{ logDate: Date | null, documentUri: string | null } | null>(null);

    useEffect(() => {
        const clientSideInitialLogs: UploadedLog[] = [
            { id: 'LOG001', driverName: 'John Doe', logDate: new Date(new Date().setDate(new Date().getDate() - 2)), uploadDate: new Date(new Date().setDate(new Date().getDate() - 1)), documentUri: 'https://picsum.photos/seed/log1/800/1100' },
            { id: 'LOG002', driverName: 'Jane Doe', logDate: new Date(new Date().setDate(new Date().getDate() - 1)), uploadDate: new Date(), documentUri: 'https://picsum.photos/seed/log2/800/1100' },
        ];
        setUploadedLogs(clientSideInitialLogs);
        setNewLogData({ logDate: new Date(), documentUri: null });
    }, []);

    const handlePrint = () => {
        const content = templateRef.current;
        if (content) {
            const printWindow = window.open('', '', 'height=1100,width=850');
            printWindow?.document.write('<html><head><title>Print Paper Log</title>');
            printWindow?.document.write('<style>body{font-family:sans-serif;}input,textarea{border:none;border-bottom:1px solid #000;border-radius:0;padding:2px;width:100%;font-size:10px;}label{font-size:8px;font-weight:600;text-transform:uppercase;} .font-headline{ font-family: "Space Grotesk", sans-serif;} .font-sans{font-family: sans-serif} .text-center{text-align:center;} .text-base{font-size:1rem;} .text-xs{font-size:.75rem;} .font-bold{font-weight:700;} .tracking-wider{letter-spacing:.05em;} .h-5{height:1.25rem;} .text-\\[8px\\]{font-size:8px;} .border-black{border-color:#000;} .border-b{border-bottom-width:1px;} .px-1{padding-left:.25rem;padding-right:.25rem;} .grid{display:grid;} .grid-cols-3{grid-template-columns:repeat(3,1fr);} .grid-cols-2{grid-template-columns:repeat(2,1fr);} .gap-x-2{column-gap:.5rem;} .pt-1{padding-top:.25rem;} .mb-2{margin-bottom:.5rem;} .space-y-1 > * + *{margin-top:0.25rem;} .border{border-width:1px;} .p-1{padding:0.25rem;} .items-end{align-items:flex-end;} .border-l{border-left-width:1px;} .border-r{border-right-width:1px;} .col-span-1{grid-column:span 1 / span 1;} .col-span-9{grid-column:span 9/span 9;} .col-span-3{grid-column:span 3/span 3;} .grid-cols-12{grid-template-columns:repeat(12,1fr);} .p-1{padding:0.25rem;} .h-20{height:5rem;} .space-y-0\\.5 > * + *{margin-top:0.125rem;} .text-\\[9px\\]{font-size:9px;} .grid-cols-25{grid-template-columns: 8% repeat(24, 3.833333%);} .leading-tight{line-height:1.25;} .flex{display:flex;} .items-center{align-items:center;} .justify-center{justify-content:center;} .font-semibold{font-weight:600;} .border-dashed{border-style:dashed;} .border-gray-300{border-color:#d1d5db;} .min-h-\\[32px\\]{min-height:32px;} .my-4{margin-top:1rem;margin-bottom:1rem;} .bg-gray-100{background-color:#f3f4f6;}</style>');
            printWindow?.document.write('<body style="transform: scale(0.95); transform-origin: top left;">');
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
        if (!newLogData?.documentUri || !newLogData?.logDate) {
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
                        Use this template to print or email blank logs for manual completion. Two logs fit on one page.
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleEmail}><Mail className="mr-2"/>Email</Button>
                    <Button onClick={handlePrint}><Printer className="mr-2"/>Print Blank Log</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                   <div className="w-full max-w-4xl mx-auto origin-top" style={{'--tw-scale-x': '0.9', '--tw-scale-y': '0.9', transform: 'scale(var(--tw-scale-x), var(--tw-scale-y))'}}>
                        <PaperLogTemplate ref={templateRef} />
                    </div>
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
                            {newLogData?.logDate && (
                                <Input 
                                id="log-date" 
                                type="date" 
                                value={format(newLogData.logDate, 'yyyy-MM-dd')}
                                onChange={(e) => setNewLogData(prev => prev ? {...prev, logDate: new Date(e.target.value)} : null)}
                            />
                            )}
                    </div>
                        <div className="space-y-2">
                        <Label>Document</Label>
                            <DocumentUpload 
                            onDocumentChange={(uri) => setNewLogData(prev => prev ? ({...prev, documentUri: uri}) : null)} 
                            currentDocument={newLogData?.documentUri || null}
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

