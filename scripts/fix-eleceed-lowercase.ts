import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Normaliza títulos/ids de Eleceed para minúsculas
  const updated = await prisma.mangaReward.updateMany({
    where: {
      OR: [
        { mangaId: 'Eleceed' as any }, // caso raro
        { mangaTitle: 'Eleceed' as any },
      ],
    },
    data: {
      mangaId: 'eleceed',
      mangaTitle: 'eleceed',
    },
  })

  // Além disso, garanta que todos registros já em minúsculas também fiquem corretos
  const updated2 = await prisma.mangaReward.updateMany({
    where: { mangaId: 'eleceed' },
    data: { mangaTitle: 'eleceed' },
  })

  console.log(`Atualizados: ${updated.count} + ${updated2.count}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })


