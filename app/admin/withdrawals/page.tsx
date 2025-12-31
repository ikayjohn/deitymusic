"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import type { WithdrawalRequestAdmin } from "@/lib/validations/admin"
import { formatCurrencyUSD, formatCurrencyNGN } from "@/lib/validations/admin"

export default function AdminWithdrawalsPage() {
 const [withdrawals, setWithdrawals] = useState<WithdrawalRequestAdmin[]>([])
 const [loading, setLoading] = useState(true)
 const [filter, setFilter] = useState<string>("")
 const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequestAdmin | null>(null)
 const [showActionModal, setShowActionModal] = useState(false)
 const [actionType, setActionType] = useState<"APPROVE" | "REJECT" | "PROCESS">("APPROVE")
 const [reason, setReason] = useState("")
 const [reference, setReference] = useState("")

 useEffect(() => {
 fetchWithdrawals()
 }, [filter])

 const fetchWithdrawals = async () => {
 setLoading(true)
 try {
 const params = new URLSearchParams()
 if (filter) params.append("status", filter)

 const response = await fetch(`/api/admin/withdrawals?${params}`)
 const data = await response.json()
 setWithdrawals(data.withdrawals || [])
 } catch (error) {
 console.error("Failed to fetch withdrawals:", error)
 } finally {
 setLoading(false)
 }
 }

 const handleAction = async () => {
 if (!selectedWithdrawal) return

 try {
 const response = await fetch("/api/admin/withdrawals", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 withdrawalId: selectedWithdrawal.id,
 action: actionType,
 reason,
 reference,
 }),
 })

 if (response.ok) {
 alert(`Withdrawal ${actionType.toLowerCase()} successfully`)
 setShowActionModal(false)
 setSelectedWithdrawal(null)
 setReason("")
 setReference("")
 fetchWithdrawals()
 }
 } catch (error) {
 console.error("Failed to process action:", error)
 }
 }

 if (loading) {
 return (
 <div className="flex min-h-[400px] items-center justify-center">
 <div className="text-center">
 <div className="inline-block h-8 w-8 animate-spin border-4 border-solid border-primary border-r-transparent" />
 <p className="mt-4 text-sm text-muted-foreground">Loading withdrawals...</p>
 </div>
 </div>
 )
 }

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <h1 className="text-3xl font-bold">Withdrawal Requests</h1>
 <p className="text-muted-foreground">
 Review and process user withdrawal requests
 </p>
 </div>

 <select
 value={filter}
 onChange={(e) => setFilter(e.target.value)}
 className="border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 >
 <option value="">All Status</option>
 <option value="PENDING">Pending</option>
 <option value="PROCESSING">Processing</option>
 <option value="COMPLETED">Completed</option>
 <option value="REJECTED">Rejected</option>
 </select>
 </div>

 {/* Withdrawals Table */}
 <div className="border border-border bg-background shadow-sm overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="border-b border-border bg-muted/30">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Request ID
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 User
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Amount
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Method
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Details
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Status
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Requested
 </th>
 <th className="px-6 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
 Actions
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {withdrawals.length === 0 ? (
 <tr>
 <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
 No withdrawal requests found
 </td>
 </tr>
 ) : (
 withdrawals.map((withdrawal) => (
 <tr key={withdrawal.id} className="hover:bg-muted/30">
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
 {withdrawal.id}
 </td>
 <td className="px-6 py-4 text-sm">
 <p className="font-medium">{withdrawal.userName}</p>
 <p className="text-xs text-muted-foreground">{withdrawal.userEmail}</p>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
 {formatCurrencyUSD(withdrawal.amount)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 {withdrawal.paymentMethod.replace(/_/g, " ")}
 </td>
 <td className="px-6 py-4 text-sm text-muted-foreground">
 {withdrawal.paymentDetails.email && (
 <p>{withdrawal.paymentDetails.email}</p>
 )}
 {withdrawal.paymentDetails.accountHolderName && (
 <p>
 {withdrawal.paymentDetails.accountHolderName}
 {withdrawal.paymentDetails.last4Digits &&
 ` (****${withdrawal.paymentDetails.last4Digits})`}
 </p>
 )}
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span
 className={`inline-flex px-2 py-1 text-xs font-medium ${
 withdrawal.status === "PENDING"
 ? "bg-warning/10 text-warning"
 : withdrawal.status === "PROCESSING"
 ? "bg-info/10 text-info"
 : withdrawal.status === "COMPLETED"
 ? "bg-success/10 text-success"
 : "bg-destructive/10 text-destructive"
 }`}
 >
 {withdrawal.status}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
 {new Date(withdrawal.requestedAt).toLocaleDateString()}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
 <WithdrawalActions
 withdrawal={withdrawal}
 onAction={(w, action) => {
 setSelectedWithdrawal(w)
 setActionType(action)
 setShowActionModal(true)
 }}
 />
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Action Modal */}
 {showActionModal && selectedWithdrawal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
 <div className="w-full max-w-md border border-border bg-background p-6 shadow-lg">
 <h3 className="text-lg font-semibold">
 {actionType === "APPROVE"
 ? "Approve Withdrawal"
 : actionType === "PROCESS"
 ? "Mark as Completed"
 : "Reject Withdrawal"}
 </h3>
 <p className="mt-2 text-sm text-muted-foreground">
 {formatCurrencyUSD(selectedWithdrawal.amount)} requested by{" "}
 {selectedWithdrawal.userName}
 </p>

 {(actionType === "REJECT" || actionType === "PROCESS") && (
 <div className="mt-4">
 <label className="block text-sm font-medium mb-2">
 {actionType === "PROCESS" ? "Reference Number" : "Reason"}
 </label>
 <textarea
 value={reason}
 onChange={(e) => setReason(e.target.value)}
 placeholder={
 actionType === "PROCESS"
 ? "Enter transaction reference..."
 : "Provide a reason for rejection..."
 }
 rows={3}
 className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 />
 </div>
 )}

 <div className="mt-6 flex justify-end gap-2">
 <button
 onClick={() => {
 setShowActionModal(false)
 setReason("")
 setReference("")
 setSelectedWithdrawal(null)
 }}
 className="border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
 >
 Cancel
 </button>
 <button
 onClick={handleAction}
 className={` px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 ${
 actionType === "REJECT"
 ? "bg-destructive"
 : actionType === "PROCESS"
 ? "bg-success"
 : "bg-primary"
 }`}
 >
 Confirm
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 )
}

function WithdrawalActions({
 withdrawal,
 onAction,
}: {
 withdrawal: WithdrawalRequestAdmin
 onAction: (w: WithdrawalRequestAdmin, action: "APPROVE" | "REJECT" | "PROCESS") => void
}) {
 if (withdrawal.status === "PENDING") {
 return (
 <div className="flex justify-end gap-2">
 <button
 onClick={() => onAction(withdrawal, "APPROVE")}
 className="bg-success px-3 py-1 text-xs font-medium text-success-foreground hover:bg-success/90"
 >
 Approve
 </button>
 <button
 onClick={() => onAction(withdrawal, "REJECT")}
 className="border border-destructive bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/20"
 >
 Reject
 </button>
 </div>
 )
 }

 if (withdrawal.status === "PROCESSING") {
 return (
 <button
 onClick={() => onAction(withdrawal, "PROCESS")}
 className="bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
 >
 Mark Complete
 </button>
 )
 }

 return <span className="text-muted-foreground">—</span>
}
