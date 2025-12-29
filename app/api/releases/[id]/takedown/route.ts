import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// POST /api/releases/[id]/takedown - Request a takedown
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if release exists and belongs to user
    const { data: release } = await supabase
      .from("releases")
      .select("id, status")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (!release) {
      return NextResponse.json({ error: "Release not found" }, { status: 404 })
    }

    // Only allow takedown for live releases
    if (release.status !== "LIVE") {
      return NextResponse.json(
        { error: "Can only request takedown for live releases" },
        { status: 400 }
      )
    }

    // Get reason from request body
    const body = await request.json()
    const { reason } = body

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "Reason is required" },
        { status: 400 }
      )
    }

    // Update release status
    const { error: updateError } = await supabase
      .from("releases")
      .update({ status: "TAKEDOWN" })
      .eq("id", params.id)

    if (updateError) throw updateError

    // Record in takedown history
    const { error: historyError } = await supabase
      .from("takedown_history")
      .insert({
        release_id: params.id,
        reason: reason.trim(),
        requested_by: user.id,
        takedown_type: "artist_request",
      })

    if (historyError) throw historyError

    // TODO: Send takedown requests to all platforms via API
    // This would integrate with FUGA or similar distributor

    return NextResponse.json({
      success: true,
      message: "Takedown request submitted successfully",
    })
  } catch (error) {
    console.error("Takedown error:", error)
    return NextResponse.json(
      { error: "Failed to process takedown request" },
      { status: 500 }
    )
  }
}
