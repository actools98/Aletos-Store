import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'   // 👈 añade esto

export async function GET() {
  const m = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(m)
}
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const m = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(m)
}
