import { z } from "zod"

// ============================================
// RELEASE VALIDATION SCHEMAS
// ============================================

export const releaseBasicInfoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  releaseType: z.enum(["SINGLE", "EP", "ALBUM"], {
    required_error: "Release type is required",
  } as any),
  genre: z.string().min(1, "Genre is required"),
  subGenre: z.string().optional(),
  explicitContent: z.boolean().default(false),
  language: z.string().default("en"),
  copyrightYear: z.number().int().min(1900).max(new Date().getFullYear() + 5),
  copyrightHolder: z.string().min(1, "Copyright holder is required"),
})

export const trackSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Track title is required").max(255),
  audioFileUrl: z.string().min(1, "Audio file is required"),
  audioFileSize: z.number().int().positive(),
  duration: z.number().int().positive().default(0),
  previewStart: z.number().int().min(0).default(30),
  previewDuration: z.number().int().positive().default(30),
  explicitContent: z.boolean().default(false),
  isrc: z.string().regex(/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/, {
    message: "Invalid ISRC format (e.g., USABC1234567)",
  }).optional(),
  lyrics: z.string().optional(),
  language: z.string().default("en"),
})

export const artworkSchema = z.object({
  file: z.instanceof(File).refine((file) => {
    return file.type === "image/jpeg" || file.type === "image/png"
  }, "Artwork must be JPEG or PNG format")
  .refine((file) => {
    return file.size <= 10 * 1024 * 1024 // 10MB
  }, "Artwork must be less than 10MB"),
  url: z.string().optional(),
})

export const contributorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required").max(255),
  role: z.enum([
    "PRIMARY_ARTIST",
    "FEATURED_ARTIST",
    "PRODUCER",
    "COMPOSER",
    "LYRICIST",
    "PUBLISHER",
    "REMIXER",
    "ENGINEER",
  ], {
    required_error: "Role is required",
  } as any),
  sharePercentage: z.number().min(0).max(100).default(0),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
})

export const distributionSchema = z.object({
  platforms: z.array(z.enum([
    "SPOTIFY",
    "APPLE_MUSIC",
    "AMAZON_MUSIC",
    "YOUTUBE_MUSIC",
    "TIKTOK",
    "INSTAGRAM",
    "DEEZER",
    "TIDAL",
    "PANDORA",
    "NAPSTER",
    "AUDIOMACK",
    "BOOMPLAY",
  ])).min(1, "Select at least one platform"),
  territories: z.array(z.string()).default(["*"]),
  digitalReleaseDate: z.string().refine((date) => {
    if (!date) return true
    const releaseDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return releaseDate >= today
  }, "Release date must be today or in the future"),
  priceTier: z.enum(["standard", "premium"]).default("standard"),
})

export const releaseFormSchema = z.object({
  basicInfo: releaseBasicInfoSchema,
  tracks: z.array(trackSchema).min(1, "At least one track is required"),
  artwork: artworkSchema.partial({ url: true }).refine(data => data.url, "Artwork is required"),
  contributors: z.array(contributorSchema).optional(),
  distribution: distributionSchema,
})

export type ReleaseBasicInfo = z.infer<typeof releaseBasicInfoSchema>
export type Track = z.infer<typeof trackSchema>
export type Artwork = z.infer<typeof artworkSchema>
export type Contributor = z.infer<typeof contributorSchema>
export type Distribution = z.infer<typeof distributionSchema>
export type ReleaseFormData = z.infer<typeof releaseFormSchema>

// ============================================
// FILE VALIDATION
// ============================================

export const audioFileSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => {
      return ["audio/wav", "audio/mpeg", "audio/flac", "audio/x-wav"].includes(file.type)
    }, "Audio file must be WAV, MP3, or FLAC format")
    .refine((file) => {
      return file.size <= 50 * 1024 * 1024 // 50MB
    }, "Audio file must be less than 50MB"),
})

export type AudioFile = z.infer<typeof audioFileSchema>

// ============================================
// ISRC & UPC GENERATION
// ============================================

export function generateISRC(): string {
  // Format: CC-XXX-YY-NNNNN
  // CC = Country Code (2 letters)
  // XXX = Registrant Code (3 alphanumeric)
  // YY = Year (2 digits)
  // NNNNN = Designation Code (5 digits)

  const countryCode = "US" // You can make this configurable
  const registrantCode = "ABC" // Your registrant code from IFPI
  const year = new Date().getFullYear().toString().slice(-2)
  const designationCode = Math.floor(Math.random() * 100000).toString().padStart(5, "0")

  return `${countryCode}${registrantCode}${year}${designationCode}`
}

export function generateUPC(): string {
  // Generate a random 12-digit number
  const base = Math.floor(Math.random() * 1000000000000).toString().padStart(12, "0")

  // Calculate checksum digit
  let sum = 0
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(base[i])
    sum += i % 2 === 0 ? digit : digit * 3
  }
  const checksum = (10 - (sum % 10)) % 10

  return base + checksum.toString()
}
