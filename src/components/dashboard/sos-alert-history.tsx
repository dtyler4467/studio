
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { History } from "lucide-react";
import { format } from "date-fns";
import React from "react";
import { Skeleton } from "../ui/skeleton";

type Alert = {
    id: string;
    type: string;
    urgency: 'High' | 'Critical';
    location: string;
    details: string;
    timestamp: Date;
};

const mockAlertsData: Omit<Alert, 'timestamp'>[] = [
    { id: 'SOS001', type: 'Accident', urgency: 'Critical', location: 'I-80 East, Mile Marker 45', details: 'Multi-vehicle collision, road blocked.' },
    { id: 'SOS002', type: 'Mechanical Breakdown', urgency: 'High', location: 'Warehouse Dock 7', details: 'Trailer landing gear failed, unable to move.' },
];

const ClientFormattedDate = ({ date }: { date: Date | null }) => {
    if (!date) {
        return <Skeleton className="h-4 w-[150px]" />;
    }
    return <>{format(date, 'Pp')}</>;
}


export function SosAlertHistory() {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);

  React.useEffect(() => {
    // Generate timestamps on the client to avoid hydration mismatch
    const clientSideAlerts = mockAlertsData.map((alert, index) => ({
      ...alert,
      timestamp: new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000) // Simulate different times
    }));
    setAlerts(clientSideAlerts);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <History />
            Alert History
        </CardTitle>
        <CardDescription>A log of the most recent SOS alerts that have been sent.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="text-muted-foreground">
                        <ClientFormattedDate date={alert.timestamp} />
                    </TableCell>
                    <TableCell className="font-medium">{alert.type}</TableCell>
                    <TableCell>
                      <Badge variant={alert.urgency === 'Critical' ? 'destructive' : 'default'}>
                        {alert.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell>{alert.location}</TableCell>
                    <TableCell>{alert.details}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No SOS alerts have been sent recently.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
