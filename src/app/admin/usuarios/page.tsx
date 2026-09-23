'use client'
import { useEffect, useState } from 'react'

const ROLES = ['admin', 'editor', 'viewer']

export default function Users() {
  const [users, setUsers] = useState<any[]>([])
  const [form, setForm] = useState({ id: '', name: '', email: '', password: '', role: 'admin', active: true })
  const [showForm, setShowForm] = useState(false)

  const load = async () => setUsers(await (await fetch('/api/users')).json())
  useEffect(() => { load() }, [])

  const save = async () => {
    const isEdit = !!form.id
    const url = isEdit ? `/api/users/${form.id}` : '/api/users'
    const method = isEdit ? 'PUT' : 'POST'
    const payload: any = { name: form.name, email: form.email, role: form.role, active: form.active }
    if (form.password) payload.password = form.password
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!r.ok) { alert('Error: ' + (await r.json()).error); return }
    setForm({ id: '', name: '', email: '', password: '', role: 'admin', active: true })
    setShowForm(false)
    load()
  }

  const edit = (u: any) => {
    setForm({ id: u.id, name: u.name, email: u.email, password: '', role: u.role, active: u.active })
    setShowForm(true)
  }
  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este usuario?')) return
    await fetch(`/api/users/${id}`, { method: 'DELETE' }); load()
  }

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl font-extrabold">Usuarios y roles</h1>
        <button onClick={() => { setForm({ id: '', name: '', email: '', password: '', role: 'admin', active: true }); setShowForm(true) }} className="btn-dash">+ Nuevo usuario</button>
      </header>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-text-secondary">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Email</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Estado</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-light">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4 text-text-secondary">{u.email}</td>
                <td className="p-4"><span className="text-xs px-2 py-1 rounded-full bg-brand-light text-brand font-medium capitalize">{u.role}</span></td>
                <td className="p-4 text-xs">{u.active ? 'Activo' : 'Inactivo'}</td>
                <td className="p-4 text-right space-x-3">
                  <button className="text-xs underline" onClick={() => edit(u)}>Editar</button>
                  <button className="text-xs underline text-red-600" onClick={() => remove(u.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold">{form.id ? 'Editar usuario' : 'Nuevo usuario'}</h2>
            <div><label className="label">Nombre</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="label">Email</label><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="label">Contraseña {form.id && '(dejar vacío para no cambiar)'}</label><input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div>
              <label className="label">Rol</label>
              <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Activo
            </label>
            <div className="flex gap-2 pt-2">
              <button onClick={save} className="btn-dash flex-1">Guardar</button>
              <button onClick={() => setShowForm(false)} className="btn-dash-ghost flex-1">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
