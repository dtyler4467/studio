
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Wand2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { editReceiptImage } from '@/ai/flows/edit-receipt-image-flow';

const enhancementOptions = [
    { id: 'self_crop', label: 'Self-Cropping' },
    { id: 'shadows', label: 'Remove Shadows' },
    { id: 'enhance', label: 'Enhance Clarity' },
    { id: 'grayscale', label: 'Convert to Grayscale' },
    { id: 'brighten', label: 'Increase Brightness' },
];

export function EnhancePhotoDialog({
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
                    <Button variant="ghost" onClick={() => onSave(imageDataUri)}>Skip Enhancements</Button>
                    <Button onClick={handleApplyEdits} disabled={isProcessing}>
                        <Wand2 className="mr-2"/>
                        {isProcessing ? 'Applying...' : `Apply ${selectedEnhancements.length} Enhancements`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
