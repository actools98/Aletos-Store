#!/bin/sh
set -e

echo "▶ Generando Prisma Client..."
npx prisma generate

echo "▶ Sincronizando esquema (db push)..."
npx prisma db push --skip-generate --accept-data-loss

echo "▶ Ejecutando seed (idempotente)..."
node prisma/seed.js || true

echo "▶ Iniciando servidor..."
exec "$@"
