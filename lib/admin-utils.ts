import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

/**
 * Verifica se o usuário atual é admin
 * Retorna o usuário se for admin, null caso contrário
 */
export async function checkAdmin() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, isAdmin: true }
  })

  if (!user || !user.isAdmin) {
    return null
  }

  return user
}

/**
 * Middleware helper para verificar admin em rotas de API
 * Retorna NextResponse com erro se não for admin, null se for admin
 */
export async function requireAdmin() {
  const admin = await checkAdmin()
  
  if (!admin) {
    return NextResponse.json(
      { error: "Acesso negado. Apenas administradores podem acessar esta rota." },
      { status: 403 }
    )
  }

  return null
}

