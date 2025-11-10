import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar todas as recompensas (área secreta)
export async function GET(request: NextRequest) {

  try {
    const { searchParams } = new URL(request.url)
    const mangaId = searchParams.get('mangaId')
    const episode = searchParams.get('episode')

    const where: any = {}
    if (mangaId) {
      where.mangaId = mangaId.toLowerCase()
    }
    if (episode) {
      where.episode = parseInt(episode)
    }

    const rewards = await prisma.mangaReward.findMany({
      where,
      orderBy: [
        { mangaTitle: 'asc' },
        { episode: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      rewards
    })
  } catch (error: any) {
    console.error('[API REWARDS GET] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar recompensas' },
      { status: 500 }
    )
  }
}

// POST - Criar nova recompensa (área secreta)
export async function POST(request: NextRequest) {

  try {
    const body = await request.json()
    const { mangaId, mangaTitle, episode, experience, abilities, items, titles, attributes } = body

    // Validações
    if (!mangaId || !mangaTitle || episode === undefined) {
      return NextResponse.json(
        { error: 'mangaId, mangaTitle e episode são obrigatórios' },
        { status: 400 }
      )
    }

    if (episode < 1) {
      return NextResponse.json(
        { error: 'O episódio deve ser maior que 0' },
        { status: 400 }
      )
    }

    // Verificar se já existe recompensa para este mangá e episódio
    const existing = await prisma.mangaReward.findUnique({
      where: {
        mangaId_episode: {
          mangaId: mangaId.toLowerCase(),
          episode: parseInt(episode)
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Já existe uma recompensa para este mangá e episódio' },
        { status: 400 }
      )
    }

    // Criar recompensa
    const reward = await prisma.mangaReward.create({
      data: {
        mangaId: mangaId.toLowerCase(),
        mangaTitle: mangaTitle.trim(),
        episode: parseInt(episode),
        experience: experience ? parseInt(experience) : null,
        abilities: abilities ? abilities : null,
        items: items ? items : null,
        titles: titles ? titles : null,
        attributes: attributes ? attributes : null,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Recompensa criada com sucesso',
      reward
    }, { status: 201 })
  } catch (error: any) {
    console.error('[API REWARDS POST] Erro:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Já existe uma recompensa para este mangá e episódio' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao criar recompensa' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar recompensa existente (área secreta)
export async function PUT(request: NextRequest) {

  try {
    const body = await request.json()
    const { id, mangaId, mangaTitle, episode, experience, abilities, items, titles, attributes } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID da recompensa é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a recompensa existe
    const existing = await prisma.mangaReward.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Recompensa não encontrada' },
        { status: 404 }
      )
    }

    // Se mangaId ou episode mudaram, verificar se não conflita com outra recompensa
    if ((mangaId && mangaId.toLowerCase() !== existing.mangaId) || 
        (episode !== undefined && parseInt(episode) !== existing.episode) ||
        (mangaTitle && mangaTitle.trim() !== existing.mangaTitle)) {
      
      const newMangaId = mangaId ? mangaId.toLowerCase() : existing.mangaId
      const newEpisode = episode !== undefined ? parseInt(episode) : existing.episode

      const conflict = await prisma.mangaReward.findUnique({
        where: {
          mangaId_episode: {
            mangaId: newMangaId,
            episode: newEpisode
          }
        }
      })

      if (conflict && conflict.id !== id) {
        return NextResponse.json(
          { error: 'Já existe outra recompensa para este mangá e episódio' },
          { status: 400 }
        )
      }
    }

    // Atualizar recompensa
    const reward = await prisma.mangaReward.update({
      where: { id },
      data: {
        ...(mangaId && { mangaId: mangaId.toLowerCase() }),
        ...(mangaTitle && { mangaTitle: mangaTitle.trim() }),
        ...(episode !== undefined && { episode: parseInt(episode) }),
        ...(experience !== undefined && { experience: experience ? parseInt(experience) : null }),
        ...(abilities !== undefined && { abilities: abilities || null }),
        ...(items !== undefined && { items: items || null }),
        ...(titles !== undefined && { titles: titles || null }),
        ...(attributes !== undefined && { attributes: attributes || null }),
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Recompensa atualizada com sucesso',
      reward
    })
  } catch (error: any) {
    console.error('[API REWARDS PUT] Erro:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Já existe outra recompensa para este mangá e episódio' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar recompensa' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar recompensa (área secreta)
export async function DELETE(request: NextRequest) {

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID da recompensa é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a recompensa existe
    const existing = await prisma.mangaReward.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Recompensa não encontrada' },
        { status: 404 }
      )
    }

    // Deletar recompensa
    await prisma.mangaReward.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Recompensa deletada com sucesso'
    })
  } catch (error: any) {
    console.error('[API REWARDS DELETE] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar recompensa' },
      { status: 500 }
    )
  }
}

