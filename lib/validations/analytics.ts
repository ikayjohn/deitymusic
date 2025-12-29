import { z } from "zod"

// ============================================
// ANALYTICS VALIDATION SCHEMAS
// ============================================

export const dateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  period: z.enum(["day", "week", "month", "year", "custom"]).default("month"),
})

export const analyticsQuerySchema = z.object({
  releaseId: z.string().optional(),
  platform: z.enum([
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
  ]).optional(),
  country: z.string().length(2).optional(),
  dateRange: dateRangeSchema,
})

export type DateRange = z.infer<typeof dateRangeSchema>
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>

// ============================================
// ANALYTICS TYPES
// ============================================

export interface StreamsOverTime {
  date: string
  streams: number
  downloads: number
}

export interface RevenueByPlatform {
  platform: string
  revenue: number
  streams: number
}

export interface TopTrack {
  id: string
  title: string
  streams: number
  revenue: number
  artwork: string
}

export interface GeographicData {
  country: string
  countryName: string
  streams: number
  revenue: number
}

export interface PlatformComparison {
  platform: string
  currentPeriod: {
    streams: number
    revenue: number
  }
  previousPeriod: {
    streams: number
    revenue: number
  }
  growth: {
    streams: number
    revenue: number
  }
}

export interface AnalyticsOverview {
  totalStreams: number
  totalRevenue: number
  totalDownloads: number
  activePlatforms: number
  topTrack: TopTrack | null
  dateRange: DateRange
}

export interface DetailedAnalytics {
  overview: AnalyticsOverview
  streamsOverTime: StreamsOverTime[]
  revenueByPlatform: RevenueByPlatform[]
  topTracks: TopTrack[]
  geographicData: GeographicData[]
  platformComparison: PlatformComparison[]
}

// ============================================
// MOCK DATA GENERATORS
// ============================================

export function generateMockStreamsOverTime(days: number = 30): StreamsOverTime[] {
  const data: StreamsOverTime[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      streams: Math.floor(Math.random() * 10000) + 1000,
      downloads: Math.floor(Math.random() * 500),
    })
  }

  return data
}

export function generateMockRevenueByPlatform(): RevenueByPlatform[] {
  const platforms = [
    { name: "SPOTIFY", displayName: "Spotify" },
    { name: "APPLE_MUSIC", displayName: "Apple Music" },
    { name: "AMAZON_MUSIC", displayName: "Amazon Music" },
    { name: "YOUTUBE_MUSIC", displayName: "YouTube Music" },
    { name: "DEEZER", displayName: "Deezer" },
  ]

  return platforms.map((platform) => ({
    platform: platform.name,
    revenue: Math.random() * 500 + 50,
    streams: Math.floor(Math.random() * 100000) + 10000,
  }))
}

export function generateMockTopTracks(count: number = 5): TopTrack[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `track-${i + 1}`,
    title: `Track ${i + 1}`,
    streams: Math.floor(Math.random() * 100000) + 10000 - i * 10000,
    revenue: Math.random() * 500 + 50 - i * 50,
    artwork: "/placeholder-album.png",
  }))
}

export function generateMockGeographicData(): GeographicData[] {
  const countries = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "BR", name: "Brazil" },
    { code: "JP", name: "Japan" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
  ]

  return countries.map((country) => ({
    country: country.code,
    countryName: country.name,
    streams: Math.floor(Math.random() * 50000) + 5000,
    revenue: Math.random() * 200 + 20,
  }))
}

export function generateMockPlatformComparison(): PlatformComparison[] {
  const platforms = ["SPOTIFY", "APPLE_MUSIC", "AMAZON_MUSIC", "YOUTUBE_MUSIC"]

  return platforms.map((platform) => {
    const currentStreams = Math.floor(Math.random() * 100000) + 10000
    const currentRevenue = currentStreams * 0.006

    return {
      platform,
      currentPeriod: {
        streams: currentStreams,
        revenue: currentRevenue,
      },
      previousPeriod: {
        streams: Math.floor(currentStreams * 0.9),
        revenue: currentRevenue * 0.9,
      },
      growth: {
        streams: Math.floor(Math.random() * 20) + 5,
        revenue: Math.random() * 0.15 + 0.05,
      },
    }
  })
}

export function generateMockAnalyticsOverview(): AnalyticsOverview {
  return {
    totalStreams: 500000,
    totalRevenue: 3096.77,
    totalDownloads: 5000,
    activePlatforms: 8,
    topTrack: generateMockTopTracks(1)[0],
    dateRange: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString(),
      period: "month",
    },
  }
}
