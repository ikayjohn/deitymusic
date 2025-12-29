"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import type { Releases } from "@/types/supabase"

interface ReleaseDetailsProps {
 release: Releases & {
 tracks?: any[]
 contributors?: any[]
 platforms?: any[]
 }
}

export function ReleaseDetailsClient({ release }: ReleaseDetailsProps) {
 const router = useRouter()
 const [showTakedownModal, setShowTakedownModal] = useState(false)
 const [takedownReason, setTakedownReason] = useState("")
 const [processing, setProcessing] = useState(false)

 const handleTakedown = async () => {
 if (!takedownReason.trim()) {
 alert("Please provide a reason for the takedown")
 return
 }

 setProcessing(true)

 try {
 const response = await fetch(`/api/releases/${release.id}/takedown`, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({ reason: takedownReason }),
 })

 if (!response.ok) {
 const error = await response.json()
 throw new Error(error.error || "Failed to request takedown")
 }

 alert("Takedown request submitted successfully")
 setShowTakedownModal(false)
 router.refresh()
 } catch (error) {
 console.error("Takedown error:", error)
 alert(error instanceof Error ? error.message : "Failed to request takedown")
 } finally {
 setProcessing(false)
 }
 }

 const handleDuplicate = async () => {
 if (!confirm("Create a copy of this release?")) {
 return
 }

 setProcessing(true)

 try {
 const response = await fetch(`/api/releases/${release.id}/duplicate`, {
 method: "POST",
 })

 if (!response.ok) {
 const error = await response.json()
 throw new Error(error.error || "Failed to duplicate release")
 }

 const result = await response.json()
 router.push(`/releases/${result.release.id}`)
 } catch (error) {
 console.error("Duplicate error:", error)
 alert(error instanceof Error ? error.message : "Failed to duplicate release")
 } finally {
 setProcessing(false)
 }
 }

 const handleDelete = async () => {
 if (!confirm("Are you sure you want to delete this release? This action cannot be undone.")) {
 return
 }

 setProcessing(true)

 try {
 const response = await fetch(`/api/releases/${release.id}`, {
 method: "DELETE",
 })

 if (!response.ok) {
 const error = await response.json()
 throw new Error(error.error || "Failed to delete release")
 }

 router.push("/releases?deleted=true")
 } catch (error) {
 console.error("Delete error:", error)
 alert(error instanceof Error ? error.message : "Failed to delete release")
 } finally {
 setProcessing(false)
 }
 }

 const getStatusColor = (status: string) => {
 switch (status) {
 case "LIVE":
 return "bg-success/10 text-success"
 case "DRAFT":
 return "bg-muted text-muted-foreground"
 case "PENDING_REVIEW":
 return "bg-warning/10 text-warning"
 case "APPROVED":
 return "bg-info/10 text-info"
 case "REJECTED":
 return "bg-error/10 text-error"
 case "TAKEDOWN":
 return "bg-error/10 text-error"
 default:
 return "bg-muted text-muted-foreground"
 }
 }

 const getPlatformStatusColor = (status: string) => {
 switch (status) {
 case "LIVE":
 return "bg-success/10 text-success"
 case "PENDING":
 return "bg-warning/10 text-warning"
 case "ERROR":
 return "bg-error/10 text-error"
 case "REMOVED":
 return "bg-muted text-muted-foreground"
 default:
 return "bg-muted text-muted-foreground"
 }
 }

 const getPlatformName = (name: string) => {
 const names: Record<string, string> = {
 SPOTIFY: "Spotify",
 APPLE_MUSIC: "Apple Music",
 AMAZON_MUSIC: "Amazon Music",
 YOUTUBE_MUSIC: "YouTube Music",
 TIKTOK: "TikTok",
 INSTAGRAM: "Instagram",
 DEEZER: "Deezer",
 TIDAL: "Tidal",
 PANDORA: "Pandora",
 NAPSTER: "Napster",
 AUDIOMACK: "Audiomack",
 BOOMPLAY: "Boomplay",
 }
 return names[name] || name
 }

 return (
 <>
 <Header title={release.title} />
 <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
 <div className="mx-auto max-w-7xl space-y-6">
 {/* Takedown Modal */}
 {showTakedownModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
 <div className="w-full max-w-md bg-background p-6 shadow-lg">
 <h2 className="mb-4 text-xl font-semibold">Request Takedown</h2>
 <p className="mb-4 text-sm text-muted-foreground">
 Please provide a reason for requesting a takedown of this release from all platforms.
 </p>
 <textarea
 value={takedownReason}
 onChange={(e) => setTakedownReason(e.target.value)}
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 rows={4}
 placeholder="Enter reason for takedown..."
 />
 <div className="mt-4 flex justify-end gap-2">
 <button
 onClick={() => {
 setShowTakedownModal(false)
 setTakedownReason("")
 }}
 disabled={processing}
 className="border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
 >
 Cancel
 </button>
 <button
 onClick={handleTakedown}
 disabled={processing || !takedownReason.trim()}
 className="bg-warning px-4 py-2 text-sm font-medium text-warning-foreground hover:bg-warning/90 disabled:cursor-not-allowed disabled:opacity-50"
 >
 {processing ? "Processing..." : "Request Takedown"}
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Breadcrumb */}
 <div className="flex items-center gap-2 text-sm text-muted-foreground">
 <Link href="/releases" className="hover:text-foreground">
 Releases
 </Link>
 <span>/</span>
 <span className="text-foreground">{release.title}</span>
 </div>

 {/* Header */}
 <div className="flex items-start justify-between">
 <div className="flex gap-6">
 {/* Artwork */}
 <img
 src={release.artwork_url}
 alt={release.title}
 className="h-40 w-40 object-cover shadow-lg"
 />

 {/* Info */}
 <div>
 <div className="mb-2 flex items-center gap-3">
 <h1 className="text-2xl font-bold">{release.title}</h1>
 <span className={` px-3 py-1 text-xs font-medium ${getStatusColor(release.status!)}`}>
 {release.status!.replace(/_/g, " ")}
 </span>
 </div>

 <div className="space-y-1 text-sm text-muted-foreground">
 <p>{release.release_type} • {release.genre}</p>
 {release.sub_genre && <p>Sub-genre: {release.sub_genre}</p>}
 <p>
 {release.tracks?.length || 0} {(release.tracks?.length || 0) === 1 ? "track" : "tracks"}
 </p>
 {release.digital_release_date && (
 <p>Released: {new Date(release.digital_release_date).toLocaleDateString()}</p>
 )}
 {release.upc && <p>UPC: {release.upc}</p>}
 {release.explicit_content && (
 <p className="text-error">Explicit Content</p>
 )}
 </div>
 </div>
 </div>

 {/* Actions */}
 <div className="flex gap-2">
 {release.status === "DRAFT" && (
 <>
 <Link
 href={`/releases/${release.id}/edit`}
 className="border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
 >
 Edit
 </Link>
 <button
 onClick={handleDelete}
 disabled={processing}
 className="border border-error px-4 py-2 text-sm font-medium text-error hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-50"
 >
 Delete
 </button>
 </>
 )}
 {release.status === "LIVE" && (
 <button
 onClick={() => setShowTakedownModal(true)}
 className="border border-warning px-4 py-2 text-sm font-medium text-warning hover:bg-warning/10"
 >
 Request Takedown
 </button>
 )}
 <button
 onClick={handleDuplicate}
 disabled={processing}
 className="border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
 >
 Duplicate
 </button>
 </div>
 </div>

 {/* Tabs Content */}
 <div className="grid gap-6 lg:grid-cols-3">
 {/* Main Content */}
 <div className="lg:col-span-2 space-y-6">
 {/* Tracks */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <h2 className="mb-4 text-lg font-semibold">Tracks</h2>
 <div className="space-y-2">
 {release.tracks?.map((track: any, index: number) => (
 <div
 key={track.id}
 className="flex items-center justify-between border border-border bg-muted/30 p-3"
 >
 <div className="flex items-center gap-3">
 <span className="text-muted-foreground">#{index + 1}</span>
 <div>
 <p className="font-medium">{track.title}</p>
 <p className="text-xs text-muted-foreground">
 {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}
 {track.explicit_content && " • Explicit"}
 </p>
 </div>
 </div>
 {track.isrc && (
 <span className="text-xs text-muted-foreground">ISRC: {track.isrc}</span>
 )}
 </div>
 ))}
 </div>
 </div>

 {/* Contributors */}
 {release.contributors && release.contributors.length > 0 && (
 <div className="border border-border bg-background p-6 shadow-sm">
 <h2 className="mb-4 text-lg font-semibold">Contributors</h2>
 <div className="space-y-3">
 {release.contributors.map((contributor: any) => (
 <div
 key={contributor.id}
 className="flex items-center justify-between"
 >
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center bg-primary text-sm font-medium text-primary-foreground">
 {contributor.name.charAt(0).toUpperCase()}
 </div>
 <div>
 <p className="font-medium">{contributor.name}</p>
 <p className="text-xs text-muted-foreground">
 {contributor.role.replace(/_/g, " ")}
 </p>
 </div>
 </div>
 {contributor.share_percentage > 0 && (
 <span className="text-sm text-muted-foreground">{contributor.share_percentage}%</span>
 )}
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Copyright Info */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <h2 className="mb-4 text-lg font-semibold">Copyright Information</h2>
 <dl className="grid gap-4 sm:grid-cols-2 text-sm">
 <div>
 <dt className="text-muted-foreground">Copyright Year</dt>
 <dd className="font-medium">{release.copyright_year}</dd>
 </div>
 <div>
 <dt className="text-muted-foreground">Copyright Holder</dt>
 <dd className="font-medium">{release.copyright_holder}</dd>
 </div>
 <div>
 <dt className="text-muted-foreground">Language</dt>
 <dd className="font-medium capitalize">{release.language}</dd>
 </div>
 <div>
 <dt className="text-muted-foreground">Price Tier</dt>
 <dd className="font-medium capitalize">{release.price_tier}</dd>
 </div>
 </dl>
 </div>
 </div>

 {/* Sidebar */}
 <div className="space-y-6">
 {/* Platform Status */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <h2 className="mb-4 text-lg font-semibold">Platform Status</h2>
 <div className="space-y-3">
 {release.platforms && release.platforms.length > 0 ? (
 release.platforms.map((platform: any) => (
 <div
 key={platform.id}
 className="flex items-center justify-between border border-border bg-muted/30 p-3"
 >
 <div>
 <p className="font-medium">{getPlatformName(platform.name)}</p>
 {platform.live_at && (
 <p className="text-xs text-muted-foreground">
 Live since {new Date(platform.live_at).toLocaleDateString()}
 </p>
 )}
 </div>
 <span className={` px-2 py-1 text-xs font-medium ${getPlatformStatusColor(platform.status)}`}>
 {platform.status}
 </span>
 </div>
 ))
 ) : (
 <p className="text-sm text-muted-foreground">
 No platforms yet. Release will be distributed to selected platforms once approved.
 </p>
 )}
 </div>
 </div>

 {/* Territories */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <h2 className="mb-4 text-lg font-semibold">Distribution Territories</h2>
 <div className="flex flex-wrap gap-2">
 {release.territories.includes("*") ? (
 <span className="bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
 Worldwide
 </span>
 ) : (
 release.territories.map((territory: string) => (
 <span
 key={territory}
 className="bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
 >
 {territory}
 </span>
 ))
 )}
 </div>
 </div>

 {/* Quick Actions */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
 <div className="space-y-2">
 <Link
 href={`/analytics?release=${release.id}`}
 className="flex items-center justify-between p-3 hover:bg-muted"
 >
 <span className="text-sm">View Analytics</span>
 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
 </svg>
 </Link>
 <button
 onClick={() => {
 if (navigator.share) {
 navigator.share({
 title: release.title,
 url: window.location.href,
 })
 } else {
 navigator.clipboard.writeText(window.location.href)
 alert("Link copied to clipboard!")
 }
 }}
 className="flex w-full items-center justify-between p-3 hover:bg-muted"
 >
 <span className="text-sm">Share Release</span>
 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
 </svg>
 </button>
 <button
 onClick={() => window.print()}
 className="flex w-full items-center justify-between p-3 hover:bg-muted"
 >
 <span className="text-sm">Print Details</span>
 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
 </svg>
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 </main>
 </>
 )
}
