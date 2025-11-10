import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkConnection() {
  try {
    console.log('🔍 Verificando conexão com o banco de dados...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurado' : '❌ Não configurado')
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL não está configurado!')
      console.log('💡 Adicione DATABASE_URL no arquivo .env.local')
      process.exit(1)
    }

    // Tentar conectar
    await prisma.$connect()
    console.log('✅ Conexão com o banco de dados estabelecida!')

    // Verificar se as tabelas existem
    try {
      await prisma.user.findFirst()
      console.log('✅ Tabela "users" existe')
    } catch (error: any) {
      if (error?.code === 'P2021' || error?.message?.includes('does not exist')) {
        console.error('❌ Tabela "users" não existe!')
        console.log('💡 Execute: npx prisma migrate dev')
        process.exit(1)
      }
      throw error
    }

    try {
      await prisma.userProgress.findFirst()
      console.log('✅ Tabela "user_progress" existe')
    } catch (error: any) {
      if (error?.code === 'P2021' || error?.message?.includes('does not exist')) {
        console.error('❌ Tabela "user_progress" não existe!')
        console.log('💡 Execute: npx prisma migrate dev')
        process.exit(1)
      }
      throw error
    }

    console.log('✅ Tudo configurado corretamente!')
  } catch (error: any) {
    console.error('❌ Erro ao verificar conexão:', error.message)
    
    if (error?.code === 'P1001') {
      console.error('❌ Não foi possível conectar ao banco de dados!')
      console.log('💡 Verifique se:')
      console.log('   1. O PostgreSQL está rodando')
      console.log('   2. A DATABASE_URL está correta')
      console.log('   3. Você tem permissões para acessar o banco')
    } else if (error?.code === 'P2021') {
      console.error('❌ As tabelas não existem no banco de dados!')
      console.log('💡 Execute: npx prisma migrate dev')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkConnection()

