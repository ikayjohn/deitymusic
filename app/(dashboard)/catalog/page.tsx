import { Header } from "@/components/layout/header"
import Link from "next/link"

export default function CatalogPage() {
 return (
 <>
 <Header title="Catalog" />
 <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
 <div className="mx-auto max-w-7xl space-y-6">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-2xl font-bold">My Catalog</h2>
 <p className="text-muted-foreground">
 Browse and manage all your releases
 </p>
 </div>
 <Link
 href="/releases/new"
 className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
 >
 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
 </svg>
 New Release
 </Link>
 </div>

 {/* Redirect to releases page for now */}
 <div className="border border-border bg-background p-12 text-center shadow-sm">
 <svg className="mx-auto h-16 w-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
 </svg>
 <h3 className="mt-4 text-lg font-semibold">Catalog View</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 Advanced catalog features coming soon.
 </p>
 <Link
 href="/releases"
 className="mt-4 inline-flex items-center gap-2 bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
 >
 View Releases
 </Link>
 </div>
 </div>
 </main>
 </>
 )
}
