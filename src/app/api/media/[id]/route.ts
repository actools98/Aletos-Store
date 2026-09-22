import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import path from 'path'

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const m = await prisma.media.findUnique({ where: { id: params.id } })
  if (m) {
    // Borrar archivo del servidor
    try {
      const filePath = path.join(process.cwd(), 'public', m.url)
      await unlink(filePath)
    } catch {}
    await prisma.media.delete({ where: { id: params.id } })
  }
  return NextResponse.json({ ok: true })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const b = await req.json()
  const m = await prisma.media.update({ where: { id: params.id }, data: { alt: b.alt } })
  return NextResponse.json(m)
}
