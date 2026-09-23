import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALLOWED = [
  'image/jpeg', 'image/jpg', 'image/png',
  'image/webp', 'image/gif', 'image/avif', 'image/svg+xml',
]

const EXT_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
  'image/svg+xml': '.svg',
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 })
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo de archivo no permitido: ${file.type || 'desconocido'}` },
        { status: 400 },
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = EXT_MAP[file.type] || path.extname(file.name).toLowerCase() || '.bin'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    const dir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, filename), buffer)

    const url = `/uploads/${filename}`
    const media = await prisma.media.create({
      data: {
        url,
        filename,
        size: buffer.length,
        mimeType: file.type,
        alt: (form.get('alt') as string) || null,
      },
    })
    return NextResponse.json(media)
  } catch (err: any) {
    console.error('[upload] Error:', err)
    return NextResponse.json({ error: err?.message || 'Error subiendo archivo' }, { status: 500 })
  }
}
