# Setup Rápido - Resolvendo Erro 500

## ⚠️ Problema: Erro 500 ao fazer login/cadastrar

O erro 500 está acontecendo porque o arquivo `.env.local` não existe ou não está configurado corretamente.

## 🔧 Solução Rápida

### 1. Criar arquivo `.env.local`

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/isekai?schema=public"

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-aleatorio-aqui
```

### 2. Configurar DATABASE_URL

Substitua `user`, `password`, `localhost`, `5432` e `isekai` pelos valores do seu banco de dados PostgreSQL.

**Exemplo:**
```env
DATABASE_URL="postgresql://postgres:senha123@localhost:5432/isekai?schema=public"
```

### 3. Gerar NEXTAUTH_SECRET

Gere um secret aleatório seguro:

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

Ou use qualquer string aleatória longa, por exemplo:
```env
NEXTAUTH_SECRET=minha-chave-secreta-super-segura-123456789
```

### 4. Executar migrations

```bash
# Gerar Prisma Client
npm run db:generate

# Criar as tabelas no banco
npm run db:migrate
```

### 5. Verificar conexão

```bash
npm run db:check
```

### 6. Reiniciar o servidor

```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

## 🚀 Usando SQLite (Mais Simples para Desenvolvimento)

Se você não tem PostgreSQL configurado, pode usar SQLite:

### 1. Alterar `prisma/schema.prisma`

Mude a linha do datasource:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### 2. Criar `.env.local`

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-aleatorio-aqui
```

**Nota**: Com SQLite, não precisa de DATABASE_URL!

### 3. Executar migrations

```bash
npm run db:generate
npm run db:migrate
```

### 4. Reiniciar servidor

```bash
npm run dev
```

## ✅ Verificação

Após configurar, você deve conseguir:
- ✅ Acessar a página de cadastro sem erro 500
- ✅ Criar uma conta
- ✅ Fazer login
- ✅ Ver seu progresso sincronizado

## 🆘 Ainda com problemas?

Consulte o arquivo `TROUBLESHOOTING.md` para mais detalhes.

## 📝 Checklist

- [ ] Arquivo `.env.local` criado
- [ ] `DATABASE_URL` configurado (ou usando SQLite)
- [ ] `NEXTAUTH_SECRET` configurado
- [ ] `npm run db:generate` executado
- [ ] `npm run db:migrate` executado
- [ ] `npm run db:check` passou sem erros
- [ ] Servidor reiniciado

