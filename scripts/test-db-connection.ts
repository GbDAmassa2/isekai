// Script para testar conexão com banco de dados
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com banco de dados...\n')
    
    // Testar conexão básica
    await prisma.$connect()
    console.log('✅ Conexão com banco de dados estabelecida!')
    
    // Verificar se a tabela ShareCode existe
    try {
      const count = await prisma.shareCode.count()
      console.log(`✅ Tabela ShareCode existe! (${count} registros)`)
    } catch (error: any) {
      console.error('❌ Erro ao acessar tabela ShareCode:', error.message)
    }
    
    // Verificar se a tabela MangaReward existe
    try {
      const count = await prisma.mangaReward.count()
      console.log(`✅ Tabela MangaReward existe! (${count} registros)`)
    } catch (error: any) {
      console.error('❌ Erro ao acessar tabela MangaReward:', error.message)
    }
    
    console.log('\n✨ Teste concluído com sucesso!')
    
  } catch (error: any) {
    console.error('❌ Erro ao conectar com banco de dados:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

