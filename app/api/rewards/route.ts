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
    const { mangaId, mangaTitle, episode, experience, abilities, items, titles, attributes, aliases } = body

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

    // Criar recompensa (aliases é opcional - só inclui se a migration foi aplicada)
    const createData: any = {
      mangaId: mangaId.toLowerCase(),
      mangaTitle: mangaTitle.trim(),
      episode: parseInt(episode),
      experience: experience ? parseInt(experience) : null,
      abilities: abilities ? abilities : null,
      items: items ? items : null,
      titles: titles ? titles : null,
      attributes: attributes ? attributes : null,
    }
    
    // Tenta adicionar aliases se foi fornecido
    if (aliases && Array.isArray(aliases) && aliases.length > 0) {
      createData.aliases = aliases
      console.log('[API REWARDS POST] Tentando salvar aliases:', aliases)
    }

    let reward
    try {
      reward = await prisma.mangaReward.create({
        data: createData
      })
      console.log('[API REWARDS POST] ✅ Recompensa criada com sucesso. Aliases salvos:', reward.aliases)
    } catch (createError: any) {
      console.error('[API REWARDS POST] ❌ Erro ao criar com aliases:', createError.message)
      console.error('[API REWARDS POST] Código do erro:', createError.code)
      
      // Se falhar por causa do campo aliases não existir, tenta sem ele
      if (createError.message?.includes('aliases') || 
          createError.message?.includes('column') || 
          createError.message?.includes('Unknown') ||
          createError.code === 'P2001' ||
          createError.code === 'P2011') {
        console.log('[API REWARDS POST] ⚠️ Campo aliases não existe no banco (migration não aplicada)')
        console.log('[API REWARDS POST] 💡 Solução: Execute "npx prisma migrate dev" para adicionar o campo')
        console.log('[API REWARDS POST] 🔄 Tentando criar sem aliases...')
        
        delete createData.aliases
        reward = await prisma.mangaReward.create({
          data: createData
        })
        console.log('[API REWARDS POST] ✅ Recompensa criada sem aliases (será adicionado após migration)')
        
        // Avisar o usuário que precisa aplicar a migration
        return NextResponse.json({
          success: true,
          message: 'Recompensa criada com sucesso, mas aliases não foram salvos. Execute a migration para habilitar aliases.',
          warning: 'Migration não aplicada - campo aliases não existe no banco',
          reward
        }, { status: 201 })
      } else {
        throw createError
      }
    }

    // Retornar resposta normal se chegou aqui (sem warning)
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

    // Erro de campo não encontrado (migration não aplicada)
    if (error.message?.includes('Unknown column') || error.message?.includes('column') || error.code === 'P2001') {
      return NextResponse.json(
        { 
          error: 'Campo "aliases" não encontrado no banco. Execute a migration: npx prisma migrate dev',
          details: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Erro ao criar recompensa',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// PUT - Atualizar recompensa existente (área secreta)
export async function PUT(request: NextRequest) {

  try {
    const body = await request.json()
    const { id, mangaId, mangaTitle, episode, experience, abilities, items, titles, attributes, aliases } = body

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

    // Atualizar recompensa (aliases é opcional)
    const updateData: any = {}
    if (mangaId) updateData.mangaId = mangaId.toLowerCase()
    if (mangaTitle) updateData.mangaTitle = mangaTitle.trim()
    if (episode !== undefined) updateData.episode = parseInt(episode)
    if (experience !== undefined) updateData.experience = experience ? parseInt(experience) : null
    if (abilities !== undefined) updateData.abilities = abilities || null
    if (items !== undefined) updateData.items = items || null
    if (titles !== undefined) updateData.titles = titles || null
    if (attributes !== undefined) updateData.attributes = attributes || null
    
    // Tenta adicionar aliases se foi fornecido
    if (aliases !== undefined && Array.isArray(aliases) && aliases.length > 0) {
      updateData.aliases = aliases
    }

    let reward
    try {
      reward = await prisma.mangaReward.update({
        where: { id },
        data: updateData
      })
    } catch (updateError: any) {
      // Se falhar por causa do campo aliases não existir, tenta sem ele
      if (updateError.message?.includes('aliases') || updateError.code === 'P2001') {
        delete updateData.aliases
        reward = await prisma.mangaReward.update({
          where: { id },
          data: updateData
        })
      } else {
        throw updateError
      }
    }

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

    // Erro de campo não encontrado (migration não aplicada)
    if (error.message?.includes('Unknown column') || error.message?.includes('column') || error.code === 'P2001') {
      return NextResponse.json(
        { 
          error: 'Campo "aliases" não encontrado no banco. Execute a migration: npx prisma migrate dev',
          details: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Erro ao atualizar recompensa',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
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

