import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function VerifyPaymentPage({
 searchParams,
}: {
 searchParams: { reference?: string; plan?: string }
}) {
 const supabase = await createClient()

 const { data: { user } } = await supabase.auth.getUser()

 if (!user) {
 redirect("/login")
 }

 const reference = searchParams.reference
 const plan = searchParams.plan || "starter"

 if (!reference) {
 redirect("/subscription")
 }

 // Check if subscription is activated (webhook may have already processed it)
 const { data: subscription } = await supabase
 .from("subscriptions")
 .select("*")
 .eq("payment_reference", reference)
 .order("created_at", { ascending: false })
 .limit(1)
 .maybeSingle()

 const isActivated = (subscription as any)?.status === "ACTIVE"

 if (isActivated) {
 // Payment successful, redirect to success page
 redirect(`/subscription/success?plan=${plan}&ref=${reference}`)
 }

 // If not activated yet, show loading/checking state
 // The webhook might still be processing
 return (
 <>
 <Header title="Verifying Payment" />
 <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
 <div className="mx-auto max-w-2xl">
 <div className="border border-border bg-background p-8 text-center shadow-sm">
 {/* Loading Icon */}
 <div className="mb-6 flex justify-center">
 <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
 <svg className="h-10 w-10 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
 <circle
 className="opacity-25"
 cx="12"
 cy="12"
 r="10"
 stroke="currentColor"
 strokeWidth="4"
 />
 <path
 className="opacity-75"
 fill="currentColor"
 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
 />
 </svg>
 </div>
 </div>

 <h1 className="mb-2 text-2xl font-bold">Verifying Your Payment</h1>
 <p className="mb-6 text-muted-foreground">
 Please wait while we confirm your payment...
 </p>

 <p className="text-sm text-muted-foreground">
 Reference: <code className="bg-muted px-2 py-1">{reference}</code>
 </p>

 <div className="mt-8">
 <Link
 href="/subscription"
 className="inline-flex items-center border-2 border-border bg-background px-6 py-2 text-sm font-semibold hover:border-[#E7B900]"
 >
 Back to Plans
 </Link>
 </div>
 </div>
 </div>
 </main>
 </>
 )
}
