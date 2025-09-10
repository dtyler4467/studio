
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSchedule, Applicant } from '@/hooks/use-schedule';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DocumentUpload } from './document-upload';

export function AddApplicantDialog() {
  const { addApplicant, jobPostings } = useSchedule();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Applicant, 'id' | 'applicationDate' | 'status'>>({
    name: '',
    email: '',
    phone: '',
    applyingFor: '',
    resumeUri: null,
  });

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.applyingFor) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill out Name, Email, and Applying For fields.' });
      return;
    }
    addApplicant({ ...formData, status: 'Applied' });
    setIsOpen(false);
    setFormData({ name: '', email: '', phone: '', applyingFor: '', resumeUri: null }); // Reset form
    toast({ title: 'Applicant Added', description: `${formData.name} has been added to the applicant pool.` });
  };

  const handleDocumentChange = (uri: string | null) => {
    setFormData(prev => ({...prev, resumeUri: uri }));
  }

  const openJobs = jobPostings.filter(j => j.status === 'Open');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2" /> Add Applicant</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manually Add Applicant</DialogTitle>
          <DialogDescription>
            Fill out the details below for a new candidate.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Full Name</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Phone</Label>
            <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="applyingFor" className="text-right">Applying For</Label>
            <Select value={formData.applyingFor} onValueChange={(value) => setFormData({ ...formData, applyingFor: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a job" />
              </SelectTrigger>
              <SelectContent>
                {openJobs.map(job => (
                  <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
             <Label className="text-right pt-2">Resume</Label>
             <div className="col-span-3">
                <DocumentUpload onDocumentChange={handleDocumentChange} currentDocument={formData.resumeUri} />
             </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Add Applicant</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
