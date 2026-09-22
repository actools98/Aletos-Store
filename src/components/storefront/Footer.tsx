import Link from 'next/link'
export default function Footer() {
  return (
    <footer className="bg-brand-black text-white mt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <p className="font-display text-5xl font-extrabold">ALETOS</p>
          <p className="text-sm text-white/60 mt-4 max-w-md">
            Ropa deportiva diseñada para escaladores. Resistente, técnica y honesta.
          </p>
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-widest mb-4">Tienda</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/productos">Todo</Link></li>
            <li><Link href="/productos?cat=camisetas">Camisetas</Link></li>
            <li><Link href="/productos?cat=chaquetas">Chaquetas</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-widest mb-4">Contacto</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>info@aletos.cloud</li>
            <li>store.aletos.cloud</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Aletos. Todos los derechos reservados.
      </div>
    </footer>
  )
}
