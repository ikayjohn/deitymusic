"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import type { User } from "@/types/supabase"
import { Logo } from "@/components/logo"

interface NavItem {
 name: string
 href: string
 icon: React.ComponentType<{ className?: string }>
}

const navigation: NavItem[] = [
 {
 name: "Dashboard",
 href: "/dashboard",
 icon: ({ className }) => (
 <svg
 className={className}
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
 />
 </svg>
 ),
 },
 {
 name: "Releases",
 href: "/releases",
 icon: ({ className }) => (
 <svg
 className={className}
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
 />
 </svg>
 ),
 },
 {
 name: "Catalog",
 href: "/catalog",
 icon: ({ className }) => (
 <svg
 className={className}
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
 />
 </svg>
 ),
 },
 {
 name: "Analytics",
 href: "/analytics",
 icon: ({ className }) => (
 <svg
 className={className}
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
 />
 </svg>
 ),
 },
 {
 name: "Earnings",
 href: "/earnings",
 icon: ({ className }) => (
 <svg
 className={className}
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
 ),
 },
 {
 name: "Billing",
 href: "/billing",
 icon: ({ className }) => (
 <svg
 className={className}
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
 />
 </svg>
 ),
 },
 {
 name: "New Release",
 href: "/releases/new",
 icon: ({ className }) => (
 <svg
 className={className}
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M12 4v16m8-8H4"
 />
 </svg>
 ),
 },
]

export function Sidebar() {
 const pathname = usePathname()
 const supabase = createBrowserClient()
 const [user, setUser] = useState<User | null>(null)

 useEffect(() => {
 const getUser = async () => {
 const { data: { user: authUser } } = await supabase.auth.getUser()
 if (authUser) {
 const { data } = await supabase
 .from("users")
 .select("*")
 .eq("id", authUser.id)
 .single()
 setUser(data)
 }
 }
 getUser()
 }, [supabase])

 const handleSignOut = async () => {
 await supabase.auth.signOut()
 window.location.href = "/login"
 }

 const getNavStyles = (href: string, isActive: boolean) => {
 // Earnings gets green accent (success, growth)
 if (href.includes('earnings')) {
 return isActive
 ? "bg-green-600 text-white"
 : "text-muted-foreground hover:bg-green-50 hover:text-green-600"
 }
 // Everything else gets blue (platform credibility)
 return isActive
 ? "bg-blue-600 text-white"
 : "text-muted-foreground hover:bg-blue-50 hover:text-blue-600"
 }

 return (
 <div className="flex h-full w-64 flex-col border-r border-border bg-background">
 {/* Logo */}
 <div className="flex h-16 items-center border-b border-border bg-card px-6">
 <Logo variant="compact" />
 </div>

 {/* Navigation */}
 <nav className="flex-1 space-y-1 p-4">
 {navigation.map((item) => {
 const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
 return (
 <Link
 key={item.name}
 href={item.href}
 className={`
 flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors
 ${getNavStyles(item.href, isActive)}
 `}
 >
 <item.icon className="h-4 w-4" />
 {item.name}
 </Link>
 )
 })}
 </nav>

 {/* User Section */}
 <div className="border-t border-border p-4 bg-muted">
 <div className="mb-3 flex items-center gap-3">
 <div className="flex h-9 w-9 items-center justify-center bg-purple-600 text-white text-sm font-medium">
 {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
 </div>
 <div className="flex-1 min-w-0">
 <p className="truncate text-sm font-medium">{user?.name || "User"}</p>
 <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
 </div>
 </div>
 <button
 onClick={handleSignOut}
 className="flex w-full items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-white hover:text-foreground transition-colors"
 >
 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
 />
 </svg>
 Sign out
 </button>
 </div>
 </div>
 )
}
