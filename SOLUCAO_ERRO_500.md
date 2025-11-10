# 🚨 Solução Rápida - Erro 500

## Problema Identificado

O erro 500 está acontecendo porque:
1. ❌ O arquivo `.env.local` não existe
2. ❌ O `NEXTAUTH_SECRET` não está configurado
3. ❌ As migrations podem não ter sido executadas

## Solução Imediata

### Opção 1: Usar SQLite (Mais Simples) ⭐ RECOMENDADO

Já existe um arquivo `dev.db` no projeto, então podemos usar SQLite:

#### 1. Alterar o schema para SQLite

Edite o arquivo `prisma/schema.prisma` e altere:

```prisma
datasource db {
  provider = "sqlite"  // Mudar de "postgresql" para "sqlite"
  url      = "file:./dev.db"  // Adicionar esta linha
}
```

#### 2. Criar arquivo `.env.local`

Crie um arquivo `.env.local` na raiz do projeto:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=minha-chave-secreta-123456789-aleatoria
```

**Importante**: Gere um `NEXTAUTH_SECRET` único. Pode ser qualquer string longa e aleatória.

#### 3. Executar os comandos

```bash
# Gerar Prisma Client
npm run db:generate

# Executar migrations (cria as tabelas)
npm run db:migrate

# Reiniciar o servidor
npm run dev
```

### Opção 2: Usar PostgreSQL

Se você tem PostgreSQL instalado:

#### 1. Criar arquivo `.env.local`

```env
# Database
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/isekai?schema=public"

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=minha-chave-secreta-123456789-aleatoria
```

#### 2. Executar os comandos

```bash
# Gerar Prisma Client
npm run db:generate

# Executar migrations
npm run db:migrate

# Verificar conexão
npm run db:check

# Reiniciar servidor
npm run dev
```

## Verificação Rápida

Após seguir os passos acima:

1. ✅ O servidor deve iniciar sem erros
2. ✅ Acesse http://localhost:3000/auth/signup
3. ✅ Tente criar uma conta
4. ✅ Não deve mais aparecer erro 500

## Comandos Úteis

```bash
# Verificar conexão com banco
npm run db:check

# Gerar Prisma Client
npm run db:generate

# Executar migrations
npm run db:migrate

# Abrir Prisma Studio (ver dados)
npm run db:studio
```

## Se Ainda Der Erro

1. **Verifique os logs do servidor** (terminal onde rodou `npm run dev`)
2. **Verifique o console do navegador** (F12)
3. **Execute o comando de verificação**:
   ```bash
   npm run db:check
   ```

## Próximos Passos

Após resolver o erro 500:
1. ✅ Criar uma conta
2. ✅ Fazer login
3. ✅ Seu progresso será sincronizado automaticamente
4. ✅ Você pode acessar de qualquer dispositivo

---

**Nota**: SQLite é mais simples para desenvolvimento, mas para produção recomenda-se PostgreSQL.

