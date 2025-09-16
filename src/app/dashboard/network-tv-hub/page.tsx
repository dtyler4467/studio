
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Tv, Film, Image as ImageIcon, Text, GripVertical, Trash2, Play, Pause, List, Tv2 } from 'lucide-react';
import { useSchedule, Visitor } from '@/hooks/use-schedule';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type MediaItemType = 'video' | 'image' | 'text' | 'queue';

type MediaItem = {
  id: string;
  type: MediaItemType;
  title: string;
  src?: string; // URL for video/image
  content?: string; // for text
  duration: number; // in seconds
};

const initialMediaLibrary: MediaItem[] = [
  { id: 'vid1', type: 'video', title: 'Company Promo Video', src: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 10 },
  { id: 'img1', type: 'image', title: 'Warehouse Stock Photo', src: 'https://picsum.photos/seed/warehouse/1920/1080', duration: 8 },
  { id: 'txt1', type: 'text', title: 'Welcome Message', content: 'Welcome to LogiFlow! Please check in at the reception desk.', duration: 8 },
];

const initialPlaylist: MediaItem[] = [
    { id: 'que1', type: 'queue', title: 'Visitor Queue', duration: 15 },
    ...initialMediaLibrary,
];

const AddMediaDialog = ({ onAdd }: { onAdd: (item: Omit<MediaItem, 'id'>) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<MediaItemType>('image');
    const [title, setTitle] = useState('');
    const [src, setSrc] = useState<string | null>(null);
    const [content, setContent] = useState('');
    const [duration, setDuration] = useState(10);
    const { toast } = useToast();

    const handleSave = () => {
        if (!title) {
            toast({ variant: 'destructive', title: 'Error', description: 'Title is required.' });
            return;
        }
        
        const newItem: Omit<MediaItem, 'id'> = {
            type, title, duration,
            ...(type === 'text' && { content }),
            ...( (type === 'image' || type === 'video') && { src: src || 'https://picsum.photos/seed/placeholder/1920/1080' })
        };
        onAdd(newItem);
        setIsOpen(false);
        setTitle('');
        setSrc(null);
        setContent('');
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild><Button><PlusCircle className="mr-2"/> Add Media</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Media to Library</DialogTitle>
                    <DialogDescription>Select the type of media and provide the content.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Type</Label>
                        <div className="col-span-3 flex gap-2">
                             {['image', 'video', 'text'].map((t) => (
                                <Button key={t} variant={type === t ? 'default' : 'outline'} onClick={() => setType(t as MediaItemType)}>{t.charAt(0).toUpperCase() + t.slice(1)}</Button>
                            ))}
                        </div>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} className="col-span-3"/>
                    </div>
                    { (type === 'image' || type === 'video') && (
                        <div className="grid grid-cols-4 items-start gap-4">
                             <Label className="text-right pt-2">File</Label>
                            <div className="col-span-3"><DocumentUpload onDocumentChange={setSrc} currentDocument={src} /></div>
                        </div>
                    )}
                    { type === 'text' && (
                        <div className="grid grid-cols-4 items-start gap-4">
                             <Label htmlFor="content" className="text-right pt-2">Text</Label>
                            <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} className="col-span-3"/>
                        </div>
                    )}
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">Duration (s)</Label>
                        <Input id="duration" type="number" value={duration} onChange={e => setDuration(Number(e.target.value) || 10)} className="col-span-3"/>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Add to Library</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const MediaLibrary = ({ library, onAddToPlaylist, onDragStart, onDelete }: { library: MediaItem[], onAddToPlaylist: (item: MediaItem) => void, onDragStart: (e: React.DragEvent, item: MediaItem) => void, onDelete: (id: string) => void }) => {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline flex items-center gap-2"><List/> Media Library</CardTitle>
                    <CardDescription>Drag items to the playlist on the right.</CardDescription>
                </div>
                <AddMediaDialog onAdd={onAddToPlaylist} />
            </CardHeader>
            <CardContent className="flex-1 space-y-3 overflow-y-auto">
                {library.map(item => (
                    <div key={item.id} draggable onDragStart={(e) => onDragStart(e, item)} className="p-3 border rounded-lg flex items-center gap-4 cursor-grab active:cursor-grabbing bg-background">
                        <div className="text-muted-foreground">
                            {item.type === 'image' && <ImageIcon/>}
                            {item.type === 'video' && <Film/>}
                            {item.type === 'text' && <Text/>}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.duration} seconds</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive h-7 w-7" onClick={() => onDelete(item.id)}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

const TvPlayer = ({ playlist, visitors }: { playlist: MediaItem[], visitors: Visitor[] }) => {
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const currentItem = playlist[currentItemIndex];

    useEffect(() => {
        if (!currentItem || !isPlaying) return;

        let timer: NodeJS.Timeout;
        if (currentItem.type === 'video' && videoRef.current) {
            const videoElement = videoRef.current;
            const handleVideoEnd = () => {
                setCurrentItemIndex(prev => (prev + 1) % playlist.length);
            };
            videoElement.addEventListener('ended', handleVideoEnd);
            videoElement.play().catch(e => console.error("Video play error:", e));
            
            return () => videoElement.removeEventListener('ended', handleVideoEnd);

        } else {
             timer = setTimeout(() => {
                setCurrentItemIndex(prev => (prev + 1) % playlist.length);
            }, currentItem.duration * 1000);
        }

        return () => clearTimeout(timer);

    }, [currentItemIndex, currentItem, playlist.length, isPlaying]);

    const waitingVisitors = visitors.filter(v => v.status === 'Waiting for Host');
    const nextVisitor = waitingVisitors[0];
    const acceptedVisitor = visitors.find(v => v.status === 'Accepted' && !v.checkOutTime);


    if (!currentItem) return <div className="bg-black text-white flex items-center justify-center h-full">No items in playlist.</div>;

    return (
        <div className="w-full aspect-video bg-black relative text-white overflow-hidden">
             {currentItem.type === 'image' && <Image src={currentItem.src!} alt={currentItem.title} layout="fill" objectFit="cover" />}
             {currentItem.type === 'video' && <video ref={videoRef} src={currentItem.src} className="w-full h-full object-cover" muted />}
             {currentItem.type === 'text' && <div className="w-full h-full flex items-center justify-center p-12"><h2 className="text-4xl font-bold text-center">{currentItem.content}</h2></div>}
             {currentItem.type === 'queue' && (
                <div className="w-full h-full flex p-8">
                    <div className="w-2/3 pr-8 border-r border-white/20">
                        <h2 className="text-5xl font-bold font-headline mb-6">Visitor Queue</h2>
                        <div className="space-y-4">
                            {waitingVisitors.slice(0, 5).map(v => (
                                <div key={v.id} className="p-4 bg-white/10 rounded-lg text-2xl font-medium">{v.name} to see {v.visiting}</div>
                            ))}
                            {waitingVisitors.length === 0 && <p className="text-2xl text-white/70">No visitors waiting.</p>}
                        </div>
                    </div>
                    <div className="w-1/3 pl-8 flex flex-col items-center justify-center">
                        <h3 className="text-3xl font-semibold mb-4">Now Seeing</h3>
                        {acceptedVisitor ? (
                            <div className="text-center">
                                {acceptedVisitor.photoDataUri && <img src={acceptedVisitor.photoDataUri} alt={acceptedVisitor.name} className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-green-400"/>}
                                <p className="text-4xl font-bold">{acceptedVisitor.name}</p>
                                <p className="text-xl text-white/80">is meeting with</p>
                                <p className="text-3xl font-semibold mt-1">{acceptedVisitor.visiting}</p>
                            </div>
                        ) : (
                            <p className="text-2xl text-white/70">N/A</p>
                        )}
                    </div>
                </div>
             )}
             <div className="absolute bottom-4 left-4 text-xs font-mono">{format(new Date(), 'PPP p')}</div>
             <div className="absolute top-4 right-4 flex items-center gap-2">
                 <Button variant="ghost" size="icon" onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? <Pause/> : <Play/>}</Button>
             </div>
        </div>
    );
};


export default function NetworkTvHubPage() {
    const { visitors } = useSchedule();
    const { toast } = useToast();
    const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(initialMediaLibrary);
    const [playlist, setPlaylist] = useState<MediaItem[]>(initialPlaylist);

    const handleAddMedia = (item: Omit<MediaItem, 'id'>) => {
        const newItem: MediaItem = { ...item, id: `media-${Date.now()}` };
        setMediaLibrary(prev => [newItem, ...prev]);
        toast({ title: 'Media Added', description: `"${item.title}" has been added to your library.` });
    }
    
    const handleDeleteMedia = (id: string) => {
        setMediaLibrary(prev => prev.filter(item => item.id !== id));
        setPlaylist(prev => prev.filter(item => item.id !== id));
    }
    
    const handleDragStart = (e: React.DragEvent, item: MediaItem) => {
        e.dataTransfer.setData('mediaItem', JSON.stringify(item));
    };
    
    const handleDropOnPlaylist = (e: React.DragEvent) => {
        e.preventDefault();
        const itemJson = e.dataTransfer.getData('mediaItem');
        if (itemJson) {
            const item = JSON.parse(itemJson);
            // Add a unique ID for the playlist instance
            setPlaylist(prev => [...prev, { ...item, id: `${item.id}-${Date.now()}` }]);
        }
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // This is necessary to allow dropping
    };

    const handleDeleteFromPlaylist = (id: string) => {
        setPlaylist(prev => prev.filter(item => item.id !== id));
    }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Network TV Hub" />
      <main className="flex-1 grid lg:grid-cols-2 gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline flex items-center gap-2"><Tv2 /> Live TV Preview</CardTitle>
                    <CardDescription>This is a preview of what's showing on your network.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <TvPlayer playlist={playlist} visitors={visitors}/>
            </CardContent>
        </Card>
        <div className="grid grid-rows-2 gap-4">
            <MediaLibrary library={mediaLibrary} onAddToPlaylist={handleAddMedia} onDragStart={handleDragStart} onDelete={handleDeleteMedia} />
            <Card className="h-full flex flex-col" onDrop={handleDropOnPlaylist} onDragOver={handleDragOver}>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><List/> Playlist</CardTitle>
                    <CardDescription>The current sequence of media being displayed.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-3 overflow-y-auto">
                    {playlist.map(item => (
                         <div key={item.id} className="p-3 border rounded-lg flex items-center gap-4 bg-background">
                            <GripVertical className="text-muted-foreground cursor-move"/>
                            <div className="text-muted-foreground">
                                {item.type === 'image' && <ImageIcon/>}
                                {item.type === 'video' && <Film/>}
                                {item.type === 'text' && <Text/>}
                                {item.type === 'queue' && <Users/>}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">{item.title}</p>
                            </div>
                             <Badge variant="outline">{item.duration}s</Badge>
                             {item.type !== 'queue' && <Button variant="ghost" size="icon" className="text-destructive h-7 w-7" onClick={() => handleDeleteFromPlaylist(item.id)}><Trash2 className="h-4 w-4"/></Button>}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
