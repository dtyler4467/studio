
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Note } from '@/hooks/use-schedule';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { PlusCircle, Upload, Download, Search } from 'lucide-react';

interface NoteListProps {
    notes: Note[];
    selectedNote: Note | null;
    onSelectNote: (note: Note) => void;
    onNewNote: () => void;
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NoteList = ({ notes, selectedNote, onSelectNote, onNewNote, onExport, onImport }: NoteListProps) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const filteredNotes = React.useMemo(() => {
        return notes
            .filter(note => 
                note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                note.content.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a,b) => b.date.getTime() - a.date.getTime());
    }, [notes, searchTerm]);

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle>All Notes</CardTitle>
                <div className="relative mt-2">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search notes..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-2 space-y-1">
                        {filteredNotes.length > 0 ? (
                            filteredNotes.map(note => (
                                <button
                                    key={note.id}
                                    onClick={() => onSelectNote(note)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-md hover:bg-muted",
                                        selectedNote?.id === note.id && "bg-muted"
                                    )}
                                >
                                    <p className="font-semibold truncate">{note.title}</p>
                                    <p className="text-sm text-muted-foreground truncate">{note.content || 'No content'}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDistanceToNow(note.date, { addSuffix: true })}
                                    </p>
                                </button>
                            ))
                        ) : (
                             <div className="text-center p-8 text-sm text-muted-foreground">
                                <p>No notes found.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 p-2 border-t">
                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={onImport} />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2"/> Import
                </Button>
                <Button variant="outline" onClick={onExport}>
                    <Download className="mr-2"/> Export
                </Button>
                <Button onClick={onNewNote} className="col-span-2">
                    <PlusCircle className="mr-2"/> New Note
                </Button>
            </CardFooter>
        </Card>
    );
};
