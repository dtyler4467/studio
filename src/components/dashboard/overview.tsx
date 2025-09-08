'use client';

import { useState, useEffect } from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  shipments: {
    label: 'Shipments',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function Overview() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // This needs to be client-side only to avoid hydration errors
    setChartData([
      { date: 'Mon', shipments: Math.floor(Math.random() * 200) + 50 },
      { date: 'Tue', shipments: Math.floor(Math.random() * 200) + 50 },
      { date: 'Wed', shipments: Math.floor(Math.random() * 200) + 50 },
      { date: 'Thu', shipments: Math.floor(Math.random() * 200) + 50 },
      { date: 'Fri', shipments: Math.floor(Math.random() * 200) + 50 },
      { date: 'Sat', shipments: Math.floor(Math.random() * 200) + 50 },
      { date: 'Sun', shipments: Math.floor(Math.random() * 200) + 50 },
    ]);
  }, []);


  return (
    <CardHeader>
        <CardTitle className="font-headline">Shipments Overview</CardTitle>
        <CardDescription>An overview of shipments for the past week.</CardDescription>
        <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart data={chartData}>
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
                <ChartTooltip
                cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                content={<ChartTooltipContent />}
                />
                <Bar dataKey="shipments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ChartContainer>
        </CardContent>
    </CardHeader>
  );
}
