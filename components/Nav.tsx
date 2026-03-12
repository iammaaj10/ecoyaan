"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const steps = [
  { label: "Cart",    path: "/" },
  { label: "Address", path: "/checkout" },
  { label: "Payment", path: "/payment" },
]

export default function Nav() {
  const pathname = usePathname()
  const currentIdx = steps.findIndex(s => s.path === pathname)

  return (
    <nav className="sticky top-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 bg-[#F7F3ED]/90 backdrop-blur-md border-b border-[#5A4E3A]/10">

      {/* Brand */}
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-8 h-8 rounded-lg bg-[#3A5C38] flex items-center justify-center text-base shadow-sm">
          🌿
        </div>
        <span className="font-display text-2xl font-semibold text-[#2B2214] tracking-wide">
          Eco<span className="text-[#3A5C38]">yaan</span>
        </span>
      </Link>

      {/* Steps */}
      <div className="hidden sm:flex items-center">
        {steps.map((step, i) => {
          const isDone   = i < currentIdx
          const isActive = i === currentIdx
          return (
            <div key={step.path} className="flex items-center">
              {i > 0 && <div className="w-8 h-px bg-[#5A4E3A]/15" />}
              <div className={`flex items-center gap-2 px-3 py-1 text-xs font-medium tracking-widest uppercase transition-all
                ${isActive ? "text-[#3A5C38] opacity-100"
                  : isDone  ? "text-[#3A5C38] opacity-70"
                  :           "text-[#8A7D6A] opacity-40"}`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-semibold flex-shrink-0 transition-all
                  ${isActive || isDone
                    ? "bg-[#3A5C38] border-[#3A5C38] text-white"
                    : "border-[#8A7D6A]/40 text-[#8A7D6A]"}`}
                >
                  {isDone
                    ? <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 4.5l2 2L7.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    : i + 1}
                </div>
                {step.label}
              </div>
            </div>
          )
        })}
      </div>
    </nav>
  )
}