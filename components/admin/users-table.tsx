"use client"

import { useState } from "react"
import Image from "next/image"
import type { AdminUser } from "@/lib/validations/admin"
import {
 getUserStatusColor,
 formatCurrencyUSD,
} from "@/lib/validations/admin"

interface UsersTableProps {
 users: AdminUser[]
 onAction: (userId: string, action: string, data?: any) => void
}

export function UsersTable({ users, onAction }: UsersTableProps) {
 return (
 <div className="border border-border bg-background shadow-sm overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="border-b border-border bg-muted/30">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 User
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Role
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Type
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Status
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Releases
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Earnings
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Balance
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
 Joined
 </th>
 <th className="px-6 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
 Actions
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {users.length === 0 ? (
 <tr>
 <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">
 No users found
 </td>
 </tr>
 ) : (
 users.map((user) => (
 <tr key={user.id} className="hover:bg-muted/30">
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="flex items-center">
 <div className="flex h-10 w-10 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
 {user.fullName.charAt(0)}
 </div>
 <div className="ml-4">
 <p className="font-medium">{user.fullName}</p>
 <p className="text-sm text-muted-foreground">{user.email}</p>
 </div>
 </div>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 <span className="inline-flex bg-muted px-2 py-1 text-xs font-medium">
 {user.role}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
 {user.accountType}
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span
 className={`inline-flex px-2 py-1 text-xs font-medium ${getUserStatusColor(user.status)}`}
 >
 {user.status}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 {user.totalReleases}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 {formatCurrencyUSD(user.totalEarnings)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 {formatCurrencyUSD(user.currentBalance)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
 {new Date(user.createdAt).toLocaleDateString()}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
 <UserActions user={user} onAction={onAction} />
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

function UserActions({
 user,
 onAction,
}: {
 user: AdminUser
 onAction: (userId: string, action: string, data?: any) => void
}) {
 const [isOpen, setIsOpen] = useState(false)

 return (
 <div className="relative inline-block text-left">
 <button
 onClick={() => setIsOpen(!isOpen)}
 className="rounded px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
 >
 Actions ▼
 </button>

 {isOpen && (
 <>
 <div
 className="fixed inset-0 z-10"
 onClick={() => setIsOpen(false)}
 />
 <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right border border-border bg-background shadow-lg">
 <div className="py-1">
 <button
 onClick={() => {
 onAction(user.id, "suspended")
 setIsOpen(false)
 }}
 className="block w-full px-4 py-2 text-left text-sm text-muted-foreground hover:bg-muted"
 >
 {user.status === "ACTIVE" ? "Suspend" : "Activate"}
 </button>
 <button
 onClick={() => {
 onAction(user.id, "role_change", { role: user.role === "ADMIN" ? "USER" : "ADMIN" })
 setIsOpen(false)
 }}
 className="block w-full px-4 py-2 text-left text-sm text-muted-foreground hover:bg-muted"
 >
 Make {user.role === "ADMIN" ? "User" : "Admin"}
 </button>
 <button
 onClick={() => {
 if (confirm(`Are you sure you want to delete ${user.fullName}?`)) {
 onAction(user.id, "deleted")
 setIsOpen(false)
 }
 }}
 className="block w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
 >
 Delete User
 </button>
 </div>
 </div>
 </>
 )}
 </div>
 )
}
