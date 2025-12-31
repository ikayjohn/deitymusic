import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
 const supabase = await createClient()

 const { data: { user } } = await supabase.auth.getUser()

 if (!user) {
 redirect("/login")
 }

 // Fetch user profile data
 const { data: profile } = await supabase
 .from("users")
 .select("*")
 .eq("id", user.id)
 .single()

 // Fetch subscription
 const { data: subscription } = await supabase
 .from("subscriptions")
 .select("*")
 .eq("user_id", user.id)
 .eq("status", "ACTIVE")
 .gte("end_date", new Date().toISOString())
 .order("created_at", { ascending: false })
 .limit(1)
 .maybeSingle()

 const hasActiveSubscription = subscription && new Date((subscription as any).end_date) > new Date()

 async function updateProfile(formData: FormData) {
 "use server"

 const supabase = await createClient()

 const { data: { user } } = await supabase.auth.getUser()

 if (!user) {
 return
 }

 const name = formData.get("name") as string
 const phone = formData.get("phone") as string

 // Update auth metadata
 await supabase.auth.updateUser({
 data: { name }
 })

 // Update profile
 const { error } = await (supabase
 .from("users") as any)
 .update({
 name,
 phone,
 updated_at: new Date().toISOString(),
 })
 .eq("id", user.id)

 if (error) {
 throw new Error(error.message)
 }

 revalidatePath("/settings")
 redirect("/settings")
 }

 async function updateEmail(formData: FormData) {
 "use server"

 const supabase = await createClient()

 const { data: { user } } = await supabase.auth.getUser()

 if (!user) {
 return
 }

 const newEmail = formData.get("email") as string

 const { error } = await supabase.auth.updateUser({
 email: newEmail
 })

 if (error) {
 throw new Error(error.message)
 }

 revalidatePath("/settings")
 }

 async function updatePassword(formData: FormData) {
 "use server"

 const supabase = await createClient()

 const { data: { user } } = await supabase.auth.getUser()

 if (!user) {
 return
 }

 const password = formData.get("password") as string

 if (password.length < 8) {
 throw new Error("Password must be at least 8 characters")
 }

 const { error } = await supabase.auth.updateUser({
 password
 })

 if (error) {
 throw new Error(error.message)
 }

 revalidatePath("/settings")
 }

 return (
 <>
 <Header title="Settings" />
 <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
 <div className="mx-auto max-w-3xl space-y-6">
 {/* Profile Section */}
 <div className="border border-border bg-white p-6 shadow-sm">
 <h2 className="mb-4 text-lg font-semibold">Profile Information</h2>
 <form action={updateProfile} className="space-y-4">
 <div>
 <label htmlFor="name" className="mb-2 block text-sm font-medium">
 Full Name
 </label>
 <input
 type="text"
 name="name"
 id="name"
 defaultValue={(profile as any)?.name || user.user_metadata?.name || ""}
 required
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder="Enter your full name"
 />
 </div>

 <div>
 <label htmlFor="email" className="mb-2 block text-sm font-medium">
 Email Address
 </label>
 <input
 type="email"
 id="email"
 defaultValue={user.email}
 disabled
 className="w-full border border-input bg-muted px-4 py-2 text-sm text-muted-foreground cursor-not-allowed"
 />
 <p className="mt-1 text-xs text-muted-foreground">
 Contact support to change your email address
 </p>
 </div>

 <div>
 <label htmlFor="phone" className="mb-2 block text-sm font-medium">
 Phone Number
 </label>
 <input
 type="tel"
 name="phone"
 id="phone"
 defaultValue={(profile as any)?.phone || ""}
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder="+234 XXX XXX XXXX"
 />
 </div>

 <div>
 <label htmlFor="accountType" className="mb-2 block text-sm font-medium">
 Account Type
 </label>
 <input
 type="text"
 id="accountType"
 defaultValue={(profile as any)?.account_type || "ARTIST"}
 disabled
 className="w-full border border-input bg-muted px-4 py-2 text-sm text-muted-foreground cursor-not-allowed"
 />
 <p className="mt-1 text-xs text-muted-foreground">
 Account type cannot be changed after registration
 </p>
 </div>

 <button
 type="submit"
 className="bg-[#E7B900] px-6 py-2 text-sm font-semibold text-black hover:bg-[#d4a800]"
 >
 Save Changes
 </button>
 </form>
 </div>

 {/* Subscription Section */}
 <div className="border border-border bg-white p-6 shadow-sm">
 <h2 className="mb-4 text-lg font-semibold">Subscription</h2>

 {hasActiveSubscription && subscription ? (
 <div className="space-y-4">
 <div className="flex items-center justify-between border-b border-border pb-4">
 <div>
 <p className="font-semibold">{(subscription as any).plan} Plan</p>
 <p className="text-sm text-muted-foreground">
 Active until {new Date((subscription as any).end_date).toLocaleDateString("en-NG", {
 year: "numeric",
 month: "long",
 day: "numeric",
 })}
 </p>
 </div>
 <span className="bg-success/10 px-3 py-1 text-xs font-semibold text-success">
 ACTIVE
 </span>
 </div>

 <div className="space-y-2 text-sm">
 <div className="flex justify-between">
 <span className="text-muted-foreground">Amount Paid</span>
 <span className="font-semibold">₦{Number((subscription as any).amount).toLocaleString()}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-muted-foreground">Payment Method</span>
 <span className="font-semibold">{(subscription as any).payment_method || "Paystack"}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-muted-foreground">Started On</span>
 <span className="font-semibold">
 {new Date((subscription as any).start_date).toLocaleDateString("en-NG", {
 year: "numeric",
 month: "short",
 day: "numeric",
 })}
 </span>
 </div>
 </div>

 <div className="flex gap-3">
 <a
 href="/billing"
 className="border-2 border-border bg-background px-4 py-2 text-sm font-semibold hover:border-[#E7B900]"
 >
 Manage Subscription
 </a>
 <a
 href="/subscription"
 className="border-2 border-border bg-background px-4 py-2 text-sm font-semibold hover:border-[#E7B900]"
 >
 Upgrade Plan
 </a>
 </div>
 </div>
 ) : (
 <div className="text-center">
 <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
 </svg>
 <h3 className="mt-4 text-lg font-semibold">No Active Subscription</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 Subscribe to start distributing your music
 </p>
 <a
 href="/subscription"
 className="mt-4 inline-flex items-center bg-[#E7B900] px-6 py-2 text-sm font-semibold text-black hover:bg-[#d4a800]"
 >
 View Plans
 </a>
 </div>
 )}
 </div>

 {/* Security Section */}
 <div className="border border-border bg-white p-6 shadow-sm">
 <h2 className="mb-4 text-lg font-semibold">Security</h2>

 <form action={updatePassword} className="space-y-4">
 <div>
 <label htmlFor="password" className="mb-2 block text-sm font-medium">
 New Password
 </label>
 <input
 type="password"
 name="password"
 id="password"
 required
 minLength={8}
 className="w-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 placeholder="Min. 8 characters"
 />
 <p className="mt-1 text-xs text-muted-foreground">
 Leave blank to keep current password
 </p>
 </div>

 <button
 type="submit"
 className="border-2 border-border bg-background px-6 py-2 text-sm font-semibold hover:border-[#E7B900]"
 >
 Update Password
 </button>
 </form>
 </div>

 {/* Danger Zone */}
 <div className="border-2 border-error/50 bg-white p-6 shadow-sm">
 <h2 className="mb-4 text-lg font-semibold text-error">Danger Zone</h2>
 <p className="mb-4 text-sm text-muted-foreground">
 Irreversible and destructive actions
 </p>

 <div className="space-y-4">
 <div className="flex items-center justify-between border-b border-border pb-4">
 <div>
 <p className="font-medium">Delete Account</p>
 <p className="text-sm text-muted-foreground">
 Permanently delete your account and all data
 </p>
 </div>
 <button
 className="border-2 border-error bg-background px-4 py-2 text-sm font-semibold text-error hover:bg-error hover:text-white"
 >
 Delete Account
 </button>
 </div>
 </div>
 </div>
 </div>
 </main>
 </>
 )
}
