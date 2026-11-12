import nodemailer from 'nodemailer'
import { eur } from '@/lib/utils'

// Variables de entorno (Coolify):
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM (opcional), ADMIN_EMAIL (uno o varios separados por coma)
function getTransport() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null
  const port = Number(process.env.SMTP_PORT || 465)
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user, pass },
  })
}

const esc = (s: any) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))

export async function sendOrderEmails(order: any, items: any[]) {
  const transport = getTransport()
  if (!transport) {
    console.warn('[mail] SMTP no configurado, no se envía correo de pedido')
    return
  }

  const from = process.env.SMTP_FROM || `Aletos <${process.env.SMTP_USER}>`
  const admins = (process.env.ADMIN_EMAIL || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  const rows = items
    .map(
      (i) => `<tr>
        <td style="padding:6px 8px;border-bottom:1px solid #eee">${esc(i.name)}${i.variantName ? ` <small>(${esc(i.variantName)})</small>` : ''}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">${eur(i.price * i.quantity)}</td>
      </tr>`
    )
    .join('')

  const table = `
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <thead><tr style="background:#f5f5f5">
        <th style="padding:6px 8px;text-align:left">Producto</th>
        <th style="padding:6px 8px">Cant.</th>
        <th style="padding:6px 8px;text-align:right">Subtotal</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr>
        <td colspan="2" style="padding:8px;text-align:right"><b>Total</b></td>
        <td style="padding:8px;text-align:right"><b>${eur(order.total)}</b></td>
      </tr></tfoot>
    </table>`

  const envio = `
    <p style="font-size:14px;margin:12px 0 0">
      <b>Envío a:</b> ${esc(order.customerName)}<br>
      ${esc(order.address)}${order.city ? ', ' + esc(order.city) : ''}${order.country ? ', ' + esc(order.country) : ''}<br>
      ${order.customerPhone ? 'Tel: ' + esc(order.customerPhone) + '<br>' : ''}
      ${order.notes ? 'Notas: ' + esc(order.notes) : ''}
    </p>`

  const wrap = (title: string, body: string) =>
    `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#222">
      <h2 style="margin-bottom:4px">${title}</h2>${body}
    </div>`

  const tasks: Promise<any>[] = []

  // 1) Confirmación al comprador
  if (order.customerEmail) {
    tasks.push(
      transport.sendMail({
        from,
        to: order.customerEmail,
        subject: `Confirmación de tu pedido ${order.orderNumber} - Aletos`,
        html: wrap(
          `¡Gracias por tu compra, ${esc(order.customerName)}!`,
          `<p>Recibimos tu pedido <b>${esc(order.orderNumber)}</b>. Pronto nos pondremos en contacto contigo.</p>${table}${envio}${
            siteUrl ? `<p style="font-size:12px;color:#888;margin-top:20px">${esc(siteUrl)}</p>` : ''
          }`
        ),
      })
    )
  }

  // 2) Aviso al admin
  if (admins.length) {
    tasks.push(
      transport.sendMail({
        from,
        to: admins,
        replyTo: order.customerEmail || undefined,
        subject: `Nuevo pedido ${order.orderNumber} - ${order.customerName}`,
        html: wrap(
          'Nuevo pedido recibido',
          `<p>Cliente: <b>${esc(order.customerName)}</b> (${esc(order.customerEmail)})</p>${table}${envio}${
            siteUrl ? `<p><a href="${esc(siteUrl)}/admin/pedidos/${esc(order.id)}">Ver pedido en el panel</a></p>` : ''
          }`
        ),
      })
    )
  }

  const results = await Promise.allSettled(tasks)
  results.forEach((r) => {
    if (r.status === 'rejected') console.error('[mail] Error enviando correo:', r.reason)
  })
}
