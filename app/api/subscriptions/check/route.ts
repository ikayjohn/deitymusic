import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
 try {
 const supabase = await createClient()

 const { data: { user } } = await supabase.auth.getUser()

 if (!user) {
 return NextResponse.json(
 { hasSubscription: false, error: "Not authenticated" },
 { status: 401 }
 )
 }

 // Check for active subscription
 const { data: subscription } = await supabase
 .from("subscriptions")
 .select("*")
 .eq("user_id", user.id)
 .eq("status", "ACTIVE")
 .gte("end_date", new Date().toISOString())
 .order("created_at", { ascending: false })
 .limit(1)
 .single()

 const hasActiveSubscription = subscription && new Date((subscription as any).end_date) > new Date()

 return NextResponse.json({
 hasSubscription: hasActiveSubscription,
 subscription: hasActiveSubscription ? {
 plan: (subscription as any).plan,
 endDate: (subscription as any).end_date,
 startDate: (subscription as any).start_date,
 } : null,
 })
 } catch (error) {
 console.error("Error checking subscription:", error)
 return NextResponse.json(
 { hasSubscription: false, error: "Failed to check subscription" },
 { status: 500 }
 )
 }
}
