# 📚 Isekai - Documentação Completa do Projeto

## 🎯 Visão Geral

**Isekai** é uma aplicação web desenvolvida em Next.js que simula um sistema de RPG baseado em mangás/manhwas/manhuas. Os usuários podem adicionar obras que leram, ganhar XP, subir de nível e desenvolver habilidades baseadas no conteúdo consumido.

## 🏗️ Arquitetura do Projeto

### Tecnologias Utilizadas
- **Frontend**: Next.js 15.2.4 + React
- **Styling**: Tailwind CSS + shadcn/ui
- **Autenticação**: NextAuth.js
- **Linguagem**: TypeScript
- **Gerenciamento de Estado**: React Context API

### Estrutura de Pastas
```
isekai/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Dashboard principal
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI (shadcn/ui)
│   └── *.tsx             # Componentes específicos
├── lib/                  # Utilitários e tipos
├── hooks/                # Custom hooks
├── public/               # Assets estáticos
└── styles/              # Arquivos de estilo adicionais
```

## 🎮 Funcionalidades Principais

### 1. Sistema de Autenticação
- **Login/Registro** com NextAuth.js
- **Páginas**: `/auth/signin`, `/auth/signup`, `/auth/error`
- **Proteção de rotas** para dashboard

### 2. Sistema de Perfil e Progressão

#### Atributos do Personagem
- **Atributos Base**: Força, Agilidade, Inteligência, Vitalidade, Sorte
- **Atributos Customizados**: Definidos pelo usuário
- **Sistema de Níveis**: Baseado em XP acumulado
- **Fórmula de XP**: `Nível × 100` XP necessário para próximo nível

#### Sistema de XP
- **Ganho de XP**: `Episódio Atual × 10 XP` por mangá
- **Regressão de Nível**: Ao excluir mangás, XP é removido e níveis regridem automaticamente
- **Cálculo Multi-nível**: Sistema inteligente que remove múltiplos níveis quando necessário

### 3. Biblioteca de Mangás

#### Tipos Suportados
- **📖 Mangás** (Japoneses)
- **🇰🇷 Manhwas** (Coreanos)  
- **🇨🇳 Manhuas** (Chineses)

#### Funcionalidades da Biblioteca
- **Adicionar Mangás**: Formulário completo com validação
- **Editar Mangás**: Modal para modificar informações
- **Excluir Mangás**: Remove obra e recalcula XP
- **Busca por Nome**: Campo de busca em tempo real
- **Filtros por Tipo**: Botões para filtrar por categoria
- **Validação de Duplicatas**: Impede obras com mesmo nome
- **Controle de Episódios**: Incremento/decremento com botões

#### Campos do Mangá
- **Título**: Nome da obra (obrigatório)
- **Tipo**: Manga/Manhwa/Manhua
- **URL da Capa**: Link para imagem de capa
- **Link do Site**: URL para ler a obra
- **Episódio Atual**: Número de capítulos lidos

### 4. Sistema de Habilidades
- **Habilidades Baseadas em Mangás**: Cada habilidade tem fonte específica
- **Adicionar Habilidades**: Modal para criar novas habilidades
- **Editar Habilidades**: Modificar habilidades existentes
- **Excluir Habilidades**: Remover habilidades
- **Categorização**: Habilidades organizadas por fonte

### 5. Sistema de Itens
- **Inventário**: Gerenciamento de itens do personagem
- **Categorias**: Armas, Armaduras, Acessórios, Consumíveis
- **Equipamento**: Sistema de equipar/desequipar itens
- **Edição**: Modificar itens existentes

### 6. Sistema de Títulos
- **Títulos Honoríficos**: Conquistas baseadas em progresso
- **Fonte**: Títulos podem vir de mangás específicos
- **Gerenciamento**: Adicionar, editar e excluir títulos

## 🎨 Interface do Usuário

### Design System
- **Tema**: Escuro com cores âmbar/ouro
- **Paleta**: Slate (fundo), Amber (destaque), Purple (accent)
- **Componentes**: shadcn/ui para consistência
- **Responsivo**: Mobile-first design

### Componentes Principais

#### FloatingCharacterWindow
- **Janela Principal**: Interface central do personagem
- **Tabs**: Mangás, Habilidades, Itens, Títulos, Atributos
- **Modais**: Sistema de modais para diferentes funcionalidades
- **Animações**: Transições suaves e efeitos visuais

#### Cards de Mangá
- **Layout**: Grid responsivo
- **Informações**: Título, tipo, episódio atual, capa
- **Ações**: Editar, excluir, ir ao site, adicionar conteúdo
- **Hover Effects**: Escala e efeitos visuais

### Estados e Feedback
- **Notificações**: Sistema de toast para feedback
- **Animações de XP**: Efeitos visuais ao ganhar XP
- **Level Up**: Animações especiais ao subir de nível
- **Loading States**: Indicadores de carregamento

## 🔧 Funcionalidades Técnicas

### Gerenciamento de Estado
- **IsekaiContext**: Context principal da aplicação
- **Estado Global**: Profile, mangas, abilities, items, titles
- **Persistência**: localStorage para dados do usuário
- **Sincronização**: Estado sincronizado entre componentes

### Validações
- **Duplicatas**: Prevenção de mangás com mesmo nome
- **Formulários**: Validação de campos obrigatórios
- **Tipos**: Validação TypeScript em tempo de compilação

### Performance
- **Lazy Loading**: Componentes carregados sob demanda
- **Memoização**: Otimizações de re-render
- **Bundle Splitting**: Código dividido por rotas

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Adaptações
- **Grid Responsivo**: 1 coluna (mobile) → 2 colunas (tablet) → 3 colunas (desktop)
- **Modais**: Adaptação de tamanho para diferentes telas
- **Navegação**: Menu adaptativo para mobile

## 🔐 Segurança

### Autenticação
- **NextAuth.js**: Sistema robusto de autenticação
- **Sessões**: Gerenciamento seguro de sessões
- **Proteção**: Rotas protegidas por autenticação

### Validação de Dados
- **Client-side**: Validação em tempo real
- **TypeScript**: Tipagem forte para prevenir erros
- **Sanitização**: Limpeza de dados de entrada

## 🚀 Deploy e Configuração

### Variáveis de Ambiente
```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Scripts Disponíveis
- `npm run dev`: Servidor de desenvolvimento
- `npm run build`: Build de produção
- `npm run start`: Servidor de produção
- `npm run lint`: Verificação de código

## 📊 Estrutura de Dados

### Profile
```typescript
interface Profile {
  name: string
  level: number
  experience: number
  totalMangasRead: number
  totalAbilities: number
  attributes: {
    strength: number
    agility: number
    intelligence: number
    vitality: number
    luck: number
  }
  customAttributes: string[]
  manualAttributes: string[]
  titles: string[]
}
```

### Manga
```typescript
interface Manga {
  id: string
  title: string
  type: "manga" | "manhwa" | "manhua"
  abilities: string[]
  coverImage?: string
  url?: string
  currentEpisode?: number
  dateAdded: string
}
```

### Ability
```typescript
interface Ability {
  id: string
  name: string
  description: string
  sources: string[] // IDs dos mangás
  dateAdded: string
}
```

## 🎯 Roadmap e Melhorias Futuras

### Funcionalidades Planejadas
- [ ] Sistema de conquistas/achievements
- [ ] Estatísticas avançadas de leitura
- [ ] Sistema de recomendações
- [ ] Exportação/importação de dados
- [ ] Modo offline com PWA
- [ ] Sistema de amigos/ranking
- [ ] Integração com APIs de mangás

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] Otimização de performance
- [ ] Internacionalização (i18n)
- [ ] Sistema de temas personalizáveis
- [ ] Cache inteligente
- [ ] Monitoramento de erros

## 🤝 Contribuição

### Como Contribuir
1. Fork do repositório
2. Criação de branch para feature
3. Desenvolvimento com testes
4. Pull request com descrição detalhada

### Padrões de Código
- **ESLint**: Configuração padrão
- **Prettier**: Formatação automática
- **TypeScript**: Tipagem obrigatória
- **Commits**: Mensagens descritivas

## 📝 Changelog

### v1.0.0 (Atual)
- ✅ Sistema de autenticação completo
- ✅ Biblioteca de mangás com CRUD
- ✅ Sistema de XP e níveis
- ✅ Habilidades baseadas em mangás
- ✅ Sistema de itens e inventário
- ✅ Títulos honoríficos
- ✅ Busca e filtros na biblioteca
- ✅ Validação de duplicatas
- ✅ Interface responsiva
- ✅ Animações e feedback visual

---

## 📞 Suporte

Para dúvidas, sugestões ou problemas:
- **GitHub Issues**: Para bugs e feature requests
- **Documentação**: Este arquivo e comentários no código
- **Desenvolvedor**: Gabriel (GbDAmassa2)

---

*Documentação atualizada em: 17 de Outubro de 2025*
*Versão do Projeto: 1.0.0*

