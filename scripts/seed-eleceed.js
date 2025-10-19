// Simple JS seeder to avoid TS/ESM resolution issues
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedEleceed() {
  console.log('Seeding Eleceed...')

  await prisma.mangaReward.upsert({
    where: { mangaId_episode: { mangaId: 'eleceed', episode: 1 } },
    update: { mangaTitle: 'eleceed' },
    create: {
      mangaId: 'eleceed',
      mangaTitle: 'eleceed',
      episode: 1,
      experience: 0,
      abilities: [
        {
          name: 'Electric Control',
          description: 'Controle básico sobre eletricidade',
          type: 'active',
          level: 1,
          category: 'attack',
          power: 4,
          manaCost: 15,
          cooldown: 45,
        },
      ],
    },
  })

  await prisma.mangaReward.upsert({
    where: { mangaId_episode: { mangaId: 'eleceed', episode: 2 } },
    update: { mangaTitle: 'eleceed' },
    create: {
      mangaId: 'eleceed',
      mangaTitle: 'eleceed',
      episode: 2,
      experience: 0,
      abilities: [
        {
          name: 'Electric Control2',
          description: 'Controle básico sobre eletricidade aprimorado',
          type: 'active',
          level: 1,
          category: 'attack',
          power: 4,
          manaCost: 15,
          cooldown: 45,
        },
      ],
    },
  })

  await prisma.mangaReward.upsert({
    where: { mangaId_episode: { mangaId: 'eleceed', episode: 3 } },
    update: { mangaTitle: 'eleceed' },
    create: {
      mangaId: 'eleceed',
      mangaTitle: 'eleceed',
      episode: 3,
      attributes: {
        strength: 2,
        intelligence: 3,
        agility: 1,
      },
    },
  })

  await prisma.mangaReward.upsert({
    where: { mangaId_episode: { mangaId: 'eleceed', episode: 5 } },
    update: { mangaTitle: 'eleceed' },
    create: {
      mangaId: 'eleceed',
      mangaTitle: 'eleceed',
      episode: 5,
      items: [
        {
          name: 'Luvas de Combate Elétricas',
          description: 'Aumenta o poder de ataques elétricos',
          type: 'weapon',
          rarity: 'rare',
          effects: { attackMagico: 15, agility: 2 },
        },
      ],
      titles: [
        {
          name: 'Mestre Elétrico Iniciante',
          description: 'Concedido por dominar o controle elétrico básico',
          effects: { intelligence: 1, manaMaxima: 10 },
        },
      ],
    },
  })

  console.log('Eleceed seeded.')
}

async function main() {
  try {
    await seedEleceed()
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


