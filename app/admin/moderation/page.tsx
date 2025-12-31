"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { ModerationItem } from "@/lib/validations/admin"
import {
 getModerationStatusColor,
 ModerationAction,
} from "@/lib/validations/admin"

type ModerationActionValue = typeof ModerationAction[keyof typeof ModerationAction]

export default function AdminModerationPage() {
 const [items, setItems] = useState<ModerationItem[]>([])
 const [loading, setLoading] = useState(true)
 const [filter, setFilter] = useState<string>("")
 const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null)
 const [showActionModal, setShowActionModal] = useState(false)
 const [actionType, setActionType] = useState<ModerationActionValue>(ModerationAction.APPROVED)
 const [reason, setReason] = useState("")

 useEffect(() => {
 fetchQueue()
 }, [filter])

 const fetchQueue = async () => {
 setLoading(true)
 try {
 const params = new URLSearchParams()
 if (filter) params.append("status", filter)

 const response = await fetch(`/api/admin/moderation?${params}`)
 const data = await response.json()
 setItems(data.items || [])
 } catch (error) {
 console.error("Failed to fetch moderation queue:", error)
 } finally {
 setLoading(false)
 }
 }

 const handleAction = async () => {
 if (!selectedItem) return

 try {
 const response = await fetch("/api/admin/moderation", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 itemId: selectedItem.id,
 action: actionType,
 reason,
 }),
 })

 if (response.ok) {
 alert(`Release ${actionType.toLowerCase()} successfully`)
 setShowActionModal(false)
 setSelectedItem(null)
 setReason("")
 fetchQueue()
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
 <p className="mt-4 text-sm text-muted-foreground">Loading moderation queue...</p>
 </div>
 </div>
 )
 }

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <h1 className="text-3xl font-bold">Moderation Queue</h1>
 <p className="text-muted-foreground">
 Review and approve releases before distribution
 </p>
 </div>

 <select
 value={filter}
 onChange={(e) => setFilter(e.target.value)}
 className="border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 >
 <option value="">All Status</option>
 <option value={ModerationAction.PENDING}>Pending</option>
 <option value={ModerationAction.NEEDS_CHANGES}>Needs Changes</option>
 <option value={ModerationAction.APPROVED}>Approved</option>
 <option value={ModerationAction.REJECTED}>Rejected</option>
 </select>
 </div>

 {/* Queue Items */}
 <div className="grid gap-4">
 {items.length === 0 ? (
 <div className="border border-border bg-background p-12 text-center shadow-sm">
 <p className="text-muted-foreground">No items in moderation queue</p>
 </div>
 ) : (
 items.map((item) => (
 <div
 key={item.id}
 className="border border-border bg-background p-6 shadow-sm"
 >
 <div className="flex gap-6">
 {/* Artwork */}
 {item.metadata?.artwork && (
 <Image
 src={item.metadata.artwork}
 alt={item.title}
 width={120}
 height={120}
 className="h-30 w-30 rounded object-cover"
 />
 )}

 {/* Content */}
 <div className="flex-1 space-y-4">
 <div className="flex items-start justify-between">
 <div>
 <h3 className="text-lg font-semibold">{item.title}</h3>
 <p className="text-sm text-muted-foreground">
 {item.userEmail} · {item.userName}
 </p>
 </div>
 <div className="flex items-center gap-2">
 <span
 className={`inline-flex px-3 py-1 text-xs font-medium ${getModerationStatusColor(item.status)}`}
 >
 {item.status}
 </span>
 <span
 className={`inline-flex px-3 py-1 text-xs font-medium ${
 item.priority === "URGENT"
 ? "bg-destructive/10 text-destructive"
 : item.priority === "HIGH"
 ? "bg-warning/10 text-warning"
 : "bg-muted text-muted-foreground"
 }`}
 >
 {item.priority}
 </span>
 </div>
 </div>

 {/* Metadata */}
 <div className="grid grid-cols-4 gap-4 text-sm">
 <div>
 <p className="text-muted-foreground">Type</p>
 <p className="font-medium">{item.metadata?.releaseType}</p>
 </div>
 <div>
 <p className="text-muted-foreground">Genre</p>
 <p className="font-medium">{item.metadata?.genre}</p>
 </div>
 <div>
 <p className="text-muted-foreground">Tracks</p>
 <p className="font-medium">{item.metadata?.trackCount}</p>
 </div>
 <div>
 <p className="text-muted-foreground">Explicit</p>
 <p className="font-medium">{item.metadata?.explicitContent ? "Yes" : "No"}</p>
 </div>
 </div>

 {/* Actions */}
 <div className="flex items-center justify-between">
 <p className="text-xs text-muted-foreground">
 Submitted {new Date(item.submittedAt).toLocaleString()}
 </p>
 <div className="flex gap-2">
 {item.status === ModerationAction.PENDING && (
 <>
 <button
 onClick={() => {
 setSelectedItem(item)
 setActionType(ModerationAction.APPROVED)
 setShowActionModal(true)
 }}
 className="bg-success px-4 py-2 text-sm font-medium text-success-foreground hover:bg-success/90"
 >
 Approve
 </button>
 <button
 onClick={() => {
 setSelectedItem(item)
 setActionType(ModerationAction.NEEDS_CHANGES)
 setShowActionModal(true)
 }}
 className="border border-info bg-info/10 px-4 py-2 text-sm font-medium text-info hover:bg-info/20"
 >
 Request Changes
 </button>
 <button
 onClick={() => {
 setSelectedItem(item)
 setActionType(ModerationAction.REJECTED)
 setShowActionModal(true)
 }}
 className="border border-destructive bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20"
 >
 Reject
 </button>
 </>
 )}
 </div>
 </div>
 </div>
 </div>
 </div>
 ))
 )}
 </div>

 {/* Action Modal */}
 {showActionModal && selectedItem && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
 <div className="w-full max-w-md border border-border bg-background p-6 shadow-lg">
 <h3 className="text-lg font-semibold">
 {actionType === ModerationAction.APPROVED
 ? "Approve Release"
 : actionType === ModerationAction.NEEDS_CHANGES
 ? "Request Changes"
 : "Reject Release"}
 </h3>
 <p className="mt-2 text-sm text-muted-foreground">
 {selectedItem.title} by {selectedItem.userName}
 </p>

 <div className="mt-4">
 <label className="block text-sm font-medium mb-2">
 Reason (optional)
 </label>
 <textarea
 value={reason}
 onChange={(e) => setReason(e.target.value)}
 placeholder="Provide a reason for this action..."
 rows={3}
 className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 />
 </div>

 <div className="mt-6 flex justify-end gap-2">
 <button
 onClick={() => {
 setShowActionModal(false)
 setReason("")
 setSelectedItem(null)
 }}
 className="border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
 >
 Cancel
 </button>
 <button
 onClick={handleAction}
 className="bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
