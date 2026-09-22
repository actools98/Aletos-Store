import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true } })
  return NextResponse.json(order)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const order = await prisma.order.update({
    where: { id: params.id },
    data: {
      status: body.status,
      paymentStatus: body.paymentStatus,
      shippingStatus: body.shippingStatus,
      trackingNumber: body.trackingNumber,
      internalNotes: body.internalNotes,
    },
  })
  return NextResponse.json(order)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.order.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
