
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, FileUp, Videotape, Trash2, SwitchCamera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type DocumentUploadProps = {
    onDocumentChange: (dataUri: string | null) => void;
    currentDocument: string | null;
};

export function DocumentUpload({ onDocumentChange, currentDocument }: DocumentUploadProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("camera");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const streamRef = useRef<MediaStream | null>(null);

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

        const currentDeviceId = deviceId || videoDevices[0]?.deviceId;
        if (currentDeviceId) {
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
  }, [stopStream, toast]);

  useEffect(() => {
    if (activeTab === "camera") {
        startStream(selectedCameraId || undefined);
    } else {
        stopStream();
    }
    // Cleanup function to stop stream when component unmounts or tab changes
    return () => {
        stopStream();
    }
  }, [activeTab, startStream, stopStream, selectedCameraId]);

  const handleCameraChange = (deviceId: string) => {
    setSelectedCameraId(deviceId);
    // The useEffect will handle restarting the stream
  }

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
        onDocumentChange(dataUrl);
        toast({ title: "Image Captured", description: "The image is ready to be submitted with the form."});
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        onDocumentChange(loadEvent.target?.result as string);
         toast({ title: "File Selected", description: "The file is ready to be submitted with the form."});
      };
      reader.readAsDataURL(file);
    }
    // Reset file input so user can select the same file again if they need to
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
                <img src={currentDocument} alt="Attached document" className="rounded-md border max-h-80 w-auto mx-auto" />
                <Button variant="destructive" onClick={clearDocument} className="w-full">
                    <Trash2 className="mr-2" /> Remove Document
                </Button>
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
                                    {cameras.length > 1 && (
                                        <div className="flex-1">
                                            <Select value={selectedCameraId} onValueChange={handleCameraChange}>
                                                <SelectTrigger>
                                                    <SwitchCamera className="mr-2"/>
                                                    <SelectValue placeholder="Select camera" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {cameras.map(camera => (
                                                        <SelectItem key={camera.deviceId} value={camera.deviceId}>
                                                            {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                    <Button onClick={handleCapture} className="flex-1">
                                        <Camera className="mr-2" /> Capture Document
                                    </Button>
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
    </div>
  );
}
