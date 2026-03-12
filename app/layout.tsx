import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { CheckoutProvider } from "@/context/CheckoutContext"
import Nav from "@/components/Nav"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ecoyaan — Sustainable Living",
  description: "Shop eco-friendly, plastic-free products for a better planet.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#F7F3ED] text-[#2B2214] min-h-screen`}>
        <CheckoutProvider>
          <Nav />
          <main>{children}</main>
          <footer className="text-center text-xs text-[#8A7D6A] border-t border-[#5A4E3A]/10 py-8 mt-16">
            © 2025 Ecoyaan · Sustainable Living · All rights reserved
          </footer>
        </CheckoutProvider>
      </body>
    </html>
  )
}