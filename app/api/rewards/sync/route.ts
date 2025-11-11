// app/api/rewards/sync/route.ts

// =================================================================
// 1. IMPORTS
// =================================================================
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// =================================================================
// 2. INICIALIZAÇÃO DO PRISMA CLIENT (singleton em lib/prisma)
// =================================================================

// =================================================================
// 3. DEFINIÇÕES DE TIPO (INTERFACES)
// Devem estar aqui, fora de qualquer função.
// =================================================================
interface SyncRewardsRequest {
  mangaId: string;
  mangaTitle: string;
  currentEpisode: number;
  collectedRewards: string[];
}

// =================================================================
// 4. A FUNÇÃO DA API (ÚNICA EXPORTAÇÃO 'POST')
// =================================================================
export async function POST(request: NextRequest) {
  try {
    const body: SyncRewardsRequest = await request.json();
    const { mangaId, mangaTitle, currentEpisode, collectedRewards } = body;

    // LOG 1: O que a API recebeu?
    console.log(`[API SYNC] Recebido: mangaId="${mangaId}", mangaTitle="${mangaTitle}", currentEpisode=${currentEpisode}`);

    if (!mangaId || !mangaTitle || currentEpisode === undefined) {
      return NextResponse.json({ error: 'mangaId, mangaTitle e currentEpisode são obrigatórios' }, { status: 400 });
    }

    // LOG 2: Buscando no banco de dados (padronizado para minúsculas por compatibilidade com SQLite)
    const searchMangaId = mangaId.toLowerCase();
    const searchMangaTitle = mangaTitle.toLowerCase().trim().replace(/\s+/g, ' ');
    console.log(`[API SYNC] Buscando (normalizado) para mangaId='${searchMangaId}' ou mangaTitle='${searchMangaTitle}' até o episódio ${currentEpisode}`);
    
    // Construir query com busca por ID, título e aliases
    const whereClause: any = {
      OR: [
        { mangaId: searchMangaId },
        { 
          mangaTitle: {
            equals: searchMangaTitle,
            mode: 'insensitive'
          }
        },
      ],
      episode: {
        lte: currentEpisode,
      },
    };
    
    // Buscar primeiro por ID e título
    let rewardsFromDb = await prisma.mangaReward.findMany({
      where: whereClause,
      orderBy: {
        episode: 'asc',
      },
    });
    
    console.log(`[API SYNC] Encontrado ${rewardsFromDb.length} recompensa(s) por ID/título`);
    
    // SEMPRE buscar também por aliases (mesmo se encontrou por ID/título, para garantir)
    // Isso permite que diferentes nomes encontrem a mesma recompensa
    const allRewardsForAliasCheck = await prisma.mangaReward.findMany({
      where: {
        episode: {
          lte: currentEpisode,
        },
      },
      orderBy: {
        episode: 'asc',
      },
    });
    
    // Filtrar por aliases e adicionar aos resultados (evitando duplicatas)
    const rewardsByAlias = allRewardsForAliasCheck.filter(reward => {
      // Pular se já está nos resultados
      const alreadyFound = rewardsFromDb.some(r => r.id === reward.id)
      if (alreadyFound) return false
      
      // Verificar aliases
      if (!reward.aliases) return false
      
      let aliasesArray: string[] = []
      try {
        if (Array.isArray(reward.aliases)) {
          aliasesArray = reward.aliases
        } else if (typeof reward.aliases === 'string') {
          aliasesArray = JSON.parse(reward.aliases)
        } else {
          aliasesArray = JSON.parse(JSON.stringify(reward.aliases))
        }
      } catch (e) {
        console.error('[API SYNC] Erro ao parsear aliases:', e)
        return false
      }
      
      const found = aliasesArray.some((alias: string) => {
        const normalizedAlias = alias.toLowerCase().trim().replace(/\s+/g, ' ')
        return normalizedAlias === searchMangaTitle
      })
      
      return found
    });
    
    if (rewardsByAlias.length > 0) {
      console.log(`[API SYNC] Encontrado ${rewardsByAlias.length} recompensa(s) adicional(is) por alias: "${searchMangaTitle}"`);
      rewardsFromDb = [...rewardsFromDb, ...rewardsByAlias]
      // Reordenar por episódio
      rewardsFromDb.sort((a, b) => a.episode - b.episode)
    }

    // LOG 3: O Prisma encontrou algo?
    console.log(`[API SYNC] Recompensas encontradas no DB: ${rewardsFromDb.length}`);

    // Se não encontrou nada, podemos parar aqui e retornar uma resposta vazia.
    if (rewardsFromDb.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma recompensa encontrada no banco de dados para estes critérios.',
        appliedRewards: [],
      });
    }

    // LOG 4: Filtrando recompensas já coletadas
    console.log(`[API SYNC] Verificando ${rewardsFromDb.length} recompensas contra ${collectedRewards.length} recompensas já coletadas.`);
    
    const pendingRewards = rewardsFromDb.filter(reward => {
      const rewardId = `${reward.mangaId}-${reward.episode}`;
      const isCollected = collectedRewards.includes(rewardId);
      console.log(`[API SYNC] Verificando ${rewardId}: Já coletada? ${isCollected}`);
      return !isCollected; // Retorna true apenas se NÃO foi coletada
    });

    // LOG 5: Resultado final
    console.log(`[API SYNC] Recompensas novas para aplicar (após filtro): ${pendingRewards.length}`);

    // Se não houver recompensas novas, informa o usuário.
    if (pendingRewards.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Você já coletou todas as recompensas disponíveis.',
        appliedRewards: [],
      });
    }

    // Mapeia os dados para o formato de resposta esperado pelo frontend
    // O seu código de parse JSON estava correto, mas pode ser simplificado.
    const rewardsToApply = pendingRewards.map(reward => {
      // O Prisma já retorna JSON como objetos, o parse não é necessário se o tipo no schema for `Json`
      return {
        mangaId: reward.mangaId,
        mangaTitle: reward.mangaTitle,
        episode: reward.episode,
        rewards: {
          experience: reward.experience ?? undefined,
          abilities: reward.abilities as any[] ?? undefined,
          items: reward.items as any[] ?? undefined,
          titles: reward.titles as any[] ?? undefined,
          attributes: reward.attributes as Record<string, number> ?? undefined,
        }
      };
    });

    return NextResponse.json({
      success: true,
      message: `${rewardsToApply.length} nova(s) recompensa(s) aplicada(s)!`,
      appliedRewards: rewardsToApply,
    });

  } catch (error) {
    console.error('[API SYNC] Erro Crítico:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
