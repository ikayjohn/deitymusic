"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

const navigation = [
 { name: "Dashboard", href: "/admin", icon: DashboardIcon },
 { name: "Users", href: "/admin/users", icon: UsersIcon },
 { name: "Moderation", href: "/admin/moderation", icon: ModerationIcon },
 { name: "Withdrawals", href: "/admin/withdrawals", icon: WithdrawalsIcon },
 { name: "Analytics", href: "/admin/analytics", icon: AnalyticsIcon },
 { name: "Activity Logs", href: "/admin/activity-logs", icon: ActivityLogsIcon },
 { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
]

export function AdminSidebar() {
 const pathname = usePathname()

 return (
 <div className="flex w-64 flex-col border-r border-border bg-background">
 {/* Logo */}
 <div className="flex h-16 items-center border-b border-border px-6">
 <Link href="/admin" className="flex items-center gap-2">
 <div className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground">
 <span className="text-sm font-bold">DM</span>
 </div>
 <span className="text-lg font-bold">Deity Admin</span>
 </Link>
 </div>

 {/* Navigation */}
 <nav className="flex-1 space-y-1 px-3 py-4">
 {navigation.map((item) => {
 const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
 return (
 <Link
 key={item.name}
 href={item.href}
 className={clsx(
 "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
 isActive
 ? "bg-primary text-primary-foreground"
 : "text-muted-foreground hover:bg-muted hover:text-foreground"
 )}
 >
 <item.icon className="h-5 w-5" />
 {item.name}
 </Link>
 )
 })}
 </nav>

 {/* User Section */}
 <div className="border-t border-border p-4">
 <div className="flex items-center gap-3 bg-muted/50 p-3">
 <div className="flex h-10 w-10 items-center justify-center bg-primary text-primary-foreground">
 <span className="text-sm font-bold">A</span>
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium truncate">Admin User</p>
 <p className="text-xs text-muted-foreground truncate">admin@deitymusic.com</p>
 </div>
 </div>
 <Link
 href="/dashboard"
 className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground"
 >
 Back to Dashboard
 </Link>
 </div>
 </div>
 )
}

function DashboardIcon() {
 return (
 <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
 </svg>
 )
}

function UsersIcon() {
 return (
 <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
 </svg>
 )
}

function ModerationIcon() {
 return (
 <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
 </svg>
 )
}

function WithdrawalsIcon() {
 return (
 <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v-.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
 </svg>
 )
}

function AnalyticsIcon() {
 return (
 <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
 </svg>
 )
}

function ActivityLogsIcon() {
 return (
 <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 )
}

function SettingsIcon() {
 return (
 <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 018.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
 </svg>
 )
}
