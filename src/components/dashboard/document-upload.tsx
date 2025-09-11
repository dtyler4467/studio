
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, FileUp, Videotape, Trash2, SwitchCamera, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import Image from 'next/image';
import { editReceiptImage } from '@/ai/flows/edit-receipt-image-flow';
import { Skeleton } from '../ui/skeleton';

type DocumentUploadProps = {
    onDocumentChange: (dataUri: string | null) => void;
    currentDocument: string | null;
};

const enhancementOptions = [
    { id: 'self_crop', label: 'Self-Cropping' },
    { id: 'crop', label: 'Auto-Crop Receipt' },
    { id: 'shadows', label: 'Remove Shadows' },
    { id: 'enhance', label: 'Enhance Clarity' },
    { id: 'grayscale', label: 'Convert to Grayscale' },
    { id: 'brighten', label: 'Increase Brightness' },
];

function EditImageDialog({
    isOpen,
    onOpenChange,
    imageDataUri,
    onSave,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    imageDataUri: string;
    onSave: (editedUri: string) => void;
}) {
    const [selectedEnhancements, setSelectedEnhancements] = useState<string[]>(['self_crop', 'shadows', 'enhance']);
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const handleApplyEdits = async () => {
        setIsProcessing(true);
        try {
            const result = await editReceiptImage({
                photoDataUri: imageDataUri,
                enhancements: selectedEnhancements.map(id => enhancementOptions.find(opt => opt.id === id)!.label),
            });
            onSave(result.editedPhotoDataUri);
            onOpenChange(false);
            toast({ title: 'Image Enhanced', description: 'The selected enhancements have been applied.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Editing Failed', description: 'Could not apply edits to the image. Please try again.' });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Enhance Receipt Image</DialogTitle>
                    <DialogDescription>
                        Select enhancements to improve image quality for better data extraction.
                    </DialogDescription>
                </DialogHeader>
                 <div className="grid md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="p-4 border rounded-md bg-muted h-full flex items-center justify-center relative">
                        <Image src={imageDataUri} alt="Receipt to edit" width={600} height={800} className="max-h-full max-w-full object-contain" />
                        {isProcessing && (
                             <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-2">
                                <Skeleton className="h-4 w-32" />
                                <p className="text-sm font-medium">Applying AI enhancements...</p>
                             </div>
                        )}
                    </div>
                     <div className="space-y-4 py-4">
                        <h4 className="font-semibold">Available Enhancements</h4>
                        <div className="space-y-3">
                            {enhancementOptions.map((option) => (
                                <div key={option.id} className="flex items-center space-x-3">
                                    <Checkbox
                                        id={option.id}
                                        checked={selectedEnhancements.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                            setSelectedEnhancements(prev => 
                                                checked ? [...prev, option.id] : prev.filter(id => id !== option.id)
                                            );
                                        }}
                                    />
                                    <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={() => onSave(imageDataUri)}>Skip Enhancements</Button>
                    <Button onClick={handleApplyEdits} disabled={isProcessing}>
                        <Wand2 className="mr-2"/>
                        {isProcessing ? 'Applying...' : `Apply ${selectedEnhancements.length} Enhancements`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function DocumentUpload({ onDocumentChange, currentDocument }: DocumentUploadProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("camera");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);
  
  const startStream = useCallback(async (deviceId?: string) => {
    stopStream();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
            variant: 'destructive',
            title: 'Camera Not Available',
            description: 'Your browser does not support camera access.',
        });
        return;
    }

    try {
        const videoDevices = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'videoinput');
        setCameras(videoDevices);
        
        if (videoDevices.length === 0) {
             setHasCameraPermission(false);
             return;
        }

        const currentDeviceId = deviceId || selectedCameraId || videoDevices[0]?.deviceId;
        if (currentDeviceId && !selectedCameraId) {
            setSelectedCameraId(currentDeviceId);
        }
        
        const constraints: MediaStreamConstraints = { 
            video: currentDeviceId ? { deviceId: { exact: currentDeviceId } } : true 
        };

        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
            videoRef.current.srcObject = newStream;
        }
        streamRef.current = newStream;
        setHasCameraPermission(true);
    } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
        });
    }
  }, [stopStream, toast, selectedCameraId]);

  useEffect(() => {
    if (activeTab === "camera") {
        startStream(selectedCameraId);
    } else {
        stopStream();
    }
    
    return () => {
        stopStream();
    }
  }, [activeTab, startStream, stopStream, selectedCameraId]);

  const handleFlipCamera = () => {
    if (cameras.length > 1) {
      const currentIndex = cameras.findIndex(c => c.deviceId === selectedCameraId);
      const nextIndex = (currentIndex + 1) % cameras.length;
      setSelectedCameraId(cameras[nextIndex].deviceId);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        setIsEditOpen(true);
      }
    }
  };
  
  const handleEditSave = (editedUri: string) => {
    onDocumentChange(editedUri);
    setCapturedImage(null);
    setIsEditOpen(false);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target?.result as string;
        setCapturedImage(dataUrl);
        setIsEditOpen(true);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  const clearDocument = () => {
    onDocumentChange(null);
    toast({ variant: 'destructive', title: "Document Removed", description: "The attached document has been cleared."});
  };

  if (currentDocument) {
      return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <p className="text-sm font-medium">Document Preview:</p>
                <div className="relative">
                    <img src={currentDocument} alt="Attached document" className="rounded-md border max-h-80 w-auto mx-auto" />
                    <Button variant="destructive" size="icon" onClick={clearDocument} className="absolute top-2 right-2 h-7 w-7">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
      );
  }

  return (
    <div className="space-y-6">
        <Tabs defaultValue="camera" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="camera"><Camera className="mr-2" /> Use Camera</TabsTrigger>
                <TabsTrigger value="upload"><FileUp className="mr-2" /> Upload File</TabsTrigger>
            </TabsList>
            <TabsContent value="camera">
                <Card>
                    <CardContent className="p-4 space-y-4">
                        {hasCameraPermission === null && (
                            <div className="flex items-center justify-center h-48 rounded-md border border-dashed">
                                <p>Requesting camera permission...</p>
                            </div>
                        )}
                        {hasCameraPermission === false && (
                             <Alert variant="destructive">
                                <Videotape className="h-4 w-4" />
                                <AlertTitle>Camera Not Available</AlertTitle>
                                <AlertDescription>
                                    Could not access the camera. Please check your browser permissions and ensure you have a camera connected.
                                </AlertDescription>
                            </Alert>
                        )}
                        {hasCameraPermission && (
                            <>
                                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                                <div className="flex gap-2">
                                     <Button onClick={handleCapture} className="flex-1">
                                        <Camera className="mr-2" /> Capture Document
                                    </Button>
                                    {cameras.length > 1 && (
                                        <Button variant="outline" size="icon" onClick={handleFlipCamera} title="Flip camera">
                                            <SwitchCamera />
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                         <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="upload">
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="document-file">Select File</Label>
                            <Input id="document-file" type="file" accept="image/*,.pdf" onChange={handleFileChange} />
                        </div>
                    </CardContent>
                </Card>
             </TabsContent>
        </Tabs>
        {capturedImage && (
            <EditImageDialog
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                imageDataUri={capturedImage}
                onSave={handleEditSave}
            />
        )}
    </div>
  );
}
