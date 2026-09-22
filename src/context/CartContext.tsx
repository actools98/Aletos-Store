'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type CartItem = {
  key: string
  productId: string
  variantId?: string | null
  name: string
  variantName?: string | null
  price: number
  imageUrl?: string | null
  quantity: number
  sku?: string | null
  slug?: string
}

type Ctx = {
  items: CartItem[]
  add: (i: Omit<CartItem, 'key' | 'quantity'> & { quantity?: number }) => void
  remove: (key: string) => void
  updateQty: (key: string, qty: number) => void
  clear: () => void
  subtotal: number
  count: number
  open: boolean
  setOpen: (b: boolean) => void
}

const CartCtx = createContext<Ctx | null>(null)
const KEY = 'aletos_cart_v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setItems(JSON.parse(raw)) } catch {}
  }, [])
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)) }, [items])

  const add: Ctx['add'] = (item) => {
    const key = `${item.productId}::${item.variantId ?? ''}`
    setItems((prev) => {
      const found = prev.find((p) => p.key === key)
      if (found) return prev.map((p) => p.key === key ? { ...p, quantity: p.quantity + (item.quantity ?? 1) } : p)
      return [...prev, { ...item, key, quantity: item.quantity ?? 1 }]
    })
    setOpen(true)
  }
  const remove = (key: string) => setItems((p) => p.filter((i) => i.key !== key))
  const updateQty = (key: string, qty: number) =>
    setItems((p) => p.map((i) => i.key === key ? { ...i, quantity: Math.max(1, qty) } : i))
  const clear = () => setItems([])
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartCtx.Provider value={{ items, add, remove, updateQty, clear, subtotal, count, open, setOpen }}>
      {children}
    </CartCtx.Provider>
  )
}

export function useCart() {
  const c = useContext(CartCtx)
  if (!c) throw new Error('useCart must be inside CartProvider')
  return c
}
