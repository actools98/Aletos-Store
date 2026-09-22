import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { orderNumber } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const items = body.items || []
  if (!items.length) return NextResponse.json({ error: 'Sin items' }, { status: 400 })

  const subtotal = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0)
  const tax = 0
  const shipping = 0
  const total = subtotal + tax + shipping

  const order = await prisma.order.create({
    data: {
      orderNumber: orderNumber(),
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone || null,
      address: body.address,
      city: body.city || null,
      postalCode: body.postalCode || null,
      country: body.country || null,
      notes: body.notes || null,
      status: 'pendiente',
      paymentStatus: 'pendiente',
      shippingStatus: 'pendiente',
      subtotal, tax, shipping, total,
      items: {
        create: items.map((i: any) => ({
          productId: i.productId || null,
          variantId: i.variantId || null,
          name: i.name,
          variantName: i.variantName || null,
          price: i.price,
          quantity: i.quantity,
          imageUrl: i.imageUrl || null,
        })),
      },
    },
  })

  // Descontar stock
  for (const i of items) {
    if (i.variantId) {
      await prisma.productVariant.update({
        where: { id: i.variantId },
        data: { stock: { decrement: i.quantity } },
      }).catch(() => {})
    } else if (i.productId) {
      await prisma.product.update({
        where: { id: i.productId },
        data: { stock: { decrement: i.quantity } },
      }).catch(() => {})
    }
  }

  // TODO: enviar email de notificación cuando se configure

  return NextResponse.json({ ok: true, orderId: order.id, orderNumber: order.orderNumber })
}

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}
