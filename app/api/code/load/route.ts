import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    // Validar código
    if (!code || !/^\d{8}$/.test(code)) {
      return NextResponse.json(
        { error: 'Código inválido. Deve ter exatamente 8 dígitos.' },
        { status: 400 }
      )
    }

    try {
      // Buscar código no banco
      const shareCode = await prisma.shareCode.findUnique({
        where: { code }
      })

      if (!shareCode) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Código não encontrado',
            message: 'Este código não existe ou expirou.'
          },
          { status: 404 }
        )
      }

      // Verificar se expirou
      if (new Date(shareCode.expiresAt) < new Date()) {
        // Remover código expirado
        await prisma.shareCode.delete({
          where: { code }
        })
        
        return NextResponse.json(
          { 
            success: false,
            error: 'Código expirado',
            message: 'Este código expirou. Gere um novo código.'
          },
          { status: 410 }
        )
      }

      // Retornar dados
      return NextResponse.json(
        { 
          success: true,
          data: shareCode.data,
          createdAt: shareCode.createdAt,
          expiresAt: shareCode.expiresAt
        },
        { status: 200 }
      )
    } catch (dbError: any) {
      // Se erro de banco, retornar erro mas não falhar completamente
      console.error('Erro ao buscar no banco:', dbError)
      return NextResponse.json(
        { 
          success: false,
          error: 'Erro ao buscar código',
          message: 'Não foi possível buscar o código no servidor. Verifique sua conexão.'
        },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('Erro ao carregar código:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: process.env.NODE_ENV === 'development' ? error?.message : undefined },
      { status: 500 }
    )
  }
}

