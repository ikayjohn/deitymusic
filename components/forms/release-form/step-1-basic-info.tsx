"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { releaseBasicInfoSchema, type ReleaseBasicInfo } from "@/lib/validations/release"
import type { ReleaseFormData } from "@/lib/validations/release"

interface Step1BasicInfoProps {
 data: Partial<ReleaseFormData>
 onChange: (data: Partial<ReleaseFormData>) => void
 onNext: (data: Partial<ReleaseFormData>) => void
 onPrevious: () => void
 onSubmit?: () => void
 isSubmitting?: boolean
 isFirstStep?: boolean
 isLastStep?: boolean
}

export function Step1BasicInfo({
 data,
 onChange,
 onNext,
 onPrevious,
 isSubmitting,
 isFirstStep,
 isLastStep,
}: Step1BasicInfoProps) {
 const {
 register,
 handleSubmit,
 watch,
 formState: { errors },
 } = useForm<ReleaseBasicInfo>({
 resolver: zodResolver(releaseBasicInfoSchema as any),
 defaultValues: data.basicInfo || {
 releaseType: "SINGLE",
 explicitContent: false,
 language: "en",
 copyrightYear: new Date().getFullYear(),
 },
 })

 const releaseType = watch("releaseType")

 const onSubmitForm = (formData: ReleaseBasicInfo) => {
 onChange({ basicInfo: formData })
 onNext({ basicInfo: formData })
 }

 return (
 <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
 <div>
 <h2 className="text-xl font-semibold">Basic Information</h2>
 <p className="text-sm text-muted-foreground">
 Tell us about your release
 </p>
 </div>

 {/* Release Type */}
 <div>
 <label className="mb-2 block text-sm font-medium">
 Release Type <span className="text-error">*</span>
 </label>
 <div className="grid grid-cols-3 gap-4">
 {[
 { value: "SINGLE", label: "Single", desc: "1-2 tracks" },
 { value: "EP", label: "EP", desc: "3-6 tracks" },
 { value: "ALBUM", label: "Album", desc: "7+ tracks" },
 ].map((type) => (
 <label
 key={type.value}
 className={`
 relative flex cursor-pointer flex-col items-center border-2 p-4 transition-colors
 hover:border-primary/50
 ${releaseType === type.value
 ? "border-primary bg-primary/5"
 : "border-border"
 }
 `}
 >
 <input
 type="radio"
 value={type.value}
 {...register("releaseType")}
 className="sr-only"
 />
 <span className="font-medium">{type.label}</span>
 <span className="text-xs text-muted-foreground">{type.desc}</span>
 </label>
 ))}
 </div>
 {errors.releaseType && (
 <p className="mt-1 text-xs text-error">{errors.releaseType.message}</p>
 )}
 </div>

 {/* Title */}
 <div>
 <label htmlFor="title" className="mb-2 block text-sm font-medium">
 Release Title <span className="text-error">*</span>
 </label>
 <input
 type="text"
 id="title"
 {...register("title")}
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder="Enter release title"
 />
 {errors.title && (
 <p className="mt-1 text-xs text-error">{errors.title.message}</p>
 )}
 </div>

 {/* Genre */}
 <div>
 <label htmlFor="genre" className="mb-2 block text-sm font-medium">
 Genre <span className="text-error">*</span>
 </label>
 <select
 id="genre"
 {...register("genre")}
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 >
 <option value="">Select a genre</option>
 <option value="pop">Pop</option>
 <option value="rock">Rock</option>
 <option value="hip-hop-rap">Hip-Hop/Rap</option>
 <option value="r-b-soul">R&B/Soul</option>
 <option value="country">Country</option>
 <option value="electronic">Electronic</option>
 <option value="jazz">Jazz</option>
 <option value="classical">Classical</option>
 <option value="latin">Latin</option>
 <option value="metal">Metal</option>
 <option value="folk">Folk</option>
 <option value="blues">Blues</option>
 <option value="reggae">Reggae</option>
 <option value="world">World</option>
 <option value="other">Other</option>
 </select>
 {errors.genre && (
 <p className="mt-1 text-xs text-error">{errors.genre.message}</p>
 )}
 </div>

 {/* Sub Genre (Optional) */}
 <div>
 <label htmlFor="subGenre" className="mb-2 block text-sm font-medium">
 Sub Genre (Optional)
 </label>
 <input
 type="text"
 id="subGenre"
 {...register("subGenre")}
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder="e.g., Indie Pop, Trap Rock"
 />
 </div>

 {/* Copyright Information */}
 <div className="grid gap-4 sm:grid-cols-2">
 <div>
 <label htmlFor="copyrightYear" className="mb-2 block text-sm font-medium">
 Copyright Year <span className="text-error">*</span>
 </label>
 <input
 type="number"
 id="copyrightYear"
 {...register("copyrightYear", { valueAsNumber: true })}
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder={new Date().getFullYear().toString()}
 />
 {errors.copyrightYear && (
 <p className="mt-1 text-xs text-error">{errors.copyrightYear.message}</p>
 )}
 </div>

 <div>
 <label htmlFor="copyrightHolder" className="mb-2 block text-sm font-medium">
 Copyright Holder <span className="text-error">*</span>
 </label>
 <input
 type="text"
 id="copyrightHolder"
 {...register("copyrightHolder")}
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder="Label name or artist name"
 />
 {errors.copyrightHolder && (
 <p className="mt-1 text-xs text-error">{errors.copyrightHolder.message}</p>
 )}
 </div>
 </div>

 {/* Settings */}
 <div className="grid gap-4 sm:grid-cols-2">
 <div>
 <label htmlFor="language" className="mb-2 block text-sm font-medium">
 Primary Language
 </label>
 <select
 id="language"
 {...register("language")}
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 >
 <option value="en">English</option>
 <option value="es">Spanish</option>
 <option value="fr">French</option>
 <option value="de">German</option>
 <option value="it">Italian</option>
 <option value="pt">Portuguese</option>
 <option value="ja">Japanese</option>
 <option value="ko">Korean</option>
 <option value="zh">Chinese</option>
 <option value="ar">Arabic</option>
 <option value="hi">Hindi</option>
 <option value="other">Other</option>
 </select>
 </div>

 <div>
 <label className="flex items-center gap-2">
 <input
 type="checkbox"
 {...register("explicitContent")}
 className="h-4 w-4 rounded border-input"
 />
 <span className="text-sm font-medium">Contains explicit content</span>
 </label>
 <p className="mt-1 text-xs text-muted-foreground">
 Mark if your release contains explicit lyrics or content
 </p>
 </div>
 </div>

 {/* Actions */}
 <div className="flex justify-end gap-4 border-t border-border pt-6">
 <button
 type="button"
 onClick={onPrevious}
 disabled={isFirstStep}
 className="border border-border px-6 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
 >
 Previous
 </button>
 <button
 type="submit"
 className="bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
 >
 Next Step
 </button>
 </div>
 </form>
 )
}
