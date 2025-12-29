import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  generateMockAdminStats,
  adminStatsSchema,
} from "@/lib/validations/admin"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Replace with actual database queries
    /*
    // Get overview stats
    const [totalUsers, activeUsers, totalReleases, pendingReleases] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
      supabase.from('releases').select('id', { count: 'exact', head: true }),
      supabase.from('releases').select('id', { count: 'exact', head: true }).eq('status', 'PENDING'),
    ])

    // Get earnings stats
    const { data: earningsData } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'EARNING')

    const totalEarnings = earningsData?.reduce((sum, t) => sum + t.amount, 0) || 0

    const { data: pendingWithdrawals } = await supabase
      .from('withdrawal_requests')
      .select('amount')
      .eq('status', 'PENDING')

    // Get user growth data
    const { data: userGrowthData } = await supabase
      .from('users')
      .select('createdAt')
      .gte('createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    // Get release stats by type and genre
    const { data: releasesByType } = await supabase
      .from('releases')
      .select('releaseType')

    const { data: releasesByGenre } = await supabase
      .from('releases')
      .select('genre')
    */

    // For now, use mock data
    const mockStats = generateMockAdminStats()
    const validatedStats = adminStatsSchema.parse(mockStats)

    return NextResponse.json(validatedStats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    )
  }
}
