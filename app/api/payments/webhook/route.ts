import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
 try {
 const body = await request.text()
 const signature = request.headers.get("x-paystack-signature")

 if (!signature) {
 return NextResponse.json(
 { error: "No signature provided" },
 { status: 401 }
 )
 }

 // Verify webhook signature
 const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
 if (!paystackSecretKey) {
 console.error("PAYSTACK_SECRET_KEY not configured")
 return NextResponse.json(
 { error: "Server configuration error" },
 { status: 500 }
 )
 }

 // Calculate HMAC
 const hmac = crypto
 .createHmac("sha512", paystackSecretKey)
 .update(body)
 .digest("hex")

 if (hmac !== signature) {
 console.error("Invalid webhook signature")
 return NextResponse.json(
 { error: "Invalid signature" },
 { status: 401 }
 )
 }

 const event = JSON.parse(body)
 console.log("Paystack webhook received:", event.event)

 // Handle successful payment
 if (event.event === "charge.success") {
 const data = event.data

 // Extract metadata
 const plan = data.metadata?.plan
 const reference = data.reference

 if (!plan || !reference) {
 console.error("Missing metadata in webhook")
 return NextResponse.json(
 { error: "Invalid webhook data" },
 { status: 400 }
 )
 }

 const supabase = await createClient()

 // Find the pending subscription
 const { data: subscription, error: fetchError } = await supabase
 .from("subscriptions")
 .select("*")
 .eq("payment_reference", reference)
 .eq("status", "PENDING")
 .single()

 if (fetchError || !subscription) {
 console.error("Subscription not found:", reference)
 return NextResponse.json(
 { error: "Subscription not found" },
 { status: 404 }
 )
 }

 // Update subscription to ACTIVE
 const { error: updateError } = await supabase
 .from("subscriptions")
 .update({
 status: "ACTIVE",
 payment_method: "Paystack",
 })
 .eq("id", subscription.id)

 if (updateError) {
 console.error("Failed to activate subscription:", updateError)
 return NextResponse.json(
 { error: "Failed to activate subscription" },
 { status: 500 }
 )
 }

 console.log("Subscription activated:", subscription.id)
 }

 return NextResponse.json({ received: true }, { status: 200 })
 } catch (error) {
 console.error("Webhook processing error:", error)
 return NextResponse.json(
 { error: "Webhook processing failed" },
 { status: 500 }
 )
 }
}
