"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCheckout } from "@/context/CheckoutContext"
import { Address } from "@/types/address"
import { cartData } from "@/data/cartData"
import OrderSummary from "@/components/OrderSummary"

type Errors = Partial<Record<keyof Address, string>>

const EMPTY_FORM: Omit<Address, "id"> = {
  name: "", email: "", phone: "", city: "", state: "", pincode: "",
}

export default function CheckoutPage() {
  const router = useRouter()
  const { addresses, selectedAddressId, addAddress, updateAddress, deleteAddress, selectAddress } = useCheckout()

  // UI state
  const [mode, setMode] = useState<"list" | "new" | "edit">(
    addresses.length === 0 ? "new" : "list"
  )
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Address, "id">>(EMPTY_FORM)
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

  const setField = (field: keyof Address, value: string) => {
    setForm(p => ({ ...p, [field]: value }))
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }))
  }

  const openNew = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setEditId(null)
    setMode("new")
  }

  const openEdit = (addr: Address) => {
    setForm({ name: addr.name, email: addr.email, phone: addr.phone, city: addr.city, state: addr.state, pincode: addr.pincode })
    setErrors({})
    setEditId(addr.id!)
    setMode("edit")
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    if (mode === "edit" && editId) {
      updateAddress(editId, { ...form, id: editId })
    } else {
      addAddress(form as Address)
    }
    setTimeout(() => {
      setSubmitting(false)
      setMode("list")
    }, 300)
  }

  const handleContinue = () => {
    if (!selectedAddressId) return
    setSubmitting(true)
    setTimeout(() => router.push("/payment"), 400)
  }

  const inputBase = "w-full px-3.5 py-2.5 rounded-xl text-sm text-[#2B2214] bg-[#F7F3ED] border transition-all outline-none placeholder:text-[#8A7D6A]/50 focus:bg-white focus:ring-2"
  const inputOk   = "border-[#5A4E3A]/15 focus:border-[#3A5C38] focus:ring-[#3A5C38]/10"
  const inputErr  = "border-[#C4714A] bg-orange-50 focus:border-[#C4714A] focus:ring-[#C4714A]/10"
  const cls = (f: keyof Address) => `${inputBase} ${errors[f] ? inputErr : inputOk}`

  return (
    /* pb-28 so content isn't hidden behind sticky bar */
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-14 pb-28">
      <h1 className="font-display text-3xl md:text-5xl font-medium text-[#2B2214] tracking-tight mb-1">
        Shipping Details
      </h1>
      <p className="text-[#8A7D6A] text-sm font-light mb-8">
        Choose or add a delivery address
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-5">

          {/* ── ADDRESS LIST ── */}
          {(mode === "list" || addresses.length > 0) && (
            <div className="bg-white rounded-2xl border border-[#5A4E3A]/10 shadow-[0_2px_12px_rgba(43,34,20,0.08)]">
              <div className="px-6 pt-5">
                <div className="flex items-center justify-between border-b border-[#5A4E3A]/10 pb-4">
                  <h2 className="font-display text-lg font-medium text-[#2B2214]">
                    Saved Addresses
                    {addresses.length > 0 && (
                      <span className="ml-2 text-xs font-normal text-[#8A7D6A]">({addresses.length})</span>
                    )}
                  </h2>
                  <button
                    onClick={openNew}
                    className="flex items-center gap-1.5 text-xs text-[#3A5C38] font-semibold border border-[#3A5C38]/30 rounded-lg px-3 py-1.5 hover:bg-[#EAF0E8] transition-colors"
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Add New
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 flex flex-col gap-3">
                {addresses.length === 0 && (
                  <p className="text-sm text-[#8A7D6A] py-2">No saved addresses yet.</p>
                )}
                {addresses.map(addr => (
                  <AddressCard
                    key={addr.id}
                    addr={addr}
                    selected={addr.id === selectedAddressId}
                    onSelect={() => selectAddress(addr.id!)}
                    onEdit={() => openEdit(addr)}
                    onDelete={() => deleteAddress(addr.id!)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── ADD / EDIT FORM ── */}
          {(mode === "new" || mode === "edit") && (
            <div className="bg-white rounded-2xl border border-[#5A4E3A]/10 shadow-[0_2px_12px_rgba(43,34,20,0.08)]">
              <div className="px-6 pt-5">
                <div className="flex items-center justify-between border-b border-[#5A4E3A]/10 pb-4">
                  <h2 className="font-display text-lg font-medium text-[#2B2214]">
                    {mode === "edit" ? "Edit Address" : "New Address"}
                  </h2>
                  {addresses.length > 0 && (
                    <button
                      onClick={() => setMode("list")}
                      className="text-xs text-[#8A7D6A] hover:text-[#2B2214] transition-colors"
                    >
                      ✕ Cancel
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSave} noValidate className="px-6 py-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="sm:col-span-2">
                    <Label>Full Name</Label>
                    <input className={cls("name")} placeholder="Arjun Sharma"
                      value={form.name} onChange={e => setField("name", e.target.value)} />
                    <Err msg={errors.name} />
                  </div>

                  <div className="sm:col-span-2">
                    <Label>Email Address</Label>
                    <input type="email" className={cls("email")} placeholder="arjun@example.com"
                      value={form.email} onChange={e => setField("email", e.target.value)} />
                    <Err msg={errors.email} />
                  </div>

                  <div>
                    <Label>Phone Number</Label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8A7D6A] font-medium pointer-events-none select-none">+91</span>
                      <input type="tel" className={`${cls("phone")} pl-10`} placeholder="98765 43210"
                        value={form.phone}
                        onChange={e => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} />
                    </div>
                    <Err msg={errors.phone} />
                  </div>

                  <div>
                    <Label>PIN Code</Label>
                    <input className={cls("pincode")} placeholder="400001"
                      value={form.pincode}
                      onChange={e => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} />
                    <Err msg={errors.pincode} />
                  </div>

                  <div>
                    <Label>City</Label>
                    <input className={cls("city")} placeholder="Mumbai"
                      value={form.city} onChange={e => setField("city", e.target.value)} />
                    <Err msg={errors.city} />
                  </div>

                  <div>
                    <Label>State</Label>
                    <input className={cls("state")} placeholder="Maharashtra"
                      value={form.state} onChange={e => setField("state", e.target.value)} />
                    <Err msg={errors.state} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-[#3A5C38] hover:bg-[#4D7A4B] disabled:opacity-75 text-white text-sm font-medium tracking-widest uppercase rounded-xl py-3 transition-all"
                >
                  {submitting ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                  ) : mode === "edit" ? "Update Address" : "Save Address"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* SUMMARY SIDEBAR — hidden on mobile (shown above sticky bar) */}
        <div className="hidden lg:block">
          <OrderSummary
            subtotal={subtotal}
            shipping={cartData.shipping_fee}
            discount={cartData.discount_applied}
          />
        </div>
      </div>

      {/* ── STICKY BOTTOM ACTION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#F7F3ED]/95 backdrop-blur-md border-t border-[#5A4E3A]/15 px-4 py-3 shadow-[0_-4px_20px_rgba(43,34,20,0.10)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Order total — visible on mobile */}
          <div className="flex flex-col leading-tight lg:hidden">
            <span className="text-[10px] text-[#8A7D6A] uppercase tracking-widest font-semibold">Total</span>
            <span className="text-base font-bold text-[#2B2214]">
              ₹{(subtotal + cartData.shipping_fee - cartData.discount_applied).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#5A4E3A] bg-white border border-[#5A4E3A]/20 rounded-xl hover:bg-[#EDE7DB] transition-all no-underline"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hidden sm:inline">Back to Cart</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <button
              onClick={handleContinue}
              disabled={!selectedAddressId || submitting}
              className="flex items-center gap-2 bg-[#3A5C38] hover:bg-[#4D7A4B] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium tracking-widest uppercase rounded-xl px-6 py-2.5 transition-all hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(58,92,56,0.30)] active:translate-y-0"
            >
              {submitting ? (
                <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Please wait…</>
              ) : (
                <>
                  <span className="hidden sm:inline">Continue to Payment</span>
                  <span className="sm:hidden">Continue</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Address Card ── */
function AddressCard({
  addr, selected, onSelect, onEdit, onDelete
}: {
  addr: Address
  selected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative flex items-start gap-3 rounded-xl border px-4 py-3.5 cursor-pointer transition-all
        ${selected
          ? "border-[#3A5C38] bg-[#EAF0E8]"
          : "border-[#5A4E3A]/15 bg-[#F7F3ED] hover:border-[#3A5C38]/40 hover:bg-[#EAF0E8]/50"}`}
    >
      {/* Radio */}
      <div className={`mt-0.5 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
        ${selected ? "border-[#3A5C38] bg-[#3A5C38]" : "border-[#5A4E3A]/30 bg-white"}`}>
        {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#2B2214]">{addr.name}</p>
        <p className="text-xs text-[#5A4E3A] mt-0.5 leading-relaxed">
          {addr.city}, {addr.state} — {addr.pincode}
        </p>
        <p className="text-xs text-[#8A7D6A]">+91 {addr.phone} · {addr.email}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg text-[#8A7D6A] hover:text-[#3A5C38] hover:bg-white transition-colors"
          title="Edit"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M9 1.5l2.5 2.5L4 11.5H1.5V9L9 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-[#8A7D6A] hover:text-[#C4714A] hover:bg-orange-50 transition-colors"
          title="Delete"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 3.5h9M5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M10.5 3.5l-.8 7a.5.5 0 01-.5.5H3.8a.5.5 0 01-.5-.5l-.8-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>
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