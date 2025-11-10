# Instruções de Migração - Sistema de Login e Sincronização

Este documento descreve as mudanças implementadas e como configurar o sistema de login e sincronização de progresso.

## O que foi implementado

1. **Sistema de Autenticação com Banco de Dados**
   - Modelos `User` e `UserProgress` no Prisma
   - Autenticação usando NextAuth com credenciais
   - Hash de senhas com bcryptjs
   - APIs para salvar/carregar progresso do banco

2. **Sincronização Automática de Progresso**
   - Progresso sincronizado automaticamente com o banco quando usuário está logado
   - Debounce de 1 segundo para evitar muitas requisições
   - Fallback para localStorage quando não logado
   - localStorage sempre usado como backup mesmo quando logado

3. **Interface Atualizada**
   - Página inicial com opções de login/cadastro e modo offline
   - Dashboard verifica autenticação
   - Botão de logout funcional
   - Mantém funcionalidade de export/import JSON

## Como configurar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` baseado no `env.example`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/isekai?schema=public"

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-aleatorio-aqui
```

**Importante**: Gere um `NEXTAUTH_SECRET` seguro. Você pode gerar um com:
```bash
openssl rand -base64 32
```

### 3. Configurar o banco de dados

Certifique-se de que o PostgreSQL está rodando e a `DATABASE_URL` está correta.

### 4. Executar migrations do Prisma

```bash
# Gerar o cliente Prisma
npx prisma generate

# Criar as tabelas no banco
npx prisma migrate dev --name add_user_and_progress

# (Opcional) Abrir o Prisma Studio para ver os dados
npx prisma studio
```

### 5. Iniciar o servidor

```bash
npm run dev
```

## Como usar

### Criar uma conta

1. Acesse a página inicial
2. Clique em "Criar Conta"
3. Preencha nome, email e senha
4. Faça login com suas credenciais

### Modo offline (sem login)

1. Acesse a página inicial
2. Digite um nome na seção "Modo Offline"
3. (Opcional) Importe um arquivo JSON com seu progresso
4. Clique em "Iniciar Aventura (Offline)"

**Nota**: No modo offline, o progresso é salvo apenas no localStorage do navegador.

### Sincronização automática

Quando você está logado:
- Seu progresso é salvo automaticamente no banco após 1 segundo de inatividade
- Ao acessar de outro dispositivo, seu progresso será carregado automaticamente
- O localStorage ainda é usado como backup local

### Exportar/Importar JSON

A funcionalidade de export/import JSON continua disponível:
- **Exportar**: Use o botão de exportar no dashboard para baixar seu progresso como JSON
- **Importar**: Na página inicial, use a opção de importar arquivo JSON

## Estrutura do banco de dados

### Tabela `users`
- `id`: ID único do usuário
- `email`: Email único do usuário
- `name`: Nome do usuário
- `password`: Hash da senha (bcrypt)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### Tabela `user_progress`
- `id`: ID único do progresso
- `userId`: ID do usuário (FK para users)
- `profile`: JSON com dados do perfil
- `mangas`: JSON com array de mangás
- `abilities`: JSON com array de habilidades
- `items`: JSON com array de itens
- `titles`: JSON com array de títulos
- `collectedRewards`: JSON com array de recompensas coletadas
- `lastSyncedAt`: Data da última sincronização
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## Migração de dados existentes

Se você já tem dados salvos no localStorage:

1. Exporte seus dados como JSON (usando a funcionalidade de exportar)
2. Faça login ou crie uma conta
3. Importe o JSON na página inicial OU use a funcionalidade de importar no dashboard

## Troubleshooting

### Erro: "Não autenticado"
- Verifique se você está logado
- Verifique se o `NEXTAUTH_SECRET` está configurado
- Verifique os logs do servidor para mais detalhes

### Erro: "Erro ao salvar progresso"
- Verifique se o banco de dados está acessível
- Verifique se a `DATABASE_URL` está correta
- Verifique os logs do servidor

### Progresso não sincroniza
- Verifique se você está logado (deve aparecer seu nome no dashboard)
- Verifique a conexão com o banco de dados
- Verifique os logs do navegador (F12) para erros

### Migration falha
- Certifique-se de que o PostgreSQL está rodando
- Verifique se a `DATABASE_URL` está correta
- Verifique se você tem permissões para criar tabelas no banco

## Notas importantes

1. **Senhas**: As senhas são hasheadas com bcrypt antes de serem salvas no banco
2. **Sincronização**: O progresso é sincronizado automaticamente com debounce de 1 segundo
3. **Backup**: O localStorage sempre é usado como backup, mesmo quando logado
4. **Modo Offline**: Você pode continuar usando o sistema sem login, mas o progresso não sincroniza entre dispositivos
5. **Export/Import**: A funcionalidade de export/import JSON continua disponível para backup manual

## Próximos passos (opcionais)

- [ ] Adicionar recuperação de senha
- [ ] Adicionar verificação de email
- [ ] Adicionar sincronização em tempo real
- [ ] Adicionar histórico de mudanças
- [ ] Adicionar backup automático periódico

