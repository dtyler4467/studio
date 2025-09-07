
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, MapPin, Milestone } from 'lucide-react';

const mockActiveLoads = [
  { id: 'LD004', driver: 'Mike Smith', origin: 'Seattle, WA', destination: 'Denver, CO' },
  { id: 'LD007', driver: 'Emily Jones', origin: 'Miami, FL', destination: 'Dallas, TX' },
];

export default function TrackingPage() {
  const [selectedLoad, setSelectedLoad] = useState<string | null>('LD004');
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(true);
  const [showGeofence, setShowGeofence] = useState(true);

  return (
    <div className="flex flex-col w-full h-screen">
      <Header pageTitle="Live Asset Tracking" />
      <main className="flex flex-1 flex-col lg:flex-row">
        <div className="w-full lg:w-1/4 xl:w-1/5 p-4 border-r border-border flex flex-col gap-4 bg-card">
          <h2 className="font-semibold text-lg font-headline">Tracking Controls</h2>
          
          <div className="space-y-2">
            <Label htmlFor="active-load">Select Active Load</Label>
            <Select value={selectedLoad || ''} onValueChange={setSelectedLoad}>
              <SelectTrigger id="active-load">
                <SelectValue placeholder="Select a load to track" />
              </SelectTrigger>
              <SelectContent>
                {mockActiveLoads.map(load => (
                  <SelectItem key={load.id} value={load.id}>
                    {load.id} - {load.driver}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-4">
             <div className="flex items-center justify-between">
              <Label htmlFor="show-breadcrumbs" className="flex items-center gap-2">
                <Milestone className="w-4 h-4" />
                Show Breadcrumbs
              </Label>
              <Switch
                id="show-breadcrumbs"
                checked={showBreadcrumbs}
                onCheckedChange={setShowBreadcrumbs}
              />
            </div>
             <div className="flex items-center justify-between">
              <Label htmlFor="show-geofence" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Show Geofence
              </Label>
              <Switch
                id="show-geofence"
                checked={showGeofence}
                onCheckedChange={setShowGeofence}
              />
            </div>
          </div>

          {selectedLoad && (
            <Card className="mt-4">
              <CardHeader className="p-4">
                <CardTitle className="text-md font-headline">Load Details</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm space-y-2">
                 {mockActiveLoads.find(l => l.id === selectedLoad) && (
                    <>
                        <p><strong>Driver:</strong> {mockActiveLoads.find(l => l.id === selectedLoad)?.driver}</p>
                        <p><strong>Route:</strong> {mockActiveLoads.find(l => l.id === selectedLoad)?.origin} to {mockActiveLoads.find(l => l.id === selectedLoad)?.destination}</p>
                        <p className="flex items-center gap-2 text-green-600"><Check className="w-4 h-4" /> On Schedule</p>
                    </>
                 )}
              </CardContent>
            </Card>
          )}
          
          <div className="mt-auto">
             <Button variant="outline" className="w-full">Refresh Data</Button>
          </div>
        </div>
        <div className="flex-1 bg-muted/30 relative">
            <Image 
                src="https://picsum.photos/seed/map/1600/1200" 
                alt="Map showing GPS tracking" 
                layout="fill"
                objectFit="cover"
                data-ai-hint="gps map"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4">
                <Card>
                    <CardContent className="p-4">
                        <p className="font-semibold text-center">Live Map Simulation</p>
                        <p className="text-sm text-muted-foreground text-center">In a real application, this would be an interactive map showing live driver locations.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
