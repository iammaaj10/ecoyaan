import { CartData } from "@/types/cart"
import CartItem from "@/components/CartItem"
import OrderSummary from "@/components/OrderSummary"

async function getCartData(): Promise<CartData> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const res = await fetch(`${base}/api/cart`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch cart")
  return res.json()
}

export default async function CartPage() {
  const data = await getCartData()
  const subtotal = data.cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity, 0
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-14">
      <h1 className="font-display text-4xl md:text-5xl font-medium text-[#2B2214] tracking-tight mb-1">
        Your Cart
      </h1>
      <p className="text-[#8A7D6A] text-sm font-light mb-8">
        {data.cartItems.length} items · ready for checkout
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

        {/* Summary sidebar */}
        <OrderSummary
          subtotal={subtotal}
          shipping={data.shipping_fee}
          discount={data.discount_applied}
          ctaLabel="Proceed to Checkout"
          ctaHref="/checkout"
        />
      </div>
    </div>
  )
}