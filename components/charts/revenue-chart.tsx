"use client"

import {
 PieChart,
 Pie,
 Cell,
 ResponsiveContainer,
 Tooltip,
 Legend,
} from "recharts"
import type { RevenueByPlatform } from "@/lib/validations/analytics"
import { formatCurrencyUSD } from "@/lib/validations/earnings"

interface RevenueChartProps {
 data: RevenueByPlatform[]
}

const PLATFORM_COLORS: Record<string, string> = {
 SPOTIFY: "#1DB954",
 APPLE_MUSIC: "#FA2D48",
 AMAZON_MUSIC: "#00A8E1",
 YOUTUBE_MUSIC: "#FF0000",
 DEEZER: "#FF5A00",
 TIKTOK: "#00F2EA",
 INSTAGRAM: "#E1306C",
 TIDAL: "#000000",
 PANDORA: "#0076E2",
 NAPSTER: "#EF4123",
 AUDIOMACK: "#FFA500",
 BOOMPLAY: "#6F42C1",
}

const getPlatformName = (code: string) => {
 const names: Record<string, string> = {
 SPOTIFY: "Spotify",
 APPLE_MUSIC: "Apple Music",
 AMAZON_MUSIC: "Amazon Music",
 YOUTUBE_MUSIC: "YouTube Music",
 DEEZER: "Deezer",
 TIKTOK: "TikTok",
 INSTAGRAM: "Instagram",
 TIDAL: "Tidal",
 PANDORA: "Pandora",
 NAPSTER: "Napster",
 AUDIOMACK: "Audiomack",
 BOOMPLAY: "Boomplay",
 }
 return names[code] || code
}

export function RevenueChart({ data }: RevenueChartProps) {
 const chartData = data.map((item) => ({
 name: getPlatformName(item.platform),
 value: item.revenue,
 streams: item.streams,
 }))

 const CustomTooltip = ({ active, payload }: any) => {
 if (active && payload && payload.length) {
 const data = payload[0].payload
 return (
 <div className="border border-border bg-background p-3 shadow-lg">
 <p className="font-medium">{data.name}</p>
 <p className="text-sm text-muted-foreground">
 Revenue: {formatCurrencyUSD(data.value)}
 </p>
 <p className="text-xs text-muted-foreground">
 {data.streams.toLocaleString()} streams
 </p>
 </div>
 )
 }
 return null
 }

 return (
 <ResponsiveContainer width="100%" height={300}>
 <PieChart>
 <Pie
 data={chartData}
 cx="50%"
 cy="50%"
 labelLine={false}
 label={({ name, percent }: any) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
 outerRadius={80}
 fill="#8884d8"
 dataKey="value"
 >
 {data.map((entry, index) => (
 <Cell
 key={`cell-${index}`}
 fill={PLATFORM_COLORS[entry.platform] || "#8884d8"}
 />
 ))}
 </Pie>
 <Tooltip content={<CustomTooltip />} />
 <Legend />
 </PieChart>
 </ResponsiveContainer>
 )
}
