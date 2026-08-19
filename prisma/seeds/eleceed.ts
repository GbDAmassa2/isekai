// prisma/seeds/eleceed.ts

import { PrismaClient } from '@prisma/client';

// Exportamos a função para que ela possa ser importada em outro lugar
export async function seedEleceed(prisma: PrismaClient) {
  console.log("Iniciando o seed para Eleceed...");

  // --- Capítulo 1 ---
  await prisma.mangaReward.upsert({
    where: { mangaId_episode: { mangaId: "eleceed", episode: 1 } },
    update: { mangaTitle: "eleceed" }, // garantir lowercase no título
    create: {
      mangaId: "eleceed",
      mangaTitle: "eleceed",
      episode: 1,
      experience: 0,
      abilities: [
        {
          name: "Electric Control",
          description: "Controle básico sobre eletricidade",
          type: "active",
          level: 1,
          category: "attack",
          power: 4,
          manaCost: 15,
          cooldown: 45
        }
      ]
    }
  });

  // --- Capítulo 2 ---
  await prisma.mangaReward.upsert({
    where: { mangaId_episode: { mangaId: "eleceed", episode: 2 } },
    update: { mangaTitle: "eleceed" },
    create: {
      mangaId: "eleceed",
      mangaTitle: "eleceed",
      episode: 2,
      experience: 0,
      abilities: [
        {
          name: "Electric Control2",
          description: "Controle básico sobre eletricidade aprimorado",
          type: "active",
          level: 1,
          category: "attack",
          power: 4,
          manaCost: 15,
          cooldown: 45
        }
      ]
    }
  });

  // --- Capítulo 3 ---
  await prisma.mangaReward.upsert({
    where: { mangaId_episode: { mangaId: "eleceed", episode: 3 } },
    update: { mangaTitle: "eleceed" },
    create: {
      mangaId: "eleceed",
      mangaTitle: "eleceed",
      episode: 3,
      attributes: {
        strength: 2,
        intelligence: 3,
        agility: 1
      }
    }
  });

  await prisma.mangaReward.upsert({
    where: { mangaId_episode: { mangaId: "eleceed", episode: 4} },
    update: { mangaTitle: "eleceed" },
    create: {
      mangaId: "eleceed",
      mangaTitle: "eleceed",
      episode: 4,
      experience: 0,
      abilities: [
        {
          name: "Electric Control3",
          description: "Controle básico sobre eletricidade aprimorado",
          type: "active",
          level: 1,
          category: "attack",
          power: 4,
          manaCost: 15,
          cooldown: 45
        }
      ]
    }
  });

  // --- Capítulo 5 ---
  await prisma.mangaReward.upsert({
    where: { mangaId_episode: { mangaId: "eleceed", episode: 5 } },
    update: { mangaTitle: "eleceed" },
    create: {
      mangaId: "eleceed",
      mangaTitle: "eleceed",
      episode: 5,
      items: [
        {
          name: "Luvas de Combate Elétricas",
          description: "Aumenta o poder de ataques elétricos",
          type: "weapon",
          rarity: "rare",
          effects: {
            attackMagico: 15,
            agility: 2
          }
        }
      ],
      titles: [
        {
          name: "Mestre Elétrico Iniciante",
          description: "Concedido por dominar o controle elétrico básico",
          effects: {
            intelligence: 1,
            manaMaxima: 10
          }
        }
      ]
    }
  });

  // Adicione mais capítulos conforme necessário...
  // --- Capítulo 10 ---
  await prisma.mangaReward.upsert({
    where: { mangaId_episode: { mangaId: "eleceed", episode: 10 } },
    update: { mangaTitle: "eleceed" },
    create: {
      mangaId: "eleceed",
      mangaTitle: "eleceed",
      episode: 10,
      abilities: [],
      items: [],
      attributes: {},
      titles: []
    }
  });

  console.log("Seed de Eleceed concluído.");
}
