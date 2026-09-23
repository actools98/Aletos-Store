import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export const dynamic = 'force-dynamic'   // 👈

export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const exists = await prisma.user.findUnique({ where: { email: b.email } })
  if (exists) return NextResponse.json({ error: 'Email ya registrado' }, { status: 400 })
  const user = await prisma.user.create({
    data: {
      name: b.name,
      email: b.email,
      password: await hashPassword(b.password),
      role: b.role || 'admin',
      active: b.active ?? true,
    },
  })
  return NextResponse.json({ id: user.id })
}
