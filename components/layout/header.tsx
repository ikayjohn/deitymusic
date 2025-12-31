"use client"

import { createBrowserClient } from "@/lib/supabase/client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"

interface HeaderProps {
 title: string
}

export function Header({ title }: HeaderProps) {
 const supabaseRef = useRef<ReturnType<typeof createBrowserClient> | null>(null)
 const router = useRouter()
 const [notificationCount, setNotificationCount] = useState(0)

 const getSupabase = () => {
 if (!supabaseRef.current) {
 supabaseRef.current = createBrowserClient()
 }
 return supabaseRef.current
 }

 useEffect(() => {
 const fetchNotifications = async () => {
 const supabase = getSupabase()
 const { data: { user } } = await supabase.auth.getUser()
 if (user) {
 const { count } = await supabase
 .from("notifications")
 .select("*", { count: "exact", head: true })
 .eq("user_id", user.id)
 .eq("read", false)

 setNotificationCount(count || 0)
 }
 }

 fetchNotifications()
 }, [])

 return (
 <header className="flex h-14 items-center justify-between border-b border-border bg-white px-6">
 <div>
 <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
 </div>

 <div className="flex items-center gap-2">
 {/* Notifications */}
 <button className="relative p-2 text-muted-foreground hover:bg-muted transition-colors">
 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
 />
 </svg>
 {notificationCount > 0 && (
 <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
 <span className="absolute inline-flex h-full w-full animate-ping bg-purple-600 opacity-75" />
 <span className="relative inline-flex h-2 w-2 bg-purple-600" />
 </span>
 )}
 </button>

 {/* Help */}
 <button className="p-2 text-muted-foreground hover:bg-muted transition-colors">
 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
 />
 </svg>
 </button>

 {/* Settings */}
 <button
 onClick={() => router.push("/settings")}
 className="p-2 text-muted-foreground hover:bg-muted transition-colors"
 title="Settings"
 >
 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
 />
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
 />
 </svg>
 </button>
 </div>
 </header>
 )
}
