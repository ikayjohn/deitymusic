"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contributorSchema, type Contributor } from "@/lib/validations/release"
import type { ReleaseFormData } from "@/lib/validations/release"
import { nanoid } from "nanoid"

interface Step4MetadataProps {
 data: Partial<ReleaseFormData>
 onChange: (data: Partial<ReleaseFormData>) => void
 onNext: (data: Partial<ReleaseFormData>) => void
 onPrevious: () => void
}

export function Step4Metadata({
 data,
 onChange,
 onNext,
 onPrevious,
}: Step4MetadataProps) {
 const contributors = data.contributors || []
 const [showAddForm, setShowAddForm] = useState(false)

 const {
 register,
 handleSubmit,
 reset,
 formState: { errors },
 } = useForm<Contributor>({
 resolver: zodResolver(contributorSchema),
 defaultValues: {
 role: "PRIMARY_ARTIST",
 sharePercentage: 0,
 },
 })

 const handleAddContributor = (formData: Contributor) => {
 onChange({
 contributors: [
 ...contributors,
 {
 ...formData,
 id: nanoid(),
 },
 ],
 })
 reset()
 setShowAddForm(false)
 }

 const handleRemoveContributor = (id: string) => {
 onChange({
 contributors: contributors.filter((c) => c.id !== id),
 })
 }

 const handleNext = () => {
 onNext({ contributors })
 }

 return (
 <div className="space-y-6">
 <div>
 <h2 className="text-xl font-semibold">Contributors & Credits</h2>
 <p className="text-sm text-muted-foreground">
 Add contributors to your release
 </p>
 </div>

 {/* Contributors List */}
 <div className="space-y-3">
 {contributors.map((contributor) => (
 <div
 key={contributor.id}
 className="flex items-center justify-between border border-border bg-muted/30 p-3"
 >
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center bg-primary text-sm font-medium text-primary-foreground">
 {contributor.name.charAt(0).toUpperCase()}
 </div>
 <div>
 <p className="font-medium">{contributor.name}</p>
 <p className="text-xs text-muted-foreground">
 {contributor.role.replace(/_/g, " ")}
 {contributor.sharePercentage > 0 && ` • ${contributor.sharePercentage}%`}
 </p>
 </div>
 </div>
 <button
 type="button"
 onClick={() => handleRemoveContributor(contributor.id!)}
 className="text-muted-foreground hover:text-error"
 >
 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>
 ))}
 </div>

 {/* Add Contributor Form */}
 {!showAddForm ? (
 <button
 type="button"
 onClick={() => setShowAddForm(true)}
 className="flex w-full items-center justify-center gap-2 border-2 border-dashed border-border p-4 hover:border-primary"
 >
 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
 </svg>
 Add Contributor
 </button>
 ) : (
 <form onSubmit={handleSubmit(handleAddContributor)} className="space-y-4 border border-border bg-muted/30 p-4">
 <div className="grid gap-4 sm:grid-cols-2">
 <div>
 <label className="mb-1 block text-sm font-medium">Name</label>
 <input
 type="text"
 {...register("name")}
 className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder="Contributor name"
 />
 {errors.name && (
 <p className="mt-1 text-xs text-error">{errors.name.message}</p>
 )}
 </div>

 <div>
 <label className="mb-1 block text-sm font-medium">Role</label>
 <select
 {...register("role")}
 className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 >
 <option value="PRIMARY_ARTIST">Primary Artist</option>
 <option value="FEATURED_ARTIST">Featured Artist</option>
 <option value="PRODUCER">Producer</option>
 <option value="COMPOSER">Composer</option>
 <option value="LYRICIST">Lyricist</option>
 <option value="PUBLISHER">Publisher</option>
 <option value="REMIXER">Remixer</option>
 <option value="ENGINEER">Engineer</option>
 </select>
 </div>

 <div>
 <label className="mb-1 block text-sm font-medium">Revenue Share (%)</label>
 <input
 type="number"
 {...register("sharePercentage", { valueAsNumber: true })}
 className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder="0"
 min="0"
 max="100"
 />
 <p className="mt-1 text-xs text-muted-foreground">
 Percentage of revenue this contributor receives
 </p>
 </div>

 <div>
 <label className="mb-1 block text-sm font-medium">Email (Optional)</label>
 <input
 type="email"
 {...register("email")}
 className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder="contributor@email.com"
 />
 </div>
 </div>

 <div className="flex gap-2">
 <button
 type="submit"
 className="bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
 >
 Add Contributor
 </button>
 <button
 type="button"
 onClick={() => {
 setShowAddForm(false)
 reset()
 }}
 className="border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
 >
 Cancel
 </button>
 </div>
 </form>
 )}

 {/* Info */}
 <div className="bg-info/10 p-4">
 <p className="text-sm text-info">
 <strong>Note:</strong> Contributors are optional but recommended for proper credit and royalty distribution.
 </p>
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
