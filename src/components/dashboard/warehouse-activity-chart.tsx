
"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", inbound: 186, outbound: 80 },
  { month: "February", inbound: 305, outbound: 200 },
  { month: "March", inbound: 237, outbound: 120 },
  { month: "April", inbound: 73, outbound: 190 },
  { month: "May", inbound: 209, outbound: 130 },
  { month: "June", inbound: 214, outbound: 140 },
]

const chartConfig = {
  inbound: {
    label: "Inbound",
    color: "hsl(var(--chart-1))",
  },
  outbound: {
    label: "Outbound",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function WarehouseActivityChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-[350px]">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="inbound" fill="var(--color-inbound)" radius={4} />
        <Bar dataKey="outbound" fill="var(--color-outbound)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
