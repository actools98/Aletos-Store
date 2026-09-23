'use client'
import { useEffect, useState } from 'react'

export default function Categories() {
  const [cats, setCats] = useState<any[]>([])
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState('')
  const [editing, setEditing] = useState<any>(null)

  const load = async () => setCats(await (await fetch('/api/categories')).json())
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!name.trim()) return
    if (editing) {
      await fetch(`/api/categories/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, parentId: parentId || null }) })
    } else {
      await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, parentId: parentId || null }) })
    }
    setName(''); setParentId(''); setEditing(null); load()
  }

  const edit = (c: any) => { setEditing(c); setName(c.name); setParentId(c.parentId || '') }
  const remove = async (id: string) => {
    if (!confirm('¿Eliminar categoría?')) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' }); load()
  }

  const roots = cats.filter((c) => !c.parentId)
  const childrenOf = (id: string) => cats.filter((c) => c.parentId === id)

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold mb-6">Categorías</h1>

      <div className="card p-5 mb-6 grid md:grid-cols-[1fr_200px_auto] gap-3 items-end">
        <div><label className="label">Nombre</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div>
          <label className="label">Categoría padre</label>
          <select className="input" value={parentId} onChange={(e) => setParentId(e.target.value)}>
            <option value="">— Ninguna (raíz) —</option>
            {roots.filter((r) => r.id !== editing?.id).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <button onClick={save} className="btn-dash">{editing ? 'Actualizar' : 'Añadir'}</button>
      </div>

      <div className="card divide-y divide-line-light">
        {roots.map((c) => (
          <div key={c.id} className="p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{c.name} <span className="text-xs text-text-secondary">({c._count?.products || 0})</span></p>
              <div className="flex gap-3 text-xs">
                <button className="underline" onClick={() => edit(c)}>Editar</button>
                <button className="underline text-red-600" onClick={() => remove(c.id)}>Eliminar</button>
              </div>
            </div>
            {childrenOf(c.id).length > 0 && (
              <ul className="mt-3 ml-4 space-y-2">
                {childrenOf(c.id).map((ch) => (
                  <li key={ch.id} className="flex items-center justify-between text-sm">
                    <span>↳ {ch.name}</span>
                    <div className="flex gap-3 text-xs">
                      <button className="underline" onClick={() => edit(ch)}>Editar</button>
                      <button className="underline text-red-600" onClick={() => remove(ch.id)}>Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {cats.length === 0 && <p className="p-6 text-sm text-text-secondary">Sin categorías.</p>}
      </div>
    </div>
  )
}
