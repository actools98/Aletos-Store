'use client'
import { useEffect, useState } from 'react'

export default function Media() {
  const [items, setItems] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [busy, setBusy] = useState(false)

  const load = async () => setItems(await (await fetch('/api/media')).json())
  useEffect(() => { load() }, [])

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setBusy(true)
    for (const f of files) {
      const fd = new FormData(); fd.append('file', f)
      await fetch('/api/upload', { method: 'POST', body: fd })
    }
    setBusy(false); await load()
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar esta imagen? Se borrará del servidor.')) return
    await fetch(`/api/media/${id}`, { method: 'DELETE' })
    load()
  }

  const saveAlt = async () => {
    if (!selected) return
    await fetch(`/api/media/${selected.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alt: selected.alt }),
    })
    setSelected(null); load()
  }

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Medios</h1>
          <p className="text-text-secondary text-sm mt-1">{items.length} archivos</p>
        </div>
        <label className="btn-dash cursor-pointer">
          {busy ? 'Subiendo…' : '+ Subir imágenes'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} />
        </label>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((m) => (
          <div key={m.id} className="group relative aspect-square bg-white rounded-lg overflow-hidden border border-line-light">
            <img src={m.url} className="w-full h-full object-cover cursor-pointer" alt={m.alt || ''} onClick={() => setSelected({ ...m })} />
            <button onClick={() => remove(m.id)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition">
              ×
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-full text-sm text-text-secondary">Sin imágenes. Sube tu primera imagen.</p>}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <img src={selected.url} className="rounded-lg mb-4 max-h-72 mx-auto" alt="" />
            <label className="label">Texto alternativo (alt)</label>
            <input className="input mb-4" value={selected.alt || ''} onChange={(e) => setSelected({ ...selected, alt: e.target.value })} />
            <div className="flex gap-2">
              <button onClick={saveAlt} className="btn-dash flex-1">Guardar</button>
              <button onClick={() => setSelected(null)} className="btn-dash-ghost flex-1">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
