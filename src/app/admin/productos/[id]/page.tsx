import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditProduct({ params }: { params: { id: string } }) {
  const p = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { sortOrder: 'asc' } }, variants: true },
  })
  if (!p) notFound()
  return <ProductForm initial={p} />
}
