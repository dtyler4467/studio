
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Mail, Upload, FileText } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
        { num: 1, label: 'Off Duty' },
        { num: 2, label: 'Sleeper Berth' },
        { num: 3, label: 'Driving' },
        { num: 4, label: 'On Duty' },
    ];
    return (
        <div className="border border-black">
            <div className="grid grid-cols-[8%_repeat(24,_minmax(0,_1fr))_5%] border-b border-black text-center text-[8px] font-semibold">
                <div className="border-r border-black flex items-center justify-center p-1 leading-tight">Mid<br />Night</div>
                {hours.map(h => <div key={`h-top-${h}`} className="border-r border-black flex items-center justify-center">{h === 12 ? 'Noon' : h}</div>)}
                {hours.map(h => <div key={`h-bottom-${h}`} className="border-r border-black flex items-center justify-center">{h}</div>)}
                <div className="flex items-center justify-center p-1 leading-tight">Total<br />Hours</div>
            </div>
            {statuses.map(status => (
                <div key={status.num} className="grid grid-cols-[8%_repeat(24,_minmax(0,_1fr))_5%] border-b border-black text-sm">
                    <div className="border-r border-black flex items-center justify-center text-[10px] font-semibold p-1">{status.num} {status.label}</div>
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div key={`cell-${status.num}-${i}`} className="border-r border-black h-8 flex justify-around items-center">
                            <div className="h-full w-px border-l border-dashed border-gray-400"></div>
                            <div className="h-full w-px border-l border-dashed border-gray-400"></div>
                            <div className="h-full w-px border-l border-dashed border-gray-400"></div>
                        </div>
                    ))}
                    <div></div>
                </div>
            ))}
            <div className="grid grid-cols-[calc(8%_+_24*100%/26)_5%]">
                 <div className="grid grid-cols-1 border-r border-black">
                    <div className="p-1 text-center font-semibold text-[8px]">REMARKS</div>
                    <div className="h-16 border-t border-black"></div>
                </div>
                 <div className="grid grid-cols-1 text-center text-[8px] font-semibold">
                    <div className="p-1">TOTAL HOURS</div>
                    <div className="h-16 border-t border-black"></div>
                </div>
            </div>
        </div>
    );
};


const SingleLogTemplate = () => (
    <div className="bg-white text-black p-4 space-y-2 font-sans">
        <div className="text-center mb-4">
            <h2 className="text-lg font-bold font-headline tracking-wider">DRIVER'S DAILY LOG</h2>
            <p className="text-sm font-bold font-headline">ONE CALENDAR DAY</p>
        </div>

        <div className="flex gap-4 mb-2">
            <div className="flex-1 space-y-1">
                <Input className="h-8 border-black" />
                <Label className="block text-center text-[9px] font-semibold tracking-wider">MONTH/DAY/YEAR</Label>
            </div>
            <div className="flex-1 space-y-1">
                <Input className="h-8 border-black" />
                <Label className="block text-center text-[9px] font-semibold tracking-wider">TOTAL MILES DRIVEN TODAY</Label>
            </div>
            <div className="flex-1 space-y-1">
                <Input className="h-8 border-black" />
                <Label className="block text-center text-[9px] font-semibold tracking-wider">VEHICLE NUMBERS</Label>
            </div>
        </div>
        
        <div className="flex gap-4 mb-2">
            <div className="w-[66%] space-y-2">
                <div className="space-y-1">
                    <Input className="h-8 border-black" />
                    <Label className="block text-center text-[9px] font-semibold tracking-wider">NAME OF THE CARRIER</Label>
                </div>
                 <div className="space-y-1">
                    <Input className="h-8 border-black" />
                    <Label className="block text-center text-[9px] font-semibold tracking-wider">MAIN OFFICE ADDRESS</Label>
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                <div className="flex-grow border border-black"></div>
                <Label className="block text-center text-[9px] font-semibold tracking-wider mt-1">DRIVER'S SIGNATURE</Label>
            </div>
        </div>
        
        <div className="flex gap-4 mb-2">
            <div className="flex-1 space-y-1">
                <Input className="h-8 border-black" />
                <Label className="block text-center text-[9px] font-semibold tracking-wider">NAME OF THE CO-DRIVER</Label>
            </div>
            <div className="flex-1 space-y-1">
                <Input className="h-8 border-black" />
                <Label className="block text-center text-[9px] font-semibold tracking-wider">PRO OR SHIPPING NUMBER</Label>
            </div>
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
    const [newLogData, setNewLogData] = useState<{ logDate: Date | null, documentUri: string | null } | null>(null);

    useEffect(() => {
        // Client-side effect to prevent hydration mismatch for dates
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
            const styles = Array.from(document.styleSheets)
                .map(s => s.href ? `<link rel="stylesheet" href="${s.href}">` : `<style>${Array.from(s.cssRules).map(r => r.cssText).join('')}</style>`)
                .join('\n');
            printWindow?.document.write(`<head>${styles}</head>`);
            printWindow?.document.write('<body style="background-color: white; -webkit-print-color-adjust: exact;">');
            printWindow?.document.write(content.innerHTML);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            
            setTimeout(() => {
                printWindow?.print();
            }, 500); // Delay to ensure styles are loaded
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


