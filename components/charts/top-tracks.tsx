"use client"

import Link from "next/link"
import type { TopTrack } from "@/lib/validations/analytics"
import { formatCurrencyUSD } from "@/lib/validations/earnings"

interface TopTracksProps {
 tracks: TopTrack[]
}

export function TopTracks({ tracks }: TopTracksProps) {
 return (
 <div className="space-y-4">
 <h3 className="font-semibold">Top Performing Tracks</h3>

 <div className="space-y-2">
 {tracks.map((track, index) => (
 <div
 key={track.id}
 className="flex items-center gap-4 border border-border bg-muted/30 p-3"
 >
 {/* Rank */}
 <div className="flex h-8 w-8 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
 {index + 1}
 </div>

 {/* Artwork */}
 <img
 src={track.artwork}
 alt={track.title}
 className="h-12 w-12 rounded object-cover"
 />

 {/* Track Info */}
 <div className="flex-1 min-w-0">
 <p className="font-medium truncate">{track.title}</p>
 <p className="text-xs text-muted-foreground">
 {track.streams.toLocaleString()} streams
 </p>
 </div>

 {/* Revenue */}
 <div className="text-right">
 <p className="font-medium">{formatCurrencyUSD(track.revenue)}</p>
 <p className="text-xs text-muted-foreground">revenue</p>
 </div>

 {/* Progress Bar */}
 <div className="hidden sm:block w-32">
 <div className="mb-1 h-2 w-full bg-muted overflow-hidden">
 <div
 className="h-full bg-primary"
 style={{
 width: `${(track.streams / tracks[0].streams) * 100}%`,
 }}
 />
 </div>
 <p className="text-xs text-muted-foreground">
 {((track.streams / tracks[0].streams) * 100).toFixed(0)}% of top
 </p>
 </div>
 </div>
 ))}
 </div>
 </div>
 )
}
