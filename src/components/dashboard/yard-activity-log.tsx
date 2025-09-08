
"use client";

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

type Activity = {
    id: string;
    type: 'Inbound' | 'Outbound';
    trailerId: string;
    carrier: string;
    timestamp: Date;
};

const initialActivities: Activity[] = [
    { id: 'ACT001', type: 'Inbound', trailerId: 'TR53123', carrier: 'Knight-Swift', timestamp: new Date() },
    { id: 'ACT002', type: 'Outbound', trailerId: 'TR48991', carrier: 'J.B. Hunt', timestamp: new Date(new Date().getTime() - 30 * 60000) },
    { id: 'ACT003', type: 'Inbound', trailerId: 'TR53456', carrier: 'Schneider', timestamp: new Date(new Date().getTime() - 45 * 60000) },
];

export function YardActivityLog() {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        // In a real app, you would fetch this data or subscribe to updates.
        setActivities(initialActivities);
    }, []);

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Trailer ID</TableHead>
                        <TableHead>Carrier</TableHead>
                        <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {activities.length > 0 ? (
                        activities.map((activity) => (
                            <TableRow key={activity.id}>
                                <TableCell>
                                    <Badge variant={activity.type === 'Inbound' ? 'secondary' : 'outline'}>
                                        {activity.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium">{activity.trailerId}</TableCell>
                                <TableCell>{activity.carrier}</TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                    {format(activity.timestamp, 'p')}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No recent activity.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
