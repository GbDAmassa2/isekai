import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const data = await request.json()

    // Validar dados
    if (!data.profile || !data.mangas || !data.abilities || !data.items || !data.titles || !data.collectedRewards) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    // Salvar ou atualizar progresso
    const progress = await prisma.userProgress.upsert({
      where: { userId },
      update: {
        profile: data.profile,
        mangas: data.mangas,
        abilities: data.abilities,
        items: data.items,
        titles: data.titles,
        collectedRewards: data.collectedRewards,
        lastSyncedAt: new Date(),
      },
      create: {
        userId,
        profile: data.profile,
        mangas: data.mangas,
        abilities: data.abilities,
        items: data.items,
        titles: data.titles,
        collectedRewards: data.collectedRewards,
      }
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Progresso salvo com sucesso',
        lastSyncedAt: progress.lastSyncedAt
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erro ao salvar progresso:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

