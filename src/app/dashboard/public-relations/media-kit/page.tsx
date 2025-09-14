
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { Logo } from '@/components/icons/logo';

const boilerplate = "LogiFlow is a leading provider of innovative logistics and supply chain solutions. Our platform streamlines operations, enhances visibility, and drives efficiency for businesses of all sizes.";

export default function MediaKitPage() {
    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Media Kit" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Manage Media Kit</CardTitle>
                        <CardDescription>
                            A central repository for your company's brand assets.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="font-semibold">Company Logos</h3>
                            <div className="flex flex-wrap gap-4">
                                <div className="p-4 border rounded-lg flex flex-col items-center gap-2">
                                    <Logo className="w-20 h-20 text-primary" />
                                    <Button variant="outline" size="sm"><Download className="mr-2"/> Download</Button>
                                </div>
                                <div className="p-4 border rounded-lg flex flex-col items-center gap-2 bg-gray-800">
                                    <Logo className="w-20 h-20 text-white" />
                                    <Button variant="secondary" size="sm"><Download className="mr-2"/> Download (Dark)</Button>
                                </div>
                                <div className="p-4 border rounded-lg flex items-center justify-center">
                                    <Button variant="secondary"><Upload className="mr-2" /> Upload New Logo</Button>
                                </div>
                            </div>
                        </div>

                         <div className="space-y-2">
                            <h3 className="font-semibold">Company Boilerplate</h3>
                            <div className="p-4 border rounded-lg bg-muted">
                                <p className="text-sm text-muted-foreground">{boilerplate}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
