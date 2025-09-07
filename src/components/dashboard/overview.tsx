'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ChartTooltipContent } from '@/components/ui/chart';

const data = [
  { date: 'Mon', shipments: Math.floor(Math.random() * 200) + 50 },
  { date: 'Tue', shipments: Math.floor(Math.random() * 200) + 50 },
  { date: 'Wed', shipments: Math.floor(Math.random() * 200) + 50 },
  { date: 'Thu', shipments: Math.floor(Math.random() * 200) + 50 },
  { date: 'Fri', shipments: Math.floor(Math.random() * 200) + 50 },
  { date: 'Sat', shipments: Math.floor(Math.random() * 200) + 50 },
  { date: 'Sun', shipments: Math.floor(Math.random() * 200) + 50 },
];

export function Overview() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-headline">Shipments Overview</CardTitle>
        <CardDescription>An overview of shipments for the past week.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
             <Tooltip
                cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                content={<ChartTooltipContent />}
              />
            <Bar dataKey="shipments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
