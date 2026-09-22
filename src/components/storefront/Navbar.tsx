'use client'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const { count, setOpen } = useCart()
  return (
    <>
      <div className="bg-brand-black text-white text-[11px] tracking-[0.15em] uppercase">
        <div className="max-w-[1400px] mx-auto px-6 h-8 flex items-center justify-center">
          Envío gratis en pedidos superiores a 60€ · Devoluciones en 30 días
        </div>
      </div>
      <header className="border-b border-black/5">
        <nav className="max-w-[1400px] mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex-1 flex gap-8 text-[12px] font-semibold uppercase tracking-wider">
            <Link href="/productos?cat=camisetas">Camisetas</Link>
            <Link href="/productos?cat=chaquetas" className="hidden md:inline">Chaquetas</Link>
            <Link href="/productos?cat=polares" className="hidden md:inline">Polares</Link>
          </div>
          <Link href="/" className="font-display text-2xl font-extrabold tracking-tight">
            ALETOS
          </Link>
          <div className="flex-1 flex justify-end items-center gap-6 text-[12px] font-semibold uppercase tracking-wider">
            <Link href="/productos" className="hidden md:inline">Tienda</Link>
            <button onClick={() => setOpen(true)} className="relative">
              Carrito
              {count > 0 && (
                <span className="absolute -top-2 -right-4 bg-brand text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>
      <CartDrawer />
    </>
  )
}
