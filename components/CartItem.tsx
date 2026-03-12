import { CartItem as CartItemType } from "@/types/cart"

interface Props {
  item: CartItemType
  delay?: number
}

export default function CartItem({ item, delay = 0 }: Props) {
  const lineTotal = item.product_price * item.quantity

  return (
    <div
      className="flex items-center gap-4 py-4 border-b border-[#5A4E3A]/10 last:border-0 animate-fade-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <img
        src={item.image}
        alt={item.product_name}
        className="w-17 h-17 rounded-xl object-cover bg-[#EAF0E8] border border-[#5A4E3A]/10 flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#2B2214] leading-snug mb-1">
          {item.product_name}
        </p>
        <p className="text-xs text-[#8A7D6A]">
          ₹{item.product_price.toLocaleString()} each
        </p>
      </div>

      <span className="flex items-center gap-1.5 bg-[#EAF0E8] border border-[#3A5C38]/18 rounded-full px-3 py-1 text-xs font-medium text-[#3A5C38] whitespace-nowrap">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M1 1h1.5l1.8 6.3a1 1 0 001 .7H9l1-4H3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="5.5" cy="10.5" r=".8" fill="currentColor"/>
          <circle cx="9" cy="10.5" r=".8" fill="currentColor"/>
        </svg>
        Qty: {item.quantity}
      </span>

      <p className="text-sm font-semibold text-[#2B2214] text-right min-w-[60px]">
        ₹{lineTotal.toLocaleString()}
      </p>
    </div>
  )
}