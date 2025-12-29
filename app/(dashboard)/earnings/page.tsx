"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { BalanceOverviewCards } from "@/components/earnings/balance-overview"
import { RevenueBreakdown } from "@/components/earnings/revenue-breakdown"
import { TransactionHistory } from "@/components/earnings/transaction-history"
import { WithdrawalForm } from "@/components/earnings/withdrawal-form"
import type { DetailedEarnings } from "@/lib/validations/earnings"

export default function EarningsPage() {
 const [earnings, setEarnings] = useState<DetailedEarnings | null>(null)
 const [loading, setLoading] = useState(true)
 const [showWithdrawalForm, setShowWithdrawalForm] = useState(false)

 useEffect(() => {
 fetchEarnings()
 }, [])

 const fetchEarnings = async () => {
 setLoading(true)

 try {
 const response = await fetch("/api/earnings")
 const data = await response.json()
 setEarnings(data)
 } catch (error) {
 console.error("Failed to fetch earnings:", error)
 } finally {
 setLoading(false)
 }
 }

 if (loading) {
 return (
 <>
 <Header title="Earnings" />
 <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
 <div className="mx-auto max-w-7xl">
 <div className="flex min-h-[400px] items-center justify-center">
 <div className="text-center">
 <div className="inline-block h-8 w-8 animate-spin border-4 border-solid border-primary border-r-transparent" />
 <p className="mt-4 text-sm text-muted-foreground">Loading earnings...</p>
 </div>
 </div>
 </div>
 </main>
 </>
 )
 }

 if (!earnings) {
 return (
 <>
 <Header title="Earnings" />
 <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
 <div className="mx-auto max-w-7xl">
 <div className="bg-white border border-border p-12 text-center shadow-sm">
 <svg className="mx-auto h-16 w-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 <h3 className="mt-4 text-lg font-semibold">No Earnings Available</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 Once your releases go live and start generating streams, you'll see your earnings here.
 </p>
 </div>
 </div>
 </main>
 </>
 )
 }

 return (
 <>
 <Header title="Earnings" />
 <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
 <div className="mx-auto max-w-7xl space-y-6">
 {/* Header */}
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <h2 className="text-2xl font-bold">Earnings & Payouts</h2>
 <p className="text-muted-foreground">
 Track your revenue and request withdrawals
 </p>
 </div>

 {!showWithdrawalForm && (
 <button
 onClick={() => setShowWithdrawalForm(true)}
 className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-black"
 >
 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 Request Withdrawal
 </button>
 )}
 </div>

 {/* Balance Overview */}
 <BalanceOverviewCards
 balance={earnings.overview}
 payoutThreshold={earnings.payoutThreshold}
 />

 {/* Withdrawal Form */}
 {showWithdrawalForm && (
 <div className="flex justify-end">
 <div className="w-full max-w-2xl">
 <WithdrawalForm
 balance={earnings.overview}
 payoutThreshold={earnings.payoutThreshold}
 onSuccess={() => {
 setShowWithdrawalForm(false)
 fetchEarnings()
 }}
 />
 <button
 onClick={() => setShowWithdrawalForm(false)}
 className="mt-4 text-sm text-muted-foreground hover:text-foreground"
 >
 Cancel
 </button>
 </div>
 </div>
 )}

 {/* Revenue Breakdown */}
 <div>
 <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
 <RevenueBreakdown
 byRelease={earnings.byRelease}
 byPlatform={earnings.byPlatform}
 />
 </div>

 {/* Transaction History */}
 <div>
 <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
 <TransactionHistory transactions={earnings.recentTransactions} />
 </div>
 </div>
 </main>
 </>
 )
}
