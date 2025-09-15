
"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSchedule, Note } from '@/hooks/use-schedule';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Save, Trash2, Search, Mic, Printer, Upload, Download } from 'lucide-react';
import { format } from 'date-fns';
import { NoteList } from '@/components/dashboard/note-list';
import { cn } from '@/lib/utils';


export default function NotesPage() {
    const { notes, addNote, updateNote, deleteNote, bulkAddNotes } = useSchedule();
    const { toast } = useToast();
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (selectedNote) {
            setNoteTitle(selectedNote.title);
            setNoteContent(selectedNote.content);
        } else {
            setNoteTitle('');
            setNoteContent('');
        }
    }, [selectedNote]);

    React.useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    setNoteContent(prev => prev + event.results[i][0].transcript);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
        };

        recognition.onend = () => setIsRecording(false);
        recognition.onerror = (event: any) => {
            toast({ variant: 'destructive', title: 'Speech Recognition Error', description: event.error });
            setIsRecording(false);
        };

        recognitionRef.current = recognition;

        return () => recognitionRef.current?.abort();
    }, [toast]);
    
    const handleMicClick = () => {
        if (!recognitionRef.current) {
            toast({ variant: 'destructive', title: 'Unsupported Browser', description: 'Voice recognition is not supported by your browser.' });
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
        setIsRecording(!isRecording);
    };

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

    const handleDeleteNote = () => {
        if (selectedNote) {
            deleteNote(selectedNote.id);
            handleNewNote();
            toast({ variant: 'destructive', title: 'Note Deleted' });
        }
    };
    
    const handlePrint = () => {
        if (selectedNote) {
            const printWindow = window.open('', '_blank');
            printWindow?.document.write(`
                <html>
                    <head><title>${selectedNote.title}</title></head>
                    <body>
                        <h1>${selectedNote.title}</h1>
                        <p><em>${format(selectedNote.date, 'PPP p')}</em></p>
                        <hr />
                        <div>${selectedNote.content.replace(/\n/g, '<br>')}</div>
                    </body>
                </html>
            `);
            printWindow?.document.close();
            printWindow?.print();
        }
    }
    
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
        <div className="flex flex-col w-full h-screen">
            <Header pageTitle="My Notes" />
            <main className="flex-1 grid lg:grid-cols-3 gap-4 p-4 md:gap-8 md:p-8 overflow-hidden">
                <div className="lg:col-span-1 flex flex-col gap-4">
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
                    <Card className="flex flex-col h-full">
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
                        <CardContent className="flex-1 flex flex-col">
                            <Textarea
                                placeholder="Start writing your note here... or use the microphone to speak."
                                className="flex-1 resize-none border-none shadow-none focus-visible:ring-0 text-base"
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                            />
                        </CardContent>
                        <CardFooter className="flex-wrap gap-2 justify-end">
                            <Button variant="ghost" onClick={handlePrint} disabled={!selectedNote}>
                                <Printer className="mr-2"/> Print
                            </Button>
                             <Button 
                                variant="outline" 
                                onClick={handleMicClick}
                                className={cn(isRecording && "bg-destructive text-white hover:bg-destructive/90")}
                            >
                                <Mic className="mr-2"/> {isRecording ? 'Stop Recording' : 'Talk to Text'}
                            </Button>
                            {selectedNote && (
                                <Button variant="destructive" onClick={handleDeleteNote}>
                                    <Trash2 className="mr-2"/> Delete Note
                                </Button>
                            )}
                            <Button onClick={handleSaveNote}>
                                <Save className="mr-2"/> Save Note
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    );
}
