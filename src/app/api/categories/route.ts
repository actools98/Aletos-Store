import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'   // 👈

export async function GET() {
  const cats = await prisma.category.findMany({
    include: { children: true, _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(cats)
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  let slug = b.slug ? slugify(b.slug) : slugify(b.name)
  let i = 1
  while (await prisma.category.findUnique({ where: { slug } })) slug = `${slugify(b.name)}-${i++}`
  const c = await prisma.category.create({
    data: { name: b.name, slug, parentId: b.parentId || null },
  })
  return NextResponse.json(c)
}
