"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import type { AdminStats } from "@/lib/validations/admin"
import { formatCurrencyUSD, formatCurrencyNGN } from "@/lib/validations/admin"
import {
 LineChart,
 Line,
 BarChart,
 Bar,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
 PieChart,
 Pie,
 Cell,
 Legend,
} from "recharts"
import Link from "next/link"

const COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#FBBF24"]

export default function AdminDashboardPage() {
 const [stats, setStats] = useState<AdminStats | null>(null)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 fetchStats()
 }, [])

 const fetchStats = async () => {
 setLoading(true)
 try {
 const response = await fetch("/api/admin/stats")
 const data = await response.json()
 setStats(data)
 } catch (error) {
 console.error("Failed to fetch admin stats:", error)
 } finally {
 setLoading(false)
 }
 }

 if (loading) {
 return (
 <div className="flex min-h-[400px] items-center justify-center">
 <div className="text-center">
 <div className="inline-block h-8 w-8 animate-spin border-4 border-solid border-primary border-r-transparent" />
 <p className="mt-4 text-sm text-muted-foreground">Loading admin dashboard...</p>
 </div>
 </div>
 )
 }

 if (!stats) {
 return (
 <div className="border border-border bg-background p-12 text-center shadow-sm">
 <h3 className="text-lg font-semibold">Unable to load dashboard</h3>
 <p className="mt-2 text-sm text-muted-foreground">Please try again later</p>
 </div>
 )
 }

 return (
 <div className="space-y-6">
 {/* Header */}
 <div>
 <h1 className="text-3xl font-bold">Admin Dashboard</h1>
 <p className="text-muted-foreground">
 Monitor and manage your music distribution platform
 </p>
 </div>

 {/* Overview Stats */}
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 <StatCard
 title="Total Users"
 value={stats.overview.totalUsers.toLocaleString()}
 change={`${stats.overview.activeUsers} active`}
 icon={<UsersIcon />}
 color="blue"
 />
 <StatCard
 title="Total Releases"
 value={stats.overview.totalReleases.toLocaleString()}
 change={`${stats.overview.pendingReleases} pending`}
 icon={<ReleasesIcon />}
 color="blue"
 />
 <StatCard
 title="Total Earnings"
 value={formatCurrencyUSD(stats.overview.totalEarnings)}
 change={`${formatCurrencyUSD(stats.overview.monthlyRevenue)} this month`}
 icon={<EarningsIcon />}
 color="green"
 />
 <StatCard
 title="Pending Withdrawals"
 value={stats.overview.pendingWithdrawals.toString()}
 change={`${formatCurrencyUSD(stats.overview.totalPaidOut)} paid out`}
 icon={<WithdrawalsIcon />}
 color="orange"
 />
 </div>

 {/* Charts Row */}
 <div className="grid gap-6 lg:grid-cols-2">
 {/* User Growth Chart */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <h3 className="mb-4 font-semibold">User Growth (30 Days)</h3>
 <ResponsiveContainer width="100%" height={250}>
 <LineChart data={stats.userGrowth}>
 <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
 <XAxis
 dataKey="date"
 className="text-xs text-muted-foreground"
 tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
 />
 <YAxis className="text-xs text-muted-foreground" />
 <Tooltip
 contentStyle={{
 backgroundColor: "hsl(var(--background))",
 border: "1px solid hsl(var(--border))",
 borderRadius: "0.5rem",
 }}
 labelFormatter={(value) => new Date(value).toLocaleDateString()}
 />
 <Legend />
 <Line
 type="monotone"
 dataKey="users"
 stroke="hsl(var(--primary))"
 strokeWidth={2}
 dot={false}
 name="Total Users"
 />
 <Line
 type="monotone"
 dataKey="activeUsers"
 stroke="hsl(var(--success))"
 strokeWidth={2}
 dot={false}
 name="Active Users"
 />
 </LineChart>
 </ResponsiveContainer>
 </div>

 {/* Revenue Chart */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <h3 className="mb-4 font-semibold">Revenue vs Payouts (12 Months)</h3>
 <ResponsiveContainer width="100%" height={250}>
 <BarChart data={stats.revenueChart}>
 <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
 <XAxis
 dataKey="date"
 className="text-xs text-muted-foreground"
 tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short" })}
 />
 <YAxis className="text-xs text-muted-foreground" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
 <Tooltip
 contentStyle={{
 backgroundColor: "hsl(var(--background))",
 border: "1px solid hsl(var(--border))",
 borderRadius: "0.5rem",
 }}
 labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
 formatter={(value: number | string | undefined) => [formatCurrencyUSD(Number(value || 0)), ""]}
 />
 <Legend />
 <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" radius={[4, 4, 0, 0]} />
 <Bar dataKey="payouts" fill="hsl(var(--success))" name="Payouts" radius={[4, 4, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Release Stats & Platform Health */}
 <div className="grid gap-6 lg:grid-cols-2">
 {/* Releases by Type */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <h3 className="mb-4 font-semibold">Releases by Type</h3>
 <ResponsiveContainer width="100%" height={200}>
 <PieChart>
 <Pie
 data={stats.releaseStats.byType}
 cx="50%"
 cy="50%"
 labelLine={false}
 label={(props: any) => `${props.type}: ${props.percentage.toFixed(0)}%`}
 outerRadius={80}
 fill="#8884d8"
 dataKey="count"
 nameKey="type"
 >
 {stats.releaseStats.byType.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
 ))}
 </Pie>
 <Tooltip />
 </PieChart>
 </ResponsiveContainer>
 </div>

 {/* Platform Health */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <h3 className="mb-4 font-semibold">Platform Health</h3>
 <div className="space-y-3">
 {stats.platformHealth.map((platform) => (
 <div
 key={platform.platform}
 className="flex items-center justify-between border border-border bg-muted/30 p-3"
 >
 <div className="flex-1">
 <div className="flex items-center justify-between mb-1">
 <p className="font-medium">{platform.platform}</p>
 <span
 className={`inline-flex px-2 py-1 text-xs font-medium ${
 platform.status === "OPERATIONAL"
 ? "bg-success/10 text-success"
 : platform.status === "DEGRADED"
 ? "bg-warning/10 text-warning"
 : "bg-destructive/10 text-destructive"
 }`}
 >
 {platform.status}
 </span>
 </div>
 <p className="text-xs text-muted-foreground">
 {platform.deliveries.toLocaleString()} deliveries · {platform.successRate}% success
 </p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Quick Actions */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <h3 className="mb-4 font-semibold">Quick Actions</h3>
 <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
 <QuickActionCard
 title="Moderation Queue"
 description={`${stats.overview.pendingReleases} releases pending`}
 href="/admin/moderation"
 color="yellow"
 />
 <QuickActionCard
 title="Withdrawal Requests"
 description={`${stats.overview.pendingWithdrawals} pending`}
 href="/admin/withdrawals"
 color="blue"
 />
 <QuickActionCard
 title="User Management"
 description={`${stats.overview.totalUsers} total users`}
 href="/admin/users"
 color="blue"
 />
 <QuickActionCard
 title="Activity Logs"
 description="View recent activity"
 href="/admin/activity-logs"
 color="green"
 />
 </div>
 </div>
 </div>
 )
}

function StatCard({
 title,
 value,
 change,
 icon,
 color,
}: {
 title: string
 value: string
 change: string
 icon: React.ReactNode
 color: string
}) {
 const colorClasses = {
 blue: "bg-blue-500/10 text-blue-500",
 green: "bg-green-500/10 text-green-500",
 orange: "bg-orange-500/10 text-orange-500",
 }

 return (
 <div className="border border-border bg-background p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-muted-foreground">{title}</p>
 <p className="mt-2 text-2xl font-bold">{value}</p>
 <p className="mt-1 text-xs text-muted-foreground">{change}</p>
 </div>
 <div className={`flex h-12 w-12 items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
 {icon}
 </div>
 </div>
 </div>
 )
}

function QuickActionCard({
 title,
 description,
 href,
 color,
}: {
 title: string
 description: string
 href: string
 color: string
}) {
 const colorClasses = {
 yellow: "border-yellow-500/20 hover:border-yellow-500/40 hover:bg-yellow-500/5",
 blue: "border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5",
 green: "border-green-500/20 hover:border-green-500/40 hover:bg-green-500/5",
 }

 return (
 <Link
 href={href}
 className={`block border-2 border-border bg-muted/30 p-4 transition-colors ${colorClasses[color as keyof typeof colorClasses]}`}
 >
 <p className="font-medium">{title}</p>
 <p className="mt-1 text-sm text-muted-foreground">{description}</p>
 </Link>
 )
}

function UsersIcon() {
 return (
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
 </svg>
 )
}

function ReleasesIcon() {
 return (
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25" />
 </svg>
 )
}

function EarningsIcon() {
 return (
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 )
}

function WithdrawalsIcon() {
 return (
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
 </svg>
 )
}
