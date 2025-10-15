# 🚀 Configuração para Deploy no Vercel

## 1. Preparação Local

Antes de fazer o deploy, certifique-se de que o projeto funciona localmente:

### Testar localmente:
```bash
npm run dev
```

Acesse `http://localhost:3000` e teste:
- Tela inicial com nome de usuário
- Dashboard (`/dashboard`)
- Funcionalidades do sistema
- Exportar/Importar progresso

## 2. Deploy no Vercel

### 2.1 Conectar Repositório
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Selecione seu repositório `sistema-isekai`

### 2.2 Deploy Direto
O sistema agora não requer variáveis de ambiente especiais!

### 2.3 Deploy
1. Clique em "Deploy"
2. Aguarde o processo de build
3. O Vercel irá fornecer uma URL como: `https://sistema-isekai-xxx.vercel.app`

## 3. Teste Final

Após o deploy, acesse sua URL do Vercel e teste:
- ✅ Tela inicial com nome de usuário
- ✅ Dashboard completo
- ✅ Funcionalidades do sistema
- ✅ Exportar/Importar progresso

## 4. Como Usar

### 4.1 Primeira Vez
1. Digite seu nome na tela inicial
2. Clique em "Iniciar Aventura"
3. Comece a usar o sistema

### 4.2 Exportar Progresso
1. No dashboard, clique no botão de download (📥)
2. Um arquivo JSON será baixado com todo seu progresso
3. Guarde este arquivo para backup

### 4.3 Importar Progresso
1. Na tela inicial, selecione um arquivo JSON
2. Digite seu nome
3. Clique em "Iniciar Aventura"
4. Seus dados serão carregados automaticamente

## 🔐 Segurança

- **Dados Locais**: Todos os dados são salvos localmente no navegador
- **HTTPS**: Sempre use HTTPS em produção (automático no Vercel)
- **Backup**: Sempre exporte seu progresso para arquivos JSON
- **Privacidade**: Nenhum dado é enviado para servidores externos

## 📱 Funcionalidades Disponíveis

- ✅ Sistema simples com nome de usuário
- ✅ Contador de episódios de mangás
- ✅ Sistema de XP automático
- ✅ Gerenciamento de habilidades
- ✅ Exportar/Importar progresso
- ✅ Interface responsiva
- ✅ Notificações animadas

## 🆘 Solução de Problemas

### Dados não salvam
- Verifique se o navegador permite localStorage
- Tente usar um navegador diferente

### Arquivo não importa
- Verifique se o arquivo é um JSON válido
- Certifique-se de que foi exportado deste sistema

### Página não carrega
- Verifique os logs do Vercel
- Tente limpar o cache do navegador

## 📱 URLs Importantes

- Início: `/` (tela com nome de usuário)
- Dashboard: `/dashboard` (sistema principal)
- Logout: Botão no dashboard limpa dados locais
