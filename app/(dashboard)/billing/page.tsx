import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function BillingPage() {
 const supabase = await createClient()

 const { data: { user } } = await supabase.auth.getUser()

 if (!user) {
 redirect("/login")
 }

 // Fetch user's subscription history
 const { data: subscriptions } = await supabase
 .from("subscriptions")
 .select("*")
 .eq("user_id", user.id)
 .order("created_at", { ascending: false })

 // Get active subscription
 const activeSubscription = subscriptions?.find(
 (sub: any) => sub.status === "ACTIVE" && new Date(sub.end_date) > new Date()
 ) as any

 return (
 <>
 <Header title="Billing & Subscriptions" />
 <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
 <div className="mx-auto max-w-5xl space-y-6">
 {/* Current Plan */}
 {activeSubscription ? (
 <div className="border border-border bg-background p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <div className="flex items-center gap-3">
 <h2 className="text-xl font-bold">{activeSubscription.plan} Plan</h2>
 <span className="bg-success/10 px-3 py-1 text-xs font-semibold text-success">
 ACTIVE
 </span>
 </div>
 <p className="mt-2 text-muted-foreground">
 Your plan is valid until{" "}
 <strong>
 {new Date(activeSubscription.end_date).toLocaleDateString("en-NG", {
 year: "numeric",
 month: "long",
 day: "numeric",
 })}
 </strong>
 </p>
 <p className="mt-1 text-sm text-muted-foreground">
 Started on{" "}
 {new Date(activeSubscription.start_date).toLocaleDateString("en-NG", {
 year: "numeric",
 month: "long",
 day: "numeric",
 })}
 </p>
 </div>
 <div className="text-right">
 <p className="text-2xl font-bold">₦{Number(activeSubscription.amount).toLocaleString()}</p>
 <p className="text-sm text-muted-foreground">per year</p>
 </div>
 </div>

 {/* Plan Features Based on Tier */}
 <div className="mt-6 border-t border-border pt-6">
 <h3 className="mb-3 font-semibold">Your Plan Includes:</h3>
 <div className="grid gap-3 sm:grid-cols-2">
 {activeSubscription.plan === "STARTER" && (
 <>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 1 Artist Name
 </div>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Unlimited Uploads
 </div>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Standard Delivery (48-72 hours)
 </div>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Monthly Payouts
 </div>
 </>
 )}
 {activeSubscription.plan === "PRO" && (
 <>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 2 Artist Names
 </div>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Custom Label Name
 </div>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Priority Delivery (24-48 hours)
 </div>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Weekly Payouts
 </div>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Spotify Verification
 </div>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Advanced Analytics
 </div>
 </>
 )}
 {activeSubscription.plan === "ELITE" && (
 <>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 5 Artist Names
 </div>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Bulk Upload Feature
 </div>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Fastest Delivery (24 hours)
 </div>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Dedicated Account Manager
 </div>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Label Management Dashboard
 </div>
 <div className="flex items-center gap-2 text-sm">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 API Access
 </div>
 </>
 )}
 </div>
 </div>

 {/* Actions */}
 <div className="mt-6 flex gap-4">
 <Link
 href="/subscription"
 className="inline-flex items-center border-2 border-border bg-background px-4 py-2 text-sm font-semibold hover:border-[#E7B900]"
 >
 Upgrade Plan
 </Link>
 <button
 className="inline-flex items-center border border-border bg-background px-4 py-2 text-sm font-semibold text-error hover:border-error"
 onClick={() => {
 // TODO: Implement cancellation flow
 alert("Contact support to cancel your subscription")
 }}
 >
 Cancel Plan
 </button>
 </div>
 </div>
 ) : (
 <div className="border border-border bg-background p-8 text-center shadow-sm">
 <svg className="mx-auto h-16 w-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
 </svg>
 <h3 className="mt-4 text-lg font-semibold">No Active Subscription</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 Choose a plan to start distributing your music
 </p>
 <Link
 href="/subscription"
 className="mt-4 inline-flex items-center bg-[#E7B900] px-6 py-2 text-sm font-semibold text-black hover:bg-[#d4a800]"
 >
 View Plans
 </Link>
 </div>
 )}

 {/* Payment History */}
 <div>
 <h2 className="mb-4 text-lg font-semibold">Payment History</h2>
 {subscriptions && subscriptions.length > 0 ? (
 <div className="border border-border bg-background shadow-sm">
 <div className="divide-y divide-border">
 {subscriptions.map((sub: any) => (
 <div
 key={sub.id}
 className="flex items-center justify-between p-4 hover:bg-muted/50"
 >
 <div>
 <p className="font-medium">{sub.plan} Plan</p>
 <p className="text-sm text-muted-foreground">
 {new Date(sub.created_at).toLocaleDateString("en-NG", {
 year: "numeric",
 month: "short",
 day: "numeric",
 })}
 </p>
 </div>
 <div className="text-right">
 <p className="font-semibold">₦{Number(sub.amount).toLocaleString()}</p>
 <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${
 sub.status === "ACTIVE" && new Date(sub.end_date) > new Date()
 ? "bg-success-light text-success"
 : "bg-muted text-muted-foreground"
 }`}
 >
 {sub.status === "ACTIVE" && new Date(sub.end_date) > new Date() ? "Active" : "Expired"}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>
 ) : (
 <div className="border border-border bg-background p-8 text-center shadow-sm">
 <p className="text-muted-foreground">No payment history yet</p>
 </div>
 )}
 </div>
 </div>
 </main>
 </>
 )
}
