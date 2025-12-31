"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import type { ActivityLog } from "@/lib/validations/admin"
import { formatActivityAction, ActivityLogAction } from "@/lib/validations/admin"

export default function AdminActivityLogsPage() {
 const [logs, setLogs] = useState<ActivityLog[]>([])
 const [loading, setLoading] = useState(true)
 const [totalCount, setTotalCount] = useState(0)
 const [filters, setFilters] = useState({
 action: "",
 targetType: "",
 page: 1,
 pageSize: 20,
 })

 useEffect(() => {
 fetchLogs()
 }, [filters])

 const fetchLogs = async () => {
 setLoading(true)
 try {
 const params = new URLSearchParams()
 Object.entries(filters).forEach(([key, value]) => {
 if (value) params.append(key, value.toString())
 })

 const response = await fetch(`/api/admin/activity-logs?${params}`)
 const data = await response.json()
 setLogs(data.logs || [])
 setTotalCount(data.totalCount || 0)
 } catch (error) {
 console.error("Failed to fetch activity logs:", error)
 } finally {
 setLoading(false)
 }
 }

 if (loading) {
 return (
 <div className="flex min-h-[400px] items-center justify-center">
 <div className="text-center">
 <div className="inline-block h-8 w-8 animate-spin border-4 border-solid border-primary border-r-transparent" />
 <p className="mt-4 text-sm text-muted-foreground">Loading activity logs...</p>
 </div>
 </div>
 )
 }

 return (
 <div className="space-y-6">
 {/* Header */}
 <div>
 <h1 className="text-3xl font-bold">Activity Logs</h1>
 <p className="text-muted-foreground">
 Track all administrative actions and system events
 </p>
 </div>

 {/* Filters */}
 <div className="border border-border bg-background p-4 shadow-sm">
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 <select
 value={filters.action}
 onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
 className="border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 >
 <option value="">All Actions</option>
 <option value={ActivityLogAction.USER_LOGIN}>User Login</option>
 <option value={ActivityLogAction.USER_CREATED}>User Created</option>
 <option value={ActivityLogAction.USER_UPDATED}>User Updated</option>
 <option value={ActivityLogAction.USER_DELETED}>User Deleted</option>
 <option value={ActivityLogAction.RELEASE_CREATED}>Release Created</option>
 <option value={ActivityLogAction.RELEASE_APPROVED}>Release Approved</option>
 <option value={ActivityLogAction.RELEASE_REJECTED}>Release Rejected</option>
 <option value={ActivityLogAction.WITHDRAWAL_REQUESTED}>Withdrawal Requested</option>
 <option value={ActivityLogAction.WITHDRAWAL_APPROVED}>Withdrawal Approved</option>
 </select>

 <select
 value={filters.targetType}
 onChange={(e) => setFilters({ ...filters, targetType: e.target.value, page: 1 })}
 className="border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 >
 <option value="">All Types</option>
 <option value="USER">Users</option>
 <option value="RELEASE">Releases</option>
 <option value="WITHDRAWAL">Withdrawals</option>
 <option value="SYSTEM">System</option>
 </select>

 <select
 value={filters.pageSize.toString()}
 onChange={(e) => setFilters({ ...filters, pageSize: parseInt(e.target.value), page: 1 })}
 className="border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 >
 <option value="20">20 per page</option>
 <option value="50">50 per page</option>
 <option value="100">100 per page</option>
 </select>

 <div className="flex items-center justify-between text-sm text-muted-foreground">
 <span>Total: {totalCount.toLocaleString()} logs</span>
 <span>Page {filters.page}</span>
 </div>
 </div>
 </div>

 {/* Logs Table */}
 <div className="border border-border bg-background shadow-sm overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="border-b border-border bg-muted/30">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Timestamp
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Action
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 User
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Target
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Details
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 IP Address
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {logs.length === 0 ? (
 <tr>
 <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
 No activity logs found
 </td>
 </tr>
 ) : (
 logs.map((log) => (
 <tr key={log.id} className="hover:bg-muted/30">
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 {new Date(log.createdAt).toLocaleString()}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 <span className="inline-flex bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
 {formatActivityAction(log.action)}
 </span>
 </td>
 <td className="px-6 py-4 text-sm">
 {log.userEmail ? (
 <div>
 <p className="font-medium">{log.userEmail}</p>
 <p className="text-xs text-muted-foreground">{log.userId}</p>
 </div>
 ) : (
 <span className="text-muted-foreground">System</span>
 )}
 </td>
 <td className="px-6 py-4 text-sm">
 <span className="inline-flex bg-muted px-2 py-1 text-xs font-medium">
 {log.targetType}
 </span>
 <p className="mt-1 text-xs text-muted-foreground">{log.targetId}</p>
 </td>
 <td className="px-6 py-4 text-sm text-muted-foreground">
 {log.details}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
 {log.ipAddress || "—"}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Pagination */}
 {totalCount > filters.pageSize && (
 <div className="flex items-center justify-between">
 <button
 onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
 disabled={filters.page === 1}
 className="border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
 >
 Previous
 </button>
 <span className="text-sm text-muted-foreground">
 Page {filters.page} of {Math.ceil(totalCount / filters.pageSize)}
 </span>
 <button
 onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
 disabled={filters.page >= Math.ceil(totalCount / filters.pageSize)}
 className="border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
 >
 Next
 </button>
 </div>
 )}
 </div>
 )
}
