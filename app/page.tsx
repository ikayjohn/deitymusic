import Link from "next/link";
import { Logo } from "@/components/logo";

export default function Home() {
 return (
 <div className="flex min-h-screen flex-col">
 {/* Hero Section */}
 <main className="flex-1">
 <section
 className="relative h-[800px] bg-cover bg-center bg-no-repeat flex items-center"
 style={{ backgroundImage: "url('/deityhero.jpg')" }}
 >
 {/* Transparent Header */}
 <header className="absolute top-0 left-0 right-0 z-10 pt-[20px]">
 <div className="container mx-auto flex h-16 items-center justify-between px-4">
 <div className="filter brightness-0 invert h-[68px]">
 <Logo variant="compact" />
 </div>
 <nav className="hidden items-center gap-6 md:flex">
 <Link href="/pricing" className="text-base font-semibold text-white hover:text-gray-200">
 Pricing
 </Link>
 <Link href="#features" className="text-base font-semibold text-white hover:text-gray-200">
 Features
 </Link>
 <Link href="#about" className="text-base font-semibold text-white hover:text-gray-200">
 About
 </Link>
 </nav>
 <div className="flex items-center gap-4">
 <Link
 href="/login"
 className="text-base font-semibold text-white hover:text-gray-200"
 >
 Login
 </Link>
 <Link
 href="/signup"
 className="inline-flex items-center bg-[#E7B900] px-6 py-2 text-base font-semibold text-black hover:bg-[#d4a800]"
 >
 Get Started
 </Link>
 </div>
 </div>
 </header>
 <div className="absolute inset-0 bg-black/50" />
 <div className="relative container mx-auto px-4 text-center">
 <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
 Distribute Your Music{" "}
 <span className="text-purple-400">Everywhere</span>
 </h1>
 <p className="mt-6 text-lg leading-8 text-white sm:text-xl">
 Get your music on Spotify, Apple Music, and 150+ streaming platforms worldwide.
 Keep 100% of your royalties. Start distributing today.
 </p>
 <div className="mt-10 flex items-center justify-center gap-4">
 <Link
 href="/signup"
 className="inline-flex items-center bg-purple-600 px-8 py-3 text-base font-medium text-white hover:bg-[#e7b900]"
 >
 Start Distribution
 </Link>
 <Link
 href="#features"
 className="inline-flex items-center border-2 border-white px-8 py-3 text-base font-medium text-white hover:bg-white hover:text-black"
 >
 Learn More
 </Link>
 </div>
 <div className="mt-12 flex items-center justify-center gap-8 text-sm text-white">
 <div className="flex items-center gap-2">
 <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span>100% Royalties</span>
 </div>
 <div className="flex items-center gap-2">
 <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span>150+ Platforms</span>
 </div>
 <div className="flex items-center gap-2">
 <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span>Fast Delivery</span>
 </div>
 </div>
 </div>
 </section>

 {/* Marquee Section */}
 <section className="bg-[#054F77] overflow-hidden py-2">
 <div className="marquee-container whitespace-nowrap">
 <div className="marquee-content inline-block animate-marquee">
 <span className="text-white text-sm font-medium mx-8">
 Pitch your music to Spotify, Apple Music, and Deezer editorial playlists.
 </span>
 <span className="text-white text-sm font-medium mx-8">
 Distribute to 150+ platforms worldwide – Spotify, Apple Music, TikTok, and more!
 </span>
 <span className="text-white text-sm font-medium mx-8">
 Pitch your music to Spotify, Apple Music, and Deezer editorial playlists.
 </span>
 <span className="text-white text-sm font-medium mx-8">
 Distribute to 150+ platforms worldwide – Spotify, Apple Music, TikTok, and more!
 </span>
 </div>
 </div>
 </section>

 {/* Features Section */}
 <section id="features" className="border-t bg-[#FFF8E7]">
 <div className="container mx-auto max-w-[80%] px-4 py-24">
 <div className="mx-auto max-w-2xl text-center">
 <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
 Everything You Need to Succeed
 </h2>
 <p className="mt-4 text-lg text-muted-foreground">
 Professional tools to help you distribute, manage, and monetize your music
 </p>
 </div>
 <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
 {features.map((feature, index) => {
 return (
 <div
 key={feature.title}
 className="bg-white p-6 shadow-sm text-center"
 >
 <div className="mb-4 flex h-12 w-12 items-center justify-center">
 <feature.icon className="h-8 w-8 stroke-[#E7B900]" />
 </div>
 <h3 className="text-lg font-semibold">{feature.title}</h3>
 <p className="mt-2 text-muted-foreground">{feature.description}</p>
 </div>
 )
 })}
 </div>
 </div>
 </section>

 {/* Platform Partners */}
 <section>
 <div className="container mx-auto max-w-[80%] px-4 pt-[100px] pb-[150px]">
 <p className="text-center text-xl font-bold text-muted-foreground mb-[50px]">
 We distribute to all major platforms
 </p>
 <div className="mt-8 flex flex-wrap items-center justify-center gap-16">
 {platforms.map((platform) => (
 <img
 key={platform.name}
 src={platform.logo}
 alt={platform.name}
 className="h-8 w-auto object-contain"
 />
 ))}
 </div>
 </div>
 </section>

 {/* CTA Section */}
 <section
 className="relative bg-cover bg-center bg-no-repeat py-32"
 style={{ backgroundImage: "url('/cta1.jpg')" }}
 >
 <div className="absolute inset-0 bg-black/60" />
 <div className="relative container mx-auto px-4 text-center">
 <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
 Ready to Share Your Music?
 </h2>
 <p className="mt-6 text-xl text-white">
 Join thousands of artists distributing their music with DeityMusic
 </p>
 <div className="mt-10">
 <Link
 href="/signup"
 className="inline-flex items-center bg-[#E7B900] px-10 py-4 text-lg font-bold text-black hover:bg-[#d4a800]"
 >
 Start for Free
 </Link>
 </div>
 </div>
 </section>
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
 );
}

// Feature icons as components
const MusicIcon = (props: React.ComponentPropsWithoutRef<"svg">) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
 />
 </svg>
);

const ChartIcon = (props: React.ComponentPropsWithoutRef<"svg">) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
 />
 </svg>
);

const GlobeIcon = (props: React.ComponentPropsWithoutRef<"svg">) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
 />
 </svg>
);

const DollarIcon = (props: React.ComponentPropsWithoutRef<"svg">) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
 />
 </svg>
);

const LightningIcon = (props: React.ComponentPropsWithoutRef<"svg">) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M13 10V3L4 14h7v7l9-11h-7z"
 />
 </svg>
);

const ShieldIcon = (props: React.ComponentPropsWithoutRef<"svg">) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
 />
 </svg>
);

const features = [
 {
 title: "Easy Upload",
 description: "Upload your tracks and artwork in minutes. We handle the technical details.",
 icon: MusicIcon,
 },
 {
 title: "Real-time Analytics",
 description: "Track your streams, revenue, and audience insights in real-time.",
 icon: ChartIcon,
 },
 {
 title: "Global Distribution",
 description: "Reach fans worldwide with distribution to 150+ streaming platforms.",
 icon: GlobeIcon,
 },
 {
 title: "100% Royalties",
 description: "Keep all your earnings. We don't take a cut of your revenue.",
 icon: DollarIcon,
 },
 {
 title: "Fast Delivery",
 description: "Your music goes live on platforms within 48-72 hours.",
 icon: LightningIcon,
 },
 {
 title: "Secure & Protected",
 description: "Your music and data are protected with enterprise-grade security.",
 icon: ShieldIcon,
 },
];

const platforms = [
  { name: "Spotify", logo: "/platforms/spotify.svg" },
  { name: "Apple Music", logo: "/platforms/apple-music.svg" },
  { name: "Amazon Music", logo: "/platforms/amazon-music.svg" },
  { name: "YouTube Music", logo: "/platforms/youtube-music.svg" },
  { name: "Tidal", logo: "/platforms/tidal.svg" },
  { name: "Deezer", logo: "/platforms/deezer.svg" },
  { name: "TikTok", logo: "/platforms/tiktok.svg" },
  { name: "Instagram", logo: "/platforms/instagram.svg" },
  { name: "SoundCloud", logo: "/platforms/soundcloud.svg" },
  { name: "Pandora", logo: "/platforms/pandora.svg" },
  { name: "Napster", logo: "/platforms/napster.svg" },
  { name: "Facebook", logo: "/platforms/facebook.svg" },
  { name: "Shazam", logo: "/platforms/shazam.svg" },
  { name: "Anghami", logo: "/platforms/anghami.svg" },
  { name: "Boomplay", logo: "/platforms/boomplay.svg" },
  { name: "JOOX", logo: "/platforms/joox.svg" },
  { name: "KKBOX", logo: "/platforms/kkbox.svg" },
];
