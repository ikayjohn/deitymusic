"use client"

import type { ReleaseFormData } from "@/lib/validations/release"

interface Step6ReviewProps {
 data: Partial<ReleaseFormData>
 onChange: (data: Partial<ReleaseFormData>) => void
 onNext: (data: Partial<ReleaseFormData>) => void
 onPrevious: () => void
 onSubmit: () => void
 isSubmitting: boolean
 isFirstStep?: boolean
 isLastStep?: boolean
}

export function Step6Review({
 data,
 onPrevious,
 onSubmit,
 isSubmitting,
}: Step6ReviewProps) {
 const { basicInfo, tracks, artwork, contributors, distribution } = data

 const formatDate = (dateString: string) => {
 return new Date(dateString).toLocaleDateString("en-US", {
 year: "numeric",
 month: "long",
 day: "numeric",
 })
 }

 const getPlatformName = (code: string) => {
 const platforms: Record<string, string> = {
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
 return platforms[code] || code
 }

 const getTerritoryName = (code: string) => {
 if (code === "*") return "Worldwide"
 const territories: Record<string, string> = {
 US: "United States",
 GB: "United Kingdom",
 CA: "Canada",
 AU: "Australia",
 DE: "Germany",
 FR: "France",
 JP: "Japan",
 BR: "Brazil",
 MX: "Mexico",
 }
 return territories[code] || code
 }

 return (
 <div className="space-y-6">
 <div>
 <h2 className="text-xl font-semibold">Review & Submit</h2>
 <p className="text-sm text-muted-foreground">
 Review your release before submitting
 </p>
 </div>

 {/* Basic Info */}
 <div className="border border-border bg-muted/30 p-4">
 <h3 className="mb-3 font-semibold">Basic Information</h3>
 <dl className="space-y-2 text-sm">
 <div className="flex justify-between">
 <dt className="text-muted-foreground">Title:</dt>
 <dd className="font-medium">{basicInfo?.title}</dd>
 </div>
 <div className="flex justify-between">
 <dt className="text-muted-foreground">Type:</dt>
 <dd className="font-medium">{basicInfo?.releaseType}</dd>
 </div>
 <div className="flex justify-between">
 <dt className="text-muted-foreground">Genre:</dt>
 <dd className="font-medium">{basicInfo?.genre}</dd>
 </div>
 <div className="flex justify-between">
 <dt className="text-muted-foreground">Language:</dt>
 <dd className="font-medium">{basicInfo?.language}</dd>
 </div>
 <div className="flex justify-between">
 <dt className="text-muted-foreground">Copyright:</dt>
 <dd className="font-medium">
 © {basicInfo?.copyrightYear} {basicInfo?.copyrightHolder}
 </dd>
 </div>
 {basicInfo?.explicitContent && (
 <div className="flex justify-between">
 <dt className="text-muted-foreground">Content:</dt>
 <dd className="font-medium text-error">Explicit</dd>
 </div>
 )}
 </dl>
 </div>

 {/* Tracks */}
 <div className="border border-border bg-muted/30 p-4">
 <h3 className="mb-3 font-semibold">Tracks ({tracks?.length || 0})</h3>
 <div className="space-y-2">
 {tracks?.map((track, index) => (
 <div key={track.id} className="flex items-center justify-between text-sm">
 <div className="flex items-center gap-3">
 <span className="text-muted-foreground">{index + 1}.</span>
 <span className="font-medium">{track.title}</span>
 </div>
 <div className="flex items-center gap-2 text-xs text-muted-foreground">
 {track.duration > 0 && (
 <span>{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}</span>
 )}
 {track.explicitContent && (
 <span className="text-error">E</span>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Artwork */}
 <div className="border border-border bg-muted/30 p-4">
 <h3 className="mb-3 font-semibold">Cover Art</h3>
 <div className="flex items-center gap-4">
 <img
 src={artwork?.url}
 alt="Cover art preview"
 className="h-20 w-20 object-cover"
 />
 <div className="text-sm">
 <p className="font-medium">Cover image uploaded</p>
 <p className="text-muted-foreground">3000x3000px • JPEG/PNG</p>
 </div>
 </div>
 </div>

 {/* Contributors */}
 {contributors && contributors.length > 0 && (
 <div className="border border-border bg-muted/30 p-4">
 <h3 className="mb-3 font-semibold">Contributors ({contributors.length})</h3>
 <div className="flex flex-wrap gap-2">
 {contributors.map((contributor) => (
 <span
 key={contributor.id}
 className="inline-flex items-center gap-1 bg-primary/10 px-3 py-1 text-xs font-medium"
 >
 {contributor.name}
 <span className="text-muted-foreground">• {contributor.role.replace(/_/g, " ")}</span>
 </span>
 ))}
 </div>
 </div>
 )}

 {/* Distribution */}
 <div className="border border-border bg-muted/30 p-4">
 <h3 className="mb-3 font-semibold">Distribution</h3>
 <div className="space-y-3 text-sm">
 <div>
 <span className="text-muted-foreground">Platforms:</span>
 <div className="mt-1 flex flex-wrap gap-1">
 {distribution?.platforms?.map((platform) => (
 <span
 key={platform}
 className="bg-background px-2 py-1 text-xs font-medium"
 >
 {getPlatformName(platform)}
 </span>
 ))}
 </div>
 </div>
 <div>
 <span className="text-muted-foreground">Territories:</span>
 <div className="mt-1 flex flex-wrap gap-1">
 {distribution?.territories?.map((territory) => (
 <span
 key={territory}
 className="bg-background px-2 py-1 text-xs font-medium"
 >
 {getTerritoryName(territory)}
 </span>
 ))}
 </div>
 </div>
 <div>
 <span className="text-muted-foreground">Release Date:</span>{" "}
 <span className="font-medium">
 {distribution?.digitalReleaseDate ? formatDate(distribution.digitalReleaseDate) : "Not set"}
 </span>
 </div>
 <div>
 <span className="text-muted-foreground">Price Tier:</span>{" "}
 <span className="font-medium capitalize">{distribution?.priceTier}</span>
 </div>
 </div>
 </div>

 {/* Terms */}
 <div className="bg-info/10 p-4">
 <p className="text-sm text-info">
 <strong>Before submitting:</strong> Please ensure you have the rights to distribute this music.
 By submitting, you confirm that all information is accurate and you have the necessary permissions.
 </p>
 </div>

 {/* Actions */}
 <div className="flex justify-end gap-4 border-t border-border pt-6">
 <button
 type="button"
 onClick={onPrevious}
 disabled={isSubmitting}
 className="border border-border px-6 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
 >
 Previous
 </button>
 <button
 type="button"
 onClick={onSubmit}
 disabled={isSubmitting}
 className="bg-success px-6 py-2 text-sm font-medium text-success-foreground hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-50"
 >
 {isSubmitting ? "Submitting..." : "Submit Release"}
 </button>
 </div>
 </div>
 )
}
