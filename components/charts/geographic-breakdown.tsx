"use client"

import {
 BarChart,
 Bar,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
 Cell,
} from "recharts"
import type { GeographicData } from "@/lib/validations/analytics"
import { formatCurrencyUSD } from "@/lib/validations/earnings"

interface GeographicBreakdownProps {
 data: GeographicData[]
}

const COUNTRY_COLORS: Record<string, string> = {
 US: "#3B82F6",
 GB: "#EF4444",
 DE: "#F59E0B",
 FR: "#10B981",
 BR: "#FBBF24",
 JP: "#EC4899",
 CA: "#6366F1",
 AU: "#F97316",
}

export function GeographicBreakdown({ data }: GeographicBreakdownProps) {
 const sortedData = [...data].sort((a, b) => b.streams - a.streams).slice(0, 8)

 return (
 <div className="space-y-4">
 <h3 className="font-semibold">Geographic Breakdown</h3>

 {/* Bar Chart */}
 <ResponsiveContainer width="100%" height={250}>
 <BarChart data={sortedData} layout="horizontal">
 <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
 <XAxis type="number" className="text-xs text-muted-foreground" />
 <YAxis
 dataKey="countryName"
 type="category"
 width={100}
 className="text-xs text-muted-foreground"
 tick={{ fill: "currentColor" }}
 />
 <Tooltip
 contentStyle={{
 backgroundColor: "hsl(var(--background))",
 border: "1px solid hsl(var(--border))",
 borderRadius: "0.5rem",
 }}
 formatter={(value: number | undefined, name: string | undefined) => [
 `${(value || 0).toLocaleString()} streams`,
 formatCurrencyUSD(sortedData.find((d) => d.country === name)?.revenue || 0),
 ]}
 />
 <Bar dataKey="streams" radius={[0, 4, 0, 0]}>
 {sortedData.map((entry) => (
 <Cell
 key={entry.country}
 fill={COUNTRY_COLORS[entry.country] || "#8884d8"}
 />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>

 {/* Top Countries List */}
 <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
 {sortedData.slice(0, 4).map((country) => (
 <div
 key={country.country}
 className="border border-border bg-muted/30 p-3"
 >
 <div className="flex items-center justify-between mb-1">
 <span className="text-sm font-medium">{country.countryName}</span>
 <span className="text-xs text-muted-foreground">{country.country}</span>
 </div>
 <p className="text-lg font-semibold">{country.streams.toLocaleString()}</p>
 <p className="text-xs text-muted-foreground">{formatCurrencyUSD(country.revenue)} revenue</p>
 </div>
 ))}
 </div>
 </div>
 )
}
