"use client"

import { createContext, useContext, useState } from "react"
import { Address } from "@/types/address"
import { CartItem } from "@/types/cart"

interface CheckoutContextType {
  cart: CartItem[] | null
  setCart: (cart: CartItem[]) => void
  address: Address | null
  setAddress: (address: Address) => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[] | null>(null)
  const [address, setAddress] = useState<Address | null>(null)

  return (
    <CheckoutContext.Provider value={{ cart, setCart, address, setAddress }}>
      {children}
    </CheckoutContext.Provider>
  )
}

export const useCheckout = () => {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider")
  return ctx
}