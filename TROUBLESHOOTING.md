# Guia de Solução de Problemas

## Erro 500 ao tentar fazer login ou cadastrar

### Sintomas
- Erro 500 (Internal Server Error) ao tentar fazer login
- Erro 500 ao tentar cadastrar usuário
- Mensagem "Erro ao cadastrar. Tente novamente." no formulário
- Console do navegador mostra: `Failed to load resource: the server responded with a status of 500`

### Causas Comuns

#### 1. Banco de dados não configurado

**Problema**: A variável `DATABASE_URL` não está configurada ou está incorreta.

**Solução**:
1. Verifique se existe um arquivo `.env.local` na raiz do projeto
2. Adicione a variável `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/isekai?schema=public"
   ```
3. Substitua `user`, `password`, `localhost`, `5432` e `isekai` pelos valores corretos do seu banco de dados

#### 2. Migrations não executadas

**Problema**: As tabelas `users` e `user_progress` não existem no banco de dados.

**Solução**:
```bash
# 1. Gerar o Prisma Client
npm run db:generate

# 2. Executar as migrations
npm run db:migrate

# Ou usar os comandos diretamente:
npx prisma generate
npx prisma migrate dev --name add_user_and_progress
```

#### 3. Banco de dados não está rodando

**Problema**: O PostgreSQL não está rodando ou não está acessível.

**Solução**:
1. Verifique se o PostgreSQL está rodando:
   - Windows: Verifique nos serviços do Windows
   - Linux/Mac: `sudo systemctl status postgresql` ou `brew services list`
2. Verifique se a porta está correta (padrão: 5432)
3. Teste a conexão:
   ```bash
   psql -h localhost -U seu_usuario -d isekai
   ```

#### 4. NEXTAUTH_SECRET não configurado

**Problema**: A variável `NEXTAUTH_SECRET` não está configurada.

**Solução**:
1. Adicione no arquivo `.env.local`:
   ```env
   NEXTAUTH_SECRET=seu-secret-aleatorio-aqui
   ```
2. Gere um secret seguro:
   ```bash
   # Linux/Mac
   openssl rand -base64 32
   
   # Windows (PowerShell)
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   ```

### Verificação Rápida

Execute o script de verificação:
```bash
npm run db:check
```

Este script verifica:
- ✅ Se `DATABASE_URL` está configurado
- ✅ Se a conexão com o banco funciona
- ✅ Se as tabelas existem

### Passo a Passo Completo

1. **Verificar variáveis de ambiente**
   ```bash
   # Verifique se o arquivo .env.local existe
   cat .env.local
   ```

2. **Gerar Prisma Client**
   ```bash
   npm run db:generate
   ```

3. **Executar migrations**
   ```bash
   npm run db:migrate
   ```

4. **Verificar conexão**
   ```bash
   npm run db:check
   ```

5. **Iniciar servidor**
   ```bash
   npm run dev
   ```

### Mensagens de Erro Comuns

#### "P1001: Can't reach database server"
- O PostgreSQL não está rodando
- A `DATABASE_URL` está incorreta
- Firewall bloqueando a conexão

#### "P2021: Table does not exist"
- As migrations não foram executadas
- Execute: `npm run db:migrate`

#### "P2002: Unique constraint failed"
- Email já cadastrado (não é um erro, apenas informação)

#### "NEXTAUTH_SECRET is not set"
- Adicione `NEXTAUTH_SECRET` no `.env.local`

### Usando SQLite (Alternativa Simples)

Se você não tem PostgreSQL configurado, pode usar SQLite temporariamente:

1. **Altere o `prisma/schema.prisma`**:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. **Execute as migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

**Nota**: SQLite não é recomendado para produção, mas funciona para desenvolvimento.

### Ainda com Problemas?

1. **Verifique os logs do servidor**:
   - Os erros aparecem no terminal onde você rodou `npm run dev`
   - Procure por mensagens de erro do Prisma

2. **Verifique o console do navegador**:
   - Abra as ferramentas de desenvolvedor (F12)
   - Veja a aba "Console" para erros do cliente
   - Veja a aba "Network" para ver as requisições falhando

3. **Limpe o cache**:
   ```bash
   npm run clean
   rm -rf .next
   npm run dev
   ```

4. **Verifique a versão do Node.js**:
   ```bash
   node --version
   # Deve ser Node.js 18 ou superior
   ```

### Contato

Se ainda tiver problemas, verifique:
- Os logs do servidor para mensagens de erro específicas
- O console do navegador para erros do cliente
- A documentação do Prisma: https://www.prisma.io/docs
- A documentação do NextAuth: https://next-auth.js.org

