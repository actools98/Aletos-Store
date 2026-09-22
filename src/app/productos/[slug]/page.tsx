import { notFound } from 'next/navigation'
import Navbar from '@/components/storefront/Navbar'
import Footer from '@/components/storefront/Footer'
import AddToCart from '@/components/storefront/AddToCart'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: { orderBy: { sortOrder: 'asc' } }, variants: true, category: true },
  })
  if (!p || !p.active) notFound()

  const [main, ...rest] = p.images

  return (
    <>
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-[3/4] bg-white overflow-hidden">
            {main
              ? <img src={main.url} alt={main.alt || p.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-text-secondary">Sin imagen</div>}
          </div>
          {rest.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-3">
              {rest.map((im) => (
                <div key={im.id} className="aspect-square bg-white overflow-hidden">
                  <img src={im.url} alt={im.alt || p.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:pt-6">
          {p.category && <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-text-secondary mb-3">{p.category.name}</p>}
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{p.name}</h1>
          <p className="text-text-secondary mb-8 whitespace-pre-line">{p.description}</p>
          <AddToCart product={p} />
        </div>
      </div>
      <Footer />
    </>
  )
}
