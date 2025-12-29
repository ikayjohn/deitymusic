import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function SubscriptionSuccessPage({
 searchParams,
}: {
 searchParams: { plan?: string; ref?: string }
}) {
 const supabase = await createClient()

 const { data: { user } } = await supabase.auth.getUser()

 if (!user) {
 redirect("/login")
 }

 const plan = searchParams.plan || "starter"
 const paymentRef = searchParams.ref

 const planNames: Record<string, string> = {
 starter: "Starter",
 pro: "Pro",
 elite: "Elite",
 }

 const planName = planNames[plan] || "Starter"

 return (
 <>
 <Header title="Payment Successful" />
 <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
 <div className="mx-auto max-w-2xl">
 <div className="border border-border bg-background p-8 text-center shadow-sm">
 {/* Success Icon */}
 <div className="mb-6 flex justify-center">
 <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
 <svg className="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 </div>
 </div>

 {/* Success Message */}
 <h1 className="mb-2 text-3xl font-bold">Payment Successful!</h1>
 <p className="mb-6 text-muted-foreground">
 Congratulations! You're now subscribed to the <strong>{planName}</strong> plan.
 </p>

 {/* Plan Details */}
 <div className="mb-6 border border-border bg-muted/50 p-6">
 <h2 className="mb-4 font-semibold">Subscription Details</h2>
 <div className="space-y-2 text-left text-sm">
 <div className="flex justify-between">
 <span className="text-muted-foreground">Plan</span>
 <span className="font-semibold">{planName}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-muted-foreground">Duration</span>
 <span className="font-semibold">1 Year</span>
 </div>
 <div className="flex justify-between">
 <span className="text-muted-foreground">Reference</span>
 <span className="font-semibold">{paymentRef}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-muted-foreground">Status</span>
 <span className="font-semibold text-success">Active</span>
 </div>
 </div>
 </div>

 {/* CTA Buttons */}
 <div className="flex flex-col gap-4 sm:flex-row">
 <Link
 href="/releases/new"
 className="flex-1 inline-flex items-center justify-center bg-[#E7B900] px-6 py-3 text-sm font-semibold text-black hover:bg-[#d4a800]"
 >
 Start Uploading Music
 </Link>
 <Link
 href="/dashboard"
 className="flex-1 inline-flex items-center justify-center border-2 border-border bg-background px-6 py-3 text-sm font-semibold hover:border-[#E7B900]"
 >
 Go to Dashboard
 </Link>
 </div>

 {/* Next Steps */}
 <div className="mt-8 text-left">
 <h3 className="mb-3 font-semibold">What's Next?</h3>
 <ul className="space-y-2 text-sm text-muted-foreground">
 <li className="flex items-start gap-2">
 <svg className="h-5 w-5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span>Create your first release and upload your music</span>
 </li>
 <li className="flex items-start gap-2">
 <svg className="h-5 w-5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span>Your music will be distributed to 150+ platforms worldwide</span>
 </li>
 <li className="flex items-start gap-2">
 <svg className="h-5 w-5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span>Track your performance with our analytics dashboard</span>
 </li>
 <li className="flex items-start gap-2">
 <svg className="h-5 w-5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span>Keep 100% of your royalties - paid out monthly/weekly</span>
 </li>
 </ul>
 </div>
 </div>
 </div>
 </main>
 </>
 )
}
