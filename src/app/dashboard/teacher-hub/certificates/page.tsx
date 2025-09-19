
"use client";

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Award, Printer, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import Image from 'next/image';

// Mock data, in a real app this would come from a context or API
const mockStudents = [
  { id: 'stud_1', name: 'Alice Johnson' },
  { id: 'stud_2', name: 'Bob Williams' },
  { id: 'stud_3', name: 'Charlie Brown' },
];

const CertificatePreview = React.forwardRef<HTMLDivElement, {
    schoolName: string;
    schoolLogo: string | null;
    title: string;
    recipientName: string;
    description: string;
    issuerName: string;
    issueDate?: Date;
    template: string;
}>(({ schoolName, schoolLogo, title, recipientName, description, issuerName, issueDate, template }, ref) => {
    
    const templateStyles = {
        classic: 'border-blue-800 bg-blue-50/50 text-blue-900',
        modern: 'border-gray-800 bg-gray-50 text-gray-900',
        playful: 'border-purple-600 bg-purple-50 text-purple-900',
    };

    return (
        <div ref={ref} className={cn("p-8 border-4 aspect-[11/8.5] w-full flex flex-col items-center justify-center text-center", templateStyles[template as keyof typeof templateStyles] || templateStyles.classic)}>
             {schoolLogo && <Image src={schoolLogo} alt="School Logo" width={80} height={80} className="mb-4" />}
            <h1 className="text-xl font-semibold">{schoolName}</h1>
            <h2 className="text-3xl font-bold mt-8 font-headline tracking-wider">{title}</h2>
            <p className="mt-4">This certificate is proudly presented to</p>
            <p className="text-4xl font-serif mt-2 border-b-2 pb-2 px-8">{recipientName || 'Student Name'}</p>
            <p className="mt-4 max-w-md mx-auto">{description || 'For outstanding achievement'}</p>
            <div className="flex justify-between w-full mt-auto pt-8">
                <div className="text-center">
                    <p className="border-t-2 pt-2 px-8 font-serif">{issuerName || 'Issuer Name'}</p>
                    <p className="text-xs">Signature</p>
                </div>
                <div className="text-center">
                    <p className="border-t-2 pt-2 px-8 font-serif">{issueDate ? format(issueDate, 'PPP') : 'Date'}</p>
                    <p className="text-xs">Date</p>
                </div>
            </div>
        </div>
    );
});
CertificatePreview.displayName = 'CertificatePreview';


export default function CertificatesPage() {
    const { toast } = useToast();
    const certificateRef = useRef<HTMLDivElement>(null);
    const [schoolName, setSchoolName] = useState('LogiFlow Academy');
    const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
    const [title, setTitle] = useState('Certificate of Achievement');
    const [recipientName, setRecipientName] = useState('');
    const [description, setDescription] = useState('For excellence in classroom participation and performance.');
    const [issuerName, setIssuerName] = useState('');
    const [issueDate, setIssueDate] = useState<Date | undefined>();
    const [template, setTemplate] = useState('classic');

    useEffect(() => {
        setIssueDate(new Date());
    }, []);

    const handlePrint = () => {
        if (!recipientName) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a student.'});
            return;
        }
        
        const content = certificateRef.current;
        if (content) {
            const printWindow = window.open('', '', 'height=850,width=1100');
            printWindow?.document.write('<html><head><title>Print Certificate</title>');
            const styles = Array.from(document.styleSheets)
                .map(s => s.href ? `<link rel="stylesheet" href="${s.href}">` : `<style>${Array.from(s.cssRules).map(r => r.cssText).join('')}</style>`)
                .join('\n');
            printWindow?.document.write(`<head>${styles}</head>`);
            printWindow?.document.write('<body style="-webkit-print-color-adjust: exact;">');
            printWindow?.document.write(content.innerHTML);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            setTimeout(() => { printWindow?.print(); }, 500);
        }
    }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Certificates" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <Award />
                Certificate Generator
            </CardTitle>
            <CardDescription>
              Create, customize, and issue certificates of achievement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Customization</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>School Name</Label>
                                <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>School Logo</Label>
                                <DocumentUpload onDocumentChange={setSchoolLogo} currentDocument={schoolLogo} />
                            </div>
                            <div className="space-y-2">
                                <Label>Template Style</Label>
                                <Select value={template} onValueChange={setTemplate}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="classic">Classic Blue</SelectItem>
                                        <SelectItem value="modern">Modern Gray</SelectItem>
                                        <SelectItem value="playful">Playful Purple</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="text-lg">Certificate Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Student</Label>
                                <Select value={recipientName} onValueChange={setRecipientName}>
                                    <SelectTrigger><SelectValue placeholder="Select a student..." /></SelectTrigger>
                                    <SelectContent>
                                        {mockStudents.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label>Issuer Name</Label>
                                    <Input value={issuerName} onChange={(e) => setIssuerName(e.target.value)} placeholder="e.g., Your Name" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Issue Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !issueDate && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {issueDate ? format(issueDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={issueDate} onSelect={setIssueDate} initialFocus /></PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                     <Card>
                        <CardHeader><CardTitle>Live Preview</CardTitle></CardHeader>
                        <CardContent>
                             <CertificatePreview
                                ref={certificateRef}
                                schoolName={schoolName}
                                schoolLogo={schoolLogo}
                                title={title}
                                recipientName={recipientName}
                                description={description}
                                issuerName={issuerName}
                                issueDate={issueDate}
                                template={template}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handlePrint} className="w-full" disabled={!recipientName}>
                                <Printer className="mr-2" /> Print Certificate
                            </Button>
                        </CardFooter>
                     </Card>
                </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
