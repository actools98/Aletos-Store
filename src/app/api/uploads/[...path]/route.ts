import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/app/data/uploads'

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
}

export async function GET(_: NextRequest, { params }: { params: { path: string[] } }) {
  const filename = params.path.join('/')

  // Previene path traversal
  if (filename.includes('..') || filename.startsWith('/')) {
    return new NextResponse('Bad request', { status: 400 })
  }

  const fullPath = path.join(UPLOAD_DIR, filename)

  try {
    const data = await readFile(fullPath)
    const ext = path.extname(filename).toLowerCase()
    const contentType = MIME[ext] || 'application/octet-stream'
    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
