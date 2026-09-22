'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/storefront/Navbar'
import Footer from '@/components/storefront/Footer'
import { useCart } from '@/context/CartContext'
import { eur } from '@/lib/utils'

export default function Checkout() {
  const { items, subtotal } = useCart()
  const router = useRouter()
  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    address: '', city: '', postalCode: '', country: 'España', notes: '',
  })
  const [err, setErr] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) { setErr('Tu carrito está vacío.'); return }
    if (!form.customerName || !form.customerEmail || !form.address) { setErr('Completa los campos obligatorios.'); return }
    sessionStorage.setItem('aletos_checkout', JSON.stringify(form))
    router.push('/checkout/resumen')
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-[1fr_360px] gap-10">
        <form onSubmit={submit} className="space-y-8">
          <h1 className="font-display text-4xl font-extrabold">Datos de envío</h1>

          <div className="card p-6 space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-text-secondary">Contacto</p>
            <div>
              <label className="label">Nombre completo *</label>
              <input className="input" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Email *</label>
                <input type="email" className="input" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} required />
              </div>
              <div>
                <label className="label">Teléfono</label>
                <input className="input" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-text-secondary">Dirección</p>
            <div>
              <label className="label">Dirección *</label>
              <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="label">Ciudad</label>
                <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <label className="label">Código postal</label>
                <input className="input" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
              </div>
              <div>
                <label className="label">País</label>
                <input className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Notas (opcional)</label>
              <textarea className="input" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button type="submit" className="btn-store w-full md:w-auto">Continuar</button>
        </form>

        <aside className="card p-6 h-fit sticky top-6">
          <h2 className="font-display text-xl font-bold mb-4">Tu pedido</h2>
          {items.map((it) => (
            <div key={it.key} className="flex justify-between text-sm py-2 border-b border-line-light last:border-0">
              <span className="truncate pr-2">{it.quantity}× {it.name}{it.variantName ? ` · ${it.variantName}` : ''}</span>
              <span className="whitespace-nowrap">{eur(it.price * it.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold pt-4 border-t border-line-light mt-4">
            <span>Subtotal</span><span>{eur(subtotal)}</span>
          </div>
        </aside>
      </div>
      <Footer />
    </>
  )
}
