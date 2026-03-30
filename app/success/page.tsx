import Link from "next/link"

function genOrderId() {
  return "ECO" + Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function SuccessPage() {
  const orderId = genOrderId()

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-[#5A4E3A]/10 shadow-[0_8px_32px_rgba(43,34,20,0.14)] px-8 py-10 max-w-md w-full text-center animate-pop-in">

        <div className="w-20 h-20 rounded-full bg-[#EAF0E8] border border-[#3A5C38]/18 flex items-center justify-center mx-auto mb-6 animate-check-bounce">
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <circle cx="19" cy="19" r="18" stroke="#3A5C38" strokeWidth="1.5"/>
            <path d="M11 19l5.5 5.5L27 13" stroke="#3A5C38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="font-display text-4xl font-medium text-[#2B2214] mb-2">
          Order Placed!
        </h1>
        <p className="text-sm text-[#5A4E3A] leading-relaxed mb-5">
          Thank you for choosing eco-friendly. Your order is confirmed and will be packed with 100% plastic-free materials. 🌿
        </p>

        
        <div className="inline-block bg-[#F7F3ED] border border-[#5A4E3A]/10 rounded-xl px-5 py-2.5 font-mono text-sm font-bold text-[#3A5C38] tracking-widest mb-6">
          Order #{orderId}
        </div>

        
        <div className="flex items-start gap-3 bg-[#EAF0E8] border border-[#3A5C38]/18 rounded-xl px-4 py-3.5 text-left mb-6">
          <span className="text-2xl leading-none">📦</span>
          <div>
            <p className="text-sm font-semibold text-[#3A5C38] mb-0.5">
              Estimated delivery in 3–5 days
            </p>
            <p className="text-xs text-[#8A7D6A]">
              A confirmation email has been sent to your inbox
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 bg-[#3A5C38] hover:bg-[#4D7A4B] text-white text-sm font-medium tracking-widest uppercase rounded-xl py-3.5 transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(58,92,56,0.28)] no-underline mb-4"
        >
          Continue Shopping
        </Link>

       
        <div className="flex items-center justify-center gap-2 text-xs text-[#8A7D6A] bg-[#F7F3ED] rounded-xl px-4 py-3">
          <span>🌱</span>
          <span>
            Your purchase will plant{" "}
            <strong className="text-[#3A5C38]">1 tree</strong>{" "}
            through our reforestation partners
          </span>
        </div>

      </div>
    </div>
  )
}