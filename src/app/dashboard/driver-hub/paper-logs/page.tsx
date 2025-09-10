
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
    const statuses = ['Off Duty', 'Sleeper Berth', 'Driving', 'On-Duty (Not Driving)'];
    return (
        <div className="border-t border-l">
            {statuses.map(status => (
                 <div key={status} className="grid grid-cols-25 border-b text-xs">
                    <div className="col-span-1 border-r p-1 text-right font-medium text-muted-foreground break-words w-[120px]">{status}</div>
                    {hours.map(hour => (
                        <div key={hour} className="col-span-1 border-r h-8"></div>
                    ))}
                 </div>
            ))}
             <div className="grid grid-cols-25 border-b text-xs text-muted-foreground">
                <div className="col-span-1 border-r p-1 text-right font-medium">Midnight</div>
                {hours.map(hour => (
                    <div key={hour} className="col-span-1 border-r text-center">{hour}</div>
                ))}
            </div>
        </div>
    )
}

const PaperLogTemplate = React.forwardRef<HTMLDivElement, {}>((props, ref) => (
    <div ref={ref} className="bg-white text-black p-4 space-y-4">
        <div className="text-center">
            <h2 className="text-xl font-bold">DRIVER'S DAILY LOG</h2>
        </div>

        <div className="grid grid-cols-3 gap-4 border p-2">
            <div className="space-y-1">
                <Label className="text-xs">Date</Label>
                <Input className="h-8 text-xs" />
            </div>
             <div className="space-y-1">
                <Label className="text-xs">Total Miles Driving Today</Label>
                <Input className="h-8 text-xs" />
            </div>
             <div className="space-y-1">
                <Label className="text-xs">Truck/Tractor and Trailer(s) No.</Label>
                <Input className="h-8 text-xs" />
            </div>
        </div>
        <div className="grid grid-cols-3 gap-4 border p-2">
            <div className="col-span-2 space-y-1">
                <Label className="text-xs">Carrier</Label>
                <Input className="h-8 text-xs" />
            </div>
             <div className="space-y-1">
                <Label className="text-xs">Driver's Signature</Label>
                <Input className="h-8 text-xs" />
            </div>
            <div className="col-span-2 space-y-1">
                <Label className="text-xs">Main Office Address</Label>
                <Input className="h-8 text-xs" />
            </div>
             <div className="space-y-1">
                <Label className="text-xs">Co-Driver Name</Label>
                <Input className="h-8 text-xs" />
            </div>
        </div>
        
        <LogGrid />

        <div className="grid grid-cols-2 gap-4 border p-2">
             <div className="space-y-1">
                <Label className="text-xs">Total Hours</Label>
                <Input className="h-8 text-xs" />
            </div>
             <div className="space-y-1">
                <Label className="text-xs">Shipping Document Number(s) or Name of Shipper and Commodity</Label>
                <Input className="h-8 text-xs" />
            </div>
        </div>

        <div className="space-y-1 border p-2">
            <Label className="text-xs">Remarks</Label>
            <textarea className="w-full border rounded-md p-2 min-h-[80px] text-xs" />
        </div>
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

const initialUploadedLogs: UploadedLog[] = [
    { id: 'LOG001', driverName: 'John Doe', logDate: new Date('2024-07-28'), uploadDate: new Date('2024-07-29'), documentUri: 'https://picsum.photos/seed/log1/800/1100' },
    { id: 'LOG002', driverName: 'Jane Doe', logDate: new Date('2024-07-29'), uploadDate: new Date('2024-07-30'), documentUri: 'https://picsum.photos/seed/log2/800/1100' },
]

export default function PaperLogsPage() {
    const templateRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const { currentUser } = useSchedule();
    const [uploadedLogs, setUploadedLogs] = useState(initialUploadedLogs);
    const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [newLogData, setNewLogData] = useState<{ logDate: Date | null, documentUri: string | null }>({ logDate: null, documentUri: null });

    useEffect(() => {
        setNewLogData({ logDate: new Date(), documentUri: null });
    }, []);

    const handlePrint = () => {
        const content = templateRef.current;
        if (content) {
            const printWindow = window.open('', '', 'height=800,width=1000');
            printWindow?.document.write('<html><head><title>Print Paper Log</title>');
            // A simple way to include Tailwind-like styles for printing
            printWindow?.document.write('<style>body{font-family:sans-serif;}input,textarea{border:1px solid #ccc;padding:0.5rem;width:100%;}label{font-size:0.75rem;}.grid{display:grid;gap:1rem;}.grid-cols-3{grid-template-columns:repeat(3,1fr);}.grid-cols-2{grid-template-columns:repeat(2,1fr);}.grid-cols-25{grid-template-columns:120px repeat(24,1fr);}.col-span-1{grid-column:span 1 / span 1;}.col-span-2{grid-column:span 2 / span 2;}.space-y-1 > * + *{margin-top:0.25rem;}.border{border:1px solid #ccc;}.border-b{border-bottom:1px solid #ccc;}.border-t{border-top:1px solid #ccc;}.border-l{border-left:1px solid #ccc;}.border-r{border-right:1px solid #ccc;}.p-1{padding:0.25rem;}.p-2{padding:0.5rem;}.p-4{padding:1rem;}.text-center{text-align:center;}.text-right{text-align:right;}.h-8{height:2rem;}.text-xs{font-size:0.75rem;}.font-bold{font-weight:700;}.font-medium{font-weight:500;}h2{font-size:1.25rem;}.text-muted-foreground{color:#777;}</style>');
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
