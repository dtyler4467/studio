
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { useToast } from '@/hooks/use-toast';
import { Upload, Film, ImageIcon as ImageIconLucide, Music, Save, ListPlus, Wand2, Scissors, Play, Pause, FolderSymlink } from 'lucide-react';
import Image from 'next/image';

type MediaType = 'video' | 'image' | 'audio';

type MediaAsset = {
    id: string;
    name: string;
    type: MediaType;
    src: string;
    duration?: number;
};

const initialMediaAssets: MediaAsset[] = [
    { id: 'vid_1', name: 'Company Promo.mp4', type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 10 },
    { id: 'img_1', name: 'Warehouse.jpg', type: 'image', src: 'https://picsum.photos/seed/warehouse/1920/1080' },
    { id: 'aud_1', name: 'Corporate_uplifting.mp3', type: 'audio', src: '' },
];


const TimelineEditor = ({ duration = 0, onTrimChange }: { duration?: number; onTrimChange: (start: number, end: number) => void }) => {
    const [trim, setTrim] = useState([0, duration]);

    useEffect(() => {
        setTrim([0, duration]);
    }, [duration]);

    const handleSliderChange = (newTrim: number[]) => {
        setTrim(newTrim);
        onTrimChange(newTrim[0], newTrim[1]);
    }
    
    return (
        <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                <span>{new Date(trim[0] * 1000).toISOString().substr(14, 5)}</span>
                <span className="font-semibold">Timeline</span>
                <span>{new Date(trim[1] * 1000).toISOString().substr(14, 5)}</span>
            </div>
            <Slider
                min={0}
                max={duration}
                step={0.1}
                value={trim}
                onValueChange={handleSliderChange}
            />
        </div>
    )
}

const MediaLibraryPanel = ({ onSelect }: { onSelect: (asset: MediaAsset) => void }) => {
    const [mediaAssets, setMediaAssets] = useState(initialMediaAssets);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Media Library</CardTitle>
                <CardDescription>Your uploaded assets.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-2 overflow-y-auto">
                {mediaAssets.map(asset => (
                    <Button key={asset.id} variant="ghost" className="w-full justify-start h-auto p-2" onClick={() => onSelect(asset)}>
                        <div className="flex items-center gap-3">
                             <div className="p-2 bg-muted rounded-md">
                                {asset.type === 'video' && <Film className="h-5 w-5" />}
                                {asset.type === 'image' && <ImageIconLucide className="h-5 w-5" />}
                                {asset.type === 'audio' && <Music className="h-5 w-5" />}
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-semibold truncate">{asset.name}</p>
                                <p className="text-xs text-muted-foreground">{asset.type}</p>
                            </div>
                        </div>
                    </Button>
                ))}
            </CardContent>
            <CardFooter>
                 <Button variant="outline" className="w-full"><Upload className="mr-2"/> Upload Media</Button>
            </CardFooter>
        </Card>
    );
};

export default function NetworkTvEditorPage() {
    const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(initialMediaAssets[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showWatermark, setShowWatermark] = useState(true);
    const [watermarkSrc, setWatermarkSrc] = useState<string | null>('https://picsum.photos/seed/logo/200/100');
    const [trim, setTrim] = useState({ start: 0, end: selectedAsset?.duration || 0 });

  return (
    <div className="flex flex-col w-full h-screen">
      <Header pageTitle="Network TV Editor" />
      <main className="flex-1 grid lg:grid-cols-4 gap-4 p-4 md:gap-8 md:p-8 overflow-hidden">
        <div className="lg:col-span-1 h-full">
            <MediaLibraryPanel onSelect={setSelectedAsset} />
        </div>
        <div className="lg:col-span-2 h-full flex flex-col gap-4">
             <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center bg-muted/50 rounded-b-lg relative">
                    {selectedAsset?.type === 'video' && (
                        <video key={selectedAsset.src} src={selectedAsset.src} className="max-h-full max-w-full" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} />
                    )}
                    {selectedAsset?.type === 'image' && (
                         <Image src={selectedAsset.src} alt={selectedAsset.name} layout="fill" objectFit="contain" className="p-4"/>
                    )}
                    {showWatermark && watermarkSrc && (
                        <div className="absolute top-4 left-4">
                            <Image src={watermarkSrc} alt="Watermark" width={80} height={40} data-ai-hint="logo" />
                        </div>
                    )}
                </CardContent>
             </Card>
             {selectedAsset?.type === 'video' && (
                <TimelineEditor duration={selectedAsset?.duration} onTrimChange={(start, end) => setTrim({ start, end })}/>
             )}
        </div>
        <div className="lg:col-span-1 h-full">
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Properties</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-6 overflow-y-auto">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input value={selectedAsset?.name || ''} readOnly/>
                    </div>
                     <div className="space-y-2">
                        <Label>Duration (seconds)</Label>
                        <Input type="number" value={selectedAsset?.duration || 10} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="watermark" className="flex items-center gap-2"><FolderSymlink /> Show Watermark</Label>
                        <Switch id="watermark" checked={showWatermark} onCheckedChange={setShowWatermark} />
                    </div>
                    {showWatermark && (
                        <div className="space-y-2">
                            <Label>Watermark Image</Label>
                            <DocumentUpload onDocumentChange={setWatermarkSrc} currentDocument={watermarkSrc} />
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button className="w-full"><Save className="mr-2"/> Save to Library</Button>
                    <Button variant="secondary" className="w-full"><ListPlus className="mr-2"/> Add to Playlist</Button>
                </CardFooter>
            </Card>
        </div>
      </main>
    </div>
  );
}

