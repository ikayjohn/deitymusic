import { createClient } from "@/lib/supabase/server"

// ============================================
// FILE UPLOAD SERVICE
// ============================================

export class UploadService {
  private supabase: Awaited<ReturnType<typeof createClient>>

  constructor() {
    this.supabase = null as any // Will be initialized in methods
  }

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile({
    file,
    bucket,
    path,
    upsert = false,
  }: {
    file: File
    bucket: string
    path: string
    upsert?: boolean
  }) {
    const supabase = await createClient()

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert,
        cacheControl: "3600",
      })

    if (error) {
      console.error("Upload error:", error)
      throw new Error(`Failed to upload file: ${error.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      path: data.path,
      url: publicUrl,
    }
  }

  /**
   * Upload artwork with validation
   */
  async uploadArtwork(file: File, releaseId: string) {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type. Must be JPEG, PNG, or WebP.")
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File too large. Maximum size is 10MB.")
    }

    // Validate dimensions (3000x3000 minimum)
    const dimensions = await this.getImageDimensions(file)
    if (dimensions.width < 3000 || dimensions.height < 3000) {
      throw new Error("Artwork must be at least 3000x3000 pixels")
    }

    // Upload to releases bucket
    const timestamp = Date.now()
    const ext = file.name.split(".").pop()
    const path = `${releaseId}/artwork/original.${ext}`

    return this.uploadFile({
      file,
      bucket: "releases",
      path,
      upsert: true,
    })
  }

  /**
   * Upload audio file with validation
   */
  async uploadAudio(file: File, releaseId: string, trackNumber: number) {
    // Validate file type
    const validTypes = ["audio/wav", "audio/mpeg", "audio/flac", "audio/x-wav"]
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type. Must be WAV, MP3, or FLAC.")
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      throw new Error("File too large. Maximum size is 50MB.")
    }

    // Get duration
    const duration = await this.getAudioDuration(file)

    // Upload to releases bucket
    const timestamp = Date.now()
    const ext = file.name.split(".").pop()
    const path = `${releaseId}/tracks/track-${trackNumber}.${ext}`

    const result = await this.uploadFile({
      file,
      bucket: "releases",
      path,
      upsert: true,
    })

    return {
      ...result,
      duration,
      fileSize: file.size,
    }
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(bucket: string, path: string) {
    const supabase = await createClient()

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error("Delete error:", error)
      throw new Error(`Failed to delete file: ${error.message}`)
    }
  }

  /**
   * Get image dimensions
   */
  private async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve({ width: img.width, height: img.height })
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error("Failed to load image"))
      }

      img.src = url
    })
  }

  /**
   * Get audio duration in seconds
   */
  private async getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      const url = URL.createObjectURL(file)

      audio.addEventListener("loadedmetadata", () => {
        URL.revokeObjectURL(url)
        resolve(Math.round(audio.duration))
      })

      audio.addEventListener("error", () => {
        URL.revokeObjectURL(url)
        reject(new Error("Failed to load audio"))
      })

      audio.src = url
    })
  }

  /**
   * Generate a signed URL for temporary upload access
   */
  async generateSignedUrl(bucket: string, path: string, expiresIn: number = 3600) {
    const supabase = await createClient()

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) {
      console.error("Signed URL error:", error)
      throw new Error(`Failed to generate signed URL: ${error.message}`)
    }

    return data.signedUrl
  }
}

// Singleton instance
export const uploadService = new UploadService()
