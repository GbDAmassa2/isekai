/**
 * Script para tornar um usuário administrador
 * 
 * Uso:
 * npx tsx scripts/make-admin.ts <email>
 * 
 * Exemplo:
 * npx tsx scripts/make-admin.ts admin@example.com
 */

import { prisma } from '../lib/prisma'

async function makeAdmin(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.error(`❌ Usuário com email "${email}" não encontrado.`)
      process.exit(1)
    }

    if (user.isAdmin) {
      console.log(`ℹ️  O usuário "${email}" já é administrador.`)
      process.exit(0)
    }

    await prisma.user.update({
      where: { email },
      data: { isAdmin: true }
    })

    console.log(`✅ Usuário "${email}" agora é administrador!`)
  } catch (error: any) {
    console.error('❌ Erro ao tornar usuário admin:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

const email = process.argv[2]

if (!email) {
  console.error('❌ Por favor, forneça um email como argumento.')
  console.log('Uso: npx tsx scripts/make-admin.ts <email>')
  process.exit(1)
}

makeAdmin(email)

