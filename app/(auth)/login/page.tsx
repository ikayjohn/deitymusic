"use client"

import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function LoginPage() {
 const router = useRouter()
 const searchParams = useSearchParams()
 const supabase = createBrowserClient()
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState<string | null>(null)
 const [formData, setFormData] = useState({
 email: "",
 password: "",
 })

 const redirectTo = searchParams.get("redirect") || "/dashboard"

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setLoading(true)
 setError(null)

 try {
 console.log("Attempting login for:", formData.email)

 const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
 email: formData.email,
 password: formData.password,
 })

 console.log("Sign in result:", { signInData, signInError })

 if (signInError) {
 console.error("Sign in error:", signInError)
 throw signInError
 }

 if (!signInData.user) {
 console.error("No user returned from sign in")
 throw new Error("Login failed: No user returned")
 }

 console.log("User logged in:", signInData.user.email)

 // Update last login (may fail due to RLS, but don't block login)
 try {
 await supabase
 .from("users")
 .update({ last_login_at: new Date().toISOString() })
 .eq("id", signInData.user.id)
 } catch (updateError) {
 console.warn("Failed to update last_login:", updateError)
 }

 console.log("Redirecting to:", redirectTo)
 // Use window.location for hard redirect to ensure session cookies are set
 window.location.href = redirectTo
 } catch (err) {
 console.error("Login error:", err)
 setError(err instanceof Error ? err.message : "Invalid email or password")
 } finally {
 setLoading(false)
 }
 }

 const handleGoogleSignIn = async () => {
 setLoading(true)
 setError(null)

 try {
 const { error } = await supabase.auth.signInWithOAuth({
 provider: "google",
 options: {
 redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
 },
 })

 if (error) throw error
 } catch (err) {
 setError(err instanceof Error ? err.message : "Failed to sign in with Google")
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
 <h1 className="mb-2 text-2xl font-bold">Welcome back</h1>
 <p className="mb-8 text-sm text-muted-foreground">
 Sign in to your account to continue
 </p>

 {error && (
 <div className="mb-6 bg-error/10 p-4 text-sm text-error">
 {error}
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-4">
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
 <div className="mb-2 flex items-center justify-between">
 <label htmlFor="password" className="block text-sm font-medium">
 Password
 </label>
 <Link
 href="/forgot-password"
 className="text-xs text-primary hover:underline"
 >
 Forgot password?
 </Link>
 </div>
 <input
 id="password"
 type="password"
 required
 value={formData.password}
 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder="Enter your password"
 />
 </div>

 {/* Submit Button */}
 <button
 type="submit"
 disabled={loading}
 className="w-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
 >
 {loading ? "Signing in..." : "Sign in"}
 </button>
 </form>

 {/* Divider */}
 <div className="my-6 flex items-center">
 <div className="flex-1 border-t border-border" />
 <span className="mx-4 text-xs text-muted-foreground">OR</span>
 <div className="flex-1 border-t border-border" />
 </div>

 {/* Google Sign In */}
 <button
 onClick={handleGoogleSignIn}
 disabled={loading}
 className="flex w-full items-center justify-center gap-2 border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
 >
 <svg className="h-5 w-5" viewBox="0 0 24 24">
 <path
 fill="currentColor"
 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
 />
 <path
 fill="currentColor"
 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
 />
 <path
 fill="currentColor"
 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
 />
 <path
 fill="currentColor"
 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
 />
 </svg>
 Continue with Google
 </button>

 {/* Sign Up Link */}
 <p className="mt-6 text-center text-sm text-muted-foreground">
 Don't have an account?{" "}
 <Link href="/signup" className="font-medium text-primary hover:underline">
 Sign up
 </Link>
 </p>
 </div>
 </div>
 </div>
 )
}
