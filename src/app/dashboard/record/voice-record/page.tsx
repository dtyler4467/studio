
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, Play, Pause, Trash2, Download, Pencil, History } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { formatDistanceToNowStrict } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Recording = {
  id: string;
  name: string;
  url: string;
  duration: string;
  date: Date;
};

const AudioPlayer = ({ url }: { url: string }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    useEffect(() => {
        const audio = audioRef.current;
        const handleEnded = () => setIsPlaying(false);
        audio?.addEventListener('ended', handleEnded);
        return () => {
            audio?.removeEventListener('ended', handleEnded);
        }
    }, []);

    return (
        <div className="flex items-center gap-2">
            <audio ref={audioRef} src={url} preload="auto"></audio>
            <Button variant="ghost" size="icon" onClick={togglePlay} className="h-8 w-8">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
        </div>
    );
};

export default function VoiceRecordPage() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [recordingToRename, setRecordingToRename] = useState<Recording | null>(null);
    const [newName, setNewName] = useState('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const recordingStartTimeRef = useRef<Date | null>(null);
    const { toast } = useToast();
    
    useEffect(() => {
      // Set initial data on the client to avoid hydration mismatch
      setRecordings([
        { id: 'REC-DEMO-1', name: 'Initial Meeting Notes', url: '', duration: '0:45', date: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      ]);
    }, []);


    const startRecording = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setHasPermission(false);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setHasPermission(true);
            
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const duration = recordingStartTimeRef.current ? formatDistanceToNowStrict(recordingStartTimeRef.current, { unit: 'second'}) : '0 seconds';
                const newRecording: Recording = {
                    id: `REC-${Date.now()}`,
                    name: `Recording - ${format(new Date(), 'PPP p')}`,
                    url: audioUrl,
                    duration,
                    date: new Date(),
                };
                setRecordings(prev => [newRecording, ...prev]);
                toast({ title: "Recording Saved", description: "Your new voice recording has been saved." });
                stream.getTracks().forEach(track => track.stop()); // Stop the mic stream
            };
            
            recordingStartTimeRef.current = new Date();
            mediaRecorderRef.current.start();
            setIsRecording(true);
            
        } catch (err) {
            setHasPermission(false);
            toast({
                variant: 'destructive',
                title: 'Microphone Access Denied',
                description: 'Please enable microphone permissions in your browser settings.',
            });
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
    
    const deleteRecording = (id: string) => {
        setRecordings(prev => prev.filter(rec => rec.id !== id));
        toast({ variant: 'destructive', title: "Recording Deleted", description: "The voice recording has been deleted." });
    };

    const downloadRecording = (recording: Recording) => {
        const a = document.createElement('a');
        a.href = recording.url;
        a.download = `${recording.name}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleRename = () => {
        if (recordingToRename && newName.trim()) {
            setRecordings(prev => prev.map(rec => rec.id === recordingToRename.id ? { ...rec, name: newName.trim() } : rec));
            setRecordingToRename(null);
            setNewName('');
        }
    }


  return (
    <>
    <div className="flex flex-col w-full">
      <Header pageTitle="Voice Record" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="relative overflow-hidden">
            <CardHeader className="text-center">
                <CardTitle className="font-headline flex items-center justify-center gap-2 text-2xl">
                    <Mic />
                    Voice Recording
                </CardTitle>
                <CardDescription>
                    Create and manage your voice memos and recordings.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                {isRecording ? (
                    <Button size="lg" variant="destructive" onClick={stopRecording}>
                        <StopCircle className="mr-2" /> Stop Recording
                    </Button>
                ) : (
                    <Button size="lg" onClick={startRecording}>
                        <Mic className="mr-2" /> Start Recording
                    </Button>
                )}
                 {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 text-destructive font-semibold">
                        <div className="w-3 h-3 rounded-full bg-destructive animate-pulse"></div>
                        <span>REC</span>
                    </div>
                )}
            </CardContent>
            {hasPermission === false && (
                <CardFooter>
                    <Alert variant="destructive">
                        <AlertTitle>Microphone Access Required</AlertTitle>
                        <AlertDescription>
                            Please enable microphone access in your browser settings to use this feature.
                        </AlertDescription>
                    </Alert>
                </CardFooter>
            )}
        </Card>
        
        <Card>
             <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <History />
                    My Recordings
                </CardTitle>
                <CardDescription>
                   A list of all your saved voice recordings.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recordings.length > 0 ? recordings.map(rec => (
                                <TableRow key={rec.id}>
                                    <TableCell className="font-medium">{rec.name}</TableCell>
                                    <TableCell><ClientFormattedDate date={rec.date} /></TableCell>
                                    <TableCell>{rec.duration}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end items-center gap-1">
                                            {rec.url ? <AudioPlayer url={rec.url} /> : <span className="text-xs text-muted-foreground">No audio</span>}
                                            <Button variant="ghost" size="icon" onClick={() => { setRecordingToRename(rec); setNewName(rec.name); }}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => downloadRecording(rec)} disabled={!rec.url}>
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteRecording(rec.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">No recordings yet. Click "Start Recording" to create one.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
    <Dialog open={!!recordingToRename} onOpenChange={() => setRecordingToRename(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Rename Recording</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-2">
                <Label htmlFor="new-name">New Name</Label>
                <Input id="new-name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setRecordingToRename(null)}>Cancel</Button>
                <Button onClick={handleRename}>Save Name</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}

