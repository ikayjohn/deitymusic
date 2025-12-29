"use client"

import Link from "next/link"

interface SubscriptionPromptProps {
 plan?: string
}

export function SubscriptionPrompt({ plan = "starter" }: SubscriptionPromptProps) {
 return (
 <div className="mx-auto my-12 max-w-3xl border border-border bg-background p-8 text-center shadow-sm">
 {/* Icon */}
 <div className="mb-6 flex justify-center">
 <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
 <svg className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
 </svg>
 </div>
 </div>

 {/* Title */}
 <h1 className="mb-2 text-2xl font-bold">Upgrade to Start Uploading</h1>
 <p className="mb-8 text-muted-foreground">
 Choose a subscription plan that fits your needs. All plans include unlimited uploads and distribution to 150+ platforms.
 </p>

 {/* Plan Cards */}
 <div className="mb-8 grid gap-4 sm:grid-cols-3">
 <Link
 href="/subscription/checkout?plan=starter"
 className="border border-border bg-background p-4 text-center hover:border-[#E7B900] transition-colors"
 >
 <h3 className="font-semibold">Starter</h3>
 <p className="mt-2 text-2xl font-bold">₦10,000</p>
 <p className="text-sm text-muted-foreground">/year</p>
 <p className="mt-2 text-xs text-muted-foreground">1 Artist • Unlimited Uploads</p>
 </Link>

 <Link
 href="/subscription/checkout?plan=pro"
 className="border-2 border-[#E7B900] bg-background p-4 text-center"
 >
 <div className="mb-1 inline-block bg-[#E7B900] px-2 py-0.5 text-xs font-bold text-black">
 POPULAR
 </div>
 <h3 className="font-semibold">Pro</h3>
 <p className="mt-2 text-2xl font-bold">₦25,000</p>
 <p className="text-sm text-muted-foreground">/year</p>
 <p className="mt-2 text-xs text-muted-foreground">2 Artists • Custom Label</p>
 </Link>

 <Link
 href="/subscription/checkout?plan=elite"
 className="border border-border bg-background p-4 text-center hover:border-[#E7B900] transition-colors"
 >
 <h3 className="font-semibold">Elite</h3>
 <p className="mt-2 text-2xl font-bold">₦80,000</p>
 <p className="text-sm text-muted-foreground">/year</p>
 <p className="mt-2 text-xs text-muted-foreground">5 Artists • Bulk Uploads</p>
 </Link>
 </div>

 {/* CTA */}
 <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
 <Link
 href="/subscription"
 className="inline-flex items-center justify-center border-2 border-border bg-background px-6 py-3 text-sm font-semibold hover:border-[#E7B900]"
 >
 View All Plans
 </Link>
 </div>

 {/* Features */}
 <div className="mt-8 border-t border-border pt-6">
 <p className="mb-3 text-sm font-semibold">All plans include:</p>
 <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
 <span className="flex items-center gap-1">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 150+ Platforms
 </span>
 <span className="flex items-center gap-1">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 100% Royalties
 </span>
 <span className="flex items-center gap-1">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Free Barcodes
 </span>
 <span className="flex items-center gap-1">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Analytics
 </span>
 </div>
 </div>
 </div>
 )
}
