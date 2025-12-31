import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/releases - Fetch all releases for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("releases")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq("status", status)
    }

    const { data: releases, error } = await query

    if (error) throw error

    return NextResponse.json({ releases: releases as any })
  } catch (error) {
    console.error("Error fetching releases:", error)
    return NextResponse.json(
      { error: "Failed to fetch releases" },
      { status: 500 }
    )
  }
}

// POST /api/releases - Create a new release
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    const requiredFields = ["title", "release_type", "genre", "copyright_year", "copyright_holder", "artwork_url"]
    const missingFields = requiredFields.filter(field => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      )
    }

    // Create release
    const { data: release, error } = await (supabase
      .from("releases") as any)
      .insert({
        user_id: user.id,
        title: body.title,
        release_type: body.release_type,
        genre: body.genre,
        sub_genre: body.sub_genre || null,
        copyright_year: body.copyright_year,
        copyright_holder: body.copyright_holder,
        artwork_url: body.artwork_url,
        explicit_content: body.explicit_content || false,
        language: body.language || "en",
        original_release_date: body.original_release_date || null,
        digital_release_date: body.digital_release_date || null,
        price_tier: body.price_tier || "standard",
        territories: body.territories || ["*"],
        status: "DRAFT",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ release: release as any }, { status: 201 })
  } catch (error) {
    console.error("Error creating release:", error)
    return NextResponse.json(
      { error: "Failed to create release" },
      { status: 500 }
    )
  }
}
