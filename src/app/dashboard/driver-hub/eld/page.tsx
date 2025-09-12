
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Zap } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type EldProvider = {
    id: string;
    name: string;
    logoUrl: string;
};

const eldProviders: EldProvider[] = [
    { id: 'keeptruckin', name: 'Motive (KeepTruckin)', logoUrl: 'https://picsum.photos/seed/keeptruckin/200/100' },
    { id: 'samsara', name: 'Samsara', logoUrl: 'https://picsum.photos/seed/samsara/200/100' },
    { id: 'omnitracs', name: 'Omnitracs', logoUrl: 'https://picsum.photos/seed/omnitracs/200/100' },
    { id: 'geotab', name: 'Geotab', logoUrl: 'https://picsum.photos/seed/geotab/200/100' },
];


export default function EldPage() {
    const [connectedProvider, setConnectedProvider] = useState<string | null>('keeptruckin');
    const { toast } = useToast();

    const handleConnect = (providerId: string) => {
        setConnectedProvider(providerId);
        const providerName = eldProviders.find(p => p.id === providerId)?.name;
        toast({
            title: "ELD Connected",
            description: `Successfully connected to ${providerName}.`,
        })
    }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="ELD" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Electronic Logging Device Integration</CardTitle>
                <CardDescription>
                    Connect your ELD provider to automatically sync driving hours and vehicle data.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eldProviders.map((provider) => {
                        const isConnected = connectedProvider === provider.id;
                        return (
                            <Card key={provider.id} className={cn("flex flex-col", isConnected && "border-primary")}>
                                <CardHeader className="flex-row items-center justify-between">
                                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                                    {isConnected && <CheckCircle className="h-5 w-5 text-primary" />}
                                </CardHeader>
                                <CardContent className="flex-1 flex items-center justify-center">
                                    <Image 
                                        src={provider.logoUrl} 
                                        alt={`${provider.name} logo`} 
                                        width={150} 
                                        height={75}
                                        data-ai-hint="logo"
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button 
                                        className="w-full"
                                        variant={isConnected ? 'default' : 'outline'}
                                        onClick={() => handleConnect(provider.id)}
                                    >
                                        <Zap className="mr-2" />
                                        {isConnected ? 'Connected' : 'Connect'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}

