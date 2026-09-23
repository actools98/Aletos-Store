import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'   // 👈

export async function GET() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { sortOrder: 'asc' } }, variants: true, category: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  let slug = b.slug ? slugify(b.slug) : slugify(b.name)
  let i = 1
  while (await prisma.product.findUnique({ where: { slug } })) slug = `${slugify(b.name)}-${i++}`

  const p = await prisma.product.create({
    data: {
      name: b.name,
      slug,
      description: b.description || null,
      price: Number(b.price) || 0,
      sku: b.sku || null,
      stock: Number(b.stock) || 0,
      active: b.active ?? true,
      tags: b.tags || null,
      sortOrder: Number(b.sortOrder) || 0,
      categoryId: b.categoryId || null,
      images: {
        create: (b.images || []).map((im: any, idx: number) => ({
          url: im.url, alt: im.alt || null, sortOrder: idx,
        })),
      },
      variants: {
        create: (b.variants || []).map((v: any) => ({
          name: v.name,
          sku: v.sku || null,
          price: v.price ? Number(v.price) : null,
          stock: Number(v.stock) || 0,
          imageUrl: v.imageUrl || null,
        })),
      },
    },
  })
  return NextResponse.json(p)
}
