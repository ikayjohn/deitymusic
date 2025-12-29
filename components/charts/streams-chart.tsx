"use client"

import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 Legend,
 ResponsiveContainer,
} from "recharts"
import type { StreamsOverTime } from "@/lib/validations/analytics"

interface StreamsChartProps {
 data: StreamsOverTime[]
}

export function StreamsChart({ data }: StreamsChartProps) {
 // Format data for chart
 const chartData = data.map((item) => ({
 date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
 Streams: item.streams,
 Downloads: item.downloads,
 }))

 return (
 <ResponsiveContainer width="100%" height={300}>
 <LineChart data={chartData}>
 <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
 <XAxis
 dataKey="date"
 className="text-xs text-muted-foreground"
 tick={{ fill: "currentColor" }}
 />
 <YAxis
 className="text-xs text-muted-foreground"
 tick={{ fill: "currentColor" }}
 tickFormatter={(value) => {
 if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
 if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
 return value.toString()
 }}
 />
 <Tooltip
 contentStyle={{
 backgroundColor: "hsl(var(--background))",
 border: "1px solid hsl(var(--border))",
 borderRadius: "0.5rem",
 }}
 />
 <Legend />
 <Line
 type="monotone"
 dataKey="Streams"
 stroke="hsl(var(--primary))"
 strokeWidth={2}
 dot={{ fill: "hsl(var(--primary))" }}
 activeDot={{ r: 6 }}
 />
 <Line
 type="monotone"
 dataKey="Downloads"
 stroke="hsl(var(--success))"
 strokeWidth={2}
 dot={{ fill: "hsl(var(--success))" }}
 activeDot={{ r: 6 }}
 />
 </LineChart>
 </ResponsiveContainer>
 )
}
