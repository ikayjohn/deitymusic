import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function ReleasesPage() {
 const supabase = await createClient()

 const { data: { user } } = await supabase.auth.getUser()

 if (!user) {
 return null // Middleware will handle redirect
 }

 // Fetch user's releases
 const { data: releases } = await supabase
 .from("releases")
 .select("*")
 .eq("user_id", user.id)
 .order("created_at", { ascending: false }) as any

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
 default:
 return "bg-muted text-muted-foreground"
 }
 }

 const getStatusLabel = (status: string) => {
 return status.split("_").map(word =>
 word.charAt(0) + word.slice(1).toLowerCase()
 ).join(" ")
 }

 return (
 <>
 <Header title="My Releases" />
 <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
 <div className="mx-auto max-w-7xl space-y-6">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-2xl font-bold">My Releases</h2>
 <p className="text-muted-foreground">
 Manage and distribute your music
 </p>
 </div>
 <Link
 href="/releases/new"
 className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
 >
 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
 </svg>
 New Release
 </Link>
 </div>

 {/* Releases Grid */}
 {releases && releases.length > 0 ? (
 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 {releases.map((release: any) => (
 <div
 key={release.id}
 className="group relative overflow-hidden border border-border bg-background shadow-sm transition-shadow hover:shadow-md"
 >
 {/* Artwork */}
 <div className="aspect-square bg-muted">
 <img
 src={release.artwork_url}
 alt={release.title}
 className="h-full w-full object-cover"
 />
 </div>

 {/* Content */}
 <div className="p-4">
 <div className="mb-2 flex items-start justify-between">
 <div className="flex-1">
 <h3 className="font-semibold line-clamp-1">{release.title}</h3>
 <p className="text-sm text-muted-foreground">
 {release.release_type} • {release.genre}
 </p>
 </div>
 <span className={`inline-flex items-center px-2 py-1 text-xs font-medium ${getStatusColor(release.status)}`}>
 {getStatusLabel(release.status)}
 </span>
 </div>

 {release.digital_release_date && (
 <p className="text-xs text-muted-foreground">
 Released {new Date(release.digital_release_date).toLocaleDateString()}
 </p>
 )}

 {/* Actions */}
 <div className="mt-4 flex gap-2">
 <Link
 href={`/releases/${release.id}`}
 className="flex-1 border border-border px-3 py-1.5 text-center text-sm font-medium hover:bg-muted"
 >
 View
 </Link>
 {release.status === "DRAFT" && (
 <Link
 href={`/releases/${release.id}/edit`}
 className="flex-1 bg-primary px-3 py-1.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
 >
 Edit
 </Link>
 )}
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 /* Empty State */
 <div className="flex min-h-[400px] items-center justify-center border border-border bg-background p-12">
 <div className="text-center">
 <svg
 className="mx-auto h-16 w-16 text-muted-foreground"
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
 />
 </svg>
 <h3 className="mt-4 text-lg font-semibold">No releases yet</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 Create your first release and start distributing your music to the world
 </p>
 <div className="mt-6">
 <Link
 href="/releases/new"
 className="inline-flex items-center gap-2 bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
 >
 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
 </svg>
 Create Your First Release
 </Link>
 </div>
 </div>
 </div>
 )}
 </div>
 </main>
 </>
 )
}
