import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { eur, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const STATUSES = ['pendiente', 'pagado', 'preparando', 'enviado', 'entregado', 'cancelado', 'reembolsado']

export default async function Orders({ searchParams }: { searchParams: { status?: string; q?: string } }) {
  const where: any = {}
  if (searchParams.status) where.status = searchParams.status
  if (searchParams.q) where.OR = [
    { customerName: { contains: searchParams.q } },
    { customerEmail: { contains: searchParams.q } },
    { orderNumber: { contains: searchParams.q } },
  ]

  const orders = await prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, include: { items: true } })

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-extrabold mb-6">Pedidos</h1>

      <form className="flex gap-2 mb-6">
        <input name="q" placeholder="Buscar cliente, email o #pedido" defaultValue={searchParams.q} className="input max-w-sm" />
        <select name="status" defaultValue={searchParams.status || ''} className="input max-w-[180px]">
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <button className="btn-dash">Filtrar</button>
      </form>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-text-secondary">
            <tr>
              <th className="p-4">Pedido</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Pago</th>
              <th className="p-4">Total</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-light">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono text-xs">{o.orderNumber}</td>
                <td className="p-4">
                  <p className="font-medium">{o.customerName}</p>
                  <p className="text-xs text-text-secondary">{o.customerEmail}</p>
                </td>
                <td className="p-4 text-text-secondary">{formatDate(o.createdAt)}</td>
                <td className="p-4"><StatusBadge status={o.status} /></td>
                <td className="p-4 text-xs capitalize text-text-secondary">{o.paymentStatus}</td>
                <td className="p-4 font-semibold">{eur(o.total)}</td>
                <td className="p-4 text-right"><Link href={`/admin/pedidos/${o.id}`} className="text-xs underline">Ver</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-8 text-center text-sm text-text-secondary">No hay pedidos.</p>}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pendiente: 'bg-amber-100 text-amber-700',
    pagado: 'bg-blue-100 text-blue-700',
    preparando: 'bg-indigo-100 text-indigo-700',
    enviado: 'bg-emerald-100 text-emerald-700',
    entregado: 'bg-slate-200 text-slate-700',
    cancelado: 'bg-red-100 text-red-700',
    reembolsado: 'bg-purple-100 text-purple-700',
  }
  return <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${colors[status] || 'bg-slate-100'}`}>{status}</span>
}
