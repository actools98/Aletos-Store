'use client'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { eur } from '@/lib/utils'

export default function CartDrawer() {
  const { open, setOpen, items, remove, updateQty, subtotal, count } = useCart()
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
      <aside className="w-full max-w-md bg-white h-full flex flex-col shadow-medium">
        <header className="flex items-center justify-between px-6 py-5 border-b border-line-light">
          <h2 className="font-display text-xl font-bold">Tu carrito ({count})</h2>
          <button onClick={() => setOpen(false)} className="text-2xl leading-none">×</button>
        </header>
        <div className="flex-1 overflow-auto p-6 space-y-5">
          {items.length === 0 && <p className="text-text-secondary text-sm">Tu carrito está vacío.</p>}
          {items.map((it) => (
            <div key={it.key} className="flex gap-4">
              <div className="w-20 h-24 bg-bg-store overflow-hidden rounded-sm flex-shrink-0">
                {it.imageUrl && <img src={it.imageUrl} alt={it.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{it.name}</p>
                {it.variantName && <p className="text-xs text-text-secondary">{it.variantName}</p>}
                <p className="text-sm font-semibold mt-1">{eur(it.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-line-light rounded-sm">
                    <button onClick={() => updateQty(it.key, it.quantity - 1)} className="px-2 py-1 text-sm">−</button>
                    <span className="px-3 text-sm">{it.quantity}</span>
                    <button onClick={() => updateQty(it.key, it.quantity + 1)} className="px-2 py-1 text-sm">+</button>
                  </div>
                  <button onClick={() => remove(it.key)} className="text-xs text-text-secondary underline">Quitar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <footer className="border-t border-line-light p-6 space-y-4">
          <div className="flex justify-between text-sm font-semibold">
            <span>Subtotal</span><span>{eur(subtotal)}</span>
          </div>
          <Link href="/checkout" onClick={() => setOpen(false)} className="btn-store w-full">
            Comprar
          </Link>
        </footer>
      </aside>
    </div>
  )
}
