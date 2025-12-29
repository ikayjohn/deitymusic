"use client"

import { useState } from "react"
import Image from "next/image"
import type { RevenueByRelease, RevenueByPlatform } from "@/lib/validations/earnings"
import { formatCurrencyUSD } from "@/lib/validations/earnings"

interface RevenueBreakdownProps {
 byRelease: RevenueByRelease[]
 byPlatform: RevenueByPlatform[]
}

type TabType = "releases" | "platforms"

export function RevenueBreakdown({
 byRelease,
 byPlatform,
}: RevenueBreakdownProps) {
 const [activeTab, setActiveTab] = useState<TabType>("releases")

 const totalRevenue =
 activeTab === "releases"
 ? byRelease.reduce((sum, r) => sum + r.revenue, 0)
 : byPlatform.reduce((sum, p) => sum + p.revenue, 0)

 return (
 <div className="border border-border bg-background shadow-sm">
 {/* Tabs */}
 <div className="border-b border-border">
 <div className="flex">
 <button
 onClick={() => setActiveTab("releases")}
 className={`px-6 py-3 text-sm font-medium transition-colors ${
 activeTab === "releases"
 ? "border-b-2 border-primary text-primary"
 : "text-muted-foreground hover:text-foreground"
 }`}
 >
 By Release
 </button>
 <button
 onClick={() => setActiveTab("platforms")}
 className={`px-6 py-3 text-sm font-medium transition-colors ${
 activeTab === "platforms"
 ? "border-b-2 border-primary text-primary"
 : "text-muted-foreground hover:text-foreground"
 }`}
 >
 By Platform
 </button>
 </div>
 </div>

 <div className="p-6">
 {activeTab === "releases" ? (
 <RevenueByReleaseList data={byRelease} total={totalRevenue} />
 ) : (
 <RevenueByPlatformList data={byPlatform} total={totalRevenue} />
 )}
 </div>
 </div>
 )
}

function RevenueByReleaseList({
 data,
 total,
}: {
 data: RevenueByRelease[]
 total: number
}) {
 return (
 <div className="space-y-4">
 {data.map((item) => (
 <div
 key={item.releaseId}
 className="flex items-center gap-4 border border-border bg-muted/30 p-4"
 >
 {/* Artwork */}
 <Image
 src={item.artwork}
 alt={item.releaseTitle}
 width={48}
 height={48}
 className="h-12 w-12 rounded object-cover"
 />

 {/* Release Info */}
 <div className="flex-1 min-w-0">
 <p className="font-medium truncate">{item.releaseTitle}</p>
 <p className="text-sm text-muted-foreground">
 {item.streams.toLocaleString()} streams
 </p>
 </div>

 {/* Revenue */}
 <div className="text-right">
 <p className="font-semibold">{formatCurrencyUSD(item.revenue)}</p>
 <p className="text-xs text-muted-foreground">{item.share.toFixed(1)}%</p>
 </div>

 {/* Progress Bar */}
 <div className="hidden sm:block w-32">
 <div className="h-2 w-full bg-muted overflow-hidden">
 <div
 className="h-full bg-primary"
 style={{ width: `${item.share}%` }}
 />
 </div>
 </div>
 </div>
 ))}
 </div>
 )
}

function RevenueByPlatformList({
 data,
 total,
}: {
 data: RevenueByPlatform[]
 total: number
}) {
 const platformColors: Record<string, string> = {
 SPOTIFY: "#1DB954",
 APPLE_MUSIC: "#FA2D48",
 AMAZON_MUSIC: "#00A8E1",
 YOUTUBE_MUSIC: "#FF0000",
 DEEZER: "#FF5A00",
 }

 return (
 <div className="space-y-4">
 {data.map((item) => (
 <div
 key={item.platform}
 className="flex items-center gap-4 border border-border bg-muted/30 p-4"
 >
 {/* Platform Icon */}
 <div
 className="flex h-12 w-12 items-center justify-center text-lg font-bold text-white"
 style={{ backgroundColor: platformColors[item.platform] || "#888" }}
 >
 {item.platformName.charAt(0)}
 </div>

 {/* Platform Info */}
 <div className="flex-1 min-w-0">
 <p className="font-medium">{item.platformName}</p>
 <p className="text-sm text-muted-foreground">
 {item.streams.toLocaleString()} streams
 </p>
 </div>

 {/* Revenue */}
 <div className="text-right">
 <p className="font-semibold">{formatCurrencyUSD(item.revenue)}</p>
 <p className="text-xs text-muted-foreground">{item.share.toFixed(1)}%</p>
 </div>

 {/* Progress Bar */}
 <div className="hidden sm:block w-32">
 <div className="h-2 w-full bg-muted overflow-hidden">
 <div
 className="h-full"
 style={{
 width: `${item.share}%`,
 backgroundColor: platformColors[item.platform] || "#888",
 }}
 />
 </div>
 </div>
 </div>
 ))}
 </div>
 )
}
