"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { distributionSchema, type Distribution } from "@/lib/validations/release"
import type { ReleaseFormData } from "@/lib/validations/release"

const PLATFORMS = [
 { id: "SPOTIFY", name: "Spotify", icon: "🎵" },
 { id: "APPLE_MUSIC", name: "Apple Music", icon: "🍎" },
 { id: "AMAZON_MUSIC", name: "Amazon Music", icon: "📦" },
 { id: "YOUTUBE_MUSIC", name: "YouTube Music", icon: "▶️" },
 { id: "TIKTOK", name: "TikTok", icon: "🎬" },
 { id: "INSTAGRAM", name: "Instagram", icon: "📸" },
 { id: "DEEZER", name: "Deezer", icon: "🎧" },
 { id: "TIDAL", name: "Tidal", icon: "🌊" },
 { id: "PANDORA", name: "Pandora", icon: "📻" },
 { id: "NAPSTER", name: "Napster", icon: "💿" },
 { id: "AUDIOMACK", name: "Audiomack", icon: "🎙️" },
 { id: "BOOMPLAY", name: "Boomplay", icon: "🎶" },
]

const TERRITORIES = [
 { code: "*", name: "Worldwide" },
 { code: "US", name: "United States" },
 { code: "GB", name: "United Kingdom" },
 { code: "CA", name: "Canada" },
 { code: "AU", name: "Australia" },
 { code: "DE", name: "Germany" },
 { code: "FR", name: "France" },
 { code: "JP", name: "Japan" },
 { code: "BR", name: "Brazil" },
 { code: "MX", name: "Mexico" },
]

interface Step5DistributionProps {
 data: Partial<ReleaseFormData>
 onChange: (data: Partial<ReleaseFormData>) => void
 onNext: (data: Partial<ReleaseFormData>) => void
 onPrevious: () => void
}

export function Step5Distribution({
 data,
 onChange,
 onNext,
 onPrevious,
}: Step5DistributionProps) {
 const distribution = data.distribution || {
 platforms: [],
 territories: ["*"],
 priceTier: "standard",
 }

 const {
 register,
 handleSubmit,
 setValue,
 watch,
 formState: { errors },
 } = useForm<Distribution>({
 resolver: zodResolver(distributionSchema),
 defaultValues: distribution,
 })

 const selectedPlatforms = watch("platforms") || []
 const selectedTerritories = watch("territories") || ["*"]
 const releaseDate = watch("digitalReleaseDate")

 const handlePlatformToggle = (platformId: string) => {
 const newPlatforms = selectedPlatforms.includes(platformId)
 ? selectedPlatforms.filter((p) => p !== platformId)
 : [...selectedPlatforms, platformId] as any

 setValue("platforms", newPlatforms)
 }

 const handleTerritoryToggle = (territory: string) => {
 let newTerritories

 if (territory === "*") {
 newTerritories = ["*"]
 } else {
 newTerritories = selectedTerritories.includes("*")
 ? [territory]
 : selectedTerritories.includes(territory)
 ? selectedTerritories.filter((t) => t !== territory)
 : [...selectedTerritories, territory]
 }

 setValue("territories", newTerritories)
 }

 const onSubmitForm = (formData: Distribution) => {
 onChange({ distribution: formData })
 onNext({ distribution: formData })
 }

 const minDate = new Date().toISOString().split("T")[0]

 return (
 <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
 <div>
 <h2 className="text-xl font-semibold">Distribution Settings</h2>
 <p className="text-sm text-muted-foreground">
 Choose where and when to distribute your release
 </p>
 </div>

 {/* Platforms */}
 <div>
 <label className="mb-3 block text-sm font-medium">
 Platforms <span className="text-error">*</span>
 </label>
 <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
 {PLATFORMS.map((platform) => (
 <label
 key={platform.id}
 className={`
 relative flex cursor-pointer flex-col items-center border-2 p-3 transition-colors
 ${selectedPlatforms.includes(platform.id as any)
 ? "border-primary bg-primary/5"
 : "border-border"
 }
 `}
 >
 <input
 type="checkbox"
 value={platform.id}
 {...register("platforms")}
 className="sr-only"
 onChange={() => handlePlatformToggle(platform.id)}
 />
 <span className="text-2xl">{platform.icon}</span>
 <span className="mt-1 text-xs font-medium">{platform.name}</span>
 </label>
 ))}
 </div>
 {errors.platforms && (
 <p className="mt-1 text-xs text-error">{errors.platforms.message}</p>
 )}
 </div>

 {/* Territories */}
 <div>
 <label className="mb-3 block text-sm font-medium">
 Territories
 </label>
 <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
 {TERRITORIES.map((territory) => (
 <label
 key={territory.code}
 className={`
 relative flex cursor-pointer items-center justify-center border-2 p-3 text-sm transition-colors
 ${selectedTerritories.includes(territory.code)
 ? "border-primary bg-primary/5 font-medium"
 : "border-border"
 }
 `}
 >
 <input
 type="checkbox"
 value={territory.code}
 {...register("territories")}
 className="sr-only"
 onChange={() => handleTerroryToggle(territory.code)}
 />
 {territory.name}
 </label>
 ))}
 </div>
 <p className="mt-2 text-xs text-muted-foreground">
 Select "Worldwide" for global distribution
 </p>
 </div>

 {/* Release Date */}
 <div>
 <label htmlFor="digitalReleaseDate" className="mb-2 block text-sm font-medium">
 Release Date <span className="text-error">*</span>
 </label>
 <input
 type="date"
 id="digitalReleaseDate"
 {...register("digitalReleaseDate")}
 min={minDate}
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 />
 {errors.digitalReleaseDate && (
 <p className="mt-1 text-xs text-error">{errors.digitalReleaseDate.message}</p>
 )}
 <p className="mt-1 text-xs text-muted-foreground">
 Your release will go live on this date (typically 48-72 hours after approval)
 </p>
 </div>

 {/* Pricing Tier */}
 <div>
 <label className="mb-2 block text-sm font-medium">Price Tier</label>
 <div className="grid grid-cols-2 gap-4">
 {[
 { value: "standard", label: "Standard", desc: "Standard pricing across platforms" },
 { value: "premium", label: "Premium", desc: "Higher price point (varies by platform)" },
 ].map((tier) => (
 <label
 key={tier.value}
 className={`
 relative flex cursor-pointer flex-col items-center border-2 p-4 transition-colors
 ${watch("priceTier") === tier.value
 ? "border-primary bg-primary/5"
 : "border-border"
 }
 `}
 >
 <input
 type="radio"
 value={tier.value}
 {...register("priceTier")}
 className="sr-only"
 />
 <span className="font-medium">{tier.label}</span>
 <span className="text-xs text-muted-foreground">{tier.desc}</span>
 </label>
 ))}
 </div>
 </div>

 {/* Actions */}
 <div className="flex justify-end gap-4 border-t border-border pt-6">
 <button
 type="button"
 onClick={onPrevious}
 className="border border-border px-6 py-2 text-sm font-medium hover:bg-muted"
 >
 Previous
 </button>
 <button
 type="submit"
 className="bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
 >
 Next Step
 </button>
 </div>
 </form>
 )
}
