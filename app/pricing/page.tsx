import Link from "next/link"
import { Logo } from "@/components/logo"

export default function PricingPage() {
 return (
 <div className="flex min-h-screen flex-col">
 {/* Header */}
 <header className="border-b border-border bg-white">
 <div className="container mx-auto flex h-16 items-center justify-between px-4">
 <Logo />
 <nav className="flex items-center gap-6">
 <Link href="/pricing" className="text-sm font-medium text-foreground">
 Pricing
 </Link>
 <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
 Login
 </Link>
 <Link
 href="/signup"
 className="inline-flex items-center bg-[#E7B900] px-6 py-2 text-sm font-semibold text-black hover:bg-[#d4a800]"
 >
 Get Started
 </Link>
 </nav>
 </div>
 </header>

 {/* Pricing Section */}
 <main className="flex-1 bg-[#FFF8E7] py-24">
 <div className="container mx-auto px-4">
 {/* Header */}
 <div className="mx-auto max-w-3xl text-center">
 <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
 Simple, Transparent Pricing
 </h1>
 <p className="mt-4 text-lg text-muted-foreground">
 Choose the perfect plan for your music distribution needs. No hidden fees, keep 100% of your royalties.
 </p>
 </div>

 {/* Pricing Cards */}
 <div className="mt-16 grid gap-8 lg:grid-cols-3">
 {/* Starter Plan */}
 <div className="border border-border bg-white p-8 shadow-sm">
 <div className="mb-4">
 <h3 className="text-xl font-bold">Starter</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 Perfect for solo artists starting their journey
 </p>
 </div>
 <div className="mb-6">
 <span className="text-4xl font-bold">₦10,000</span>
 <span className="text-muted-foreground">/year</span>
 </div>
 <ul className="mb-8 space-y-3">
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>1 Artist/Band Name</strong></span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Unlimited Uploads</strong> - Release as much music as you want</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Distribution to 150+ Platforms</strong> - Spotify, Apple Music, TikTok, and more</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Keep 100% of Your Royalties</strong> - We don't take a cut</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Free UPC/EAN Barcodes</strong> - Required for all releases</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Free ISRC Codes</strong> - Track your music worldwide</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Basic Analytics Dashboard</strong> - Track streams & revenue</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Standard Delivery</strong> - 48-72 hours to go live</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Monthly Payouts</strong> - Get paid every month</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Email Support</strong> - 48-hour response time</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Real-Time Release Tracking</strong> - Monitor your music's journey</span>
 </li>
 </ul>
 <Link
 href="/signup?plan=starter"
 className="block w-full border-2 border-border bg-background px-4 py-3 text-center text-sm font-semibold hover:border-[#E7B900]"
 >
 Get Started
 </Link>
 </div>

 {/* Pro Plan */}
 <div className="border-2 border-[#E7B900] bg-white p-8 shadow-md">
 <div className="mb-4 flex items-center justify-between">
 <h3 className="text-xl font-bold">Pro</h3>
 <span className="bg-[#E7B900] px-3 py-1 text-xs font-bold text-black">
 POPULAR
 </span>
 </div>
 <p className="mt-2 text-sm text-muted-foreground">
 For growing artists ready to expand
 </p>
 <div className="mb-6">
 <span className="text-4xl font-bold">₦25,000</span>
 <span className="text-muted-foreground">/year</span>
 </div>
 <ul className="mb-8 space-y-3">
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Everything in Starter</strong></span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>2 Artist Names</strong> - Release under multiple identities</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Custom Label Name</strong> - Build your brand identity</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Advanced Analytics</strong> - Deep insights into your audience</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Priority Support</strong> - 24-hour response time</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Faster Delivery</strong> - 24-48 hours to go live</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Spotify for Artists Verification</strong> - Get verified faster</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Weekly Payouts</strong> - Get paid faster</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Content ID Protection</strong> - Protect your content on YouTube</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Editorial Playlist Pitching</strong> - Get featured on editorial playlists</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Scheduled Release Dates</strong> - Plan your releases ahead</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Revenue Splitting</strong> - Split earnings with collaborators</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Advanced Release Analytics</strong> - Per-track and per-platform data</span>
 </li>
 </ul>
 <Link
 href="/signup?plan=pro"
 className="block w-full bg-[#E7B900] px-4 py-3 text-center text-sm font-semibold text-black hover:bg-[#d4a800]"
 >
 Get Started
 </Link>
 </div>

 {/* Elite Plan */}
 <div className="border border-border bg-white p-8 shadow-sm">
 <div className="mb-4">
 <h3 className="text-xl font-bold">Elite</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 For serious labels and teams
 </p>
 </div>
 <div className="mb-6">
 <span className="text-4xl font-bold">₦80,000</span>
 <span className="text-muted-foreground">/year</span>
 </div>
 <ul className="mb-8 space-y-3">
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Everything in Pro</strong></span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>5 Artist Names</strong> - Build your roster</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Bulk Upload Feature</strong> - Upload multiple releases at once</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Label Management Dashboard</strong> - Manage all artists from one place</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Dedicated Account Manager</strong> - Personal support whenever you need it</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Fastest Delivery</strong> - 24 hours to go live</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Custom Label Landing Page</strong> - Showcase your brand</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Priority Editorial Pitching</strong> - Priority consideration for playlists</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Advanced Revenue Splits</strong> - Complex split arrangements with multiple parties</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Telegram/TikTok Distribution</strong> - Direct distribution to social platforms</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Daily Analytics Updates</strong> - Real-time performance tracking</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>API Access</strong> - Integrate with your tools</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>White-Label Options</strong> - Add your branding to releases</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Custom Contracts</strong> - Flexible terms for your artists</span>
 </li>
 <li className="flex items-start gap-3">
 <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-sm"><strong>Priority Release Review</strong> - Skip the queue</span>
 </li>
 </ul>
 <Link
 href="/signup?plan=elite"
 className="block w-full border-2 border-border bg-background px-4 py-3 text-center text-sm font-semibold hover:border-[#E7B900]"
 >
 Get Started
 </Link>
 </div>
 </div>

 {/* FAQ Section */}
 <div className="mt-24">
 <h2 className="text-center text-3xl font-bold">Frequently Asked Questions</h2>
 <div className="mx-auto mt-12 max-w-3xl space-y-6">
 <div className="border border-border bg-white p-6">
 <h3 className="font-semibold">Do I keep 100% of my royalties?</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 Yes! You keep 100% of your streaming and sales revenue. We don't take any percentage of your earnings.
 </p>
 </div>
 <div className="border border-border bg-white p-6">
 <h3 className="font-semibold">What payment methods do you accept?</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 We accept bank transfer, credit/debit cards, and bank transfers. All payments are processed securely.
 </p>
 </div>
 <div className="border border-border bg-white p-6">
 <h3 className="font-semibold">Can I upgrade my plan later?</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 Absolutely! You can upgrade anytime and we'll prorate your subscription. Just contact support to upgrade.
 </p>
 </div>
 <div className="border border-border bg-white p-6">
 <h3 className="font-semibold">How long do releases take to go live?</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 Starter plans take 48-72 hours, Pro plans take 24-48 hours, and Elite plans get priority delivery within 24 hours.
 </p>
 </div>
 <div className="border border-border bg-white p-6">
 <h3 className="font-semibold">What platforms do you distribute to?</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 We distribute to 150+ platforms including Spotify, Apple Music, YouTube Music, TikTok, Instagram, Amazon Music, Tidal, Deezer, and many more.
 </p>
 </div>
 </div>
 </div>

 {/* CTA Section */}
 <div className="mt-24 text-center">
 <h2 className="text-3xl font-bold">Ready to Start Distributing?</h2>
 <p className="mt-4 text-lg text-muted-foreground">
 Join thousands of artists already using DeityMusic
 </p>
 <div className="mt-8 flex items-center justify-center gap-4">
 <Link
 href="/signup"
 className="inline-flex items-center bg-[#E7B900] px-10 py-4 text-lg font-bold text-black hover:bg-[#d4a800]"
 >
 Get Started Now
 </Link>
 </div>
 </div>
 </div>
 </main>

 {/* Footer */}
 <footer className="border-t border-border bg-white">
 <div className="container mx-auto px-4 py-8">
 <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-center">
 <div className="text-sm text-muted-foreground">
 @{new Date().getFullYear()} DEITY DISTRIBUTION LTD. All rights reserved.
 </div>
 <Logo variant="compact" />
 <div className="flex gap-6 text-sm text-muted-foreground">
 <Link href="/privacy" className="hover:text-foreground">
 Privacy
 </Link>
 <Link href="/terms" className="hover:text-foreground">
 Terms
 </Link>
 <Link href="/contact" className="hover:text-foreground">
 Contact
 </Link>
 </div>
 </div>
 </div>
 </footer>
 </div>
 )
}
