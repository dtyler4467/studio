
"use client";

import { useParams, notFound } from 'next/navigation';
import { useSchedule, Handbook, HandbookSection } from '@/hooks/use-schedule';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Pencil, BookOpen, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const EditSectionDialog = ({ 
    section, 
    isOpen, 
    onOpenChange,
    onSave,
}: { 
    section: HandbookSection | null; 
    isOpen: boolean; 
    onOpenChange: (open: boolean) => void;
    onSave: (title: string, content: string) => void;
}) => {
    const [content, setContent] = useState(section?.content || '');

    useEffect(() => {
        setContent(section?.content || '');
    }, [section]);

    const handleSave = () => {
        if (section) {
            onSave(section.title, content);
            onOpenChange(false);
        }
    };

    if (!section) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Section: {section.title}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="section-content" className="sr-only">Section Content</Label>
                    <Textarea 
                        id="section-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="h-80"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const AddSectionDialog = ({
    isOpen,
    onOpenChange,
    onSave,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (title: string, content: string) => void;
}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { toast } = useToast();

    const handleSave = () => {
        if (!title.trim() || !content.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please provide both a title and content for the new section.' });
            return;
        }
        onSave(title, content);
        setTitle('');
        setContent('');
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add New Handbook Section</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <Label htmlFor="new-section-title">Section Title</Label>
                        <Input
                            id="new-section-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Remote Work Policy"
                        />
                    </div>
                    <div>
                        <Label htmlFor="new-section-content">Section Content</Label>
                        <Textarea
                            id="new-section-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="h-48"
                            placeholder="Enter the policy details here..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Section</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function HandbookDocumentPage() {
    const params = useParams();
    const { id } = params;
    const { getHandbookById, updateHandbookSection, addHandbookSection } = useSchedule();
    const { toast } = useToast();
    const [handbook, setHandbook] = useState<Handbook | null | undefined>(undefined);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<HandbookSection | null>(null);

    useEffect(() => {
        if (typeof id === 'string') {
            setHandbook(getHandbookById(id));
        }
    }, [id, getHandbookById]);

    const handleEditClick = (section: HandbookSection) => {
        setSelectedSection(section);
        setIsEditDialogOpen(true);
    };

    const handleSaveSection = (title: string, content: string) => {
        if (handbook) {
            updateHandbookSection(handbook.id, title, content);
            toast({ title: 'Section Saved', description: `The "${title}" section has been updated.`});
        }
    };
    
    const handleAddSection = (title: string, content: string) => {
        if (handbook) {
            addHandbookSection(handbook.id, title, content);
            toast({ title: 'Section Added', description: `The new section "${title}" has been added to the handbook.` });
        }
    };

    if (handbook === undefined) {
        return (
            <div className="flex flex-col w-full">
                <Header pageTitle="Loading Handbook..." />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                     <Card><CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader><CardContent><Skeleton className="w-full h-96" /></CardContent></Card>
                </main>
            </div>
        );
    }

    if (handbook === null) {
        notFound();
    }
    
    if (!handbook.content) {
        return (
             <div className="flex flex-col w-full">
                <Header pageTitle={handbook.name} />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Document Viewer</CardTitle>
                        </CardHeader>
                         <CardContent>
                            <iframe src={handbook.documentUri || ''} className="w-full h-[80vh] border-0" title={handbook.name} />
                        </CardContent>
                    </Card>
                </main>
            </div>
        )
    }

    const { content } = handbook;

    return (
        <div className="flex flex-col w-full">
            <Header pageTitle={handbook.name} />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader className="text-center bg-muted/50 p-10">
                        <BookOpen className="mx-auto h-12 w-12 text-primary" />
                        <CardTitle className="font-headline text-4xl mt-4">{handbook.name}</CardTitle>
                        <CardDescription>
                            Last updated: {content.lastUpdated}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 md:p-10 space-y-12">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h2 className="text-2xl font-bold font-headline">Table of Contents</h2>
                                <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(true)}>
                                    <PlusCircle className="mr-2 h-4 w-4"/>
                                    Add Section
                                </Button>
                            </div>
                            <ul className="space-y-1 list-disc list-inside">
                                {content.sections.map(section => (
                                    <li key={section.title}><a href={`#${section.title.toLowerCase().replace(/\s/g, '-')}`} className="text-primary hover:underline">{section.title}</a></li>
                                ))}
                            </ul>
                        </div>
                        {content.sections.map(section => (
                            <section key={section.title} id={section.title.toLowerCase().replace(/\s/g, '-')} className="max-w-3xl mx-auto">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                     <h2 className="text-2xl font-bold font-headline">{section.title}</h2>
                                     <Button variant="ghost" size="icon" onClick={() => handleEditClick(section)}>
                                        <Pencil className="h-4 w-4" />
                                     </Button>
                                </div>
                                <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br />') }} />
                            </section>
                        ))}
                    </CardContent>
                </Card>
                 <EditSectionDialog 
                    section={selectedSection}
                    isOpen={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    onSave={handleSaveSection}
                />
                <AddSectionDialog 
                    isOpen={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                    onSave={handleAddSection}
                />
            </main>
        </div>
    )
}
