
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, FileUp, Upload, Videotape, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

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

  const getCameraPermission = useCallback(async () => {
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
  }, [toast]);

  useEffect(() => {
    if (activeTab === "camera") {
        getCameraPermission();
    }

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [activeTab, getCameraPermission]);

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
                <img src={currentDocument} alt="Attached document" className="rounded-md border max-h-96 w-auto mx-auto" />
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
                        {hasCameraPermission && (
                            <>
                                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                                <Button onClick={handleCapture} className="w-full">
                                    <Camera className="mr-2" /> Capture Document
                                </Button>
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
