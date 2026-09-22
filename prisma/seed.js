const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'info@actols.com'
  const existing = await prisma.user.findUnique({ where: { email } })
  if (!existing) {
    const hash = await bcrypt.hash('b55f86bd4c353', 10)
    await prisma.user.create({
      data: { name: 'Admin', email, password: hash, role: 'admin' }
    })
    console.log('✔ Usuario admin creado:', email)
  } else {
    console.log('ℹ Usuario admin ya existe')
  }

  // Categorías por defecto
  const cats = [
    { name: 'Camisetas', slug: 'camisetas' },
    { name: 'Chaquetas', slug: 'chaquetas' },
    { name: 'Polares', slug: 'polares' },
    { name: 'Gorras', slug: 'gorras' },
    { name: 'Gorros', slug: 'gorros' },
    { name: 'Accesorios', slug: 'accesorios' },
  ]
  for (const c of cats) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })
  }
  console.log('✔ Categorías por defecto listas')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
