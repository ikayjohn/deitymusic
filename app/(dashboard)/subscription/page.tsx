import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function SubscriptionPage() {
 const supabase = await createClient()

 const { data: { user } } = await supabase.auth.getUser()

 if (!user) {
 redirect("/login")
 }

 // Check if user has an active subscription
 const { data: subscription } = await supabase
 .from("subscriptions")
 .select("*")
 .eq("user_id", user.id)
 .eq("status", "ACTIVE")
 .gte("end_date", new Date().toISOString())
 .order("created_at", { ascending: false })
 .limit(1)
 .single()

 const hasActiveSubscription = subscription && new Date(subscription.end_date) > new Date()

 const plans = [
 {
 id: "starter",
 name: "Starter",
 price: 10000,
 description: "Perfect for solo artists starting their journey",
 features: [
 "1 Artist/Band Name",
 "Unlimited Uploads",
 "Distribution to 150+ Platforms",
 "Keep 100% of Royalties",
 "Free UPC/EAN Barcodes & ISRC Codes",
 "Basic Analytics Dashboard",
 "Standard Delivery (48-72 hours)",
 "Monthly Payouts",
 "Email Support",
 "Real-Time Release Tracking",
 ],
 },
 {
 id: "pro",
 name: "Pro",
 price: 25000,
 description: "For growing artists ready to expand",
 popular: true,
 features: [
 "Everything in Starter",
 "2 Artist Names",
 "Custom Label Name",
 "Advanced Analytics",
 "Priority Support (24-hour response)",
 "Faster Delivery (24-48 hours)",
 "Spotify for Artists Verification",
 "Weekly Payouts",
 "Content ID Protection",
 "Editorial Playlist Pitching",
 "Scheduled Release Dates",
 "Revenue Splitting",
 "Advanced Release Analytics",
 ],
 },
 {
 id: "elite",
 name: "Elite",
 price: 80000,
 description: "For serious labels and teams",
 features: [
 "Everything in Pro",
 "5 Artist Names",
 "Bulk Upload Feature",
 "Label Management Dashboard",
 "Dedicated Account Manager",
 "Fastest Delivery (24 hours)",
 "Custom Label Landing Page",
 "Priority Editorial Pitching",
 "Advanced Revenue Splits",
 "Telegram/TikTok Distribution",
 "Daily Analytics Updates",
 "API Access",
 "White-Label Options",
 "Custom Contracts",
 "Priority Release Review",
 ],
 },
 ]

 return (
 <>
 <Header title="Choose Your Plan" />
 <main className="flex-1 overflow-y-auto bg-[#FFF8E7] p-6">
 <div className="mx-auto max-w-7xl">
 {/* Header */}
 <div className="mb-8 text-center">
 <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
 Select Your Distribution Plan
 </h1>
 <p className="mt-4 text-lg text-muted-foreground">
 Choose the perfect plan for your music distribution needs. All plans are valid for 1 year.
 </p>
 </div>

 {/* Active Subscription Notice */}
 {hasActiveSubscription && (
 <div className="mb-8 border border-border bg-success/10 p-6">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="font-semibold text-success">You have an active {subscription.plan} plan</h3>
 <p className="mt-1 text-sm text-muted-foreground">
 Your plan is valid until {new Date(subscription.end_date).toLocaleDateString("en-NG", {
 year: "numeric",
 month: "long",
 day: "numeric",
 })}
 </p>
 </div>
 <div className="flex gap-3">
 <Link
 href="/dashboard"
 className="inline-flex items-center border border-border bg-background px-4 py-2 text-sm font-medium hover:border-[#E7B900]"
 >
 Go to Dashboard
 </Link>
 </div>
 </div>
 </div>
 )}

 {/* Pricing Cards */}
 <div className="grid gap-8 lg:grid-cols-3">
 {plans.map((plan) => (
 <div
 key={plan.id}
 className={`border bg-white p-8 shadow-sm ${
 plan.popular ? "border-2 border-[#E7B900] shadow-md" : "border-border"
 }`}
 >
 {plan.popular && (
 <div className="mb-4 flex items-center justify-between">
 <span className="bg-[#E7B900] px-3 py-1 text-xs font-bold text-black">
 POPULAR
 </span>
 </div>
 )}

 <div className="mb-4">
 <h3 className="text-xl font-bold">{plan.name}</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 {plan.description}
 </p>
 </div>

 <div className="mb-6">
 <span className="text-4xl font-bold">₦{plan.price.toLocaleString()}</span>
 <span className="text-muted-foreground">/year</span>
 </div>

 <ul className="mb-8 space-y-3">
 {plan.features.map((feature, index) => (
 <li key={index} className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm">{feature}</span>
 </li>
 ))}
 </ul>

 <Link
 href={`/subscription/checkout?plan=${plan.id}`}
 className={plan.popular
 ? "block w-full text-center px-4 py-3 text-sm font-semibold bg-[#E7B900] text-black hover:bg-[#d4a800]"
 : "block w-full text-center px-4 py-3 text-sm font-semibold border-2 border-border bg-background hover:border-[#E7B900]"
 }
 >
 {hasActiveSubscription ? "Switch Plan" : "Get Started"}
 </Link>
 </div>
 ))}
 </div>

 {/* Feature Comparison */}
 <div className="mt-16">
 <h2 className="text-center text-2xl font-bold">Compare Plans</h2>
 <div className="mt-8 overflow-x-auto">
 <table className="w-full border border-border bg-white">
 <thead>
 <tr className="border-b border-border">
 <th className="border-r border-border p-4 text-left">Feature</th>
 <th className="border-r border-border p-4 text-center">Starter</th>
 <th className="border-r border-border p-4 text-center">Pro</th>
 <th className="p-4 text-center">Elite</th>
 </tr>
 </thead>
 <tbody>
 <tr className="border-b border-border">
 <td className="border-r border-border p-4 font-medium">Artist Names</td>
 <td className="border-r border-border p-4 text-center">1</td>
 <td className="border-r border-border p-4 text-center">2</td>
 <td className="p-4 text-center">5</td>
 </tr>
 <tr className="border-b border-border">
 <td className="border-r border-border p-4 font-medium">Uploads</td>
 <td className="border-r border-border p-4 text-center">Unlimited</td>
 <td className="border-r border-border p-4 text-center">Unlimited</td>
 <td className="p-4 text-center">Unlimited + Bulk</td>
 </tr>
 <tr className="border-b border-border">
 <td className="border-r border-border p-4 font-medium">Delivery Time</td>
 <td className="border-r border-border p-4 text-center">48-72 hours</td>
 <td className="border-r border-border p-4 text-center">24-48 hours</td>
 <td className="p-4 text-center">24 hours</td>
 </tr>
 <tr className="border-b border-border">
 <td className="border-r border-border p-4 font-medium">Payouts</td>
 <td className="border-r border-border p-4 text-center">Monthly</td>
 <td className="border-r border-border p-4 text-center">Weekly</td>
 <td className="p-4 text-center">Weekly</td>
 </tr>
 <tr className="border-b border-border">
 <td className="border-r border-border p-4 font-medium">Support</td>
 <td className="border-r border-border p-4 text-center">Email (48h)</td>
 <td className="border-r border-border p-4 text-center">Priority (24h)</td>
 <td className="p-4 text-center">Dedicated Manager</td>
 </tr>
 <tr>
 <td className="border-r border-border p-4 font-medium">Label Name</td>
 <td className="border-r border-border p-4 text-center">-</td>
 <td className="border-r border-border p-4 text-center">✓</td>
 <td className="p-4 text-center">✓</td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 </div>
 </main>
 </>
 )
}
