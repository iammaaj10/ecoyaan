"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Address } from "@/types/address"
import { CartItem } from "@/types/cart"

interface CheckoutContextType {
  cart: CartItem[] | null
  setCart: (cart: CartItem[]) => void
  addresses: Address[]
  selectedAddressId: string | null
  addAddress: (address: Address) => void
  updateAddress: (id: string, address: Address) => void
  deleteAddress: (id: string) => void
  selectAddress: (id: string) => void
  
  address: Address | null
  setAddress: (address: Address) => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCartState] = useState<CartItem[] | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  
  useEffect(() => {
    try {
      const savedAddresses = localStorage.getItem("ecoyaan_addresses")
      const savedSelected = localStorage.getItem("ecoyaan_selected_address")
      const savedCart = localStorage.getItem("ecoyaan_cart")
      if (savedAddresses) setAddresses(JSON.parse(savedAddresses))
      if (savedSelected) setSelectedAddressId(savedSelected)
      if (savedCart) setCartState(JSON.parse(savedCart))
    } catch {}
    setHydrated(true)
  }, [])

  
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem("ecoyaan_addresses", JSON.stringify(addresses))
  }, [addresses, hydrated])


  useEffect(() => {
    if (!hydrated) return
    if (selectedAddressId) localStorage.setItem("ecoyaan_selected_address", selectedAddressId)
    else localStorage.removeItem("ecoyaan_selected_address")
  }, [selectedAddressId, hydrated])

  const setCart = (cart: CartItem[]) => {
    setCartState(cart)
    localStorage.setItem("ecoyaan_cart", JSON.stringify(cart))
  }

  const addAddress = (address: Address) => {
    const id = `addr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const newAddr = { ...address, id }
    setAddresses(prev => {
      const updated = [...prev, newAddr]
      return updated
    })
    setSelectedAddressId(id)
  }

  const updateAddress = (id: string, address: Address) => {
    setAddresses(prev => prev.map(a => (a.id === id ? { ...address, id } : a)))
  }

  const deleteAddress = (id: string) => {
    setAddresses(prev => {
      const updated = prev.filter(a => a.id !== id)
      if (selectedAddressId === id) {
        setSelectedAddressId(updated.length > 0 ? updated[0].id! : null)
      }
      return updated
    })
  }

  const selectAddress = (id: string) => setSelectedAddressId(id)

  
  const address = addresses.find(a => a.id === selectedAddressId) ?? null
  const setAddress = (addr: Address) => addAddress(addr)

  return (
    <CheckoutContext.Provider value={{
      cart, setCart,
      addresses, selectedAddressId,
      addAddress, updateAddress, deleteAddress, selectAddress,
      address, setAddress,
    }}>
      {children}
    </CheckoutContext.Provider>
  )
}

export const useCheckout = () => {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider")
  return ctx
}