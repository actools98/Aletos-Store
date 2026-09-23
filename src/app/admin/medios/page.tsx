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
          <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload
