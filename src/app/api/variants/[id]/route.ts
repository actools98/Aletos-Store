import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const b = await req.json()
  const v = await prisma.productVariant.update({
    where: { id: params.id },
    data: { stock: Number(b.stock) || 0, price: b.price ? Number(b.price) : null, sku: b.sku || null },
  })
  return NextResponse.json(v)
}
