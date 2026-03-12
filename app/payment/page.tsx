"use client"

import { useState } from "react"
import { useCheckout } from "@/context/CheckoutContext"
import { useRouter } from "next/navigation"
import { cartData } from "@/data/cartData"
import OrderSummary from "@/components/OrderSummary"
import CartItem from "@/components/CartItem"
import Link from "next/link"

const PAYMENT_METHODS = [
  { id: "upi",  label: "UPI / Google Pay",    desc: "PhonePe, GPay, Paytm & more", icon: "UPI"  },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay",     icon: "CARD" },
  { id: "cod",  label: "Cash on Delivery",    desc: "Pay when you receive",         icon: "COD"  },
]

export default function PaymentPage() {
  const { address } = useCheckout()
  const router = useRouter()
  const [method, setMethod] = useState("upi")
  const [paying, setPaying] = useState(false)

  const subtotal = cartData.cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity, 0
  )
  const total = subtotal + cartData.shipping_fee

  const handlePay = () => {
    setPaying(true)
    setTimeout(() => router.push("/success"), 1400)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-14">
      <h1 className="font-display text-4xl md:text-5xl font-medium text-[#2B2214] tracking-tight mb-1">
        Payment
      </h1>
      <p className="text-[#8A7D6A] text-sm font-light mb-8">
        Review your order and complete payment
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div className="flex flex-col gap-5">

          {/* Delivery address */}
          <div className="bg-white rounded-2xl border border-[#5A4E3A]/10 shadow-[0_2px_12px_rgba(43,34,20,0.08)]">
            <div className="px-6 pt-5">
              <div className="flex items-center justify-between border-b border-[#5A4E3A]/10 pb-4">
                <h2 className="font-display text-lg font-medium text-[#2B2214]">Delivering To</h2>
                <Link
                  href="/checkout"
                  className="flex items-center gap-1.5 text-xs text-[#8A7D6A] border border-[#5A4E3A]/15 rounded-lg px-3 py-1.5 hover:bg-[#EDE7DB] transition-colors no-underline"
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M7.5 1.5l2 2L3 10H1V8L7.5 1.5Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                  </svg>
                  Edit
                </Link>
              </div>
            </div>
            <div className="px-6 py-5">
              {address ? (
                <div className="bg-[#EAF0E8] border border-[#3A5C38]/18 rounded-xl px-4 py-3.5">
                  <p className="font-semibold text-[#2B2214] mb-1">{address.name}</p>
                  <p className="text-sm text-[#5A4E3A] leading-7">
                    {address.city}, {address.state} — {address.pincode}<br />
                    📱 +91 {address.phone}<br />
                    ✉️ {address.email}
                  </p>
                </div>
              ) : (
                <div className="bg-[#F7F3ED] rounded-xl px-4 py-3">
                  <p className="text-sm text-[#8A7D6A]">
                    No address found.{" "}
                    <Link href="/checkout" className="text-[#3A5C38] font-medium">Add one →</Link>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order items */}
          <div className="bg-white rounded-2xl border border-[#5A4E3A]/10 shadow-[0_2px_12px_rgba(43,34,20,0.08)]">
            <div className="px-6 pt-5">
              <h2 className="font-display text-lg font-medium text-[#2B2214] border-b border-[#5A4E3A]/10 pb-4">
                Order Items
              </h2>
            </div>
            <div className="px-6 pb-5">
              {cartData.cartItems.map((item, i) => (
                <CartItem key={item.product_id} item={item} delay={i * 60} />
              ))}
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl border border-[#5A4E3A]/10 shadow-[0_2px_12px_rgba(43,34,20,0.08)]">
            <div className="px-6 pt-5">
              <h2 className="font-display text-lg font-medium text-[#2B2214] border-b border-[#5A4E3A]/10 pb-4">
                Payment Method
              </h2>
            </div>
            <div className="px-6 py-5 flex flex-col gap-3">

              {PAYMENT_METHODS.map(pm => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setMethod(pm.id)}
                  className={`flex items-center gap-3.5 w-full text-left px-4 py-3.5 rounded-xl border transition-all
                    ${method === pm.id
                      ? "border-[#3A5C38] bg-[#EAF0E8]"
                      : "border-[#5A4E3A]/15 bg-white hover:border-[#3A5C38]/40 hover:bg-[#EAF0E8]/50"}`}
                >
                  <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${method === pm.id
                      ? "border-[#3A5C38] bg-[#3A5C38]"
                      : "border-[#5A4E3A]/30"}`}
                  >
                    {method === pm.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div className="w-9 h-6 bg-[#EDE7DB] rounded flex items-center justify-center text-[9px] font-bold text-[#2B2214] tracking-tight flex-shrink-0">
                    {pm.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2B2214]">{pm.label}</p>
                    <p className="text-xs text-[#8A7D6A]">{pm.desc}</p>
                  </div>
                </button>
              ))}

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={paying || !address}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-[#3A5C38] hover:bg-[#4D7A4B] disabled:opacity-70 text-white text-sm font-medium tracking-widest uppercase rounded-xl py-3.5 transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(58,92,56,0.28)] active:translate-y-0 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                {paying ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin-loader" />
                    Processing Payment…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M1 7h12M4.5 4V3a2.5 2.5 0 015 0v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    Pay Securely · ₹{total.toLocaleString()}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4">
                {["🔒 256-bit SSL", "✅ PCI-DSS", "🌿 Carbon Neutral"].map(t => (
                  <span key={t} className="text-[11px] text-[#8A7D6A]">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <OrderSummary
          subtotal={subtotal}
          shipping={cartData.shipping_fee}
          discount={cartData.discount_applied}
        />
      </div>
    </div>
  )
}