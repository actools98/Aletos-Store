'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/storefront/Navbar'
import Footer from '@/components/storefront/Footer'
import { useCart } from '@/context/CartContext'
import { eur } from '@/lib/utils'

export default function Summary() {
  const { items, subtotal, clear } = useCart()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const raw = sessionStorage.getItem('aletos_checkout')
    if (!raw) { router.push('/checkout'); return }
    setData(JSON.parse(raw))
  }, [router])

  const confirm = async () => {
    if (!data || items.length === 0) return
    setLoading(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, items }),
    })
    if (res.ok) {
      clear()
      sessionStorage.removeItem('aletos_checkout')
      setDone(true)
    } else {
      alert('Hubo un error al crear el pedido. Inténtalo de nuevo.')
      setLoading(false)
    }
  }

  if (done) {
    return (
      <>
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-light mx-auto flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A5D3A" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h1 className="font-display text-4xl font-extrabold mb-4">¡Gracias por tu compra!</h1>
          <p className="text-text-secondary mb-8">
            En breve nos pondremos en contacto contigo para finalizar la compra.
          </p>
          <button onClick={() => router.push('/')} className="btn-store">Volver a la tienda</button>
        </div>
        <Footer />
      </>
    )
  }

  if (!data) return null

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-8">
          <h1 className="font-display text-4xl font-extrabold">Resumen del pedido</h1>
          <div className="card p-6">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-text-secondary mb-3">Envío a</p>
            <p className="font-medium">{data.customerName}</p>
            <p className="text-sm text-text-secondary">{data.address}, {data.city} {data.postalCode}</p>
            <p className="text-sm text-text-secondary">{data.country}</p>
            <p className="text-sm text-text-secondary mt-2">{data.customerEmail} · {data.customerPhone}</p>
            {data.notes && <p className="text-sm mt-3 italic text-text-secondary">Nota: {data.notes}</p>}
          </div>
          <div className="card p-6">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-text-secondary mb-4">Productos</p>
            {items.map((it) => (
              <div key={it.key} className="flex items-center gap-4 py-3 border-b border-line-light last:border-0">
                <div className="w-14 h-16 bg-bg-store overflow-hidden flex-shrink-0">
                  {it.imageUrl && <img src={it.imageUrl} className="w-full h-full object-cover" alt={it.name} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{it.name}</p>
                  {it.variantName && <p className="text-xs text-text-secondary">{it.variantName}</p>}
                  <p className="text-xs text-text-secondary">Cant: {it.quantity}</p>
                </div>
                <p className="text-sm font-semibold">{eur(it.price * it.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="card p-6 h-fit sticky top-6">
          <h2 className="font-display text-xl font-bold mb-4">Total</h2>
          <div className="flex justify-between text-sm mb-2"><span>Subtotal</span><span>{eur(subtotal)}</span></div>
          <div className="flex justify-between text-sm mb-6 text-text-secondary"><span>Envío</span><span>A convenir</span></div>
          <button onClick={confirm} disabled={loading} className="btn-store w-full">
            {loading ? 'Enviando…' : 'Continuar compra'}
          </button>
          <button onClick={() => router.back()} className="w-full text-center text-xs mt-4 underline text-text-secondary">
            Volver a editar
          </button>
        </aside>
      </div>
      <Footer />
    </>
  )
}
