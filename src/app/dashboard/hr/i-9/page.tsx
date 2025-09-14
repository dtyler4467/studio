
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { useState, useMemo, useEffect } from 'react';
import { useSchedule, W4Template } from '@/hooks/use-schedule'; // Using W4Template as a placeholder
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { MoreHorizontal, Upload, FileText, Send, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle } from '@/components/ui/alert-dialog';

const UploadTemplateDialog = ({ onSave }: { onSave: (name: string, uri: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [documentUri, setDocumentUri] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSave = () => {
        if (!name || !documentUri) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please provide a name and upload a document.' });
            return;
        }
        onSave(name, documentUri);
        setIsOpen(false);
        setName('');
        setDocumentUri(null);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><Upload className="mr-2"/> Upload New Template</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload New I-9 Template</DialogTitle>
                    <DialogDescription>Provide a name for the template and upload the document.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input id="template-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., 2024 Form I-9" />
                    </div>
                     <div className="space-y-2">
                        <Label>Document</Label>
                        <DocumentUpload onDocumentChange={setDocumentUri} currentDocument={documentUri} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Template</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const ClientFormattedDate = ({ date }: { date: Date }) => {
    const [formattedDate, setFormattedDate] = useState<string | null>(null);
    useEffect(() => {
        setFormattedDate(format(date, 'PPP p'));
    }, [date]);

    if (!formattedDate) {
        return <span className="text-muted-foreground">Loading...</span>;
    }

    return <>{formattedDate}</>;
}


export default function I9TemplatesPage() {
  // Using W4 hooks as placeholders for I-9 functionality
  const { w4Templates, addW4Template, updateW4Template, deleteW4Template } = useSchedule();
  const { toast } = useToast();
  const [templateToRename, setTemplateToRename] = useState<W4Template | null>(null);
  const [newName, setNewName] = useState('');
  const [templateToDelete, setTemplateToDelete] = useState<W4Template | null>(null);

  const handleSaveTemplate = (name: string, documentUri: string) => {
    addW4Template(name, documentUri);
    toast({ title: 'Template Uploaded', description: `I-9 Template "${name}" has been saved.` });
  };
  
  const handleSend = (template: W4Template) => {
    toast({
        title: "Action Required",
        description: `This would open an email to send "${template.name}" to an employee.`
    });
  };

  const handlePreview = (documentUri: string) => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`<iframe src="${documentUri}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
      newWindow.document.title = "Template Preview";
    } else {
        toast({ variant: 'destructive', title: 'Popup Blocked', description: 'Please allow popups for this site to preview documents.' });
    }
  };

  const handleRename = () => {
    if (templateToRename && newName) {
        updateW4Template(templateToRename.id, newName);
        toast({ title: 'Template Renamed', description: 'The I-9 template name has been updated.' });
        setTemplateToRename(null);
        setNewName('');
    }
  };

  const handleDelete = () => {
    if(templateToDelete) {
        deleteW4Template(templateToDelete.id);
        toast({variant: 'destructive', title: 'Template Deleted', description: `I-9 Template "${templateToDelete.name}" has been moved to the trash.`});
        setTemplateToDelete(null);
    }
  }

  const sortedTemplates = useMemo(() => [...w4Templates].sort((a,b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()), [w4Templates]);

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="I-9 Templates" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="templates">
            <TabsList>
                <TabsTrigger value="manage">Manage Employee I-9s</TabsTrigger>
                <TabsTrigger value="templates">Manage Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="manage">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Employee I-9 Forms</CardTitle>
                        <CardDescription>
                            Review, verify, and manage submitted employee I-9 forms.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                            <p className="text-muted-foreground">Submitted employee I-9 forms will be listed here.</p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="templates">
                <Card>
                    <CardHeader className="flex-row items-start justify-between">
                        <div>
                            <CardTitle className="font-headline">I-9 Template Library</CardTitle>
                            <CardDescription>
                                Manage, preview, and send your I-9 templates.
                            </CardDescription>
                        </div>
                        <UploadTemplateDialog onSave={handleSaveTemplate} />
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Template Name</TableHead>
                                        <TableHead>Date Uploaded</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedTemplates.map(template => (
                                        <TableRow key={template.id}>
                                            <TableCell className="font-medium">{template.name}</TableCell>
                                            <TableCell><ClientFormattedDate date={template.uploadedAt} /></TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Button variant="outline" size="sm" onClick={() => handlePreview(template.documentUri)}>Preview</Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4"/></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onClick={() => handleSend(template)}><Send className="mr-2"/> Send to Employee</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => { setTemplateToRename(template); setNewName(template.name); }}><Pencil className="mr-2"/> Rename</DropdownMenuItem>
                                                            <DropdownMenuSeparator/>
                                                             <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                                                        <Trash2 className="mr-2"/> Delete
                                                                    </DropdownMenuItem>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                        <AlertDialogDescription>This will move the template to the trash.</AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel onClick={() => setTemplateToDelete(null)}>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => { setTemplateToDelete(template); handleDelete(); }}>Delete</AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
        
        <Dialog open={!!templateToRename} onOpenChange={() => setTemplateToRename(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename Template</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <Label htmlFor="new-name">New Template Name</Label>
                    <Input id="new-name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setTemplateToRename(null)}>Cancel</Button>
                    <Button onClick={handleRename}>Save Name</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
      </main>
    </div>
  );
}
