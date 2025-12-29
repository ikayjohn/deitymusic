"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { trackSchema, type Track } from "@/lib/validations/release"
import type { ReleaseFormData } from "@/lib/validations/release"
import { nanoid } from "nanoid"

interface Step2TracksProps {
 data: Partial<ReleaseFormData>
 onChange: (data: Partial<ReleaseFormData>) => void
 onNext: (data: Partial<ReleaseFormData>) => void
 onPrevious: () => void
 onSubmit?: () => void
 isSubmitting?: boolean
 isFirstStep?: boolean
 isLastStep?: boolean
}

export function Step2Tracks({
 data,
 onChange,
 onNext,
 onPrevious,
}: Step2TracksProps) {
 const tracks = data.tracks || []
 const [uploading, setUploading] = useState(false)

 const handleAddTrack = () => {
 const newTrack: Track = {
 id: nanoid(),
 title: "",
 audioFileUrl: "",
 audioFileSize: 0,
 duration: 0,
 previewStart: 30,
 previewDuration: 30,
 explicitContent: false,
 language: "en",
 }
 onChange({ tracks: [...tracks, newTrack] })
 }

 const handleRemoveTrack = (index: number) => {
 onChange({ tracks: tracks.filter((_, i) => i !== index) })
 }

 const handleUpdateTrack = (index: number, updates: Partial<Track>) => {
 const newTracks = [...tracks]
 newTracks[index] = { ...newTracks[index], ...updates }
 onChange({ tracks: newTracks })
 }

 const handleFileUpload = async (index: number, file: File) => {
 setUploading(true)

 try {
 // Validate file
 if (!file.type.startsWith("audio/")) {
 throw new Error("Please select an audio file")
 }

 if (file.size > 50 * 1024 * 1024) {
 throw new Error("File too large. Maximum size is 50MB")
 }

 // Create a temporary release ID for uploads
 const releaseId = data.basicInfo?.title?.replace(/\s+/g, "-").toLowerCase() || "temp"

 // Upload file
 const formData = new FormData()
 formData.append("file", file)
 formData.append("type", "audio")
 formData.append("releaseId", releaseId)
 formData.append("trackNumber", (index + 1).toString())

 const response = await fetch("/api/upload", {
 method: "POST",
 body: formData,
 })

 if (!response.ok) {
 const error = await response.json()
 throw new Error(error.error || "Failed to upload file")
 }

 const result = await response.json()

 // Update track with file info
 handleUpdateTrack(index, {
 audioFileUrl: result.url,
 audioFileSize: result.fileSize,
 duration: result.duration,
 })
 } catch (error) {
 console.error("Upload error:", error)
 alert(error instanceof Error ? error.message : "Failed to upload file")
 } finally {
 setUploading(false)
 }
 }

 const handleNext = () => {
 if (tracks.length === 0) {
 alert("Please add at least one track")
 return
 }

 const invalidTrack = tracks.find(t => !t.title || !t.audioFileUrl)
 if (invalidTrack) {
 alert("Please complete all track information")
 return
 }

 onNext({ tracks })
 }

 return (
 <div className="space-y-6">
 <div>
 <h2 className="text-xl font-semibold">Tracks</h2>
 <p className="text-sm text-muted-foreground">
 Add the tracks for your release
 </p>
 </div>

 {/* Track List */}
 <div className="space-y-4">
 {tracks.map((track, index) => (
 <div
 key={track.id}
 className="border border-border bg-muted/30 p-4"
 >
 <div className="mb-4 flex items-start justify-between">
 <div className="flex items-center gap-3">
 <div className="flex h-8 w-8 items-center justify-center bg-primary text-sm font-medium text-primary-foreground">
 {index + 1}
 </div>
 <input
 type="text"
 value={track.title}
 onChange={(e) => handleUpdateTrack(index, { title: e.target.value })}
 className="flex-1 border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder="Track title"
 />
 </div>
 <button
 type="button"
 onClick={() => handleRemoveTrack(index)}
 className="text-muted-foreground hover:text-error"
 disabled={tracks.length === 1}
 >
 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
 </svg>
 </button>
 </div>

 {/* File Upload */}
 {!track.audioFileUrl ? (
 <div className="mb-4">
 <label className="block">
 <input
 type="file"
 accept="audio/*"
 onChange={(e) => {
 const file = e.target.files?.[0]
 if (file) handleFileUpload(index, file)
 }}
 disabled={uploading}
 className="sr-only"
 />
 <div className="flex cursor-pointer items-center justify-center border-2 border-dashed border-border p-4 hover:border-primary">
 <div className="text-center">
 <svg className="mx-auto h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
 </svg>
 <p className="mt-1 text-sm text-muted-foreground">
 {uploading ? "Uploading..." : "Upload audio file"}
 </p>
 <p className="text-xs text-muted-foreground">
 WAV, MP3, FLAC (max 50MB)
 </p>
 </div>
 </div>
 </label>
 </div>
 ) : (
 <div className="mb-4 flex items-center justify-between bg-success/10 p-3">
 <div className="flex items-center gap-2">
 <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 <span className="text-sm">Uploaded • {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}</span>
 </div>
 <button
 type="button"
 onClick={() => handleUpdateTrack(index, { audioFileUrl: "", audioFileSize: 0 })}
 className="text-xs text-muted-foreground hover:text-error"
 >
 Remove
 </button>
 </div>
 )}

 {/* Track Settings */}
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="mb-1 block text-xs font-medium">
 Preview Start (seconds)
 </label>
 <input
 type="number"
 value={track.previewStart}
 onChange={(e) => handleUpdateTrack(index, { previewStart: parseInt(e.target.value) || 0 })}
 className="w-full border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 min="0"
 />
 </div>
 <div>
 <label className="mb-1 block text-xs font-medium">
 ISRC (Optional)
 </label>
 <input
 type="text"
 value={track.isrc || ""}
 onChange={(e) => handleUpdateTrack(index, { isrc: e.target.value.toUpperCase() })}
 className="w-full border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder="USABC1234567"
 />
 </div>
 </div>

 <div className="mt-4 flex items-center gap-4">
 <label className="flex items-center gap-2">
 <input
 type="checkbox"
 checked={track.explicitContent}
 onChange={(e) => handleUpdateTrack(index, { explicitContent: e.target.checked })}
 className="h-4 w-4 rounded border-input"
 />
 <span className="text-sm">Explicit</span>
 </label>
 </div>
 </div>
 ))}
 </div>

 {/* Add Track Button */}
 <button
 type="button"
 onClick={handleAddTrack}
 className="flex w-full items-center justify-center gap-2 border-2 border-dashed border-border p-4 hover:border-primary"
 >
 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
 </svg>
 Add Track
 </button>

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
