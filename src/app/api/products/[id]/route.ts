import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const p = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { sortOrder: 'asc' } }, variants: true },
  })
  return NextResponse.json(p)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const b = await req.json()

  // Simplificamos: borramos imágenes y variantes y recreamos
  await prisma.productImage.deleteMany({ where: { productId: params.id } })
  await prisma.productVariant.deleteMany({ where: { productId: params.id } })

  const p = await prisma.product.update({
    where: { id: params.id },
    data: {
      name: b.name,
      description: b.description || null,
      price: Number(b.price) || 0,
      sku: b.sku || null,
      stock: Number(b.stock) || 0,
      active: b.active ?? true,
      tags: b.tags || null,
      sortOrder: Number(b.sortOrder) || 0,
      categoryId: b.categoryId || null,
      images: { create: (b.images || []).map((im: any, idx: number) => ({ url: im.url, alt: im.alt || null, sortOrder: idx })) },
      variants: { create: (b.variants || []).map((v: any) => ({
        name: v.name, sku: v.sku || null, price: v.price ? Number(v.price) : null,
        stock: Number(v.stock) || 0, imageUrl: v.imageUrl || null,
      })) },
    },
  })
  return NextResponse.json(p)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
