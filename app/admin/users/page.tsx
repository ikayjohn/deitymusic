"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { UsersTable } from "@/components/admin/users-table"
import { UserStatus, UserRole } from "@/lib/validations/admin"

export default function AdminUsersPage() {
 const [users, setUsers] = useState([])
 const [loading, setLoading] = useState(true)
 const [filters, setFilters] = useState({
 search: "",
 role: "",
 status: "",
 accountType: "",
 page: 1,
 pageSize: 10,
 })

 useEffect(() => {
 fetchUsers()
 }, [filters])

 const fetchUsers = async () => {
 setLoading(true)
 try {
 const params = new URLSearchParams()
 Object.entries(filters).forEach(([key, value]) => {
 if (value) params.append(key, value.toString())
 })

 const response = await fetch(`/api/admin/users?${params}`)
 const data = await response.json()
 setUsers(data.users || [])
 } catch (error) {
 console.error("Failed to fetch users:", error)
 } finally {
 setLoading(false)
 }
 }

 const handleUserAction = async (userId: string, action: string, data?: any) => {
 try {
 const response = await fetch("/api/admin/users", {
 method: "PATCH",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ userId, action, ...data }),
 })

 if (response.ok) {
 alert(`User ${action} successfully`)
 fetchUsers()
 }
 } catch (error) {
 console.error("Failed to perform user action:", error)
 }
 }

 if (loading) {
 return (
 <div className="flex min-h-[400px] items-center justify-center">
 <div className="text-center">
 <div className="inline-block h-8 w-8 animate-spin border-4 border-solid border-primary border-r-transparent" />
 <p className="mt-4 text-sm text-muted-foreground">Loading users...</p>
 </div>
 </div>
 )
 }

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <h1 className="text-3xl font-bold">User Management</h1>
 <p className="text-muted-foreground">View and manage all platform users</p>
 </div>
 </div>

 {/* Filters */}
 <div className="border border-border bg-background p-4 shadow-sm">
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
 <input
 type="text"
 placeholder="Search users..."
 value={filters.search}
 onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
 className="border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 />

 <select
 value={filters.role}
 onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
 className="border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 >
 <option value="">All Roles</option>
 <option value={UserRole.ADMIN}>Admin</option>
 <option value={UserRole.USER}>User</option>
 <option value={UserRole.MODERATOR}>Moderator</option>
 </select>

 <select
 value={filters.status}
 onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
 className="border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 >
 <option value="">All Statuses</option>
 <option value={UserStatus.ACTIVE}>Active</option>
 <option value={UserStatus.SUSPENDED}>Suspended</option>
 <option value={UserStatus.PENDING}>Pending</option>
 <option value={UserStatus.BANNED}>Banned</option>
 </select>

 <select
 value={filters.accountType}
 onChange={(e) => setFilters({ ...filters, accountType: e.target.value, page: 1 })}
 className="border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 >
 <option value="">All Types</option>
 <option value="ARTIST">Artist</option>
 <option value="LABEL">Label</option>
 </select>

 <select
 value={filters.pageSize.toString()}
 onChange={(e) => setFilters({ ...filters, pageSize: parseInt(e.target.value), page: 1 })}
 className="border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
 >
 <option value="10">10 per page</option>
 <option value="25">25 per page</option>
 <option value="50">50 per page</option>
 </select>
 </div>
 </div>

 {/* Users Table */}
 <UsersTable users={users} onAction={handleUserAction} />
 </div>
 )
}
