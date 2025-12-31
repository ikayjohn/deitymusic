"use client"

import { useState, useRef, Suspense } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/logo"

function VerifyEmailContent() {
 const router = useRouter()
 const searchParams = useSearchParams()
 const supabaseRef = useRef<ReturnType<typeof createBrowserClient> | null>(null)
 const email = searchParams.get("email") || ""
 const [loading, setLoading] = useState(false)
 const [sent, setSent] = useState(false)
 const [error, setError] = useState<string | null>(null)

 const getSupabase = () => {
 if (!supabaseRef.current) {
 supabaseRef.current = createBrowserClient()
 }
 return supabaseRef.current
 }

 const handleResend = async () => {
 setLoading(true)
 setError(null)

 try {
 const supabase = getSupabase()
 const { error: resendError } = await supabase.auth.resend({
 type: "signup",
 email,
 })

 if (resendError) throw resendError

 setSent(true)
 } catch (err) {
 setError(err instanceof Error ? err.message : "Failed to resend email")
 } finally {
 setLoading(false)
 }
 }

 return (
 <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
 <div className="w-full max-w-md">
 {/* Logo */}
 <div className="mb-8 flex justify-center">
 <Logo />
 </div>

 {/* Card */}
 <div className="border border-border bg-background p-8 shadow-sm text-center">
 {/* Icon */}
 <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-primary/10">
 <svg
 className="h-8 w-8 text-primary"
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
 />
 </svg>
 </div>

 <h1 className="mb-2 text-2xl font-bold">Check your email</h1>
 <p className="mb-6 text-sm text-muted-foreground">
 We sent a verification link to{" "}
 <span className="font-medium text-foreground">{email}</span>
 </p>

 {error && (
 <div className="mb-6 bg-error/10 p-4 text-sm text-error">
 {error}
 </div>
 )}

 {sent && (
 <div className="mb-6 bg-success/10 p-4 text-sm text-success">
 Email sent! Check your inbox.
 </div>
 )}

 <p className="mb-6 text-sm text-muted-foreground">
 Click the link in the email to verify your account and start distributing your music.
 </p>

 <button
 onClick={handleResend}
 disabled={loading || sent}
 className="w-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
 >
 {loading ? "Sending..." : "Resend email"}
 </button>

 <p className="mt-6 text-sm text-muted-foreground">
 Already verified?{" "}
 <Link href="/login" className="font-medium text-primary hover:underline">
 Sign in
 </Link>
 </p>
 </div>
 </div>
 </div>
 )
}

export default function VerifyEmailPage() {
 return (
 <Suspense fallback={
 <div className="flex min-h-screen items-center justify-center">
 <div className="text-lg">Loading...</div>
 </div>
 }>
 <VerifyEmailContent />
 </Suspense>
 )
}
