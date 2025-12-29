import { NextRequest, NextResponse } from "next/server"
import { uploadService } from "@/lib/services/upload.service"

// POST /api/upload - Upload a file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // "artwork" or "audio"
    const releaseId = formData.get("releaseId") as string
    const trackNumber = formData.get("trackNumber") as string | null

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    if (!releaseId) {
      return NextResponse.json(
        { error: "Release ID is required" },
        { status: 400 }
      )
    }

    if (type === "artwork") {
      const result = await uploadService.uploadArtwork(file, releaseId)
      return NextResponse.json(result)
    } else if (type === "audio") {
      if (!trackNumber) {
        return NextResponse.json(
          { error: "Track number is required for audio files" },
          { status: 400 }
        )
      }
      const result = await uploadService.uploadAudio(
        file,
        releaseId,
        parseInt(trackNumber)
      )
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { error: "Invalid upload type" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 }
    )
  }
}
