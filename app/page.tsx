import CartItem from "@/components/CartItem"
import OrderSummary from "@/components/OrderSummary"
import { cartData } from "@/data/cartData"
import Link from "next/link"

export default async function CartPage() {
  const data = cartData
  const subtotal = data.cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity, 0
  )
  const total = subtotal + data.shipping_fee - data.discount_applied

  return (
    /* pb-28 so content isn't hidden behind sticky bar */
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-14 pb-28">
      <h1 className="font-display text-3xl md:text-5xl font-medium text-[#2B2214] tracking-tight mb-1">
        Your Cart
      </h1>
      <p className="text-[#8A7D6A] text-sm font-light mb-8">
        {data.cartItems.length} item{data.cartItems.length !== 1 ? "s" : ""} · ready for checkout
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

        {/* Items list */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#5A4E3A]/10 shadow-[0_2px_12px_rgba(43,34,20,0.08)] overflow-hidden">
            <div className="px-6 pt-5">
              <h2 className="font-display text-lg font-medium text-[#2B2214] border-b border-[#5A4E3A]/10 pb-4">
                Items in Cart
              </h2>
            </div>
            <div className="px-6 pb-5">
              {data.cartItems.map((item, i) => (
                <CartItem key={item.product_id} item={item} delay={i * 80} />
              ))}
            </div>
          </div>

          {/* Eco impact */}
          <div className="flex gap-3 items-start bg-[#EAF0E8] border border-[#3A5C38]/18 rounded-xl px-5 py-4">
            <span className="text-2xl leading-none mt-0.5">🌿</span>
            <div>
              <p className="text-sm font-semibold text-[#3A5C38] mb-0.5">
                You&apos;re making a difference
              </p>
              <p className="text-xs text-[#5A4E3A] leading-relaxed">
                All products are sustainably sourced and plastic-free. Your order offsets approximately 1.2 kg of carbon emissions.
              </p>
            </div>
          </div>
        </div>

        {/* Summary sidebar — desktop only */}
        <div className="hidden lg:block">
          <OrderSummary
            subtotal={subtotal}
            shipping={data.shipping_fee}
            discount={data.discount_applied}
          />
        </div>
      </div>

      {/* ── STICKY BOTTOM ACTION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#F7F3ED]/95 backdrop-blur-md border-t border-[#5A4E3A]/15 px-4 py-3 shadow-[0_-4px_20px_rgba(43,34,20,0.10)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">

          {/* Mini total — visible on mobile */}
          <div className="flex flex-col leading-tight lg:hidden">
            <span className="text-[10px] text-[#8A7D6A] uppercase tracking-widest font-semibold">Total</span>
            <span className="text-base font-bold text-[#2B2214]">₹{total.toLocaleString()}</span>
          </div>

          {/* On cart page there's no Back, just Checkout */}
          <div className="flex items-center gap-3 ml-auto">
            <Link
              href="/checkout"
              className="flex items-center gap-2 bg-[#3A5C38] hover:bg-[#4D7A4B] text-white text-sm font-medium tracking-widest uppercase rounded-xl px-6 py-2.5 transition-all hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(58,92,56,0.30)] no-underline"
            >
              <span className="hidden sm:inline">Proceed to Checkout</span>
              <span className="sm:hidden">Checkout</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}