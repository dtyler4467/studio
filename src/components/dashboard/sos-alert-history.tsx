
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { History } from "lucide-react";
import { format } from "date-fns";

const mockAlerts = [
    { id: 'SOS001', type: 'Accident', urgency: 'Critical', location: 'I-80 East, Mile Marker 45', details: 'Multi-vehicle collision, road blocked.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'SOS002', type: 'Mechanical Breakdown', urgency: 'High', location: 'Warehouse Dock 7', details: 'Trailer landing gear failed, unable to move.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
];

export function SosAlertHistory() {
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
              {mockAlerts.length > 0 ? (
                mockAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="text-muted-foreground">{format(alert.timestamp, 'Pp')}</TableCell>
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
