
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, FileUp, Upload, Videotape } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function DocumentUpload() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function getCameraPermission() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
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
    }
    getCameraPermission();

    return () => {
        // Cleanup: stop video stream when component unmounts
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

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
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!capturedImage && !selectedFile) {
        toast({ variant: 'destructive', title: 'No document to upload', description: 'Please capture an image or select a file.' });
        return;
    }
    // In a real app, you would upload the capturedImage (data URL) or selectedFile (File object)
    // to your backend or cloud storage.
    toast({
        title: 'Upload Successful',
        description: 'Your document has been uploaded.',
    });
    setCapturedImage(null);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
        <Tabs defaultValue="camera">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="camera"><Camera className="mr-2" /> Use Camera</TabsTrigger>
                <TabsTrigger value="upload"><FileUp className="mr-2" /> Upload File</TabsTrigger>
            </TabsList>
            <TabsContent value="camera">
                <Card>
                    <CardContent className="p-4 space-y-4">
                        {hasCameraPermission === null && (
                            <div className="flex items-center justify-center h-64 rounded-md border border-dashed">
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
                        {hasCameraPermission && !capturedImage && (
                            <>
                                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                                <Button onClick={handleCapture} className="w-full">
                                    <Camera className="mr-2" /> Capture Document
                                </Button>
                            </>
                        )}
                        {capturedImage && (
                            <div className="space-y-4">
                                <p className="text-sm font-medium">Captured Image Preview:</p>
                                <img src={capturedImage} alt="Captured document" className="rounded-md border" />
                                <Button variant="outline" onClick={() => setCapturedImage(null)}>
                                    Retake Picture
                                </Button>
                            </div>
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
                        {selectedFile && (
                            <div className="text-sm text-muted-foreground">
                                <p>Selected: <span className="font-medium text-foreground">{selectedFile.name}</span></p>
                            </div>
                        )}
                    </CardContent>
                </Card>
             </TabsContent>
        </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleUpload} disabled={!capturedImage && !selectedFile}>
          <Upload className="mr-2" /> Upload Document
        </Button>
      </div>
    </div>
  );
}
