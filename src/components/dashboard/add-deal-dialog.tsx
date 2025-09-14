
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
import { useSchedule, Deal, DealStage } from '@/hooks/use-schedule';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const dealStages: DealStage[] = ['New', 'Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export function AddDealDialog() {
  const { addDeal, companies, employees, currentUser } = useSchedule();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Deal, 'id'>>({
    title: '',
    company: '',
    value: 0,
    stage: 'New',
    closeDate: new Date(),
    ownerId: currentUser?.id || '',
  });

  const handleSave = () => {
    if (!formData.title || !formData.company || !formData.value || !formData.ownerId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all required fields.' });
      return;
    }
    addDeal(formData);
    setIsOpen(false);
    setFormData({ title: '', company: '', value: 0, stage: 'New', closeDate: new Date(), ownerId: currentUser?.id || '' }); // Reset form
    toast({ title: 'Deal Added', description: `The deal "${formData.title}" has been created.` });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2" /> New Deal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
          <DialogDescription>
            Fill out the details below for the new sales opportunity.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Deal Title</Label>
            <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                 <Select value={formData.company} onValueChange={(value) => setFormData({ ...formData, company: value })}>
                    <SelectTrigger><SelectValue placeholder="Select a company" /></SelectTrigger>
                    <SelectContent>
                        {companies.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                 </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="value">Value ($)</Label>
                <Input id="value" type="number" value={formData.value || ''} onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="stage">Initial Stage</Label>
                 <Select value={formData.stage} onValueChange={(value: DealStage) => setFormData({ ...formData, stage: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {dealStages.filter(s => s !== 'Won' && s !== 'Lost').map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                 </Select>
            </div>
             <div className="space-y-2">
                <Label>Expected Close Date</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.closeDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.closeDate ? format(formData.closeDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.closeDate} onSelect={(date) => date && setFormData({...formData, closeDate: date})} initialFocus /></PopoverContent>
                 </Popover>
            </div>
          </div>
           <div className="space-y-2">
                <Label htmlFor="ownerId">Deal Owner</Label>
                 <Select value={formData.ownerId} onValueChange={(value) => setFormData({ ...formData, ownerId: value })}>
                    <SelectTrigger><SelectValue placeholder="Select an owner" /></SelectTrigger>
                    <SelectContent>
                        {employees.filter(e => e.role === 'Admin' || e.role === 'Manager').map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                    </SelectContent>
                 </Select>
            </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Create Deal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
