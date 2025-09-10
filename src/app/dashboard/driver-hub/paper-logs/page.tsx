
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
            <div className="grid grid-cols-25">
                <div className="col-span-2 flex flex-col items-center justify-center p-1 font-bold border-r border-black">
                    <p>Mid</p>
                    <p>Night</p>
                </div>
                 <div className="col-span-4 border-r border-black text-center font-semibold p-1">1 Off Duty</div>
                 <div className="col-span-4 border-r border-black text-center font-semibold p-1">2 Sleeper Berth</div>
                 <div className="col-span-4 border-r border-black text-center font-semibold p-1">3 Driving</div>
                 <div className="col-span-4 border-r border-black text-center font-semibold p-1">4 On Duty (Not Driving)</div>
                 <div className="col-span-7 p-1 font-bold text-center">Remarks</div>
            </div>
            {hours.map(hour => (
                 <div key={hour} className="grid grid-cols-25 border-t border-black min-h-[18px]">
                    <div className="col-span-2 border-r border-black text-center py-0.5">{hour + 1}</div>
                    <div className="col-span-4 border-r border-black grid grid-cols-4">
                        <div className="border-r border-dashed border-gray-400"></div>
                        <div className="border-r border-dashed border-gray-400"></div>
                        <div className="border-r border-dashed border-gray-400"></div>
                        <div></div>
                    </div>
                    <div className="col-span-4 border-r border-black grid grid-cols-4">
                        <div className="border-r border-dashed border-gray-400"></div>
                        <div className="border-r border-dashed border-gray-400"></div>
                        <div className="border-r border-dashed border-gray-400"></div>
                        <div></div>
                    </div>
                    <div className="col-span-4 border-r border-black grid grid-cols-4">
                        <div className="border-r border-dashed border-gray-400"></div>
                        <div className="border-r border-dashed border-gray-400"></div>
                        <div className="border-r border-dashed border-gray-400"></div>
                        <div></div>
                    </div>
                    <div className="col-span-4 border-r border-black grid grid-cols-4">
                         <div className="border-r border-dashed border-gray-400"></div>
                        <div className="border-r border-dashed border-gray-400"></div>
                        <div className="border-r border-dashed border-gray-400"></div>
                        <div></div>
                    </div>
                    <div className="col-span-7"></div>
                </div>
            ))}
             <div className="grid grid-cols-25 border-t border-black min-h-[18px]">
                <div className="col-span-2 flex flex-col items-center justify-center p-1 font-bold border-r border-black">
                    <p>Noon</p>
                </div>
                 <div className="col-span-4 border-r border-black text-center font-semibold p-1">1 Off Duty</div>
                 <div className="col-span-4 border-r border-black text-center font-semibold p-1">2 Sleeper Berth</div>
                 <div className="col-span-4 border-r border-black text-center font-semibold p-1">3 Driving</div>
                 <div className="col-span-4 border-r border-black text-center font-semibold p-1">4 On Duty</div>
                 <div className="col-span-7 p-1 font-bold text-center">Remarks</div>
            </div>
             <div className="grid grid-cols-5 border-t border-black text-xs">
                <div className="col-span-2 border-r border-black p-1">
                    <p>Total hours <span className="font-bold">1</span> = _____</p>
                    <p>Total hours <span className="font-bold">2</span> = _____</p>
                </div>
                <div className="col-span-2 border-r border-black p-1">
                     <p>Total hours <span className="font-bold">3</span> = _____</p>
                    <p>Total hours <span className="font-bold">4</span> = _____</p>
                </div>
                <div className="col-span-1 p-1">
                    <p>Total hours = _____</p>
                    <p>(Must equal 24)</p>
                </div>
            </div>
        </div>
    )
}

const SingleLogTemplate = () => (
    <div className="bg-white text-black p-4 space-y-2 font-sans text-[10px]">
        <div className="text-center">
            <h2 className="text-base font-bold font-headline tracking-wider">DRIVER'S DAILY LOG</h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
                <Input className="h-6 text-xs border-b border-black rounded-none px-1" />
                <Label className="text-[8px] font-semibold">1. DATE</Label>
            </div>
            <div className="text-center">
                <Input className="h-6 text-xs border-b border-black rounded-none px-1" />
                <Label className="text-[8px] font-semibold">2. TOTAL MILES DRIVING TODAY</Label>
            </div>
            <div className="text-center">
                <Input className="h-6 text-xs border-b border-black rounded-none px-1" />
                <Label className="text-[8px] font-semibold">3. TRUCK/TRACTOR AND TRAILER(S) NO.</Label>
            </div>
        </div>
        
        <div className="flex gap-2">
            <div className="w-2/3 space-y-1">
                 <div className="text-center">
                    <Input className="h-6 text-xs border-b border-black rounded-none px-1" />
                    <Label className="text-[8px] font-semibold">4. NAME OF CARRIER</Label>
                 </div>
                  <div className="text-center">
                    <Input className="h-6 text-xs border-b border-black rounded-none px-1" />
                    <Label className="text-[8px] font-semibold">5. CARRIER'S ADDRESS</Label>
                 </div>
                 <div className="text-center">
                    <Input className="h-6 text-xs border-b border-black rounded-none px-1" />
                    <Label className="text-[8px] font-semibold">6. NAME OF CO-DRIVER</Label>
                 </div>
            </div>
             <div className="w-1/3 space-y-1 text-center">
                <Input className="h-6 text-xs border-b border-black rounded-none px-1" />
                <Label className="text-[8px] font-semibold">7. DRIVER'S SIGNATURE</Label>
                <Input className="h-6 text-xs border-b border-black rounded-none px-1" />
                <Label className="text-[8px] font-semibold">8. HOME TERMINAL ADDRESS</Label>
            </div>
        </div>
        <div className="text-center">
            <Input className="h-6 text-xs border-b border-black rounded-none px-1" />
            <Label className="text-[8px] font-semibold">9. SHIPPING DOCUMENT NUMBER(S) OR NAME OF SHIPPER & COMMODITY</Label>
        </div>

        <LogGrid />

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
            const printWindow = window.open('', '', 'height=1100,width=850');
            printWindow?.document.write('<html><head><title>Print Paper Log</title>');
            // A simple way to include Tailwind-like styles for printing
            printWindow?.document.write('<style>body{font-family:sans-serif;}input,textarea{border:1px solid #000;border-radius:0;padding:0.5rem;width:100%;}label{font-size:0.75rem;font-weight:600;text-transform:uppercase;} .font-headline{ font-family: "Space Grotesk", sans-serif;} .font-sans{font-family: sans-serif} .flex{display:flex;} .gap-2{gap:.5rem;} .w-1\\/3{width:33.333333%} .w-2\\/3{width:66.666667%} .space-y-1 > * + *{margin-top:0.25rem;} .text-center{text-align:center;} .text-lg{font-size:1.125rem;} .text-base{font-size:1rem;} .text-sm{font-size:.875rem;} .font-bold{font-weight:700;} .tracking-wider{letter-spacing:.05em;} .h-6{height:1.5rem;} .text-xs{font-size:.75rem;} .text-\\[8px\\]{font-size:8px;} .border-black{border-color:#000;} .border-b{border-bottom-width:1px;} .px-1{padding-left:.25rem;padding-right:.25rem;} .grid{display:grid;} .grid-cols-3{grid-template-columns:repeat(3,1fr);} .flex-col{flex-direction:column;} .flex-grow{flex-grow:1;} .grid-cols-25{grid-template-columns: 50px repeat(16, 1fr) 150px;} .grid-cols-4{grid-template-columns:repeat(4,1fr);} .col-span-1{grid-column:span 1 / span 1;} .col-span-2{grid-column:span 2 / span 2;} .col-span-4{grid-column:span 4 / span 4;} .col-span-7{grid-column:span 7 / span 7;} .border-t{border-top-width:1px;} .border-r{border-right-width:1px;} .border-l{border-left-width:1px;} .border-dashed{border-style:dashed;} .p-1{padding:.25rem;} .bg-gray-200{background-color:#e5e7eb;} .leading-tight{line-height:1.25;} .font-semibold{font-weight:600;} .gap-2{gap:.5rem;} .items-center{align-items:center;} .justify-center{justify-content:center;} .min-h-\\[18px\\]{min-height:18px;} .py-0\\.5{padding-top:0.125rem;padding-bottom:0.125rem;} .grid-cols-5{grid-template-columns:repeat(5,1fr);} .my-4{margin-top:1rem;margin-bottom:1rem;}</style>');
            printWindow?.document.write('</head><body>');
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
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                   <div className="max-w-4xl mx-auto origin-top">
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
