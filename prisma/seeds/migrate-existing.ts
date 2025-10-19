// prisma/seeds/migrate-existing.ts

import { PrismaClient } from '@prisma/client';
import { MANGA_REWARDS } from '../../lib/manga-rewards';

export async function migrateExistingRewards(prisma: PrismaClient) {
  console.log("Iniciando migração das recompensas existentes...");

  for (const reward of MANGA_REWARDS) {
    await prisma.mangaReward.upsert({
      where: { 
        mangaId_episode: { 
          mangaId: reward.mangaId, 
          episode: reward.episode 
        } 
      },
      update: {}, // Não atualiza se já existir
      create: {
        mangaId: reward.mangaId,
        mangaTitle: reward.mangaTitle,
        episode: reward.episode,
        experience: reward.rewards.experience || null,
        abilities: reward.rewards.abilities || null,
        items: reward.rewards.items || null,
        titles: reward.rewards.titles || null,
        attributes: reward.rewards.attributes || null
      }
    });

    console.log(`Migrado: ${reward.mangaTitle} - Episódio ${reward.episode}`);
  }

  console.log("Migração de recompensas existentes concluída.");
}
