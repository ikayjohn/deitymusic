"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"

const PLAN_PRICES: Record<string, number> = {
 starter: 10000,
 pro: 25000,
 elite: 80000,
}

const PLAN_NAMES: Record<string, string> = {
 starter: "Starter",
 pro: "Pro",
 elite: "Elite",
}

declare global {
 interface Window {
 PaystackPop?: {
 setup(options: any): {
 openIFrame(): void
 close(): void
 }
 }
 }
}

export default function CheckoutPage() {
 const router = useRouter()
 const searchParams = useSearchParams()

 const plan = searchParams.get("plan") || "starter"
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState<string | null>(null)

 const planName = PLAN_NAMES[plan]
 const planPrice = PLAN_PRICES[plan]

 useEffect(() => {
 // Validate plan
 if (!plan || !PLAN_PRICES[plan]) {
 router.push("/subscription")
 }
 }, [plan, router])

 useEffect(() => {
 // Load Paystack inline script
 const script = document.createElement("script")
 script.src = "https://js.paystack.co/v1/inline.js"
 script.async = true
 document.body.appendChild(script)

 return () => {
 if (script.parentNode) {
 script.parentNode.removeChild(script)
 }
 }
 }, [])

 const handlePayment = async () => {
 setLoading(true)
 setError(null)

 try {
 // Initialize payment with our API
 const response = await fetch("/api/payments/initialize", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({ plan }),
 })

 const data = await response.json()

 if (!response.ok) {
 throw new Error(data.error || "Failed to initialize payment")
 }

 // Open Paystack popup
 if (window.PaystackPop && data.authorization_url) {
 const paystackHandler = window.PaystackPop.setup({
 key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_xxxx",
 amount: planPrice * 100,
 ref: data.reference,
 access_code: data.access_code,
 onClose: () => {
 setLoading(false)
 },
 callback: (response: any) => {
 router.push(`/subscription/verify?reference=${response.reference}&plan=${plan}`)
 },
 })

 paystackHandler.openIFrame()
 } else {
 throw new Error("Paystack payment handler not available")
 }
 } catch (err) {
 console.error("Payment error:", err)
 setError(err instanceof Error ? err.message : "Payment initialization failed. Please try again.")
 setLoading(false)
 }
 }

 return (
 <>
 <Header title="Checkout" />
 <main className="flex-1 overflow-y-auto bg-[#FFF8E7] p-6">
 <div className="mx-auto max-w-2xl">
 {/* Breadcrumb */}
 <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
 <Link href="/subscription" className="hover:text-foreground">
 Plans
 </Link>
 <span>/</span>
 <span className="text-foreground">Checkout</span>
 </div>

 {/* Header */}
 <div className="mb-8">
 <h1 className="text-3xl font-bold">Complete Your Purchase</h1>
 <p className="mt-2 text-muted-foreground">
 You're subscribing to the <strong>{planName}</strong> plan
 </p>
 </div>

 {/* Order Summary */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
 <div className="flex justify-between border-b border-border pb-4">
 <span>Plan</span>
 <span className="font-semibold">{planName}</span>
 </div>
 <div className="mt-4 flex justify-between border-b border-border pb-4">
 <span>Duration</span>
 <span className="font-semibold">1 Year</span>
 </div>
 <div className="mt-4 flex justify-between border-b border-border pb-4">
 <span>Payment Method</span>
 <span className="font-semibold">Paystack (Card, Bank Transfer, USSD, etc.)</span>
 </div>
 <div className="mt-4 flex justify-between">
 <span className="text-lg font-semibold">Total</span>
 <span className="text-lg font-bold">₦{planPrice.toLocaleString()}</span>
 </div>
 </div>

 {/* Payment Info */}
 <div className="mt-6 border border-border bg-background p-6 shadow-sm">
 <h2 className="mb-4 text-lg font-semibold">Secure Payment</h2>
 <p className="mb-4 text-sm text-muted-foreground">
 You will be redirected to Paystack's secure payment page where you can pay using:
 </p>
 <ul className="space-y-2 text-sm">
 <li className="flex items-center gap-2">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Credit/Debit Card
 </li>
 <li className="flex items-center gap-2">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Bank Transfer
 </li>
 <li className="flex items-center gap-2">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 USSD
 </li>
 <li className="flex items-center gap-2">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 Mobile Money
 </li>
 <li className="flex items-center gap-2">
 <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 QR Code
 </li>
 </ul>

 {error && (
 <div className="mt-4 bg-error/10 p-4 text-sm text-error">
 {error}
 </div>
 )}

 <button
 onClick={handlePayment}
 disabled={loading}
 className="mt-6 w-full bg-[#E7B900] px-4 py-3 text-sm font-semibold text-black hover:bg-[#d4a800] disabled:cursor-not-allowed disabled:opacity-50"
 >
 {loading ? "Initializing..." : `Pay ₦${planPrice.toLocaleString()}`}
 </button>
 </div>

 {/* Security Note */}
 <div className="mt-6 border border-border bg-background p-4 text-center">
 <p className="text-xs text-muted-foreground">
 🔒 Secured by Paystack. Your payment information is safe and encrypted.
 </p>
 </div>

 {/* Cancel */}
 <div className="mt-4 text-center">
 <Link
 href="/subscription"
 className="text-sm text-muted-foreground hover:text-foreground"
 >
 Cancel and return to plans
 </Link>
 </div>
 </div>
 </main>
 </>
 )
}
