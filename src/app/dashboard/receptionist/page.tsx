
"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Users, LogIn, LogOut, Camera, Check, X } from 'lucide-react';
import { useSchedule, Visitor, OfficeAppointment, Note } from '@/hooks/use-schedule';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScheduleCalendar } from '@/components/dashboard/schedule-calendar';
import { OfficeAppointmentDataTable } from '@/components/dashboard/office-appointment-data-table';
import { NoteList } from '@/components/dashboard/note-list';
import { Translator } from '@/components/dashboard/translator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const VisitorLogTable = () => {
    const { visitors, updateVisitorStatus } = useSchedule();
    const sortedVisitors = [...visitors].sort((a,b) => b.checkInTime.getTime() - a.checkInTime.getTime());

    return (
        <Card>
            <CardHeader>
                <CardTitle>Visitor Log</CardTitle>
                <CardDescription>A log of recent visitor check-ins and check-outs.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Visitor</TableHead>
                                <TableHead>Visiting</TableHead>
                                <TableHead>Check-in</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedVisitors.map(visitor => (
                                <TableRow key={visitor.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                {visitor.photoDataUri && <AvatarImage src={visitor.photoDataUri} alt={visitor.name} />}
                                                <AvatarFallback>{visitor.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{visitor.name}</p>
                                                <p className="text-sm text-muted-foreground">{visitor.company}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{visitor.visiting}</TableCell>
                                    <TableCell>{format(visitor.checkInTime, 'p')}</TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={
                                                visitor.status === 'Accepted' ? 'default' :
                                                visitor.status === 'Declined' ? 'destructive' : 'secondary'
                                            }
                                            className={visitor.status === 'Accepted' ? 'bg-green-600' : ''}
                                        >
                                            {visitor.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};


const LiveReceptionistView = () => {
    const { employees, addVisitor } = useSchedule();
    const { toast } = useToast();
    const [formData, setFormData] = useState({ name: '', company: '', visiting: '', reason: '' });

    const handleCheckIn = () => {
        if (!formData.name || !formData.visiting) {
            toast({ variant: 'destructive', title: 'Error', description: 'Visitor name and who they are visiting are required.' });
            return;
        }
        const visitingEmployee = employees.find(e => e.name === formData.visiting);

        addVisitor({
            name: formData.name,
            company: formData.company,
            visiting: formData.visiting,
            reason: formData.reason,
            visitType: 'Walk-in',
            photoDataUri: null,
        });

        toast({
            title: 'Visitor Checked In',
            description: `${formData.name} from ${formData.company} has been checked in.`
        });
        
        if(visitingEmployee?.email) {
            const subject = `Your Visitor Has Arrived: ${formData.name}`;
            const body = `${formData.name} from ${formData.company} is here to see you for: ${formData.reason || 'a meeting'}.\n\nThey are waiting in the lobby.`;
            window.location.href = `mailto:${visitingEmployee.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
        
        setFormData({ name: '', company: '', visiting: '', reason: '' });
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Manual Visitor Check-in</CardTitle>
                    <CardDescription>Enter visitor details below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="visitor-name">Visitor Name</Label>
                            <Input id="visitor-name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="visitor-company">Company</Label>
                            <Input id="visitor-company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="visiting">Person to See</Label>
                        <Select value={formData.visiting} onValueChange={value => setFormData({...formData, visiting: value})}>
                            <SelectTrigger><SelectValue placeholder="Select an employee..." /></SelectTrigger>
                            <SelectContent>
                                {employees.map(e => <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Visit</Label>
                        <Textarea id="reason" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
                    </div>
                    <Button onClick={handleCheckIn} className="w-full"><LogIn className="mr-2"/>Check In Visitor</Button>
                </CardContent>
            </Card>
            <VisitorLogTable />
        </div>
    )
}

const SelfServiceKioskView = () => {
    const { employees, addVisitor, updateVisitorStatus } = useSchedule();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [visitorData, setVisitorData] = useState<Partial<Visitor>>({});
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);
    
    const handleCapture = () => {
        const canvas = document.createElement('canvas');
        if (videoRef.current) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const photoDataUri = canvas.toDataURL('image/png');
            setVisitorData(prev => ({...prev, photoDataUri}));
            handleNext();
        }
    }

    const handleCheckIn = () => {
        if (!visitorData.name || !visitorData.visiting) {
            toast({ variant: 'destructive', title: 'Error', description: 'Missing information.' });
            return;
        }

        const newVisitor = addVisitor({
            name: visitorData.name,
            company: visitorData.company || 'N/A',
            visiting: visitorData.visiting,
            reason: visitorData.reason || 'Walk-in',
            visitType: visitorData.visitType || 'Walk-in',
            appointmentTime: visitorData.appointmentTime,
            photoDataUri: visitorData.photoDataUri || null,
        });

        toast({
            duration: 10000,
            title: `Alert Sent to ${visitorData.visiting}`,
            description: `${visitorData.name} is waiting for you in the lobby.`,
            action: (
                 <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={() => updateVisitorStatus(newVisitor.id, 'Accepted')}>
                        <Check className="mr-2" /> Accept
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => updateVisitorStatus(newVisitor.id, 'Declined')}>
                        <X className="mr-2"/> Decline
                    </Button>
                </div>
            )
        });

        handleNext();
    };
    
     const handleReset = () => {
        setVisitorData({});
        setStep(1);
    }

    const visitingEmployee = employees.find(e => e.name === visitorData.visiting);

    useEffect(() => {
        if (step === 2 && videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    if(videoRef.current) videoRef.current.srcObject = stream;
                })
                .catch(err => console.error("camera error:", err));
        } else if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
    }, [step]);

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">Welcome! Please Check In</CardTitle>
            </CardHeader>
            <CardContent>
                {step === 1 && (
                    <div className="space-y-6">
                         <div className="space-y-2">
                            <Label htmlFor="visitor-name-kiosk" className="text-lg">Your Full Name</Label>
                            <Input id="visitor-name-kiosk" value={visitorData.name || ''} onChange={e => setVisitorData({...visitorData, name: e.target.value})} className="h-12 text-lg" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="visitor-company-kiosk" className="text-lg">Your Company</Label>
                            <Input id="visitor-company-kiosk" value={visitorData.company || ''} onChange={e => setVisitorData({...visitorData, company: e.target.value})} className="h-12 text-lg" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="visiting-kiosk" className="text-lg">Who are you here to see?</Label>
                             <Select value={visitorData.visiting} onValueChange={value => setVisitorData({...visitorData, visiting: value})}>
                                <SelectTrigger className="h-12 text-lg"><SelectValue placeholder="Select an employee..." /></SelectTrigger>
                                <SelectContent>
                                    {employees.map(e => <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="visit-type" className="text-lg">Do you have an appointment?</Label>
                            <Select value={visitorData.visitType} onValueChange={(v: Visitor['visitType']) => setVisitorData({...visitorData, visitType: v})}>
                                <SelectTrigger className="h-12 text-lg"><SelectValue placeholder="Select an option..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Appointment">Yes, I have an appointment</SelectItem>
                                    <SelectItem value="Walk-in">No, I am a walk-in</SelectItem>
                                    <SelectItem value="Appointment">I need to make an appointment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="reason-kiosk" className="text-lg">Reason for visit</Label>
                            <Textarea id="reason-kiosk" value={visitorData.reason || ''} onChange={e => setVisitorData({...visitorData, reason: e.target.value})} className="text-lg" />
                        </div>
                        <Button onClick={handleNext} className="w-full h-14 text-xl">Next Step</Button>
                    </div>
                )}
                 {step === 2 && (
                    <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold">Please Take a Photo</h3>
                        <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        </div>
                         <Button onClick={handleCapture} className="w-full h-14 text-xl"><Camera className="mr-2"/>Take Photo & Continue</Button>
                         <Button variant="link" onClick={handleBack}>Go Back</Button>
                    </div>
                )}
                {step === 3 && (
                    <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold">Confirm Your Information</h3>
                        <div className="flex flex-col items-center gap-4">
                            {visitorData.photoDataUri && <img src={visitorData.photoDataUri} alt="Visitor" className="w-32 h-32 rounded-full object-cover" />}
                            <p><strong>Name:</strong> {visitorData.name}</p>
                            <p><strong>Company:</strong> {visitorData.company}</p>
                            <p><strong>Visiting:</strong> {visitorData.visiting}</p>
                             <p><strong>Reason:</strong> {visitorData.reason}</p>
                        </div>
                         <Button onClick={handleCheckIn} className="w-full h-14 text-xl"><LogIn className="mr-2"/>Check In</Button>
                         <Button variant="link" onClick={handleBack}>Go Back & Edit</Button>
                    </div>
                )}
                {step === 4 && (
                    <div className="text-center py-10">
                        <h2 className="text-3xl font-bold font-headline">Thank You, {visitorData.name}!</h2>
                        <p className="text-lg text-muted-foreground mt-2">
                            {visitingEmployee?.name || 'Your party'} has been notified of your arrival.
                        </p>
                        <p className="mt-4">Please take your badge and have a seat in the lobby.</p>
                        
                        <div className="w-64 mx-auto mt-6 p-4 border rounded-lg bg-background text-left">
                            <h4 className="font-bold text-center text-lg">VISITOR</h4>
                            <div className="flex flex-col items-center gap-2 my-4">
                                 {visitorData.photoDataUri && <img src={visitorData.photoDataUri} alt="Visitor" className="w-24 h-24 rounded-full object-cover" />}
                                 <p className="font-bold text-xl">{visitorData.name}</p>
                                 <p className="text-sm">{visitorData.company}</p>
                            </div>
                            <p className="text-xs"><strong>Visiting:</strong> {visitorData.visiting}</p>
                             <p className="text-xs"><strong>Date:</strong> {format(new Date(), 'PPP')}</p>
                        </div>
                        
                        <Button onClick={handleReset} className="mt-8">New Check-in</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const NotesTab = () => {
    const { notes, addNote, updateNote, deleteNote, bulkAddNotes } = useSchedule();
    const { toast } = useToast();
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');

     React.useEffect(() => {
        if (selectedNote) {
            setNoteTitle(selectedNote.title);
            setNoteContent(selectedNote.content);
        } else {
            setNoteTitle('');
            setNoteContent('');
        }
    }, [selectedNote]);

    const handleSaveNote = () => {
        if (!noteTitle.trim()) {
            toast({ variant: 'destructive', title: 'Title is required.' });
            return;
        }
        if (selectedNote) {
            updateNote(selectedNote.id, { title: noteTitle, content: noteContent });
            toast({ title: 'Note Updated' });
        } else {
            const newNote = addNote({ title: noteTitle, content: noteContent, tags: [] });
            setSelectedNote(newNote);
            toast({ title: 'Note Saved' });
        }
    };

     const handleNewNote = () => {
        setSelectedNote(null);
        setNoteTitle('');
        setNoteContent('');
    };

     const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `logiflow_notes_${format(new Date(), 'yyyy-MM-dd')}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast({ title: 'Notes Exported' });
    }
    
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedNotes = JSON.parse(e.target?.result as string);
                if (Array.isArray(importedNotes)) {
                    bulkAddNotes(importedNotes);
                    toast({ title: 'Notes Imported', description: `${importedNotes.length} notes have been added.` });
                } else {
                    throw new Error("Invalid file format.");
                }
            } catch (err) {
                 toast({ variant: 'destructive', title: 'Import Failed', description: 'The selected file is not a valid notes export.' });
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    }
    
    return (
        <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
                 <NoteList 
                    notes={notes}
                    selectedNote={selectedNote}
                    onSelectNote={setSelectedNote}
                    onNewNote={handleNewNote}
                    onExport={handleExport}
                    onImport={handleImport}
                />
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <Input
                            placeholder="Note Title"
                            className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 font-headline"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                        />
                        <CardDescription>
                            {selectedNote ? `Last updated: ${format(selectedNote.date, 'PPP p')}` : 'A new note'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Textarea
                            placeholder="Start writing..."
                            className="h-96 resize-none border-none shadow-none focus-visible:ring-0"
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                        />
                    </CardContent>
                    <CardContent className="flex justify-end">
                        <Button onClick={handleSaveNote}>Save Note</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


export default function ReceptionistPage() {
    const [mode, setMode] = useState<'live' | 'self-service'>('live');

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Receptionist Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="visitors" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="visitors">Visitor Management</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="translator">Translator</TabsTrigger>
            <TabsTrigger value="record">Record</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visitors" className="mt-6">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Visitor Management</h2>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant={mode === 'live' ? 'default' : 'outline'} onClick={() => setMode('live')}><User className="mr-2"/> Live Interaction</Button>
                        <Button variant={mode === 'self-service' ? 'default' : 'outline'} onClick={() => setMode('self-service')}><Users className="mr-2"/> Self-Service Kiosk</Button>
                    </div>
                </div>
                {mode === 'live' ? <LiveReceptionistView /> : <SelfServiceKioskView />}
          </TabsContent>

          <TabsContent value="appointments">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Company Calendar & Appointments</CardTitle>
                    <CardDescription>View all company events and manage office appointments.</CardDescription>
                </CardHeader>
                <CardContent className="grid lg:grid-cols-2 gap-6">
                    <ScheduleCalendar />
                    <OfficeAppointmentDataTable />
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="notes">
            <NotesTab />
          </TabsContent>

          <TabsContent value="translator">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Language Translator</CardTitle>
                    <CardDescription>Translate text between languages.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Translator />
                </CardContent>
            </Card>
          </TabsContent>
           <TabsContent value="record">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Record</CardTitle>
                    <CardDescription>Screen and voice recording functionality.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                        <p className="text-muted-foreground">Recording functionality coming soon.</p>
                    </div>
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
