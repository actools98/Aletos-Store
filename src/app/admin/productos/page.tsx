import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { eur } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    include: { images: { take: 1, orderBy: { sortOrder: 'asc' } }, category: true, variants: true },
    orderBy: { createdAt: 'desc' },
  })
  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Productos</h1>
          <p className="text-text-secondary text-sm mt-1">{products.length} en total</p>
        </div>
        <Link href="/admin/productos/nuevo" className="btn-dash">+ Crear producto</Link>
      </header>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-text-secondary">
            <tr>
              <th className="p-4">Producto</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Estado</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-light">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-12 bg-bg-store rounded-sm overflow-hidden">
                    {p.images?.[0] && <img src={p.images[0].url} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    {p.variants.length > 0 && <p className="text-xs text-text-secondary">{p.variants.length} variantes</p>}
                  </div>
                </td>
                <td className="p-4 text-text-secondary">{p.sku || '—'}</td>
                <td className="p-4 text-text-secondary">{p.category?.name || '—'}</td>
                <td className="p-4 font-semibold">{eur(p.price)}</td>
                <td className="p-4">
                  <span className={p.stock <= 3 ? 'text-red-600 font-semibold' : ''}>{p.stock}</span>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.active ? 'bg-brand-light text-brand' : 'bg-slate-100 text-slate-500'}`}>
                    {p.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/productos/${p.id}`} className="text-xs underline">Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-8 text-center text-sm text-text-secondary">Aún no hay productos.</p>}
      </div>
    </div>
  )
}
