import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface SearchRewardsRequest {
  mangaId?: string
  mangaTitle?: string
  episode?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchRewardsRequest = await request.json()
    const { mangaId, mangaTitle, episode } = body

    if (!mangaId && !mangaTitle) {
      return NextResponse.json(
        { error: 'mangaId ou mangaTitle são obrigatórios' },
        { status: 400 }
      )
    }

    // Construir query baseada nos parâmetros fornecidos
    const whereClause: any = {
      OR: []
    }

    if (mangaId) {
      whereClause.OR.push({ mangaId: mangaId })
    }

    if (mangaTitle) {
      // Normalizar título para busca (remoção de espaços extras, lowercase)
      const normalizedTitle = mangaTitle.toLowerCase().trim().replace(/\s+/g, ' ')
      whereClause.OR.push({ 
        mangaTitle: {
          equals: normalizedTitle,
          mode: 'insensitive'
        }
      })
      
      // Buscar também por aliases (nomes alternativos)
      // Nota: A busca por aliases será feita em memória após buscar por título/ID
      // porque a sintaxe do Prisma para JSONB arrays pode variar
    }

    // Se episódio específico foi solicitado
    if (episode !== undefined) {
      whereClause.episode = episode
    }

    let rewards = await prisma.mangaReward.findMany({
      where: whereClause,
      orderBy: {
        episode: 'asc'
      }
    })

    // Se não encontrou por título/ID, buscar também por aliases
    if (mangaTitle && rewards.length === 0) {
      const normalizedTitle = mangaTitle.toLowerCase().trim().replace(/\s+/g, ' ')
      const allRewards = await prisma.mangaReward.findMany({
        where: episode !== undefined ? { episode } : {},
        orderBy: { episode: 'asc' }
      })
      
      // Filtrar em memória por aliases
      rewards = allRewards.filter(reward => {
        if (!reward.aliases) return false
        const aliasesArray = Array.isArray(reward.aliases) 
          ? reward.aliases 
          : JSON.parse(JSON.stringify(reward.aliases))
        return aliasesArray.some((alias: string) => 
          alias.toLowerCase().trim().replace(/\s+/g, ' ') === normalizedTitle
        )
      })
    }

    // Parse dos dados JSON e formatação da resposta
    const formattedRewards = rewards.map(reward => {
      return {
        mangaId: reward.mangaId,
        mangaTitle: reward.mangaTitle,
        episode: reward.episode,
        rewards: {
          experience: reward.experience,
          abilities: reward.abilities ? JSON.parse(JSON.stringify(reward.abilities)) : undefined,
          items: reward.items ? JSON.parse(JSON.stringify(reward.items)) : undefined,
          titles: reward.titles ? JSON.parse(JSON.stringify(reward.titles)) : undefined,
          attributes: reward.attributes ? JSON.parse(JSON.stringify(reward.attributes)) : undefined
        }
      }
    })

    return NextResponse.json({
      success: true,
      rewards: formattedRewards,
      count: formattedRewards.length
    })

  } catch (error) {
    console.error('Erro ao buscar recompensas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar recompensas' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
