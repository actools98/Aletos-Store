import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.active) return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
  const ok = await verifyPassword(password, user.password)
  if (!ok) return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
  await createSession(user.id)
  return NextResponse.json({ ok: true })
}
