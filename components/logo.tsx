import Image from "next/image"
import Link from "next/link"

interface LogoProps {
 variant?: "default" | "compact"
 className?: string
}

export function Logo({ variant = "default", className }: LogoProps) {
 if (variant === "compact") {
 return (
 <Link href="/" className={`flex items-center gap-2 ${className}`}>
 <Image
 src="/logo.png"
 alt="DeityMusic"
 width={128}
 height={128}
 className="h-full w-auto"
 priority
 />
 </Link>
 )
 }

 return (
 <Link href="/" className={`flex items-center gap-2 ${className}`}>
 <Image
 src="/logo.png"
 alt="DeityMusic"
 width={128}
 height={128}
 className="h-full w-auto"
 priority
 />
 <span className="text-xl font-bold text-foreground">DeityMusic</span>
 </Link>
 )
}
