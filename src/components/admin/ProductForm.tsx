'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Img = { url: string; alt?: string }
type Var = { id?: string; name: string; sku?: string; price?: number | string; stock: number; imageUrl?: string }

const IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml'

export default function ProductForm({ initial }: { initial?: any }) {
  const router = useRouter()
  const [cats, setCats] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    price: initial?.price ?? 0,
    sku: initial?.sku || '',
    stock: initial?.stock ?? 0,
    active: initial?.active ?? true,
    tags: initial?.tags || '',
    sortOrder: initial?.sortOrder ?? 0,
    categoryId: initial?.categoryId || '',
  })
  const [images, setImages] = useState<Img[]>(
    initial?.images?.map((i: any) => ({ url: i.url, alt: i.alt || '' })) || [],
  )
  const [variants, setVariants] = useState<Var[]>(
    initial?.variants?.map((v: any) => ({
      name: v.name,
      sku: v.sku || '',
      price: v.price ?? '',
      stock: v.stock,
      imageUrl: v.imageUrl || '',
    })) || [],
  )

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCats)
      .catch(() => {})
  }, [])

  const upload = async (file: File): Promise<string | null> => {
    const fd = new FormData()
    fd.append('file', file)
    const r = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!r.ok) {
      const err = await r.json().catch(() => ({}))
      alert(`Error subiendo "${file.name}": ${err.error || r.statusText}`)
      return null
    }
    const d = await r.json()
    return d.url
  }

  const onAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    for (const f of files) {
      const url = await upload(f)
      if (url) setImages((p) => [...p, { url, alt: '' }])
    }
    e.target.value = ''
  }

  const onVariantImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const url = await upload(f)
    if (url) setVariants((p) => p.map((v, i) => (i === idx ? { ...v, imageUrl: url } : v)))
    e.target.value = ''
  }

  const save = async () => {
    if (!form.name.trim()) {
      alert('El nombre es obligatorio')
      return
    }
    setSaving(true)
    const payload = { ...form, images, variants }
    const url = initial ? `/api/products/${initial.id}` : '/api/products'
    const method = initial ? 'PUT' : 'POST'
    const r = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (r.ok) {
      router.push('/admin/productos')
      router.refresh()
    } else {
      const err = await r.json().catch(() => ({}))
      alert('Error al guardar: ' + (err.error || r.statusText))
    }
  }

  const remove = async () => {
    if (!initial) return
    if (!confirm('¿Eliminar este producto?')) return
    await fetch(`/api/products/${initial.id}`, { method: 'DELETE' })
    router.push('/admin/productos')
    router.refresh()
  }

  return (
    <div className="p-8 max-w-5xl">
      <header className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl font-extrabold">
          {initial ? 'Editar producto' : 'Nuevo producto'}
        </h1>
        <div className="flex gap-2">
          {initial && (
            <button onClick={remove} className="btn-dash-ghost text-red-600">
              Eliminar
            </button>
          )}
          <button onClick={save} disabled={saving} className="btn-dash">
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="font-display font-bold">Información</h2>
            <div>
              <label className="label">Nombre *</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Descripción</label>
              <textarea
                rows={5}
                className="input"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Precio (COP)</label>
                <input
                  type="number"
                  step="1"
                  className="input"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value as any })}
                />
              </div>
              <div>
                <label className="label">SKU</label>
                <input
                  className="input"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Stock</label>
                <input
                  type="number"
                  className="input"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value as any })}
                />
              </div>
              <div>
                <label className="label">Orden</label>
                <input
                  type="number"
                  className="input"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value as any })}
                />
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-display font-bold">Imágenes</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((im, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square bg-bg-store rounded-md overflow-hidden group"
                >
                  <img src={im.url} className="w-full h-full object-cover" alt="" />
                  <input
                    className="absolute bottom-0 inset-x-0 bg-white/90 text-xs px-2 py-1 outline-none"
                    placeholder="Alt"
                    value={im.alt}
                    onChange={(e) =>
                      setImages((p) =>
                        p.map((x, i) => (i === idx ? { ...x, alt: e.target.value } : x)),
                      )
                    }
                  />
                  <button
                    onClick={() => setImages((p) => p.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-line-light rounded-md flex items-center justify-center text-3xl text-text-secondary cursor-pointer hover:border-brand hover:text-brand">
                +
                <input
                  type="file"
                  accept={IMAGE_ACCEPT}
                  multiple
                  className="hidden"
                  onChange={onAddImage}
                />
              </label>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold">Variantes</h2>
              <button
                onClick={() =>
                  setVariants((p) => [...p, { name: '', sku: '', price: '', stock: 0 }])
                }
                className="btn-dash-ghost text-xs"
              >
                + Añadir variante
              </button>
            </div>
            {variants.map((v, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 items-end border border-line-light rounded-lg p-3"
              >
                <div className="col-span-3">
                  <label className="label">Nombre</label>
                  <input
                    className="input"
                    placeholder="Talla M / Negro"
                    value={v.name}
                    onChange={(e) =>
                      setVariants((p) =>
                        p.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)),
                      )
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="label">SKU</label>
                  <input
                    className="input"
                    value={v.sku}
                    onChange={(e) =>
                      setVariants((p) =>
                        p.map((x, i) => (i === idx ? { ...x, sku: e.target.value } : x)),
                      )
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="label">Precio</label>
                  <input
                    type="number"
                    step="1"
                    className="input"
                    value={v.price}
                    onChange={(e) =>
                      setVariants((p) =>
                        p.map((x, i) => (i === idx ? { ...x, price: e.target.value } : x)),
                      )
                    }
                  />
                </div>
                <div className="col-span-1">
                  <label className="label">Stock</label>
                  <input
                    type="number"
                    className="input"
                    value={v.stock}
                    onChange={(e) =>
                      setVariants((p) =>
                        p.map((x, i) =>
                          i === idx ? { ...x, stock: Number(e.target.value) } : x,
                        ),
                      )
                    }
                  />
                </div>
                <div className="col-span-3 flex gap-2">
                  <label className="flex-1 cursor-pointer border border-dashed border-line-light rounded-md px-2 py-2 text-xs text-center truncate">
                    {v.imageUrl ? '✓ Imagen' : 'Imagen'}
                    <input
                      type="file"
                      accept={IMAGE_ACCEPT}
                      className="hidden"
                      onChange={(e) => onVariantImage(idx, e)}
                    />
                  </label>
                  <button
                    onClick={() => setVariants((p) => p.filter((_, i) => i !== idx))}
                    className="text-red-600 text-xs px-2"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            {variants.length === 0 && (
              <p className="text-sm text-text-secondary">
                Sin variantes. Añade tallas, colores…
              </p>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="font-display font-bold">Organización</h2>
            <div>
              <label className="label">Categoría</label>
              <select
                className="input"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                <option value="">— Sin categoría —</option>
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.parent ? `${c.parent.name} / ` : ''}
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Etiquetas (separadas por coma)</label>
              <input
                className="input"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Producto activo
            </label>
          </div>
        </aside>
      </div>
    </div>
  )
}
