'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (r.ok) router.push('/admin')
    else setErr('Credenciales incorrectas')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-dash p-6">
      <form onSubmit={submit} className="card p-8 w-full max-w-sm">
        <h1 className="font-display text-2xl font-extrabold mb-1">Aletos Admin</h1>
        <p className="text-sm text-text-secondary mb-6">Inicia sesión para continuar</p>
        <div className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className="btn-dash w-full">Entrar</button>
        </div>
      </form>
    </div>
  )
}
