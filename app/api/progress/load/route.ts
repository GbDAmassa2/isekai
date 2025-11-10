import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
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

    // Carregar progresso do banco
    const progress = await prisma.userProgress.findUnique({
      where: { userId }
    })

    if (!progress) {
      // Retornar dados vazios se não houver progresso salvo
      return NextResponse.json(
        { 
          success: true,
          data: null,
          message: 'Nenhum progresso encontrado'
        },
        { status: 200 }
      )
    }

    // Retornar dados do progresso
    return NextResponse.json(
      { 
        success: true,
        data: {
          profile: progress.profile,
          mangas: progress.mangas,
          abilities: progress.abilities,
          items: progress.items,
          titles: progress.titles,
          collectedRewards: progress.collectedRewards,
        },
        lastSyncedAt: progress.lastSyncedAt
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erro ao carregar progresso:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

