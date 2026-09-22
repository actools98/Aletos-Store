import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1A5D3A',
          dark: '#0D3B22',
          light: '#E8F5E9',
          black: '#121212',
        },
        bg: {
          store: '#F3F3F1',
          storeDark: '#151515',
          dash: '#F8F9FA',
          surface: '#FFFFFF',
        },
        text: {
          primary: '#121212',
          secondary: '#64748B',
          inverse: '#FFFFFF',
        },
        line: { light: '#E2E8F0', dark: '#333333' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'Helvetica Neue', 'sans-serif'],
        display: ['var(--font-archivo)', 'Archivo', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        giant: ['120px', { lineHeight: '0.9', fontWeight: '800', letterSpacing: '-0.05em' }],
        h1: ['48px', { lineHeight: '1.05', fontWeight: '700', letterSpacing: '-0.02em' }],
        h2: ['32px', { lineHeight: '1.1', fontWeight: '600', letterSpacing: '-0.01em' }],
        h3: ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        wide: ['14px', { fontWeight: '500', letterSpacing: '0.15em' }],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0,0,0,0.05)',
        medium: '0 8px 30px rgba(0,0,0,0.08)',
      },
      borderRadius: { sm: '6px', md: '12px', lg: '16px' },
    },
  },
  plugins: [],
}
export default config
