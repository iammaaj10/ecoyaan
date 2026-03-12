"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCheckout } from "@/context/CheckoutContext"
import { Address } from "@/types/address"
import { cartData } from "@/data/cartData"
import OrderSummary from "@/components/OrderSummary"

type Errors = Partial<Record<keyof Address, string>>

export default function CheckoutPage() {
  const router = useRouter()
  const { setAddress } = useCheckout()

  const [form, setForm] = useState<Address>({
    name: "", email: "", phone: "", city: "", state: "", pincode: "",
  })
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  const subtotal = cartData.cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity, 0
  )

  const validate = (): boolean => {
    const e: Errors = {}
    if (!form.name.trim())    e.name    = "Full name is required"
    if (!form.email.trim())   e.email   = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email"
    if (!form.phone.trim())   e.phone   = "Phone is required"
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Must be 10 digits"
    if (!form.city.trim())    e.city    = "City is required"
    if (!form.state.trim())   e.state   = "State is required"
    if (!form.pincode.trim()) e.pincode = "PIN code is required"
    else if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Must be 6 digits"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const set = (field: keyof Address, value: string) => {
    setForm(p => ({ ...p, [field]: value }))
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setAddress(form)
    setTimeout(() => router.push("/payment"), 400)
  }

  // Use direct hex values — Tailwind v4 can struggle resolving CSS vars inside arbitrary bg/text utilities
  const inputBase = "w-full px-3.5 py-2.5 rounded-xl text-sm text-[#2B2214] bg-[#F7F3ED] border transition-all outline-none placeholder:text-[#8A7D6A]/50 focus:bg-white focus:ring-2"
  const inputOk   = "border-[#5A4E3A]/15 focus:border-[#3A5C38] focus:ring-[#3A5C38]/10"
  const inputErr  = "border-[#C4714A] bg-orange-50 focus:border-[#C4714A] focus:ring-[#C4714A]/10"
  const cls = (f: keyof Address) => `${inputBase} ${errors[f] ? inputErr : inputOk}`

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-14">
      <h1 className="font-display text-4xl md:text-5xl font-medium text-[#2B2214] tracking-tight mb-1">
        Shipping Details
      </h1>
      <p className="text-[#8A7D6A] text-sm font-light mb-8">
        Tell us where to deliver your eco-friendly order
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-[#5A4E3A]/10 shadow-[0_2px_12px_rgba(43,34,20,0.08)]">
          <div className="px-6 pt-5">
            <h2 className="font-display text-lg font-medium text-[#2B2214] border-b border-[#5A4E3A]/10 pb-4">
              Delivery Address
            </h2>
          </div>

          <form onSubmit={handleSubmit} noValidate className="px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Full Name */}
              <div className="sm:col-span-2">
                <Label>Full Name</Label>
                <input className={cls("name")} placeholder="Arjun Sharma"
                  value={form.name} onChange={e => set("name", e.target.value)} />
                <Err msg={errors.name} />
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <Label>Email Address</Label>
                <input type="email" className={cls("email")} placeholder="arjun@example.com"
                  value={form.email} onChange={e => set("email", e.target.value)} />
                <Err msg={errors.email} />
              </div>

              {/* Phone */}
              <div>
                <Label>Phone Number</Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8A7D6A] font-medium pointer-events-none select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    className={`${cls("phone")} pl-10`}
                    placeholder="98765 43210"
                    value={form.phone}
                    onChange={e => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                </div>
                <Err msg={errors.phone} />
              </div>

              {/* PIN Code */}
              <div>
                <Label>PIN Code</Label>
                <input className={cls("pincode")} placeholder="400001"
                  value={form.pincode}
                  onChange={e => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} />
                <Err msg={errors.pincode} />
              </div>

              {/* City */}
              <div>
                <Label>City</Label>
                <input className={cls("city")} placeholder="Mumbai"
                  value={form.city} onChange={e => set("city", e.target.value)} />
                <Err msg={errors.city} />
              </div>

              {/* State */}
              <div>
                <Label>State</Label>
                <input className={cls("state")} placeholder="Maharashtra"
                  value={form.state} onChange={e => set("state", e.target.value)} />
                <Err msg={errors.state} />
              </div>

            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-[#3A5C38] hover:bg-[#4D7A4B] disabled:opacity-75 text-white text-sm font-medium tracking-widest uppercase rounded-xl py-3.5 transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(58,92,56,0.28)] active:translate-y-0 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin-loader" />
                  Saving address…
                </>
              ) : (
                <>
                  Continue to Payment
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M3 7.5h9M8 4l3.5 3.5L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Summary */}
        <OrderSummary
          subtotal={subtotal}
          shipping={cartData.shipping_fee}
          discount={cartData.discount_applied}
        />
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold text-[#8A7D6A] tracking-widest uppercase mb-1.5">
      {children}
    </label>
  )
}

function Err({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="mt-1 text-xs text-[#C4714A] flex items-center gap-1">
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1"/>
        <path d="M5.5 3.5v2.5M5.5 7.5v.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
      {msg}
    </p>
  )
}