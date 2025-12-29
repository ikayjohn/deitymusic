import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
 title: "DeityMusic - Music Distribution Platform",
 description: "Distribute your music to all major streaming platforms worldwide. Professional music distribution for artists and labels.",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="en">
 <head>
 <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
 </head>
 <body className="antialiased">
 {children}
 </body>
 </html>
 );
}
