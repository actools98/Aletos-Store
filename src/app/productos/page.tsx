import Link from 'next/link'
import Navbar from '@/components/storefront/Navbar'
import Footer from '@/components/storefront/Footer'
import ProductCard from '@/components/storefront/ProductCard'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Products({ searchParams }: { searchParams: { cat?: string } }) {
  const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  const where: any = { active: true }
  if (searchParams.cat) where.category = { slug: searchParams.cat }

  const products = await prisma.product.findMany({
    where,
    include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 }, category: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <>
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight mb-8">
          {searchParams.cat
            ? cats.find((c) => c.slug === searchParams.cat)?.name || 'Tienda'
            : 'Tienda'}
        </h1>

        <div className="flex flex-wrap gap-2 mb-10">
          <Link href="/productos" className={`px-4 py-2 text-[12px] font-semibold uppercase tracking-wider rounded-full border ${!searchParams.cat ? 'bg-brand-black text-white border-brand-black' : 'border-line-light bg-white'}`}>
            Todo
          </Link>
          {cats.map((c) => (
            <Link key={c.id} href={`/productos?cat=${c.slug}`}
              className={`px-4 py-2 text-[12px] font-semibold uppercase tracking-wider rounded-full border ${searchParams.cat === c.slug ? 'bg-brand-black text-white border-brand-black' : 'border-line-light bg-white'}`}>
              {c.name}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <p className="text-text-secondary">No hay productos en esta categoría.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
