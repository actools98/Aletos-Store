import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const b = await req.json()
  const c = await prisma.category.update({
    where: { id: params.id },
    data: { name: b.name, parentId: b.parentId || null },
  })
  return NextResponse.json(c)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.category.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
