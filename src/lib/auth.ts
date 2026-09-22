import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-change-me')
const COOKIE = 'aletos_session'

export async function hashPassword(pwd: string) {
  return bcrypt.hash(pwd, 10)
}
export async function verifyPassword(pwd: string, hash: string) {
  return bcrypt.compare(pwd, hash)
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
  cookies().set(COOKIE, token, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
    path: '/', maxAge: 60 * 60 * 24 * 7,
  })
}

export async function destroySession() {
  cookies().delete(COOKIE)
}

export async function getSessionUser() {
  const token = cookies().get(COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, SECRET)
    const user = await prisma.user.findUnique({ where: { id: String(payload.uid) } })
    return user
  } catch { return null }
}
