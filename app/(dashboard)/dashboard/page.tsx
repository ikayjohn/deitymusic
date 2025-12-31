import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
 const supabase = await createClient()

 const { data: { user } } = await supabase.auth.getUser()

 if (!user) {
 redirect("/login")
 }

 // Fetch user's dashboard data
 const [
 { data: releases },
 { data: analytics },
 { data: transactions },
 { data: subscription },
 ] = await Promise.all([
 supabase
 .from("releases")
 .select("status")
 .eq("user_id", user.id),
 supabase
 .from("analytics")
 .select("streams, downloads, revenue")
 .eq("release_id", user.id), // This will need fixing with proper joins
 supabase
 .from("transactions")
 .select("amount")
 .eq("user_id", user.id)
 .eq("type", "EARNING"),
 supabase
 .from("subscriptions")
 .select("*")
 .eq("user_id", user.id)
 .eq("status", "ACTIVE")
 .gte("end_date", new Date().toISOString())
 .order("created_at", { ascending: false })
 .limit(1)
 .maybeSingle(),
 ])

 // Calculate stats
 const totalReleases = releases?.length || 0
 const liveReleases = releases?.filter((r: any) => r.status === "LIVE").length || 0
 const totalStreams = analytics?.reduce((sum, a: any) => sum + (a.streams || 0), 0) || 0
 const totalRevenue = transactions?.reduce((sum, t: any) => sum + (t.amount || 0), 0) || 0

 const hasActiveSubscription = subscription && new Date((subscription as any).end_date) > new Date()

 // Calculate artist usage based on subscription tier
 const getArtistLimit = (plan: string | null) => {
 switch (plan) {
 case "STARTER": return 1
 case "PRO": return 2
 case "ELITE": return 5
 default: return 0
 }
 }

 const artistLimit = hasActiveSubscription ? getArtistLimit((subscription as any)?.plan || null) : 0
 // TODO: Fetch actual artist count from database when artist profiles are implemented
 const artistsUsed = hasActiveSubscription ? Math.min(1, artistLimit) : 0 // Placeholder - will be fetched from DB

 const stats = [
 {
 name: "Total Releases",
 value: totalReleases.toString(),
 change: `+${liveReleases} live`,
 icon: (
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
 />
 </svg>
 ),
 },
 {
 name: "Total Streams",
 value: totalStreams.toLocaleString(),
 change: "All time",
 icon: (
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
 />
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
 />
 </svg>
 ),
 },
 {
 name: "Total Revenue",
 value: `$${totalRevenue.toFixed(2)}`,
 change: "Available for withdrawal",
 icon: (
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
 />
 </svg>
 ),
 },
 {
 name: "Artists Used",
 value: hasActiveSubscription ? `${artistsUsed}/${artistLimit}` : "0/0",
 change: hasActiveSubscription
 ? `Expires ${new Date((subscription as any).end_date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}`
 : "No Subscription",
 icon: (
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
 />
 </svg>
 ),
 },
 ]

 return (
 <>
 <Header title="Dashboard" />
 <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
 <div className="mx-auto max-w-7xl space-y-6">
 {/* Welcome */}
 <div>
 <h2 className="text-2xl font-bold">
 Welcome back, {user.user_metadata.name || "Artist"}!
 </h2>
 <p className="text-muted-foreground">
 Here's what's happening with your music today.
 </p>
 </div>

 {/* Subscription Banner */}
 {!hasActiveSubscription ? (
 <div className="border-2 border-[#E7B900] bg-[#E7B900]/10 p-6">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="font-semibold text-foreground">Start Distributing Your Music</h3>
 <p className="mt-1 text-sm text-muted-foreground">
 Choose a plan to start uploading and distributing your music to 150+ platforms worldwide.
 </p>
 </div>
 <Link
 href="/subscription"
 className="inline-flex items-center bg-[#E7B900] px-6 py-2 text-sm font-semibold text-black hover:bg-[#d4a800]"
 >
 View Plans
 </Link>
 </div>
 </div>
 ) : subscription && (
 <div className="border border-success/50 bg-success/10 p-4">
 <div className="flex items-center justify-between">
 <div>
 <p className="font-semibold text-success">
 Active {(subscription as any).plan} Plan
 </p>
 <p className="text-sm text-muted-foreground">
 Valid until {new Date((subscription as any).end_date).toLocaleDateString("en-NG", {
 year: "numeric",
 month: "long",
 day: "numeric",
 })}
 </p>
 </div>
 <div className="flex gap-3">
 <Link
 href="/subscription"
 className="text-sm text-blue-600 hover:underline"
 >
 Manage Plan
 </Link>
 <Link
 href="/releases/new"
 className="inline-flex items-center bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-black"
 >
 New Release
 </Link>
 </div>
 </div>
 </div>
 )}

 {/* Stats Grid */}
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 {stats.map((stat, index) => {
 const accentColors = [
 { bg: 'bg-blue-50', text: 'text-blue-600' },
 { bg: 'bg-purple-50', text: 'text-purple-600' },
 { bg: 'bg-green-50', text: 'text-green-600' },
 { bg: 'bg-blue-50', text: 'text-blue-600' },
 ]
 const colors = accentColors[index]
 return (
 <div
 key={stat.name}
 className="bg-white border border-border p-6 shadow-sm"
 >
 <div className="flex items-center justify-between">
 <div className={`flex h-12 w-12 items-center justify-center ${colors.bg} ${colors.text}`}>
 {stat.icon}
 </div>
 </div>
 <div className="mt-4">
 <p className="text-sm text-muted-foreground">{stat.name}</p>
 <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
 <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
 </div>
 </div>
 )
 })}
 </div>

 {/* Quick Actions */}
 <div>
 <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 <a
 href="/releases/new"
 className="bg-white border border-border p-4 shadow-sm hover:border-purple-500 transition-colors flex items-center gap-4"
 >
 <div className="flex h-10 w-10 items-center justify-center bg-purple-600 text-white">
 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M12 4v16m8-8H4"
 />
 </svg>
 </div>
 <div>
 <p className="font-medium">New Release</p>
 <p className="text-sm text-muted-foreground">Upload your music</p>
 </div>
 </a>

 <a
 href="/analytics"
 className="bg-white border border-border p-4 shadow-sm hover:border-blue-500 transition-colors flex items-center gap-4"
 >
 <div className="flex h-10 w-10 items-center justify-center bg-blue-600 text-white">
 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
 />
 </svg>
 </div>
 <div>
 <p className="font-medium">View Analytics</p>
 <p className="text-sm text-muted-foreground">Track your performance</p>
 </div>
 </a>

 <a
 href="/earnings"
 className="bg-white border border-border p-4 shadow-sm hover:border-green-500 transition-colors flex items-center gap-4"
 >
 <div className="flex h-10 w-10 items-center justify-center bg-green-600 text-white">
 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
 />
 </svg>
 </div>
 <div>
 <p className="font-medium">Withdraw Earnings</p>
 <p className="text-sm text-muted-foreground">Request payout</p>
 </div>
 </a>
 </div>
 </div>

 {/* Recent Releases */}
 <div>
 <div className="mb-4 flex items-center justify-between">
 <h3 className="text-lg font-semibold">Recent Releases</h3>
 <a href="/releases" className="text-sm text-blue-600">
 View all
 </a>
 </div>

 {releases && releases.length > 0 ? (
 <div className="bg-white border border-border shadow-sm">
 <div className="divide-y divide-border">
 {releases.slice(0, 5).map((release: any) => (
 <div
 key={release.status}
 className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
 >
 <div className="flex items-center gap-4">
 <div className="flex h-12 w-12 items-center justify-center bg-blue-50 text-blue-600">
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
 />
 </svg>
 </div>
 <div>
 <p className="font-medium">Release Title</p>
 <p className="text-sm text-muted-foreground">
 {release.status === "LIVE" ? "Live on all platforms" : `Status: ${release.status}`}
 </p>
 </div>
 </div>
 <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium
 ${release.status === "LIVE"
 ? "bg-success-light text-success"
 : "bg-warning-light text-warning"
 }`}
 >
 {release.status}
 </span>
 </div>
 ))}
 </div>
 </div>
 ) : (
 <div className="bg-white border border-border p-8 text-center shadow-sm">
 <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
 />
 </svg>
 <h3 className="mt-4 text-lg font-semibold">No releases yet</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 Get started by creating your first release
 </p>
 <a
 href="/releases/new"
 className="mt-4 inline-flex items-center bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-black"
 >
 Create Release
 </a>
 </div>
 )}
 </div>
 </div>
 </main>
 </>
 )
}
