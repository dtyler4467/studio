
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useSchedule, Handbook } from '@/hooks/use-schedule';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';

const UploadHandbookDialog = ({ onSave, isOpen, onOpenChange }: { onSave: (name: string, uri: string) => void, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    const [name, setName] = useState('');
    const [documentUri, setDocumentUri] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSave = () => {
        if (!name || !documentUri) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please provide a name and upload a document.' });
            return;
        }
        onSave(name, documentUri);
        setName('');
        setDocumentUri(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload New Handbook</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="handbook-name">Handbook Name</Label>
                        <Input id="handbook-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., 2025 Employee Handbook" />
                    </div>
                     <div className="space-y-2">
                        <Label>Document</Label>
                        <DocumentUpload onDocumentChange={setDocumentUri} currentDocument={documentUri} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Handbook</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ClientFormattedDate = ({ date }: { date: Date }) => {
    const [formattedDate, setFormattedDate] = useState<string | null>(null);
    useEffect(() => {
        setFormattedDate(format(date, 'PPP'));
    }, [date]);

    if (!formattedDate) {
        return <span className="text-muted-foreground">Loading...</span>;
    }

    return <>{formattedDate}</>;
}


export default function HandbookPage() {
    const { handbooks, addHandbook, deleteHandbook } = useSchedule();
    const [isUploadOpen, setUploadOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleSaveHandbook = (name: string, documentUri: string) => {
        addHandbook(name, documentUri);
        setUploadOpen(false);
        toast({ title: 'Handbook Uploaded', description: `Successfully uploaded ${name}.` });
    };

    const handleDelete = (id: string) => {
        deleteHandbook(id);
        toast({ variant: 'destructive', title: 'Handbook Deleted' });
    }

    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Employee Handbook Management" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader className="flex-row items-start justify-between">
                        <div>
                            <CardTitle className="font-headline">Manage Handbooks</CardTitle>
                            <CardDescription>
                                Upload new versions and manage past employee handbooks.
                            </CardDescription>
                        </div>
                        <Button onClick={() => setUploadOpen(true)}><PlusCircle className="mr-2"/> Upload New Handbook</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <th className="p-4 text-left">Name</th>
                                        <th className="p-4 text-left">Date Uploaded</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </TableRow>
                                </TableHeader>
                                <tbody>
                                    {handbooks.map(hb => (
                                        <TableRow key={hb.id} onClick={() => router.push(`/dashboard/hr/policies/handbook/${hb.id}`)} className="cursor-pointer">
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                {hb.name}
                                            </TableCell>
                                            <TableCell><ClientFormattedDate date={hb.uploadedAt} /></TableCell>
                                            <TableCell className="p-4 text-right">
                                                <AlertDialog>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}><MoreHorizontal/></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                                                            <DropdownMenuItem><Pencil className="mr-2"/> Rename</DropdownMenuItem>
                                                            <DropdownMenuSeparator/>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}><Trash2 className="mr-2"/> Delete</DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the handbook "{hb.name}".
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(hb.id)}>Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
                <UploadHandbookDialog isOpen={isUploadOpen} onOpenChange={setUploadOpen} onSave={handleSaveHandbook} />
            </main>
        </div>
    );
}
