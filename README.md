# Aletos — Tienda de ropa deportiva para escalada

E-commerce + panel de administración con Next.js 14, Prisma y SQLite.

## Desarrollo local

```bash
cp .env.example .env
npm install
npx prisma db push
node prisma/seed.js
npm run dev
