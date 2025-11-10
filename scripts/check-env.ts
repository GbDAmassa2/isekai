// Script para verificar configuração do .env.local
import { config } from 'dotenv'
import { resolve } from 'path'

// Carregar .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const databaseUrl = process.env.DATABASE_URL

console.log('\n📋 Verificando configuração do banco de dados...\n')

if (!databaseUrl) {
  console.error('❌ DATABASE_URL não encontrado no .env.local')
  console.log('\n💡 Você precisa criar um arquivo .env.local com:')
  console.log('DATABASE_URL="sua-url-do-banco-aqui"')
  process.exit(1)
}

console.log('✅ DATABASE_URL encontrado')
console.log(`\n🔗 URL do banco: ${databaseUrl.substring(0, 50)}...`)

// Verificar formato
if (databaseUrl.includes('postgres://') || databaseUrl.includes('postgresql://')) {
  console.log('✅ Formato da URL parece correto (PostgreSQL)')
} else {
  console.warn('⚠️  Formato da URL pode estar incorreto')
}

// Verificar se contém credenciais
if (databaseUrl.includes('@')) {
  console.log('✅ URL contém credenciais')
} else {
  console.warn('⚠️  URL pode não conter credenciais')
}

// Verificar se contém host
if (databaseUrl.includes('db.prisma.io') || databaseUrl.includes('localhost') || databaseUrl.includes('accelerate.prisma-data.net')) {
  console.log('✅ Host detectado na URL')
} else {
  console.warn('⚠️  Host não reconhecido na URL')
}

console.log('\n✨ Verificação concluída!\n')

