import paystack from 'paystack'

const paystackKey = process.env.PAYSTACK_SECRET_KEY

if (!paystackKey) {
 throw new Error('PAYSTACK_SECRET_KEY is not set in environment variables')
}

export const paystackInstance = paystack(paystackKey)

export const PLAN_PRICES: Record<string, number> = {
 starter: 10000,
 pro: 25000,
 elite: 80000,
}

export const PLAN_NAMES: Record<string, string> = {
 starter: "STARTER",
 pro: "PRO",
 elite: "ELITE",
}

export function initializeTransaction(email: string, plan: string, reference: string, amount: number) {
 return paystackInstance.transaction.initialize({
 email,
 amount: amount * 100, // Paystack expects amount in kobo (lowest currency unit)
 reference,
 metadata: {
 plan: plan.toUpperCase(),
 custom_fields: [
 {
 display_name: "Plan",
 variable_name: "plan",
 value: plan.toUpperCase(),
 },
 ],
 },
 callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription/verify`,
 })
}

export function verifyTransaction(reference: string) {
 return paystackInstance.transaction.verify(reference)
}
