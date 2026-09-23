import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { eur, formatDate } from '@/lib/utils'
import OrderEditor from '@/components/admin/OrderEditor'

export const dynamic = 'force-dynamic'

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const o = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true } })
  if (!o) notFound()

  return (
    <div className="p-8 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <header>
          <p className="text-xs text-text-secondary uppercase tracking-wider">Pedido</p>
          <h1 className="font-display text-3xl font-extrabold">{o.orderNumber}</h1>
          <p className="text-sm text-text-secondary">{formatDate(o.createdAt)}</p>
        </header>

        <div className="card p-6">
          <h2 className="font-display font-bold mb-3">Cliente y envío</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Contacto</p>
              <p className="font-medium">{o.customerName}</p>
              <p>{o.customerEmail}</p>
              {o.customerPhone && <p>{o.customerPhone}</p>}
            </div>
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Dirección</p>
              <p>{o.address}</p>
              <p>{o.postalCode} {o.city}</p>
              <p>{o.country}</p>
            </div>
          </div>
          {o.notes && <p className="mt-4 text-sm italic text-text-secondary">Nota del cliente: {o.notes}</p>}
        </div>

        <div className="card p-6">
          <h2 className="font-display font-bold mb-4">Productos</h2>
          <div className="divide-y divide-line-light">
            {o.items.map((it) => (
              <div key={it.id} className="py-3 flex items-center gap-4">
                <div className="w-12 h-14 bg-bg-store rounded-sm overflow-hidden">
                  {it.imageUrl && <img src={it.imageUrl} className="w-full h-full object-cover" alt="" />}
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
          <div className="mt-6 pt-4 border-t border-line-light space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{eur(o.subtotal)}</span></div>
            <div className="flex justify-between"><span>Impuestos</span><span>{eur(o.tax)}</span></div>
            <div className="flex justify-between"><span>Envío</span><span>{eur(o.shipping)}</span></div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-line-light"><span>Total</span><span>{eur(o.total)}</span></div>
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <OrderEditor order={o} />
      </aside>
    </div>
  )
}
