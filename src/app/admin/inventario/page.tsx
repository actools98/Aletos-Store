'use client'
import { useEffect, useState } from 'react'

export default function Inventory() {
  const [products, setProducts] = useState<any[]>([])
  const [dirty, setDirty] = useState<Record<string, number>>({})

  useEffect(() => { fetch('/api/products').then((r) => r.json()).then(setProducts) }, [])

  const setStock = (id: string, value: number) => setDirty((d) => ({ ...d, [id]: value }))

  const save = async () => {
    for (const [id, stock] of Object.entries(dirty)) {
      const isVariant = products.some((p) => p.variants.some((v: any) => v.id === id))
      const url = isVariant ? `/api/variants/${id}` : `/api/products/${id}`
      const body = isVariant ? { stock } : { ...products.find((p) => p.id === id), stock }
      await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    setDirty({})
    setProducts(await (await fetch('/api/products')).json())
  }

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl font-extrabold">Inventario</h1>
        {Object.keys(dirty).length > 0 && (
          <button onClick={save} className="btn-dash">Guardar cambios</button>
        )}
      </header>

      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="card p-5">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-text-secondary">SKU: {p.sku || '—'}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-text-secondary">Stock base</label>
                <input type="number" className="input w-24"
                  value={dirty[p.id] ?? p.stock}
                  onChange={(e) => setStock(p.id, Number(e.target.value))} />
              </div>
            </div>
            {p.variants.length > 0 && (
              <div className="ml-2 pl-4 border-l-2 border-line-light space-y-2">
                {p.variants.map((v: any) => (
                  <div key={v.id} className="flex justify-between items-center py-1">
                    <span className="text-sm">{v.name} <span className="text-xs text-text-secondary">({v.sku || '—'})</span></span>
                    <input type="number" className="input w-24"
                      value={dirty[v.id] ?? v.stock}
                      onChange={(e) => setStock(v.id, Number(e.target.value))} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
