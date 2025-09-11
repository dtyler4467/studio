
"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, ArrowRight, Truck, FileText, Info, History } from 'lucide-react';
import Link from 'next/link';
import { useSchedule, Load, YardEvent } from '@/hooks/use-schedule';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type SearchResult = {
    load: Load;
    yardEvent?: YardEvent;
};

// This is now coming from the hook, but we'll keep a reference here for component logic
const mockLoads: Load[] = [
    { id: "LD001", origin: "Los Angeles, CA", destination: "Phoenix, AZ", pickupDate: "2024-08-01", deliveryDate: "2024-08-02", rate: 1200, status: "Available", carrier: "Knight-Swift", scac: "KNX" },
    { id: "LD002", origin: "Chicago, IL", destination: "New York, NY", pickupDate: "2024-08-03", deliveryDate: "2024-08-05", rate: 2500, status: "Available", carrier: "J.B. Hunt", scac: "JBHT" },
    { id: "LD003", origin: "Dallas, TX", destination: "Atlanta, GA", pickupDate: "2024-08-05", deliveryDate: "2024-08-07", rate: 1800, status: "Pending", assignedTo: "Jane Doe", carrier: "Swift Logistics", scac: "SWFT", dispatcher: "Dispatcher Name" },
    { id: "LD004", origin: "Seattle, WA", destination: "Denver, CO", pickupDate: "2024-08-06", deliveryDate: "2024-08-08", rate: 2200, status: "In-Transit", assignedTo: "Mike Smith", carrier: "Knight-Swift", scac: "KNX", dispatcher: "Dispatcher Name" },
    { id: "LD005", origin: "Miami, FL", destination: "Houston, TX", pickupDate: "2024-08-08", deliveryDate: "2024-08-10", rate: 2000, status: "Delivered", assignedTo: "Jane Doe", carrier: "Swift Logistics", scac: "SWFT", dispatcher: "Dispatcher Name" },
];

export default function YardSearchPage() {
    const [searchType, setSearchType] = useState('bol');
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [searched, setSearched] = useState(false);
    const { yardEvents, loads } = useSchedule();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearched(true);
        if (!searchTerm.trim()) {
            setResults([]);
            return;
        }

        const lowercasedSearch = searchTerm.toLowerCase();
        let filteredLoads: Load[] = [];

        if (searchType === 'bol') {
            filteredLoads = loads.filter(load => load.id.toLowerCase().includes(lowercasedSearch));
        } else if (searchType === 'trailer') {
            const eventWithTrailer = yardEvents.find(event => event.trailerId.toLowerCase().includes(lowercasedSearch));
            if (eventWithTrailer) {
                const foundLoad = loads.find(load => load.id === eventWithTrailer.loadNumber);
                if (foundLoad) {
                    filteredLoads.push(foundLoad);
                }
            }
        }
        
        const searchResults: SearchResult[] = filteredLoads.map(load => {
            const latestEvent = yardEvents
                .filter(e => e.loadNumber === load.id)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            return { load, yardEvent: latestEvent };
        });

        setResults(searchResults);
    };

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Pre-Arrival Load Search" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">Search for Load</CardTitle>
                        <CardDescription>
                            Find a load by its Bill of Lading (BOL) or Trailer ID to begin the check-in or check-out process.
                        </CardDescription>
                    </div>
                     <Button variant="outline" asChild>
                        <Link href="/dashboard/warehouse-hub-manager/bol/history">
                            <History className="mr-2" />
                            View BOL History
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch}>
                    <Tabs value={searchType} onValueChange={setSearchType} className="w-full max-w-md">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="bol">
                                <FileText className="mr-2" /> By BOL Number
                            </TabsTrigger>
                            <TabsTrigger value="trailer">
                                <Truck className="mr-2" /> By Trailer ID
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="flex w-full max-w-md items-center space-x-2 mt-4">
                        <Input
                            type="text"
                            placeholder={searchType === 'bol' ? 'Enter BOL...' : 'Enter Trailer ID...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button type="submit">
                            <Search className="mr-2" /> Search
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
        
        {searched && (
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4 font-headline">Search Results</h2>
                {results.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {results.map(({load, yardEvent}) => (
                            <Card key={load.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>Load ID: {load.id}</CardTitle>
                                            <CardDescription>{load.origin} to {load.destination}</CardDescription>
                                        </div>
                                        <Badge variant={yardEvent ? 'default' : 'secondary'}>
                                            {yardEvent ? yardEvent.status || 'Checked In' : load.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-sm space-y-4">
                                    <div className="space-y-1">
                                        <p><strong>Carrier:</strong> {load.carrier} (SCAC: {load.scac})</p>
                                        <p><strong>Trailer ID:</strong> {yardEvent?.trailerId || 'N/A'}</p>
                                        <p><strong>Assigned Driver:</strong> {load.assignedTo || 'N/A'}</p>
                                    </div>
                                     {yardEvent?.statusNotes && (
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertTitle>Latest Note</AlertTitle>
                                            <AlertDescription>
                                                {yardEvent.statusNotes}
                                            </AlertDescription>
                                        </Alert>
                                     )}
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <Link href={`/dashboard/yard-management/check-in?loadNumber=${load.id}&trailerId=${yardEvent?.trailerId || ''}&carrier=${load.carrier}&scac=${load.scac}&driver=${load.assignedTo || ''}`}>
                                            Process Gate Transaction <ArrowRight className="ml-2" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed h-64 text-center">
                        <p className="text-lg font-medium text-muted-foreground">No matching loads found.</p>
                        <p className="text-sm text-muted-foreground">Try a different search term or enter the details manually.</p>
                        <Button variant="secondary" className="mt-4" asChild>
                           <Link href="/dashboard/yard-management/check-in">
                                Manual Gate Entry
                           </Link>
                        </Button>
                    </div>
                )}
            </div>
        )}

      </main>
    </div>
  );
}
