'use client'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

export default function AddToCart({ product }: { product: any }) {
  const { add } = useCart()
  const [variantId, setVariantId] = useState<string | null>(product.variants?.[0]?.id ?? null)
  const variant = product.variants?.find((v: any) => v.id === variantId)
  const price = variant?.price ?? product.price
  const stock = variant ? variant.stock : product.stock
  const canBuy = stock > 0

  const handle = () => {
    add({
      productId: product.id,
      variantId: variant?.id ?? null,
      name: product.name,
      variantName: variant?.name ?? null,
      price,
      imageUrl: variant?.imageUrl || product.images?.[0]?.url || null,
      sku: variant?.sku ?? product.sku,
      slug: product.slug,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <p className="font-display text-3xl font-bold">{new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(price)}</p>
        <p className="text-sm text-text-secondary">{canBuy ? `${stock} en stock` : 'Agotado'}</p>
      </div>

      {product.variants?.length > 0 && (
        <div>
          <p className="label">Variante</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v: any) => (
              <button key={v.id} onClick={() => setVariantId(v.id)}
                className={`px-4 py-2 text-sm border rounded-sm transition ${variantId === v.id ? 'border-brand-black bg-brand-black text-white' : 'border-line-light hover:border-brand-black'}`}>
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <button onClick={handle} disabled={!canBuy} className="btn-store w-full disabled:opacity-40 disabled:cursor-not-allowed">
        {canBuy ? 'Añadir al carrito' : 'Agotado'}
      </button>
    </div>
  )
}
