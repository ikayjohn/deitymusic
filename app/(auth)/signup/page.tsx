"use client"

export const dynamic = "force-dynamic"

import { useState, useRef } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function SignupPage() {
 const router = useRouter()
 const supabaseRef = useRef<ReturnType<typeof createBrowserClient> | null>(null)
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState<string | null>(null)
 const [formData, setFormData] = useState({
 email: "",
 password: "",
 name: "",
 accountType: "ARTIST" as "ARTIST" | "LABEL",
 })

 const getSupabase = () => {
 if (!supabaseRef.current) {
 supabaseRef.current = createBrowserClient()
 }
 return supabaseRef.current
 }

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setLoading(true)
 setError(null)

 try {
 const supabase = getSupabase()

 // Validate password
 if (formData.password.length < 8) {
 throw new Error("Password must be at least 8 characters")
 }

 // Sign up the user
 const { data: { user }, error: signUpError } = await supabase.auth.signUp({
 email: formData.email,
 password: formData.password,
 options: {
 data: {
 name: formData.name,
 account_type: formData.accountType,
 },
 emailRedirectTo: `${window.location.origin}/auth/callback`,
 },
 })

 if (signUpError) {
 // If user already exists, suggest logging in
 if (signUpError.message.includes("already") || signUpError.message.includes("registered")) {
 throw new Error("An account with this email already exists. Please sign in instead.")
 }
 throw signUpError
 }

 // User profile is automatically created by database trigger
 // If email verification is disabled in Supabase, redirect to dashboard
 // Otherwise, redirect to email verification page
 if (user && user.email_confirmed_at) {
 router.push("/dashboard")
 } else {
 router.push("/verify-email?email=" + encodeURIComponent(formData.email))
 }
 } catch (err) {
 setError(err instanceof Error ? err.message : "An error occurred")
 } finally {
 setLoading(false)
 }
 }

 return (
 <div className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4"
 style={{ backgroundImage: "url('/auth-bg.jpg')" }}
 >
 <div className="absolute inset-0 bg-black/50" />
 <div className="relative w-full max-w-md">
 {/* Logo */}
 <div className="mb-8 flex justify-center">
 <Logo variant="compact" />
 </div>

 {/* Form Card */}
 <div className="border border-border bg-background p-8 shadow-sm">
 <h1 className="mb-2 text-2xl font-bold">Create an account</h1>
 <p className="mb-8 text-sm text-muted-foreground">
 Start distributing your music to the world
 </p>

 {error && (
 <div className="mb-6 bg-error/10 p-4 text-sm text-error">
 {error}
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-4">
 {/* Name */}
 <div>
 <label htmlFor="name" className="mb-2 block text-sm font-medium">
 Full Name
 </label>
 <input
 id="name"
 type="text"
 required
 value={formData.name}
 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder="Enter your full name"
 />
 </div>

 {/* Email */}
 <div>
 <label htmlFor="email" className="mb-2 block text-sm font-medium">
 Email
 </label>
 <input
 id="email"
 type="email"
 required
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder="you@example.com"
 />
 </div>

 {/* Password */}
 <div>
 <label htmlFor="password" className="mb-2 block text-sm font-medium">
 Password
 </label>
 <input
 id="password"
 type="password"
 required
 value={formData.password}
 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder="Min. 8 characters"
 />
 </div>

 {/* Account Type */}
 <div>
 <label htmlFor="accountType" className="mb-2 block text-sm font-medium">
 Account Type
 </label>
 <select
 id="accountType"
 value={formData.accountType}
 onChange={(e) => setFormData({ ...formData, accountType: e.target.value as "ARTIST" | "LABEL" })}
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 >
 <option value="ARTIST">Artist</option>
 <option value="LABEL">Label</option>
 </select>
 </div>

 {/* Submit Button */}
 <button
 type="submit"
 disabled={loading}
 className="w-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
 >
 {loading ? "Creating account..." : "Create account"}
 </button>

 {/* Terms */}
 <p className="text-xs text-muted-foreground">
 By signing up, you agree to our{" "}
 <Link href="/terms" className="underline hover:text-foreground">
 Terms of Service
 </Link>{" "}
 and{" "}
 <Link href="/privacy" className="underline hover:text-foreground">
 Privacy Policy
 </Link>
 </p>
 </form>

 {/* Sign In Link */}
 <p className="mt-6 text-center text-sm text-muted-foreground">
 Already have an account?{" "}
 <Link href="/login" className="font-medium text-primary hover:underline">
 Sign in
 </Link>
 </p>
 </div>
 </div>
 </div>
 )
}
