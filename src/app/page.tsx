import Link from 'next/link'
import Navbar from '@/components/storefront/Navbar'
import Footer from '@/components/storefront/Footer'
import ProductCard from '@/components/storefront/ProductCard'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 }, category: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })

  return (
    <>
      <Navbar />
      <section className="relative max-w-[1400px] mx-auto px-6 pt-16 pb-24 overflow-hidden">
        <h1 className="font-display font-black text-[clamp(64px,15vw,200px)] leading-[0.85] tracking-tighter uppercase">
          Escala
        </h1>
        <div className="grid md:grid-cols-2 gap-8 items-end -mt-4">
          <div className="aspect-[4/3] md:aspect-[3/2] overflow-hidden bg-white">
            <img
              src="https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1400&q=80"
              alt="Escalador"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="pb-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-text-secondary mb-4">
              Colección 2025
            </p>
            <p className="font-display text-3xl md:text-4xl font-semibold leading-tight max-w-md">
              Equipación pensada para quienes viven la roca.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/productos" className="btn-store">Ver colección</Link>
              <Link href="/productos?cat=chaquetas" className="btn-store-outline">Chaquetas</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-semibold">Novedades</h2>
          <Link href="/productos" className="text-link text-[12px] font-semibold uppercase underline underline-offset-4">
            Ver todo
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="text-text-secondary">Aún no hay productos. Añádelos desde el panel de control.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </section>

      <Footer />
    </>
  )
}
