import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { analyticsQuerySchema, generateMockAnalyticsOverview, generateMockStreamsOverTime, generateMockRevenueByPlatform, generateMockTopTracks, generateMockGeographicData, generateMockPlatformComparison } from "@/lib/validations/analytics"

// GET /api/analytics - Fetch analytics data
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const query = {
      releaseId: searchParams.get("releaseId") || undefined,
      platform: searchParams.get("platform") || undefined,
      country: searchParams.get("country") || undefined,
      startDate: searchParams.get("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: searchParams.get("endDate") || new Date().toISOString(),
    }

    // For now, return mock data
    // In production, this would query the analytics table with real data
    const overview = generateMockAnalyticsOverview()
    const streamsOverTime = generateMockStreamsOverTime(30)
    const revenueByPlatform = generateMockRevenueByPlatform()
    const topTracks = generateMockTopTracks(10)
    const geographicData = generateMockGeographicData()
    const platformComparison = generateMockPlatformComparison()

    // If filtering by release, get release-specific tracks
    let filteredTopTracks = topTracks
    if (query.releaseId) {
      const { data: tracks } = await supabase
        .from("tracks")
        .select("id, title")
        .eq("release_id", query.releaseId)

      if (tracks && tracks.length > 0) {
        filteredTopTracks = (tracks as any).slice(0, 10).map((track: any, i: number) => ({
          ...track,
          streams: Math.floor(Math.random() * 100000) + 10000 - i * 5000,
          revenue: Math.random() * 5000 + 500 - i * 500,
          artwork: "/placeholder-album.png",
        }))
      }
    }

    return NextResponse.json({
      overview,
      streamsOverTime,
      revenueByPlatform,
      topTracks: filteredTopTracks,
      geographicData,
      platformComparison,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
