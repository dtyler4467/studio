
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Tractor, Car, Bus, Forklift, HardHat } from 'lucide-react';
import React, { useState } from 'react';

type ChecklistItemProps = { id: string; label: string };

const ChecklistSection = ({ title, items }: { title: string; items: ChecklistItemProps[] }) => (
    <div className="space-y-3">
        <h4 className="font-semibold text-sm text-muted-foreground">{title}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox id={item.id} />
                    <Label htmlFor={item.id} className="text-sm font-normal">{item.label}</Label>
                </div>
            ))}
        </div>
    </div>
);

const truckItems: ChecklistItemProps[] = [
    { id: 'truck-air-compressor', label: 'Air Compressor' },
    { id: 'truck-air-lines', label: 'Air Lines' },
    { id: 'truck-battery', label: 'Battery' },
    { id: 'truck-brake-accessories', label: 'Brake Accessories' },
    { id: 'truck-brakes', label: 'Brakes' },
    { id: 'truck-clutch', label: 'Clutch' },
    { id: 'truck-coupling-devices', label: 'Coupling Devices' },
    { id: 'truck-defroster', label: 'Defroster' },
    { id: 'truck-drive-line', label: 'Drive Line' },
    { id: 'truck-engine', label: 'Engine' },
    { id: 'truck-fifth-wheel', label: 'Fifth Wheel' },
    { id: 'truck-fluid-levels', label: 'Fluid Levels' },
    { id: 'truck-frame-assembly', label: 'Frame & Assembly' },
    { id: 'truck-front-axle', label: 'Front Axle' },
    { id: 'truck-fuel-tanks', label: 'Fuel Tanks' },
    { id: 'truck-heater', label: 'Heater' },
    { id: 'truck-horn', label: 'Horn' },
    { id: 'truck-lights', label: 'Lights' },
    { id: 'truck-mirrors', label: 'Mirrors' },
    { id: 'truck-oil-pressure', label: 'Oil Pressure' },
    { id: 'truck-radiator', label: 'Radiator' },
    { id: 'truck-rear-end', label: 'Rear End' },
    { id: 'truck-reflectors', label: 'Reflectors' },
    { id: 'truck-safety-equipment', label: 'Safety Equipment' },
    { id: 'truck-starter', label: 'Starter' },
    { id: 'truck-steering', label: 'Steering' },
    { id: 'truck-suspension', label: 'Suspension' },
    { id: 'truck-tires', label: 'Tires' },
    { id: 'truck-transmission', label: 'Transmission' },
    { id: 'truck-trip-recorder', label: 'Trip Recorder' },
    { id: 'truck-wheels-rims', label: 'Wheels & Rims' },
    { id: 'truck-windows', label: 'Windows' },
    { id: 'truck-windshield-wipers', label: 'Windshield Wipers' },
];

const trailerItems: ChecklistItemProps[] = [
    { id: 'trailer-brake-connections', label: 'Brake Connections' },
    { id: 'trailer-brakes', label: 'Brakes' },
    { id: 'trailer-coupling-devices', label: 'Coupling Devices' },
    { id: 'trailer-coupling-pin', label: 'Coupling (King) Pin' },
    { id: 'trailer-doors', label: 'Doors' },
    { id: 'trailer-hitch', label: 'Hitch' },
    { id: 'trailer-landing-gear', label: 'Landing Gear' },
    { id: 'trailer-lights', label: 'Lights' },
    { id: 'trailer-reflectors', label: 'Reflectors' },
    { id: 'trailer-roof', label: 'Roof' },
    { id: 'trailer-suspension', label: 'Suspension' },
    { id: 'trailer-tarpaulin', label: 'Tarpaulin' },
    { id: 'trailer-tires', label: 'Tires' },
    { id: 'trailer-wheels-rims', label: 'Wheels & Rims' },
];

const forkliftItems: ChecklistItemProps[] = [
    { id: 'forklift-forks', label: 'Forks/Blades' },
    { id: 'forklift-load-rest', label: 'Load Back Rest' },
    { id: 'forklift-mast', label: 'Mast & Chains' },
    { id: 'forklift-hydraulic', label: 'Hydraulic System' },
    { id: 'forklift-carriage', label: 'Carriage' },
    { id: 'forklift-tires-wheels', label: 'Tires & Wheels' },
    { id: 'forklift-brakes', label: 'Brakes' },
    { id: 'forklift-steering', label: 'Steering' },
    { id: 'forklift-horn', label: 'Horn' },
    { id: 'forklift-lights', label: 'Lights & Alarms' },
    { id: 'forklift-seatbelt', label: 'Seatbelt/Restraint' },
    { id: 'forklift-engine-oil', label: 'Engine Oil' },
    { id: 'forklift-coolant', label: 'Coolant Level' },
    { id: 'forklift-battery', label: 'Battery & Cables' },
    { id: 'forklift-safety-decals', label: 'Safety Decals' },
    { id: 'forklift-overhead-guard', label: 'Overhead Guard' },
];

const vehicleItems: ChecklistItemProps[] = [
    { id: 'vehicle-brakes', label: 'Brakes' },
    { id: 'vehicle-lights', label: 'Lights & Signals' },
    { id: 'vehicle-tires-wheels', label: 'Tires & Wheels' },
    { id: 'vehicle-steering', label: 'Steering' },
    { id: 'vehicle-horn', label: 'Horn' },
    { id: 'vehicle-mirrors', label: 'Mirrors' },
    { id: 'vehicle-windshield', label: 'Windshield & Wipers' },
    { id: 'vehicle-fluid-levels', label: 'Fluid Levels (Oil, Coolant)' },
    { id: 'vehicle-seatbelts', label: 'Seatbelts' },
    { id: 'vehicle-emergency-equipment', label: 'Emergency Equipment' },
    { id: 'vehicle-body-damage', label: 'Body Damage' },
];

const DvirFormTemplate = ({ children, title }: { children: React.ReactNode, title: string }) => {
    const { toast } = useToast();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast({
            title: "DVIR Submitted",
            description: `Your ${title} report has been successfully submitted.`,
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`${title}-unit`}>Vehicle/Unit #</Label>
                    <Input id={`${title}-unit`} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${title}-date`}>Date</Label>
                    <Input id={`${title}-date`} type="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor={`${title}-odometer`}>Mileage/Hours</Label>
                    <Input id={`${title}-odometer`} type="number" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${title}-location`}>Location</Label>
                    <Input id={`${title}-location`} required />
                </div>
            </div>

            <Separator />
            
            {children}

            <Separator />
            
            <div className="space-y-4">
                <Label htmlFor={`${title}-remarks`}>Remarks</Label>
                <Textarea id={`${title}-remarks`} placeholder="Explain any defects marked above. If no defects are found, write 'No Defects'." />
            </div>
            
            <div className="space-y-4">
                <Label>Condition of the vehicle is:</Label>
                <RadioGroup required defaultValue="satisfactory" className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="satisfactory" id={`${title}-sat`} />
                        <Label htmlFor={`${title}-sat`}>Satisfactory</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unsatisfactory" id={`${title}-unsat`} />
                        <Label htmlFor={`${title}-unsat`}>Unsatisfactory (defects need correction)</Label>
                    </div>
                </RadioGroup>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
                <div className="space-y-2 flex-1">
                    <Label htmlFor={`${title}-driver-signature`}>Driver's Signature</Label>
                    <Input id={`${title}-driver-signature`} placeholder="Type your name to sign" required />
                </div>
                <Button type="submit" size="lg">Submit Report</Button>
            </div>
        </form>
    );
};


export default function DvirPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="D.V.I.R" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Driver Vehicle Inspection Report</CardTitle>
                <CardDescription>
                    Select the vehicle type and complete the pre-trip or post-trip inspection.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="truck-trailer">
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
                        <TabsTrigger value="truck-trailer" className="py-2"><Tractor className="mr-2" />Truck & Trailer</TabsTrigger>
                        <TabsTrigger value="forklift" className="py-2"><Forklift className="mr-2" />Forklift</TabsTrigger>
                        <TabsTrigger value="vehicle" className="py-2"><Car className="mr-2" />Standard Vehicle</TabsTrigger>
                    </TabsList>

                    <TabsContent value="truck-trailer" className="pt-6">
                        <DvirFormTemplate title="Truck/Trailer">
                            <div className="space-y-6">
                                <ChecklistSection title="Tractor/Truck" items={truckItems} />
                                <Separator />
                                <ChecklistSection title="Trailer" items={trailerItems} />
                            </div>
                        </DvirFormTemplate>
                    </TabsContent>

                     <TabsContent value="forklift" className="pt-6">
                         <DvirFormTemplate title="Forklift">
                             <ChecklistSection title="Forklift Components" items={forkliftItems} />
                        </DvirFormTemplate>
                    </TabsContent>

                    <TabsContent value="vehicle" className="pt-6">
                         <DvirFormTemplate title="Standard Vehicle">
                             <ChecklistSection title="Vehicle Components" items={vehicleItems} />
                        </DvirFormTemplate>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}

