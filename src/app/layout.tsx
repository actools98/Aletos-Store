import { Inter, Archivo } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', weight: ['400','500','600','700','800','900'] })

export const metadata = {
  title: 'Aletos — Ropa deportiva para escalada',
  description: 'Camisetas, chaquetas, polares, gorras y más para escaladores.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${archivo.variable}`}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
