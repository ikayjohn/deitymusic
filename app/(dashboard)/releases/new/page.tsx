import { Header } from "@/components/layout/header"
import { ReleaseFormWizard } from "@/components/forms/release-form/release-form-wizard"
import { SubscriptionPrompt } from "@/components/subscription-prompt"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function NewReleasePage() {
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

 // If no active subscription, show upgrade prompt
 if (!hasActiveSubscription) {
 return (
 <>
 <Header title="Upgrade Required" />
 <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
 <div className="mx-auto max-w-7xl space-y-6">
 {/* Breadcrumb */}
 <div className="flex items-center gap-2 text-sm text-muted-foreground">
 <a href="/releases" className="hover:text-foreground">
 Releases
 </a>
 <span>/</span>
 <span className="text-foreground">New Release</span>
 </div>

 <SubscriptionPrompt />
 </div>
 </main>
 </>
 )
 }

 return (
 <>
 <Header title="New Release" />
 <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
 <div className="mx-auto max-w-7xl space-y-6">
 {/* Breadcrumb */}
 <div className="flex items-center gap-2 text-sm text-muted-foreground">
 <a href="/releases" className="hover:text-foreground">
 Releases
 </a>
 <span>/</span>
 <span className="text-foreground">New Release</span>
 </div>

 {/* Subscription Info */}
 {subscription && (
 <div className="border border-success/50 bg-success/10 p-4">
 <div className="flex items-center justify-between">
 <div>
 <p className="font-semibold text-success">
 Active {subscription.plan} Plan
 </p>
 <p className="text-sm text-muted-foreground">
 Valid until {new Date(subscription.end_date).toLocaleDateString()}
 </p>
 </div>
 <a
 href="/subscription"
 className="text-sm text-blue-600 hover:underline"
 >
 Manage Plan
 </a>
 </div>
 </div>
 )}

 {/* Form Wizard */}
 <ReleaseFormWizard />
 </div>
 </main>
 </>
 )
}
