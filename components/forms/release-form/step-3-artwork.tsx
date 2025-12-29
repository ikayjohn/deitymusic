"use client"

import { useState } from "react"
import type { ReleaseFormData } from "@/lib/validations/release"

interface Step3ArtworkProps {
 data: Partial<ReleaseFormData>
 onChange: (data: Partial<ReleaseFormData>) => void
 onNext: (data: Partial<ReleaseFormData>) => void
 onPrevious: () => void
}

export function Step3Artwork({
 data,
 onChange,
 onNext,
 onPrevious,
}: Step3ArtworkProps) {
 const artwork = data.artwork
 const [uploading, setUploading] = useState(false)
 const [preview, setPreview] = useState<string | undefined>(artwork?.url)

 const handleFileUpload = async (file: File) => {
 setUploading(true)

 try {
 // Validate file type
 if (!file.type.startsWith("image/")) {
 throw new Error("Please select an image file")
 }

 // Validate file size (10MB)
 if (file.size > 10 * 1024 * 1024) {
 throw new Error("File too large. Maximum size is 10MB")
 }

 // Show preview
 const previewUrl = URL.createObjectURL(file)
 setPreview(previewUrl)

 // Create a temporary release ID for uploads
 const releaseId = data.basicInfo?.title?.replace(/\s+/g, "-").toLowerCase() || "temp"

 // Upload file
 const formData = new FormData()
 formData.append("file", file)
 formData.append("type", "artwork")
 formData.append("releaseId", releaseId)

 const response = await fetch("/api/upload", {
 method: "POST",
 body: formData,
 })

 if (!response.ok) {
 const error = await response.json()
 throw new Error(error.error || "Failed to upload artwork")
 }

 const result = await response.json()

 // Update artwork
 onChange({
 artwork: {
 ...data.artwork,
 url: result.url,
 },
 })
 } catch (error) {
 console.error("Upload error:", error)
 alert(error instanceof Error ? error.message : "Failed to upload artwork")
 setPreview(undefined)
 } finally {
 setUploading(false)
 }
 }

 const handleNext = () => {
 if (!artwork?.url) {
 alert("Please upload artwork")
 return
 }
 onNext({ artwork })
 }

 return (
 <div className="space-y-6">
 <div>
 <h2 className="text-xl font-semibold">Cover Art</h2>
 <p className="text-sm text-muted-foreground">
 Upload your release artwork
 </p>
 </div>

 {/* Upload Area */}
 <div>
 <label className="block">
 <input
 type="file"
 accept="image/jpeg,image/png,image/webp"
 onChange={(e) => {
 const file = e.target.files?.[0]
 if (file) handleFileUpload(file)
 }}
 disabled={uploading}
 className="sr-only"
 />
 <div
 className={`
 flex cursor-pointer items-center justify-center border-2
 ${preview ? "border-success bg-success/5" : "border-dashed border-border"}
 p-8 hover:border-primary
 `}
 >
 {preview ? (
 <div className="text-center">
 <img
 src={preview}
 alt="Artwork preview"
 className="mx-auto mb-4 h-48 w-48 object-cover shadow-lg"
 />
 <p className="text-sm text-success">Artwork uploaded successfully!</p>
 <p className="text-xs text-muted-foreground">Click to change</p>
 </div>
 ) : (
 <div className="text-center">
 <svg
 className="mx-auto h-16 w-16 text-muted-foreground"
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
 />
 </svg>
 <p className="mt-4 text-sm font-medium">
 {uploading ? "Uploading..." : "Upload cover art"}
 </p>
 <p className="mt-1 text-xs text-muted-foreground">
 PNG, JPEG, or WebP (max 10MB)
 </p>
 </div>
 )}
 </div>
 </label>
 </div>

 {/* Requirements */}
 <div className="bg-muted/50 p-4">
 <h3 className="mb-2 font-medium text-sm">Artwork Requirements</h3>
 <ul className="space-y-1 text-xs text-muted-foreground">
 <li>✓ Minimum 3000x3000 pixels</li>
 <li>✓ Perfect square (1:1 aspect ratio)</li>
 <li>✓ RGB color mode (not CMYK)</li>
 <li>✓ No borders, logos, or text</li>
 <li>✓ Maximum 10MB file size</li>
 </ul>
 </div>

 {/* Actions */}
 <div className="flex justify-end gap-4 border-t border-border pt-6">
 <button
 type="button"
 onClick={onPrevious}
 className="border border-border px-6 py-2 text-sm font-medium hover:bg-muted"
 >
 Previous
 </button>
 <button
 type="button"
 onClick={handleNext}
 className="bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
 >
 Next Step
 </button>
 </div>
 </div>
 )
}
