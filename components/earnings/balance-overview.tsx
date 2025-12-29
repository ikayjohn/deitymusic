"use client"

import type { BalanceOverview, PayoutThreshold } from "@/lib/validations/earnings"
import { formatCurrencyUSD, formatCurrencyNGN } from "@/lib/validations/earnings"

interface BalanceOverviewProps {
 balance: BalanceOverview
 payoutThreshold: PayoutThreshold
}

export function BalanceOverviewCards({
 balance,
 payoutThreshold,
}: BalanceOverviewProps) {
 const canWithdraw = balance.availableForWithdrawal >= payoutThreshold.minimumWithdrawalUSD
 const progressPercentage = Math.min(
 (balance.availableForWithdrawal / payoutThreshold.minimumWithdrawalUSD) * 100,
 100
 )

 return (
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 {/* Current Balance */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-muted-foreground">Current Balance</p>
 <p className="mt-2 text-2xl font-bold">
 {formatCurrencyUSD(balance.currentBalance)}
 </p>
 <p className="mt-1 text-xs text-muted-foreground">
 Available for withdrawal
 </p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center bg-success/10 text-success">
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </div>
 </div>
 </div>

 {/* Pending Balance */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-muted-foreground">Pending Balance</p>
 <p className="mt-2 text-2xl font-bold">
 {formatCurrencyUSD(balance.pendingBalance)}
 </p>
 <p className="mt-1 text-xs text-muted-foreground">
 Being processed
 </p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center bg-warning/10 text-warning">
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </div>
 </div>
 </div>

 {/* Lifetime Earnings */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-muted-foreground">Lifetime Earnings</p>
 <p className="mt-2 text-2xl font-bold">
 {formatCurrencyUSD(balance.lifetimeEarnings)}
 </p>
 <p className="mt-1 text-xs text-muted-foreground">
 Total revenue earned
 </p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center bg-primary/10 text-primary">
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
 </svg>
 </div>
 </div>
 </div>

 {/* Withdrawal Status */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div className="flex-1">
 <div className="flex items-center justify-between mb-2">
 <p className="text-sm text-muted-foreground">Withdrawal Status</p>
 {canWithdraw ? (
 <span className="inline-flex items-center bg-success/10 px-2 py-1 text-xs font-medium text-success">
 Available
 </span>
 ) : (
 <span className="inline-flex items-center bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
 Locked
 </span>
 )}
 </div>

 <div className="mb-2">
 <div className="flex items-center justify-between text-xs mb-1">
 <span className="text-muted-foreground">
 {formatCurrencyUSD(balance.availableForWithdrawal)} of {formatCurrencyUSD(payoutThreshold.minimumWithdrawalUSD)}
 </span>
 <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
 </div>
 <div className="h-2 w-full bg-muted overflow-hidden">
 <div
 className={canWithdraw ? "h-full bg-success" : "h-full bg-primary"}
 style={{ width: `${progressPercentage}%` }}
 />
 </div>
 </div>

 <p className="text-xs text-muted-foreground">
 Min: {formatCurrencyUSD(payoutThreshold.minimumWithdrawalUSD)} (~{formatCurrencyNGN(payoutThreshold.minimumWithdrawalNGN)})
 </p>
 </div>
 </div>
 </div>
 </div>
 )
}
