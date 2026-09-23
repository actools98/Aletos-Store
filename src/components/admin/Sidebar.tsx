'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const items = [
  { href: '/admin', label: 'Dashboard', icon: '◫' },
  { href: '/admin/productos', label: 'Productos', icon: '◧' },
  { href: '/admin/categorias', label: 'Categorías', icon: '▤' },
  { href: '/admin/inventario', label: 'Inventario', icon: '◰' },
  { href: '/admin/pedidos', label: 'Pedidos', icon: '◔' },
  { href: '/admin/medios', label: 'Medios', icon: '◨' },
  { href: '/admin/usuarios', label: 'Usuarios y roles', icon: '◉' },
]

export default function Sidebar() {
  const path = usePathname()
  const router = useRouter()
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }
  return (
    <aside className="w-[260px] bg-white border-r border-line-light min-h-screen p-5 flex flex-col">
      <Link href="/admin" className="font-display text-xl font-extrabold px-3 py-2 mb-6">
        ALETOS<span className="text-brand">.</span>
      </Link>
      <nav className="space-y-1 flex-1">
        {items.map((it) => {
          const active = path === it.href || (it.href !== '/admin' && path.startsWith(it.href))
          return (
            <Link key={it.href} href={it.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${active ? 'bg-brand-light text-brand font-semibold' : 'text-text-secondary hover:bg-slate-50'}`}>
              <span className="text-lg opacity-70">{it.icon}</span>
              {it.label}
            </Link>
          )
        })}
      </nav>
      <div className="pt-4 border-t border-line-light">
        <Link href="/" target="_blank" className="block px-3 py-2 text-xs text-text-secondary hover:text-brand">
          ↗ Ver tienda
        </Link>
        <button onClick={logout} className="w-full text-left px-3 py-2 text-xs text-text-secondary hover:text-red-600">
          ↪ Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
