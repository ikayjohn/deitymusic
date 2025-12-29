import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { initializeTransaction, PLAN_PRICES, PLAN_NAMES } from "@/lib/paystack"

export async function POST(request: NextRequest) {
 try {
 const body = await request.json()
 const { plan } = body

 if (!plan || !PLAN_PRICES[plan]) {
 return NextResponse.json(
 { error: "Invalid plan selected" },
 { status: 400 }
 )
 }

 const supabase = await createClient()

 // Get authenticated user
 const { data: { user }, error: authError } = await supabase.auth.getUser()

 if (authError || !user) {
 return NextResponse.json(
 { error: "Authentication required" },
 { status: 401 }
 )
 }

 // Check if user already has an active subscription
 const { data: existingSubscription } = await supabase
 .from("subscriptions")
 .select("*")
 .eq("user_id", user.id)
 .eq("status", "ACTIVE")
 .gte("end_date", new Date().toISOString())
 .order("created_at", { ascending: false })
 .limit(1)
 .maybeSingle()

 // Generate unique payment reference
 const reference = `DEITY_${user.id}_${PLAN_NAMES[plan]}_${Date.now()}`

 // Initialize Paystack transaction
 const paystackResponse = await initializeTransaction(
 user.email!,
 plan,
 reference,
 PLAN_PRICES[plan]
 )

 if (!paystackResponse.status) {
 console.error("Paystack initialization failed:", paystackResponse)
 return NextResponse.json(
 { error: "Failed to initialize payment. Please try again." },
 { status: 500 }
 )
 }

 // Store pending subscription (will be activated on webhook)
 const startDate = new Date()
 const endDate = new Date()
 endDate.setFullYear(endDate.getFullYear() + 1)

 // Create pending subscription record
 const { error: subError } = await supabase
 .from("subscriptions")
 .insert({
 user_id: user.id,
 plan: PLAN_NAMES[plan],
 status: "PENDING",
 start_date: startDate.toISOString(),
 end_date: endDate.toISOString(),
 amount: PLAN_PRICES[plan],
 currency: "NGN",
 payment_method: "Paystack",
 payment_reference: reference,
 })

 if (subError) {
 console.error("Failed to create pending subscription:", subError)
 // Continue anyway - we'll handle this in webhook
 }

 return NextResponse.json({
 success: true,
 authorization_url: paystackResponse.data.authorization_url,
 reference: paystackResponse.data.reference,
 access_code: paystackResponse.data.access_code,
 })
 } catch (error) {
 console.error("Payment initialization error:", error)
 return NextResponse.json(
 { error: "Failed to initialize payment" },
 { status: 500 }
 )
 }
}
