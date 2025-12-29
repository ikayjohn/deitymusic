"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Step1BasicInfo } from "./step-1-basic-info"
import { Step2Tracks } from "./step-2-tracks"
import { Step3Artwork } from "./step-3-artwork"
import { Step4Metadata } from "./step-4-metadata"
import { Step5Distribution } from "./step-5-distribution"
import { Step6Review } from "./step-6-review"
import type { ReleaseFormData } from "@/lib/validations/release"

const steps = [
 { id: 1, title: "Basic Info", component: Step1BasicInfo },
 { id: 2, title: "Tracks", component: Step2Tracks },
 { id: 3, title: "Artwork", component: Step3Artwork },
 { id: 4, title: "Metadata", component: Step4Metadata },
 { id: 5, title: "Distribution", component: Step5Distribution },
 { id: 6, title: "Review", component: Step6Review },
]

interface ReleaseFormWizardProps {
 releaseId?: string
}

export function ReleaseFormWizard({ releaseId }: ReleaseFormWizardProps) {
 const router = useRouter()
 const [currentStep, setCurrentStep] = useState(1)
 const [isSubmitting, setIsSubmitting] = useState(false)
 const [formData, setFormData] = useState<Partial<ReleaseFormData>>({
 basicInfo: undefined,
 tracks: [],
 artwork: {},
 contributors: [],
 distribution: undefined,
 })

 const CurrentStepComponent = steps[currentStep - 1].component

 const handleNext = (data: Partial<ReleaseFormData>) => {
 setFormData((prev) => ({ ...prev, ...data }))
 if (currentStep < steps.length) {
 setCurrentStep((prev) => prev + 1)
 }
 }

 const handlePrevious = () => {
 if (currentStep > 1) {
 setCurrentStep((prev) => prev - 1)
 }
 }

 const handleSubmit = async () => {
 setIsSubmitting(true)

 try {
 // Create release via API
 const response = await fetch("/api/releases", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify(formData),
 })

 if (!response.ok) {
 const error = await response.json()
 throw new Error(error.error || "Failed to create release")
 }

 const result = await response.json()

 // Redirect to releases page
 router.push(`/releases/${result.release.id}?success=true`)
 } catch (error) {
 console.error("Submit error:", error)
 alert(error instanceof Error ? error.message : "Failed to create release")
 } finally {
 setIsSubmitting(false)
 }
 }

 return (
 <div className="mx-auto max-w-4xl">
 {/* Progress Indicator */}
 <div className="mb-8">
 <div className="flex items-center justify-between">
 {steps.map((step, index) => (
 <div
 key={step.id}
 className="flex flex-1 items-center"
 >
 <div className="flex flex-col items-center">
 <div
 className={`
 flex h-10 w-10 items-center justify-center border-2 font-medium transition-colors
 ${
 step.id === currentStep
 ? "border-primary bg-primary text-primary-foreground"
 : step.id < currentStep
 ? "border-success bg-success text-success-foreground"
 : "border-border bg-background text-muted-foreground"
 }
 `}
 >
 {step.id < currentStep ? (
 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 ) : (
 step.id
 )}
 </div>
 <span className="mt-2 text-xs font-medium">{step.title}</span>
 </div>
 {index < steps.length - 1 && (
 <div
 className={`
 mx-2 h-0.5 flex-1 transition-colors
 ${step.id < currentStep ? "bg-success" : "bg-border"}
 `}
 />
 )}
 </div>
 ))}
 </div>
 </div>

 {/* Current Step */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <CurrentStepComponent
 data={formData}
 onChange={(newData) => setFormData((prev) => ({ ...prev, ...newData }))}
 onNext={handleNext}
 onPrevious={handlePrevious}
 onSubmit={handleSubmit}
 isSubmitting={isSubmitting}
 isFirstStep={currentStep === 1}
 isLastStep={currentStep === steps.length}
 />
 </div>
 </div>
 )
}
