# 🚀 Instruções para Completar a Configuração do Admin

## Passo 1: Configurar o Banco de Dados

1. Abra o arquivo `.env` na raiz do projeto
2. Configure a `DATABASE_URL` com suas credenciais do PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/isekai?schema=public"
```

**Substitua:**
- `usuario` pelo seu usuário do PostgreSQL
- `senha` pela sua senha do PostgreSQL
- `localhost:5432` pelo host e porta do seu banco (se diferente)
- `isekai` pelo nome do seu banco de dados

## Passo 2: Executar a Migração

Após configurar a `DATABASE_URL`, execute:

```bash
npx prisma migrate dev --name add_is_admin_field
```

Isso irá:
- Criar a migração para adicionar o campo `isAdmin`
- Aplicar a migração no banco de dados
- Gerar o Prisma Client atualizado

## Passo 3: Tornar um Usuário Administrador

Depois da migração, você pode tornar qualquer usuário admin usando:

```bash
npx tsx scripts/make-admin.ts seu-email@example.com
```

**Importante:** Substitua `seu-email@example.com` pelo email do usuário que você quer tornar admin.

## Passo 4: Testar o Sistema

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Faça login com a conta de administrador

3. No dashboard, você verá um botão "Admin" no canto superior direito

4. Clique no botão para acessar o painel administrativo em `/admin`

## ✅ Verificação

Para verificar se um usuário é admin, você pode executar no banco:

```sql
SELECT email, "isAdmin" FROM users WHERE email = 'seu-email@example.com';
```

O campo `isAdmin` deve estar como `true` para usuários administradores.

## 🐛 Troubleshooting

### Erro: "Environment variable not found: DATABASE_URL"
- Certifique-se de que o arquivo `.env` existe na raiz do projeto
- Verifique se a `DATABASE_URL` está configurada corretamente

### Erro: "Database connection failed"
- Verifique se o PostgreSQL está rodando
- Confirme que as credenciais estão corretas
- Teste a conexão com: `npm run db:check`

### Botão Admin não aparece
- Verifique se você fez login com uma conta admin
- Confirme que o campo `isAdmin` está como `true` no banco
- Faça logout e login novamente para atualizar a sessão
