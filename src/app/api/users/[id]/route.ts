import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const b = await req.json()
  const data: any = { name: b.name, email: b.email, role: b.role, active: b.active }
  if (b.password) data.password = await hashPassword(b.password)
  const u = await prisma.user.update({ where: { id: params.id }, data })
  return NextResponse.json({ id: u.id })
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.user.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
