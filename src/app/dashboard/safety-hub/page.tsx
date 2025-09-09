
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, PlusCircle, Calendar, AlertTriangle, HeartPulse, UserCheck } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { useToast } from '@/hooks/use-toast';
import { useSchedule, Employee } from '@/hooks/use-schedule';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { useDebounce } from '@/hooks/use-debounce';

type Incident = {
    id: string;
    type: 'Accident' | 'Injury' | 'Near Miss' | 'Safety Observation';
    date: Date;
    location: string;
    description: string;
    personnelInvolved: string[]; // employee names
    correctiveAction?: string;
    status: 'Open' | 'Under Investigation' | 'Closed';
    documentUri?: string | null;
};

const initialIncidents: Incident[] = [
    { id: 'INC-001', type: 'Near Miss', date: new Date(new Date().setDate(new Date().getDate() - 2)), location: 'Warehouse Bay 3', description: 'Forklift almost hit a pedestrian who was not in the designated walkway.', personnelInvolved: ['John Doe', 'Forklift Operator'], status: 'Closed', correctiveAction: 'Retraining on pedestrian safety and warehouse markings.' },
    { id: 'INC-002', type: 'Injury', date: new Date(new Date().setDate(new Date().getDate() - 10)), location: 'Dock Door 7', description: 'Minor cut on hand while opening a container.', personnelInvolved: ['Jane Doe'], status: 'Closed', correctiveAction: 'Issued new safety gloves to all dock workers.' },
    { id: 'INC-003', type: 'Accident', date: new Date(new Date().setDate(new Date().getDate() - 5)), location: 'Yard Parking Lane L12', description: 'Truck backing into lane scraped the adjacent trailer.', personnelInvolved: ['Mike Smith'], status: 'Under Investigation' },
];

const NewIncidentDialog = ({ isOpen, onOpenChange, onSave }: { isOpen: boolean, onOpenChange: (open: boolean) => void, onSave: (incident: Omit<Incident, 'id' | 'status'>) => void }) => {
    const { employees } = useSchedule();
    const { toast } = useToast();
    const [type, setType] = useState<'Accident' | 'Injury' | 'Near Miss' | 'Safety Observation'>('Safety Observation');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [personnelInvolved, setPersonnelInvolved] = useState<string[]>([]);
    const [correctiveAction, setCorrectiveAction] = useState('');
    const [documentUri, setDocumentUri] = useState<string | null>(null);

    const employeeOptions: MultiSelectOption[] = useMemo(() => employees.map(e => ({ value: e.name, label: e.name })), [employees]);

    const handleSave = () => {
        if (!type || !location || !description) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out Type, Location, and Description fields.' });
            return;
        }
        onSave({
            type,
            date: new Date(),
            location,
            description,
            personnelInvolved,
            correctiveAction,
            documentUri,
        });
        onOpenChange(false);
        // Reset form
        setType('Safety Observation');
        setLocation('');
        setDescription('');
        setPersonnelInvolved([]);
        setCorrectiveAction('');
        setDocumentUri(null);
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>New Incident Report</DialogTitle>
                    <DialogDescription>
                        Fill out the details below to create a new safety incident report.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                             <Label htmlFor="type">Incident Type</Label>
                             <Select value={type} onValueChange={(v: any) => setType(v)}>
                                <SelectTrigger id="type"><SelectValue placeholder="Select type..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Accident">Accident</SelectItem>
                                    <SelectItem value="Injury">Injury</SelectItem>
                                    <SelectItem value="Near Miss">Near Miss</SelectItem>
                                    <SelectItem value="Safety Observation">Safety Observation</SelectItem>
                                </SelectContent>
                             </Select>
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Warehouse Aisle 4" />
                         </div>
                     </div>
                     <div className="space-y-2">
                        <Label>Personnel Involved</Label>
                        <MultiSelect
                            options={employeeOptions}
                            selected={personnelInvolved}
                            onChange={setPersonnelInvolved}
                            placeholder="Select personnel..."
                            allowOther
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Description of Incident</Label>
                        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Provide a detailed, objective account..." />
                     </div>
                      <div className="space-y-2">
                        <Label htmlFor="action">Corrective Action Taken (Optional)</Label>
                        <Textarea id="action" value={correctiveAction} onChange={e => setCorrectiveAction(e.target.value)} placeholder="Describe immediate actions taken..." />
                     </div>
                     <div className="space-y-2">
                         <Label>Attach Document or Photo (Optional)</Label>
                         <DocumentUpload onDocumentChange={setDocumentUri} currentDocument={documentUri} />
                     </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Report</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function SafetyHubPage() {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { toast } = useToast();

  const handleSaveIncident = (incidentData: Omit<Incident, 'id' | 'status'>) => {
    const newIncident: Incident = {
        ...incidentData,
        id: `INC-${Date.now()}`,
        status: 'Open'
    };
    setIncidents(prev => [newIncident, ...prev]);
    toast({ title: 'Incident Reported', description: `Report ${newIncident.id} has been created.` });

    // Here you would trigger an email
    const subject = `New Safety Incident Reported: ${newIncident.type}`;
    const body = `A new safety incident has been reported.\n\nID: ${newIncident.id}\nType: ${newIncident.type}\nLocation: ${newIncident.location}\nDate: ${format(newIncident.date, 'Pp')}\n\nDescription: ${newIncident.description}`;
    const recipients = "safety-team@example.com"; // Placeholder
    
    // This will open the user's default email client.
    window.location.href = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
        const matchesSearch = debouncedSearchQuery ? 
            incident.id.toLowerCase().includes(debouncedSearchQuery) ||
            incident.location.toLowerCase().includes(debouncedSearchQuery) ||
            incident.description.toLowerCase().includes(debouncedSearchQuery) ||
            incident.personnelInvolved.some(p => p.toLowerCase().includes(debouncedSearchQuery))
            : true;
        
        const matchesDate = dateRange?.from ?
            isWithinInterval(incident.date, { start: dateRange.from, end: dateRange.to || dateRange.from })
            : true;
            
        return matchesSearch && matchesDate;
    })
  }, [incidents, debouncedSearchQuery, dateRange]);

  const daysSinceLastIncident = useMemo(() => {
    const lastAccident = incidents
        .filter(i => i.type === 'Accident' || i.type === 'Injury')
        .sort((a,b) => b.date.getTime() - a.date.getTime())[0];
    if (!lastAccident) return 365; // Default if no accidents logged
    return Math.floor((new Date().getTime() - lastAccident.date.getTime()) / (1000 * 60 * 60 * 24));
  }, [incidents]);

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Safety Hub" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{incidents.filter(i => i.status === 'Open' || i.status === 'Under Investigation').length}</div>
                    <p className="text-xs text-muted-foreground">Incidents needing attention</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Days Since Last Accident</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{daysSinceLastIncident}</div>
                    <p className="text-xs text-muted-foreground">Strive for continuous improvement</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Injuries Reported (YTD)</CardTitle>
                    <HeartPulse className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">{incidents.filter(i => i.type === 'Injury').length}</div>
                    <p className="text-xs text-muted-foreground">Review procedures to reduce risk</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Safety Observations</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{incidents.filter(i => i.type === 'Safety Observation').length}</div>
                    <p className="text-xs text-muted-foreground">Proactive reports from the team</p>
                </CardContent>
            </Card>
        </div>
        
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline flex items-center gap-2">
                    <ShieldCheck />
                    Incident Log
                </CardTitle>
                <CardDescription>
                A central log for all safety-related incidents, reports, and observations.
                </CardDescription>
            </div>
             <Button onClick={() => setIsDialogOpen(true)}><PlusCircle className="mr-2"/>New Incident Report</Button>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <Input 
                    placeholder="Search by ID, location, description, or personnel..." 
                    className="max-w-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                {(searchQuery || dateRange) && <Button variant="ghost" onClick={() => { setSearchQuery(''); setDateRange(undefined); }}>Clear</Button>}
            </div>
             <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Incident ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {filteredIncidents.length > 0 ? (
                            filteredIncidents.map(incident => (
                                <TableRow key={incident.id} className="cursor-pointer">
                                    <TableCell className="font-medium">{incident.id}</TableCell>
                                    <TableCell><Badge variant={incident.type === 'Accident' || incident.type === 'Injury' ? 'destructive' : 'secondary'}>{incident.type}</Badge></TableCell>
                                    <TableCell>{format(incident.date, 'PPP')}</TableCell>
                                    <TableCell>{incident.location}</TableCell>
                                    <TableCell>
                                        <Badge variant={incident.status === 'Closed' ? 'default' : 'outline'} className={incident.status === 'Closed' ? 'bg-green-600' : incident.status === 'Open' ? 'bg-amber-500' : ''}>{incident.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">No incidents found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
          </CardContent>
        </Card>
        
        <NewIncidentDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={handleSaveIncident} />
      </main>
    </div>
  );
}
