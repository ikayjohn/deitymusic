"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { StreamsChart } from "@/components/charts/streams-chart"
import { RevenueChart } from "@/components/charts/revenue-chart"
import { TopTracks } from "@/components/charts/top-tracks"
import { GeographicBreakdown } from "@/components/charts/geographic-breakdown"
import type { DetailedAnalytics } from "@/lib/validations/analytics"

export default function AnalyticsPage() {
 const [analytics, setAnalytics] = useState<DetailedAnalytics | null>(null)
 const [loading, setLoading] = useState(true)
 const [dateRange, setDateRange] = useState("30d")

 useEffect(() => {
 fetchAnalytics()
 }, [dateRange])

 const fetchAnalytics = async () => {
 setLoading(true)

 try {
 const params = new URLSearchParams({
 startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
 endDate: new Date().toISOString(),
 })

 const response = await fetch(`/api/analytics?${params}`)
 const data = await response.json()
 setAnalytics(data)
 } catch (error) {
 console.error("Failed to fetch analytics:", error)
 } finally {
 setLoading(false)
 }
 }

 const handleExport = async () => {
 try {
 const response = await fetch("/api/analytics/export?format=csv")

 if (!response.ok) {
 throw new Error("Failed to export data")
 }

 const blob = await response.blob()
 const url = window.URL.createObjectURL(blob)
 const a = document.createElement("a")
 a.href = url
 a.download = `analytics-${new Date().toISOString().split("T")[0]}.csv`
 document.body.appendChild(a)
 a.click()
 window.URL.revokeObjectURL(url)
 document.body.removeChild(a)
 } catch (error) {
 console.error("Export error:", error)
 alert("Failed to export analytics")
 }
 }

 if (loading) {
 return (
 <>
 <Header title="Analytics" />
 <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
 <div className="mx-auto max-w-7xl">
 <div className="flex min-h-[400px] items-center justify-center">
 <div className="text-center">
 <div className="inline-block h-8 w-8 animate-spin border-4 border-solid border-primary border-r-transparent" />
 <p className="mt-4 text-sm text-muted-foreground">Loading analytics...</p>
 </div>
 </div>
 </div>
 </main>
 </>
 )
 }

 if (!analytics) {
 return (
 <>
 <Header title="Analytics" />
 <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
 <div className="mx-auto max-w-7xl">
 <div className="border border-border bg-background p-12 text-center shadow-sm">
 <svg className="mx-auto h-16 w-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
 </svg>
 <h3 className="mt-4 text-lg font-semibold">No Analytics Available</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 Once your releases go live and start generating streams, you'll see your analytics here.
 </p>
 </div>
 </div>
 </main>
 </>
 )
 }

 const { overview, streamsOverTime, revenueByPlatform, topTracks, geographicData } = analytics

 return (
 <>
 <Header title="Analytics" />
 <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
 <div className="mx-auto max-w-7xl space-y-6">
 {/* Header */}
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
 <p className="text-muted-foreground">
 Track your streams, revenue, and audience insights
 </p>
 </div>

 <div className="flex items-center gap-2">
 {/* Date Range Selector */}
 <select
 value={dateRange}
 onChange={(e) => setDateRange(e.target.value)}
 className="border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 >
 <option value="7d">Last 7 days</option>
 <option value="30d">Last 30 days</option>
 <option value="90d">Last 90 days</option>
 <option value="365d">Last year</option>
 <option value="all">All time</option>
 </select>

 {/* Export Button */}
 <button
 onClick={handleExport}
 className="flex items-center gap-2 border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
 >
 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
 </svg>
 Export CSV
 </button>
 </div>
 </div>

 {/* Overview Stats */}
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 <div className="border border-border bg-background p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-muted-foreground">Total Streams</p>
 <p className="mt-2 text-2xl font-bold">
 {overview?.totalStreams.toLocaleString() || 0}
 </p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center bg-primary/10 text-primary">
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7" />
 </svg>
 </div>
 </div>
 </div>

 <div className="border border-border bg-background p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-muted-foreground">Total Revenue</p>
 <p className="mt-2 text-2xl font-bold">
 ${overview?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
 </p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center bg-success/10 text-success">
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </div>
 </div>
 </div>

 <div className="border border-border bg-background p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-muted-foreground">Downloads</p>
 <p className="mt-2 text-2xl font-bold">
 {overview?.totalDownloads?.toLocaleString() || 0}
 </p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center bg-info/10 text-info">
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l4-4m4 4v4" />
 </svg>
 </div>
 </div>
 </div>

 <div className="border border-border bg-background p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-muted-foreground">Active Platforms</p>
 <p className="mt-2 text-2xl font-bold">{overview?.activePlatforms || 0}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center bg-warning/10 text-warning">
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
 </svg>
 </div>
 </div>
 </div>
 </div>

 {/* Charts Grid */}
 <div className="grid gap-6 lg:grid-cols-2">
 {/* Streams Over Time */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <StreamsChart data={streamsOverTime || []} />
 </div>

 {/* Revenue by Platform */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <RevenueChart data={revenueByPlatform || []} />
 </div>
 </div>

 {/* Top Tracks & Geographic */}
 <div className="grid gap-6 lg:grid-cols-2">
 {/* Top Tracks */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <TopTracks tracks={topTracks || []} />
 </div>

 {/* Geographic Breakdown */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <GeographicBreakdown data={geographicData || []} />
 </div>
 </div>
 </div>
 </main>
 </>
 )
}
