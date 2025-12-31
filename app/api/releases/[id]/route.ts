import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/releases/[id] - Fetch a single release
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: release, error } = await supabase
      .from("releases")
      .select(`
        *,
        tracks(*),
        contributors(*),
        platforms(*)
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) throw error

    if (!release) {
      return NextResponse.json({ error: "Release not found" }, { status: 404 })
    }

    return NextResponse.json({ release: release as any })
  } catch (error) {
    console.error("Error fetching release:", error)
    return NextResponse.json(
      { error: "Failed to fetch release" },
      { status: 500 }
    )
  }
}

// PATCH /api/releases/[id] - Update a release
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if release belongs to user
    const { data: existingRelease } = await supabase
      .from("releases")
      .select("id, status")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (!existingRelease) {
      return NextResponse.json({ error: "Release not found" }, { status: 404 })
    }

    // Don't allow edits to live releases
    if ((existingRelease as any).status === "LIVE") {
      return NextResponse.json(
        { error: "Cannot edit live releases" },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Update release
    const { data: release, error } = await (supabase
      .from("releases") as any)
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ release: release as any })
  } catch (error) {
    console.error("Error updating release:", error)
    return NextResponse.json(
      { error: "Failed to update release" },
      { status: 500 }
    )
  }
}

// DELETE /api/releases/[id] - Delete a release
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if release belongs to user
    const { data: existingRelease } = await supabase
      .from("releases")
      .select("id, status")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (!existingRelease) {
      return NextResponse.json({ error: "Release not found" }, { status: 404 })
    }

    // Don't allow deletion of live releases
    if ((existingRelease as any).status === "LIVE") {
      return NextResponse.json(
        { error: "Cannot delete live releases. Use takedown instead." },
        { status: 400 }
      )
    }

    // Delete release (will cascade to tracks, contributors, platforms)
    const { error } = await supabase
      .from("releases")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting release:", error)
    return NextResponse.json(
      { error: "Failed to delete release" },
      { status: 500 }
    )
  }
}
