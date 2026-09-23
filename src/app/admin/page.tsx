import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { eur } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const now = new Date()
  const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startWeek = new Date(startDay); startWeek.setDate(startWeek.getDate() - 7)
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const orders = await prisma.order.findMany({
    select: { id: true, total: true, status: true, createdAt: true },
  })
  const sumRange = (from: Date) => orders.filter((o) => new Date(o.createdAt) >= from).reduce((s, o) => s + o.total, 0)
  const countStatus = (s: string) => orders.filter((o) => o.status === s).length

  const lowStock = await prisma.product.findMany({
    where: { active: true, stock: { lte: 3 } },
    include: { images: { take: 1 } },
    orderBy: { stock: 'asc' },
    take: 5,
  })

  const recent = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }, take: 6,
    include: { items: true },
  })

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Dashboard</h1>
          <p className="text-text-secondary text-sm mt-1">Vista general de la tienda</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/productos/nuevo" className="btn-dash">+ Crear producto</Link>
          <Link href="/admin/pedidos?status=pendiente" className="btn-dash-ghost">Ver pendientes</Link>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Ventas hoy</p>
          <p className="font-display text-2xl font-bold">{eur(sumRange(startDay))}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Ventas semana</p>
          <p className="font-display text-2xl font-bold">{eur(sumRange(startWeek))}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Ventas mes</p>
          <p className="font-display text-2xl font-bold">{eur(sumRange(startMonth))}</p>
        </div>
        <div className="rounded-2xl p-5 text-white shadow-medium" style={{ backgroundImage: 'linear-gradient(135deg,#1A5D3A 0%,#0D3B22 100%)' }}>
          <p className="text-xs uppercase tracking-wider mb-2 opacity-80">Pedidos totales</p>
          <p className="font-display text-2xl font-bold">{orders.length}</p>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { k: 'pendiente', label: 'Pendientes', color: 'text-amber-600' },
          { k: 'pagado', label: 'Pagados', color: 'text-blue-600' },
          { k: 'enviado', label: 'Enviados', color: 'text-emerald-600' },
          { k: 'entregado', label: 'Entregados', color: 'text-slate-600' },
        ].map((s) => (
          <Link key={s.k} href={`/admin/pedidos?status=${s.k}`} className="card p-5 hover:shadow-medium transition">
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">{s.label}</p>
            <p className={`font-display text-2xl font-bold ${s.color}`}>{countStatus(s.k)}</p>
          </Link>
        ))}
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold">Stock bajo</h2>
            <Link href="/admin/inventario" className="text-xs underline text-text-secondary">Gestionar</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-text-secondary">Todo en orden. No hay productos con stock bajo.</p>
          ) : (
            <ul className="space-y-3">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <div className="w-10 h-12 bg-bg-store rounded-sm overflow-hidden">
                    {p.images?.[0] && <img src={p.images[0].url} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-text-secondary">{p.sku || '—'}</p>
                  </div>
                  <span className="text-sm font-semibold text-red-600">{p.stock} ud</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold">Pedidos recientes</h2>
            <Link href="/admin/pedidos" className="text-xs underline text-text-secondary">Ver todos</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-text-secondary">Aún no hay pedidos.</p>
          ) : (
            <ul className="divide-y divide-line-light">
              {recent.map((o) => (
                <li key={o.id} className="py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{o.customerName}</p>
                    <p className="text-xs text-text-secondary">#{o.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{eur(o.total)}</p>
                    <p className="text-xs text-text-secondary capitalize">{o.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
