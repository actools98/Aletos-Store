'use client'
import Link from 'next/link'
import Navbar from '@/components/storefront/Navbar'
import Footer from '@/components/storefront/Footer'
import { useCart } from '@/context/CartContext'
import { eur } from '@/lib/utils'

export default function CartPage() {
  const { items, remove, updateQty, subtotal } = useCart()
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl font-extrabold mb-8">Carrito</h1>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary mb-6">Tu carrito está vacío.</p>
            <Link href="/productos" className="btn-store">Ver productos</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-[1fr_360px] gap-10">
            <div className="space-y-5">
              {items.map((it) => (
                <div key={it.key} className="flex gap-4 border-b border-line-light pb-5">
                  <div className="w-24 h-28 bg-white overflow-hidden flex-shrink-0">
                    {it.imageUrl && <img src={it.imageUrl} alt={it.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{it.name}</p>
                    {it.variantName && <p className="text-sm text-text-secondary">{it.variantName}</p>}
                    <p className="text-sm font-semibold mt-1">{eur(it.price)}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-line-light">
                        <button onClick={() => updateQty(it.key, it.quantity - 1)} className="px-3 py-1">−</button>
                        <span className="px-3">{it.quantity}</span>
                        <button onClick={() => updateQty(it.key, it.quantity + 1)} className="px-3 py-1">+</button>
                      </div>
                      <button onClick={() => remove(it.key)} className="text-xs underline text-text-secondary">Quitar</button>
                    </div>
                  </div>
                  <p className="font-semibold whitespace-nowrap">{eur(it.price * it.quantity)}</p>
                </div>
              ))}
            </div>

            <aside className="card p-6 h-fit sticky top-6">
              <h2 className="font-display text-xl font-bold mb-4">Resumen</h2>
              <div className="flex justify-between text-sm mb-2"><span>Subtotal</span><span>{eur(subtotal)}</span></div>
              <div className="flex justify-between text-sm mb-6 text-text-secondary"><span>Envío</span><span>Calculado al finalizar</span></div>
              <Link href="/checkout" className="btn-store w-full">Comprar</Link>
            </aside>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
