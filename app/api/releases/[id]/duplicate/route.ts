import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// POST /api/releases/[id]/duplicate - Duplicate a release
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

    // Fetch original release with all data
    const { data: originalRelease, error: fetchError } = await supabase
      .from("releases")
      .select(`
        *,
        tracks(*),
        contributors(*)
      `)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !originalRelease) {
      return NextResponse.json({ error: "Release not found" }, { status: 404 })
    }

    // Create duplicated release
    const { data: newRelease, error: createError } = await supabase
      .from("releases")
      .insert({
        user_id: user.id,
        title: `${originalRelease.title} (Copy)`,
        release_type: originalRelease.release_type,
        status: "DRAFT",
        artwork_url: originalRelease.artwork_url,
        genre: originalRelease.genre,
        sub_genre: originalRelease.sub_genre,
        explicit_content: originalRelease.explicit_content,
        language: originalRelease.language,
        copyright_year: originalRelease.copyright_year,
        copyright_holder: originalRelease.copyright_holder,
        price_tier: originalRelease.price_tier,
        territories: originalRelease.territories,
        // Don't copy UPC, ISRCs, or dates
        upc: null,
        original_release_date: null,
        digital_release_date: null,
      })
      .select()
      .single()

    if (createError) throw createError

    // Copy tracks (without ISRC)
    if (originalRelease.tracks && originalRelease.tracks.length > 0) {
      const tracksToInsert = originalRelease.tracks.map(track => ({
        release_id: newRelease.id,
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

      const { error: tracksError } = await supabase
        .from("tracks")
        .insert(tracksToInsert)

      if (tracksError) throw tracksError
    }

    // Copy contributors
    if (originalRelease.contributors && originalRelease.contributors.length > 0) {
      const contributorsToInsert = originalRelease.contributors.map(contributor => ({
        release_id: newRelease.id,
        track_id: null, // Contributors at release level
        name: contributor.name,
        role: contributor.role,
        share_percentage: contributor.share_percentage,
        email: contributor.email,
        phone: contributor.phone,
      }))

      const { error: contributorsError } = await supabase
        .from("contributors")
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
