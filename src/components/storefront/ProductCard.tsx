import Link from 'next/link'
import { eur } from '@/lib/utils'

export default function ProductCard({ p }: { p: any }) {
  const img = p.images?.[0]?.url
  return (
    <Link href={`/productos/${p.slug}`} className="group block">
      <div className="aspect-[3/4] bg-white overflow-hidden">
        {img
          ? <img src={img} alt={p.images?.[0]?.alt || p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">Sin imagen</div>}
      </div>
      <div className="pt-3 flex justify-between items-start gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{p.name}</p>
          {p.category && <p className="text-xs text-text-secondary">{p.category.name}</p>}
        </div>
        <p className="text-sm font-semibold whitespace-nowrap">{eur(p.price)}</p>
      </div>
    </Link>
  )
}
