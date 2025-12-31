import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// POST /api/releases/[id]/duplicate - Duplicate a release
export async function POST(
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

    // Fetch original release with all data
    const { data: originalRelease, error: fetchError } = await supabase
      .from("releases")
      .select(`
        *,
        tracks(*),
        contributors(*)
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !originalRelease) {
      return NextResponse.json({ error: "Release not found" }, { status: 404 })
    }

    // Create duplicated release
    const { data: newRelease, error: createError } = await (supabase
      .from("releases") as any)
      .insert({
        user_id: user.id,
        title: `${(originalRelease as any).title} (Copy)`,
        release_type: (originalRelease as any).release_type,
        status: "DRAFT",
        artwork_url: (originalRelease as any).artwork_url,
        genre: (originalRelease as any).genre,
        sub_genre: (originalRelease as any).sub_genre,
        explicit_content: (originalRelease as any).explicit_content,
        language: (originalRelease as any).language,
        copyright_year: (originalRelease as any).copyright_year,
        copyright_holder: (originalRelease as any).copyright_holder,
        price_tier: (originalRelease as any).price_tier,
        territories: (originalRelease as any).territories,
        // Don't copy UPC, ISRCs, or dates
        upc: null,
        original_release_date: null,
        digital_release_date: null,
      })
      .select()
      .single()

    if (createError) throw createError

    // Copy tracks (without ISRC)
    if ((originalRelease as any).tracks && (originalRelease as any).tracks.length > 0) {
      const tracksToInsert = (originalRelease as any).tracks.map((track: any) => ({
        release_id: (newRelease as any).id,
        title: `${track.title} (Copy)`,
        duration: track.duration,
        audio_file_url: track.audio_file_url,
        audio_file_size: track.audio_file_size,
        preview_start: track.preview_start || 30,
        preview_duration: track.preview_duration || 30,
        explicit_content: track.explicit_content,
        language: track.language,
        lyrics: track.lyrics,
        // Don't copy ISRC
        isrc: null,
        track_number: track.track_number,
      }))

      const { error: tracksError } = await (supabase
        .from("tracks") as any)
        .insert(tracksToInsert)

      if (tracksError) throw tracksError
    }

    // Copy contributors
    if ((originalRelease as any).contributors && (originalRelease as any).contributors.length > 0) {
      const contributorsToInsert = (originalRelease as any).contributors.map((contributor: any) => ({
        release_id: (newRelease as any).id,
        track_id: null, // Contributors at release level
        name: contributor.name,
        role: contributor.role,
        share_percentage: contributor.share_percentage,
        email: contributor.email,
        phone: contributor.phone,
      }))

      const { error: contributorsError } = await (supabase
        .from("contributors") as any)
        .insert(contributorsToInsert)

      if (contributorsError) throw contributorsError
    }

    return NextResponse.json({
      success: true,
      release: newRelease,
    })
  } catch (error) {
    console.error("Duplicate error:", error)
    return NextResponse.json(
      { error: "Failed to duplicate release" },
      { status: 500 }
    )
  }
}
