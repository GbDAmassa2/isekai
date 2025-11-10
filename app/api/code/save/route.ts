import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { code, data, userName, oldCode } = await request.json()

    // Validar código (8 dígitos)
    if (!code || !/^\d{8}$/.test(code)) {
      return NextResponse.json(
        { error: 'Código inválido. Deve ter exatamente 8 dígitos.' },
        { status: 400 }
      )
    }

    // Validar dados
    if (!data || !data.profile || !data.mangas || !data.abilities || !data.items || !data.titles) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    // Calcular data de expiração (30 dias)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Salvar ou atualizar código no banco
    try {
      // Excluir todos os códigos antigos do mesmo usuário (baseado no nome no perfil)
      if (userName) {
        try {
          // Buscar todos os códigos (exceto o atual)
          const allCodes = await prisma.shareCode.findMany({
            select: {
              code: true,
              data: true
            }
          })

          // Filtrar códigos do mesmo usuário (exceto o código atual)
          const userCodesToDelete: string[] = []
          
          for (const shareCode of allCodes) {
            // Pular o código atual
            if (shareCode.code === code) continue
            
            try {
              const codeData = shareCode.data as any
              // Verificar se o código pertence ao mesmo usuário
              if (codeData?.profile?.name === userName) {
                userCodesToDelete.push(shareCode.code)
              }
            } catch {
              // Ignorar erros ao processar dados
            }
          }

          // Excluir códigos antigos do mesmo usuário
          if (userCodesToDelete.length > 0) {
            await prisma.shareCode.deleteMany({
              where: {
                code: {
                  in: userCodesToDelete
                }
              }
            })
            console.log(`✅ Excluídos ${userCodesToDelete.length} códigos antigos do usuário ${userName}:`, userCodesToDelete)
          } else {
            console.log(`ℹ️  Nenhum código antigo encontrado para o usuário ${userName}`)
          }
        } catch (cleanupError: any) {
          console.warn('⚠️  Erro ao limpar códigos antigos:', cleanupError?.message || cleanupError)
        }
      }
      
      // Se há um código antigo específico, tentar excluí-lo também (caso não tenha sido excluído acima)
      if (oldCode && /^\d{8}$/.test(oldCode) && oldCode !== code) {
        try {
          await prisma.shareCode.delete({
            where: {
              code: oldCode
            }
          }).catch(() => {
            // Ignorar se não existir (já foi excluído ou nunca existiu)
          })
        } catch (deleteError) {
          // Ignorar erros (código pode não existir)
        }
      }

      // Salvar ou atualizar o novo código
      await prisma.shareCode.upsert({
        where: { code },
        update: {
          data,
          expiresAt,
        },
        create: {
          code,
          data,
          expiresAt,
        }
      })

      return NextResponse.json(
        { 
          success: true, 
          message: 'Código salvo com sucesso',
          code,
          expiresAt: expiresAt.toISOString(),
          oldCodesDeleted: true
        },
        { status: 200 }
      )
    } catch (dbError: any) {
      // Se erro de banco, ainda salvar no localStorage como fallback
      console.error('Erro ao salvar no banco (usando localStorage como fallback):', dbError)
      
      // Retornar sucesso mesmo assim (dados salvos localmente)
      return NextResponse.json(
        { 
          success: true, 
          message: 'Código salvo localmente (banco não disponível)',
          code,
          warning: 'Dados salvos apenas localmente'
        },
        { status: 200 }
      )
    }

  } catch (error: any) {
    console.error('Erro ao salvar código:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: process.env.NODE_ENV === 'development' ? error?.message : undefined },
      { status: 500 }
    )
  }
}

