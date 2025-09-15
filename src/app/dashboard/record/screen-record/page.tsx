
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, StopCircle, Play, Pause, Trash2, Download, Pencil, History, Video } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

type Recording = {
  id: string;
  name: string;
  url: string;
  duration: string;
  date: Date;
};

const ClientFormattedDate = ({ date }: { date: Date }) => {
    const [formattedDate, setFormattedDate] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (date) {
            setFormattedDate(format(date, 'PPP p'));
        }
    }, [date]);

    if (!formattedDate) {
        return <Skeleton className="h-4 w-[150px]" />;
    }

    return <>{formattedDate}</>;
}


const VideoPlayerDialog = ({ recording, isOpen, onOpenChange }: { recording: Recording | null; isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!recording) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{recording.name}</DialogTitle>
                    <DialogDescription>
                        Playback of your recording from <ClientFormattedDate date={recording.date} />
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4 border rounded-md bg-muted">
                    <video src={recording.url} controls className="w-full rounded-md" />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function ScreenRecordPage() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [recordingToRename, setRecordingToRename] = useState<Recording | null>(null);
    const [recordingToPlay, setRecordingToPlay] = useState<Recording | null>(null);
    const [newName, setNewName] = useState('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const recordingStartTimeRef = useRef<Date | null>(null);
    const { toast } = useToast();
    
    const startRecording = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
            setHasPermission(false);
             toast({ variant: 'destructive', title: 'Screen Recording Not Supported', description: 'Your browser does not support screen recording.' });
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            mediaStreamRef.current = stream;
            setHasPermission(true);

            if (videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = stream;
            }

            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
            recordedChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };
            
            mediaRecorderRef.current.onstop = () => {
                const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const videoUrl = URL.createObjectURL(videoBlob);
                const duration = recordingStartTimeRef.current ? formatDistanceToNowStrict(recordingStartTimeRef.current, { unit: 'second' }) : '0 seconds';
                const newRecording: Recording = {
                    id: `SCR-${Date.now()}`,
                    name: `Screen Recording - ${format(new Date(), 'PPP p')}`,
                    url: videoUrl,
                    duration,
                    date: new Date(),
                };
                setRecordings(prev => [newRecording, ...prev]);
                toast({ title: 'Screen Recording Saved', description: 'Your new screen recording is now available.' });

                // Stop all tracks to end the screen sharing session
                stream.getTracks().forEach(track => track.stop());
            };
            
            stream.getVideoTracks()[0].onended = () => {
                stopRecording();
            };

            recordingStartTimeRef.current = new Date();
            mediaRecorderRef.current.start();
            setIsRecording(true);
            
        } catch (err) {
            setHasPermission(false);
            if ((err as Error).name === 'NotAllowedError') {
                toast({
                    variant: 'destructive',
                    title: 'Permission Denied',
                    description: 'You denied permission for screen recording.',
                });
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'An Error Occurred',
                    description: 'Could not start screen recording.',
                });
            }
        }
    };

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = null;
        }
        setIsRecording(false);
    }, [isRecording]);
    
    const deleteRecording = (id: string) => {
        setRecordings(prev => {
            const recToDelete = prev.find(r => r.id === id);
            if (recToDelete) {
                URL.revokeObjectURL(recToDelete.url);
            }
            return prev.filter(rec => rec.id !== id);
        });
        toast({ variant: 'destructive', title: "Recording Deleted" });
    };

    const downloadRecording = (recording: Recording) => {
        const a = document.createElement('a');
        a.href = recording.url;
        a.download = `${recording.name}.webm`;
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
      <Header pageTitle="Screen Record" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="relative overflow-hidden">
            <CardHeader className="text-center">
                <CardTitle className="font-headline flex items-center justify-center gap-2 text-2xl">
                    <Monitor />
                    Screen Recording
                </CardTitle>
                <CardDescription>
                    Start, stop, and manage your screen recordings.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="w-full max-w-4xl mx-auto space-y-4">
                    <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
                        <video ref={videoPreviewRef} muted autoPlay playsInline className={isRecording ? 'w-full h-full' : 'hidden'} />
                        {!isRecording && <Video className="h-24 w-24 text-muted-foreground/30" />}
                    </div>
                     <div className="flex justify-center">
                        {isRecording ? (
                            <Button size="lg" variant="destructive" onClick={stopRecording}>
                                <StopCircle className="mr-2" /> Stop Recording
                            </Button>
                        ) : (
                            <Button size="lg" onClick={startRecording}>
                                <Monitor className="mr-2" /> Start Recording
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
            {hasPermission === false && (
                <CardFooter>
                    <Alert variant="destructive">
                        <AlertTitle>Screen Recording Permission Required</AlertTitle>
                        <AlertDescription>
                            Please grant permission to record your screen to use this feature.
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
                   A list of all your saved screen recordings.
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
                                            <Button variant="ghost" size="icon" onClick={() => setRecordingToPlay(rec)}>
                                                <Play className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => { setRecordingToRename(rec); setNewName(rec.name); }}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => downloadRecording(rec)}>
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
    <VideoPlayerDialog recording={recordingToPlay} isOpen={!!recordingToPlay} onOpenChange={() => setRecordingToPlay(null)} />
    </>
  );
}
