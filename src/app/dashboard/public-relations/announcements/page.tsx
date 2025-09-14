
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type Announcement = {
    id: string;
    title: string;
    content: string;
    date: Date;
};

const initialAnnouncements: Announcement[] = [
    { id: 'ANN-001', title: 'Welcome to the New LogiFlow App!', content: 'We are excited to launch our new and improved logistics management platform.', date: new Date() },
];

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState(initialAnnouncements);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const { toast } = useToast();

    const handleAddAnnouncement = () => {
        if (!newTitle || !newContent) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please provide a title and content for the announcement.'
            });
            return;
        }

        const newAnnouncement: Announcement = {
            id: `ANN-${Date.now()}`,
            title: newTitle,
            content: newContent,
            date: new Date(),
        };

        setAnnouncements(prev => [newAnnouncement, ...prev]);
        setNewTitle('');
        setNewContent('');
        toast({
            title: 'Announcement Posted',
            description: `Your announcement "${newTitle}" has been posted.`
        });
    };

    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Announcements" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Create a New Announcement</CardTitle>
                        <CardDescription>
                            Post a new announcement for all users to see.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input placeholder="Announcement Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                        <Textarea placeholder="Announcement content..." value={newContent} onChange={e => setNewContent(e.target.value)} />
                        <Button onClick={handleAddAnnouncement}><PlusCircle className="mr-2" /> Post Announcement</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Announcement History</CardTitle>
                        <CardDescription>
                            A log of all past company announcements.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {announcements.map(announcement => (
                            <div key={announcement.id} className="border-l-4 border-primary pl-4 py-2">
                                <h3 className="font-semibold">{announcement.title}</h3>
                                <p className="text-sm text-muted-foreground">{announcement.content}</p>
                                <p className="text-xs text-muted-foreground mt-2">{format(announcement.date, 'PPP p')}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
