"use client"

import { useState } from "react"
import type { Transaction } from "@/lib/validations/earnings"
import {
 formatCurrencyUSD,
 getTransactionTypeLabel,
 TransactionType,
} from "@/lib/validations/earnings"

type TransactionTypeValue = typeof TransactionType[keyof typeof TransactionType]

interface TransactionHistoryProps {
 transactions: Transaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
 const [filter, setFilter] = useState<TransactionTypeValue | "ALL">("ALL")

 const filteredTransactions =
 filter === "ALL"
 ? transactions
 : transactions.filter((t) => t.type === filter)

 const transactionTypes: Array<TransactionTypeValue | "ALL"> = [
 "ALL",
 "EARNING",
 "WITHDRAWAL",
 "FEE",
 "ADJUSTMENT",
 ]

 return (
 <div className="border border-border bg-background shadow-sm">
 <div className="border-b border-border p-6">
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <h3 className="text-lg font-semibold">Transaction History</h3>

 {/* Filter */}
 <div className="flex items-center gap-2">
 <label className="text-sm text-muted-foreground">Filter:</label>
 <select
 value={filter}
 onChange={(e) =>
 setFilter(e.target.value as TransactionTypeValue | "ALL")
 }
 className="border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 >
 {transactionTypes.map((type) => (
 <option key={type} value={type}>
 {type === "ALL" ? "All Transactions" : getTransactionTypeLabel(type)}
 </option>
 ))}
 </select>
 </div>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="border-b border-border bg-muted/30">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Date
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Description
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Type
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Status
 </th>
 <th className="px-6 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
 Amount
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {filteredTransactions.length === 0 ? (
 <tr>
 <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
 No transactions found
 </td>
 </tr>
 ) : (
 filteredTransactions.map((transaction) => (
 <tr key={transaction.id} className="hover:bg-muted/30">
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 {new Date(transaction.createdAt).toLocaleDateString(
 "en-US",
 {
 month: "short",
 day: "numeric",
 year: "numeric",
 }
 )}
 </td>
 <td className="px-6 py-4 text-sm">
 <div>
 <p className="font-medium">{transaction.description}</p>
 {transaction.metadata?.releaseTitle && (
 <p className="text-xs text-muted-foreground">
 {transaction.metadata.releaseTitle}
 </p>
 )}
 {transaction.metadata?.platform && (
 <p className="text-xs text-muted-foreground">
 {transaction.metadata.platform}
 </p>
 )}
 </div>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 <span
 className={`inline-flex px-2 py-1 text-xs font-medium ${
 transaction.type === "EARNING"
 ? "bg-success/10 text-success"
 : transaction.type === "WITHDRAWAL"
 ? "bg-warning/10 text-warning"
 : "bg-muted text-muted-foreground"
 }`}
 >
 {getTransactionTypeLabel(transaction.type)}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 {transaction.status ? (
 <span className="inline-flex bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
 {transaction.status}
 </span>
 ) : (
 <span className="text-muted-foreground">—</span>
 )}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
 <span
 className={
 transaction.amount >= 0 ? "text-success" : "text-danger"
 }
 >
 {transaction.amount >= 0 ? "+" : ""}
 {formatCurrencyUSD(transaction.amount)}
 </span>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 )
}
