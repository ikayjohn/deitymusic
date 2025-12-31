import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/analytics/export - Export analytics as CSV
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"

    // Fetch analytics data
    const { data: releases } = await supabase
      .from("releases")
      .select("id, title, status")
      .eq("user_id", user.id)
      .in("status", ["LIVE", "TAKEDOWN"])

    if (!releases || releases.length === 0) {
      return NextResponse.json({ error: "No releases to export" }, { status: 404 })
    }

    // Get analytics for each release
    const releaseIds = (releases as any).map((r: any) => r.id)
    const { data: analytics } = await supabase
      .from("analytics")
      .select("release_id, platform, country, streams, downloads, revenue, date")
      .in("release_id", releaseIds)

    if (format === "csv") {
      // Generate CSV
      const headers = ["Release ID", "Platform", "Country", "Streams", "Downloads", "Revenue", "Date"]
      const rows = analytics?.map((a: any) => [
        a.release_id,
        a.platform || "All",
        a.country || "All",
        a.streams.toString(),
        a.downloads.toString(),
        a.revenue.toFixed(2),
        a.date,
      ]) || []

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="analytics-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      { error: "Failed to export analytics" },
      { status: 500 }
    )
  }
}
