'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = ['pendiente', 'pagado', 'preparando', 'enviado', 'entregado', 'cancelado', 'reembolsado']
const PAYMENT = ['pendiente', 'pagado', 'reembolsado', 'fallido']
const SHIPPING = ['pendiente', 'preparando', 'enviado', 'entregado']

export default function OrderEditor({ order }: { order: any }) {
  const [form, setForm] = useState({
    status: order.status,
    paymentStatus: order.paymentStatus,
    shippingStatus: order.shippingStatus,
    trackingNumber: order.trackingNumber || '',
    internalNotes: order.internalNotes || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const save = async () => {
    setSaving(true)
    await fetch(`/api/orders/${order.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    setSaving(false); setSaved(true); router.refresh()
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="card p-6 space-y-4">
      <h2 className="font-display font-bold">Gestión del pedido</h2>
      <div>
        <label className="label">Estado del pedido</label>
        <select className="input capitalize" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Estado del pago</label>
        <select className="input capitalize" value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}>
          {PAYMENT.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Estado del envío</label>
        <select className="input capitalize" value={form.shippingStatus} onChange={(e) => setForm({ ...form, shippingStatus: e.target.value })}>
          {SHIPPING.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Nº de seguimiento</label>
        <input className="input" value={form.trackingNumber} onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })} />
      </div>
      <div>
        <label className="label">Notas internas</label>
        <textarea className="input" rows={4} value={form.internalNotes} onChange={(e) => setForm({ ...form, internalNotes: e.target.value })} />
      </div>
      <button onClick={save} disabled={saving} className="btn-dash w-full">
        {saving ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar cambios'}
      </button>
      <button onClick={() => window.print()} className="btn-dash-ghost w-full">Imprimir factura / comprobante</button>
    </div>
  )
}
