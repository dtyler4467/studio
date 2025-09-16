
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/header';
import { useSchedule, Visitor } from '@/hooks/use-schedule';
import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Play, Pause, ImageIcon, Film, Text, Users } from 'lucide-react';

type MediaItem = {
  id: string;
  type: 'video' | 'image' | 'text' | 'queue';
  title: string;
  src?: string;
  content?: string;
  duration: number;
};

const initialPlaylist: MediaItem[] = [
    { id: 'que1', type: 'queue', title: 'Visitor Queue', duration: 15 },
    { id: 'vid1', type: 'video', title: 'Company Promo Video', src: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 10 },
    { id: 'img1', type: 'image', title: 'Warehouse Stock Photo', src: 'https://picsum.photos/seed/warehouse/1920/1080', duration: 8 },
    { id: 'txt1', type: 'text', title: 'Welcome Message', content: 'Welcome to LogiFlow! Please check in at the reception desk.', duration: 8 },
];

const TvPlayer = ({ playlist, visitors }: { playlist: MediaItem[], visitors: Visitor[] }) => {
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState('');
    const videoRef = React.useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(format(new Date(), 'PPP p'))
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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
        <div className="w-full h-full bg-black relative text-white overflow-hidden">
             {currentItem.type === 'image' && <Image src={currentItem.src!} alt={currentItem.title} layout="fill" objectFit="cover" />}
             {currentItem.type === 'video' && <video ref={videoRef} src={currentItem.src} className="w-full h-full object-cover" muted />}
             {currentItem.type === 'text' && <div className="w-full h-full flex items-center justify-center p-12"><h2 className="text-4xl lg:text-6xl font-bold text-center">{currentItem.content}</h2></div>}
             {currentItem.type === 'queue' && (
                <div className="w-full h-full flex p-8 lg:p-12">
                    <div className="w-2/3 pr-8 lg:pr-12 border-r border-white/20">
                        <h2 className="text-4xl lg:text-6xl font-bold font-headline mb-6 lg:mb-8">Visitor Queue</h2>
                        <div className="space-y-4">
                            {waitingVisitors.slice(0, 5).map(v => (
                                <div key={v.id} className="p-4 bg-white/10 rounded-lg text-2xl lg:text-3xl font-medium">{v.name} to see {v.visiting}</div>
                            ))}
                            {waitingVisitors.length === 0 && <p className="text-2xl text-white/70">No visitors waiting.</p>}
                        </div>
                    </div>
                    <div className="w-1/3 pl-8 lg:pl-12 flex flex-col items-center justify-center">
                        <h3 className="text-3xl lg:text-4xl font-semibold mb-4">Now Seeing</h3>
                        {acceptedVisitor ? (
                            <div className="text-center">
                                {acceptedVisitor.photoDataUri && <img src={acceptedVisitor.photoDataUri} alt={acceptedVisitor.name} className="w-32 h-32 lg:w-48 lg:h-48 rounded-full object-cover mx-auto mb-4 border-4 border-green-400"/>}
                                <p className="text-4xl lg:text-5xl font-bold">{acceptedVisitor.name}</p>
                                <p className="text-xl lg:text-2xl text-white/80">is meeting with</p>
                                <p className="text-3xl lg:text-4xl font-semibold mt-1">{acceptedVisitor.visiting}</p>
                            </div>
                        ) : (
                            <p className="text-2xl lg:text-3xl text-white/70">N/A</p>
                        )}
                    </div>
                </div>
             )}
             <div className="absolute bottom-4 left-4 text-xs font-mono">{currentTime}</div>
             <div className="absolute top-4 right-4 flex items-center gap-2">
                 <Button variant="ghost" size="icon" onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? <Pause/> : <Play/>}</Button>
             </div>
        </div>
    );
};


export default function NetworkTvScreenPage() {
    const { visitors } = useSchedule();
    const [playlist, setPlaylist] = useState<MediaItem[]>(initialPlaylist);

    return (
        <div className="w-screen h-screen">
            <TvPlayer playlist={playlist} visitors={visitors}/>
        </div>
    )
}
