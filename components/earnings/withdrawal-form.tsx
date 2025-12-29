"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type {
 PayoutThreshold,
 BalanceOverview,
} from "@/lib/validations/earnings"
import {
 withdrawalRequestSchema,
 formatCurrencyUSD,
 formatCurrencyNGN,
 PaymentMethod,
 getExchangeRate,
 convertUSDToNGN,
} from "@/lib/validations/earnings"

const withdrawalFormSchema = withdrawalRequestSchema.extend({
 confirmAmount: z.boolean().refine((val) => val === true, {
 message: "You must confirm the withdrawal amount",
 }),
})

type WithdrawalFormValues = z.infer<typeof withdrawalFormSchema>

interface WithdrawalFormProps {
 balance: BalanceOverview
 payoutThreshold: PayoutThreshold
 onSuccess?: () => void
}

export function WithdrawalForm({
 balance,
 payoutThreshold,
 onSuccess,
}: WithdrawalFormProps) {
 const [isSubmitting, setIsSubmitting] = useState(false)
 const [exchangeRate, setExchangeRate] = useState<number>(1550)
 const [loadingRate, setLoadingRate] = useState(true)

 const canWithdraw =
 balance.availableForWithdrawal >= payoutThreshold.minimumWithdrawalUSD

 // Fetch live exchange rate on mount
 useEffect(() => {
 const fetchRate = async () => {
 setLoadingRate(true)
 const rate = await getExchangeRate()
 setExchangeRate(rate)
 setLoadingRate(false)
 }
 fetchRate()
 }, [])

 const {
 register,
 handleSubmit,
 formState: { errors },
 watch,
 setValue,
 } = useForm<WithdrawalFormValues>({
 resolver: zodResolver(withdrawalFormSchema),
 defaultValues: {
 amountUSD: Math.floor(balance.availableForWithdrawal),
 amountNGN: 0,
 exchangeRate,
 paymentMethod: PaymentMethod.BANK_TRANSFER,
 paymentDetails: {},
 confirmAmount: false,
 },
 })

 const watchedAmountUSD = watch("amountUSD")

 // Update NGN amount when USD amount changes
 useEffect(() => {
 if (watchedAmountUSD && exchangeRate) {
 const ngnAmount = convertUSDToNGN(watchedAmountUSD, exchangeRate)
 setValue("amountNGN", ngnAmount)
 setValue("exchangeRate", exchangeRate)
 }
 }, [watchedAmountUSD, exchangeRate, setValue])

 const onSubmit = async (data: WithdrawalFormValues) => {
 setIsSubmitting(true)

 try {
 const response = await fetch("/api/earnings/withdrawals", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(data),
 })

 if (!response.ok) {
 const error = await response.json()
 throw new Error(error.error || "Failed to submit withdrawal request")
 }

 const result = await response.json()

 alert(result.message)
 onSuccess?.()
 } catch (error) {
 console.error("Withdrawal error:", error)
 alert(
 error instanceof Error
 ? error.message
 : "Failed to submit withdrawal request"
 )
 } finally {
 setIsSubmitting(false)
 }
 }

 if (!canWithdraw) {
 return (
 <div className="border border-border bg-background p-8 text-center shadow-sm">
 <div className="mx-auto flex h-16 w-16 items-center justify-center bg-muted">
 <svg
 className="h-8 w-8 text-muted-foreground"
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
 />
 </svg>
 </div>
 <h3 className="mt-4 text-lg font-semibold">
 Insufficient Balance for Withdrawal
 </h3>
 <p className="mt-2 text-sm text-muted-foreground">
 You need at least {formatCurrencyUSD(payoutThreshold.minimumWithdrawalUSD)}{" "}
 to request a withdrawal. Your current balance is{" "}
 {formatCurrencyUSD(balance.availableForWithdrawal)}.
 </p>
 </div>
 )
 }

 return (
 <div className="border border-border bg-background p-6 shadow-sm">
 <h3 className="text-lg font-semibold mb-4">Request Withdrawal</h3>

 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
 {/* Amount Input */}
 <div>
 <label className="block text-sm font-medium mb-2">
 Withdrawal Amount (USD)
 </label>
 <div className="relative">
 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
 $
 </span>
 <input
 type="number"
 step="0.01"
 min={payoutThreshold.minimumWithdrawalUSD}
 max={balance.availableForWithdrawal}
 className="w-full border border-input bg-background pl-7 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
 {...register("amountUSD", { valueAsNumber: true })}
 />
 </div>
 {errors.amountUSD && (
 <p className="mt-1 text-sm text-destructive">
 {errors.amountUSD.message}
 </p>
 )}

 {/* Exchange Rate Display */}
 <div className="mt-2 p-3 bg-muted/30">
 <div className="flex items-center justify-between text-sm">
 <span className="text-muted-foreground">
 Exchange Rate {loadingRate ? "(Loading...)" : ""}
 </span>
 <span className="font-medium">1 USD = {exchangeRate.toFixed(2)} NGN</span>
 </div>
 <div className="flex items-center justify-between mt-1">
 <span className="text-muted-foreground text-sm">You will receive:</span>
 <span className="text-lg font-bold text-success">
 {formatCurrencyNGN(convertUSDToNGN(watchedAmountUSD || 0, exchangeRate))}
 </span>
 </div>
 </div>

 <p className="mt-2 text-xs text-muted-foreground">
 Available: {formatCurrencyUSD(balance.availableForWithdrawal)} |
 Min: {formatCurrencyUSD(payoutThreshold.minimumWithdrawalUSD)}
 </p>
 </div>

 {/* Payment Method Selection */}
 <div>
 <label className="block text-sm font-medium mb-2">
 Payment Method
 </label>
 <div className="border-2 border-primary bg-primary/5 p-4">
 <div className="flex items-center gap-3">
 <span className="text-2xl">🏦</span>
 <div>
 <p className="font-medium">Bank Transfer</p>
 <p className="text-xs text-muted-foreground">Transfer to your Nigerian bank account</p>
 </div>
 </div>
 </div>
 <input type="hidden" {...register("paymentMethod")} />
 </div>

 {/* Payment Details */}
 <div>
 <label className="block text-sm font-medium mb-2">
 Bank Account Details
 </label>
 <div className="border border-border bg-muted/30 p-4 space-y-4">
 <div>
 <label className="block text-sm text-muted-foreground mb-1">
 Account Holder Name *
 </label>
 <input
 type="text"
 placeholder="John Doe"
 className="w-full border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
 {...register("paymentDetails.accountHolderName")}
 />
 {errors.paymentDetails?.accountHolderName && (
 <p className="mt-1 text-sm text-destructive">
 {errors.paymentDetails.accountHolderName.message}
 </p>
 )}
 </div>
 <div className="grid gap-4 sm:grid-cols-2">
 <div>
 <label className="block text-sm text-muted-foreground mb-1">
 Account Number *
 </label>
 <input
 type="text"
 placeholder="1234567890"
 className="w-full border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
 {...register("paymentDetails.accountNumber")}
 />
 {errors.paymentDetails?.accountNumber && (
 <p className="mt-1 text-sm text-destructive">
 {errors.paymentDetails.accountNumber.message}
 </p>
 )}
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">
 Bank Name *
 </label>
 <select
 className="w-full border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
 {...register("paymentDetails.bankName")}
 >
 <option value="">Select Bank</option>
 <option value="Access Bank">Access Bank</option>
 <option value="Citibank Nigeria">Citibank Nigeria</option>
 <option value="Ecobank Nigeria">Ecobank Nigeria</option>
 <option value="Fidelity Bank">Fidelity Bank</option>
 <option value="First Bank of Nigeria">First Bank</option>
 <option value="First City Monument Bank">FCMB</option>
 <option value="Guaranty Trust Bank">GTBank</option>
 <option value="Heritage Bank">Heritage Bank</option>
 <option value="Jaiz Bank">Jaiz Bank</option>
 <option value="Keystone Bank">Keystone Bank</option>
 <option value="Kuda Bank">Kuda Bank</option>
 <option value="Polaris Bank">Polaris Bank</option>
 <option value="Stanbic IBTC">Stanbic IBTC</option>
 <option value="Standard Chartered">Standard Chartered</option>
 <option value="Sterling Bank">Sterling Bank</option>
 <option value="Union Bank of Nigeria">Union Bank</option>
 <option value="United Bank for Africa">UBA</option>
 <option value="Unity Bank">Unity Bank</option>
 <option value="Wema Bank">Wema Bank</option>
 <option value="Zenith Bank">Zenith Bank</option>
 </select>
 {errors.paymentDetails?.bankName && (
 <p className="mt-1 text-sm text-destructive">
 {errors.paymentDetails.bankName.message}
 </p>
 )}
 </div>
 </div>
 </div>
 </div>

 {/* Confirmation */}
 <div className="border border-info/50 bg-info/5 p-4">
 <div className="flex items-start gap-3">
 <input
 type="checkbox"
 id="confirmAmount"
 className="mt-1h-4 w-4 border-input text-primary focus:ring-ring"
 {...register("confirmAmount")}
 />
 <div>
 <label
 htmlFor="confirmAmount"
 className="block text-sm font-medium cursor-pointer"
 >
 I confirm that I want to withdraw{" "}
 {formatCurrencyUSD(watchedAmountUSD || 0)} (
 {formatCurrencyNGN(convertUSDToNGN(watchedAmountUSD || 0, exchangeRate))})
 </label>
 <p className="mt-1 text-xs text-muted-foreground">
 This action cannot be undone. Funds will be transferred within{" "}
 {payoutThreshold.processingTime}.
 </p>
 {errors.confirmAmount && (
 <p className="mt-1 text-sm text-destructive">
 {errors.confirmAmount.message}
 </p>
 )}
 </div>
 </div>
 </div>

 {/* Submit Button */}
 <button
 type="submit"
 disabled={isSubmitting || loadingRate}
 className="w-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
 >
 {isSubmitting ? "Submitting..." : "Submit Withdrawal Request"}
 </button>
 </form>
 </div>
 )
}
