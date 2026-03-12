import Link from "next/link"

interface Props {
  subtotal: number
  shipping: number
  discount?: number
  ctaLabel?: string
  ctaHref?: string
  onCta?: () => void
  ctaDisabled?: boolean
  ctaLoading?: boolean
}

export default function OrderSummary({
  subtotal, shipping, discount = 0,
  ctaLabel, ctaHref, onCta, ctaDisabled, ctaLoading,
}: Props) {
  const total = subtotal + shipping - discount

  return (
    <div className="bg-white rounded-2xl border border-[#5A4E3A]/10 shadow-[0_2px_12px_rgba(43,34,20,0.08)] sticky top-20">

      <div className="px-6 pt-5">
        <h3 className="font-display text-lg font-medium text-[#2B2214] border-b border-[#5A4E3A]/10 pb-4">
          Order Summary
        </h3>
      </div>

      <div className="px-6 py-5 flex flex-col gap-4">

        {/* Eco badge */}
        <div className="flex items-center gap-2.5 bg-[#EAF0E8] border border-[#3A5C38]/18 rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#3A5C38]">
          <span className="text-base">🌱</span>
          Every purchase plants one tree
        </div>

        {/* Line items */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm text-[#5A4E3A]">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-[#5A4E3A]">
            <span>Shipping</span>
            {shipping === 0
              ? <span className="bg-[#EAF0E8] text-[#3A5C38] text-[10px] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase">Free</span>
              : <span>₹{shipping.toLocaleString()}</span>
            }
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-[#5A4E3A]">
              <span>Discount</span>
              <span className="bg-orange-50 text-[#C4714A] text-xs font-semibold px-2 py-0.5 rounded-full">
                −₹{discount.toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between text-base font-semibold text-[#2B2214] pt-3 border-t border-[#5A4E3A]/10 mt-1">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>

        {/* CTA */}
        {ctaLabel && (
          <>
            {ctaHref ? (
              <Link
                href={ctaHref}
                className="w-full flex items-center justify-center gap-2 bg-[#3A5C38] hover:bg-[#4D7A4B] text-white text-sm font-medium tracking-widest uppercase rounded-xl py-3.5 transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(58,92,56,0.28)] no-underline"
              >
                {ctaLabel}
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M3 7.5h9M8 4l3.5 3.5L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ) : (
              <button
                onClick={onCta}
                disabled={ctaDisabled || ctaLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#3A5C38] hover:bg-[#4D7A4B] disabled:opacity-70 text-white text-sm font-medium tracking-widest uppercase rounded-xl py-3.5 transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(58,92,56,0.28)] disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                {ctaLoading
                  ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin-loader" />Processing…</>
                  : <>{ctaLabel}<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 7.5h9M8 4l3.5 3.5L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>
                }
              </button>
            )}

            <div className="flex items-center justify-center gap-4 flex-wrap">
              {[["🔒","Secure"],["🛡️","Encrypted"],["♻️","Eco-certified"]].map(([icon, label]) => (
                <span key={label} className="flex items-center gap-1 text-[11px] text-[#8A7D6A]">
                  {icon} {label}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}