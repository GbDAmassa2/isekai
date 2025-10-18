# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-10-17

### ✨ Adicionado
- **Sistema de Autenticação Completo**
  - Login e registro com NextAuth.js
  - Proteção de rotas para dashboard
  - Páginas de erro de autenticação

- **Sistema de Perfil e Progressão**
  - Atributos base (Força, Agilidade, Inteligência, Vitalidade, Sorte)
  - Sistema de níveis baseado em XP
  - Fórmula de XP: Nível × 100 para próximo nível
  - Atributos customizados pelo usuário

- **Biblioteca de Mangás Completa**
  - Suporte para Mangás, Manhwas e Manhuas
  - CRUD completo (Criar, Ler, Atualizar, Deletar)
  - Campos: título, tipo, capa, URL, episódio atual
  - Sistema de ganho de XP: Episódio × 10 XP

- **Sistema de Habilidades**
  - Habilidades baseadas em mangás específicos
  - CRUD completo para habilidades
  - Vinculação com fontes (mangás)

- **Sistema de Itens e Inventário**
  - Categorias: Armas, Armaduras, Acessórios, Consumíveis
  - Sistema de equipar/desequipar
  - Gerenciamento completo de inventário

- **Sistema de Títulos**
  - Títulos honoríficos baseados em progresso
  - Vinculação com mangás específicos
  - Gerenciamento de conquistas

- **Interface do Usuário**
  - Design responsivo mobile-first
  - Tema escuro com cores âmbar/ouro
  - Componentes shadcn/ui para consistência
  - Animações e transições suaves

### 🔧 Melhorado
- **Sistema de XP e Regressão**
  - Regressão inteligente de múltiplos níveis
  - Cálculo correto de XP ao excluir mangás
  - Notificações de level down

- **Biblioteca de Mangás**
  - Campo de busca por nome em tempo real
  - Filtros por tipo com botões compactos
  - Validação de duplicatas no formulário
  - Validação de duplicatas no modal de edição
  - Mensagens de erro contextuais
  - Feedback visual com bordas coloridas

- **Experiência do Usuário**
  - Animações de ganho de XP
  - Efeitos de level up
  - Notificações toast para feedback
  - Limpeza automática de estados de erro

### 🐛 Corrigido
- **Validação de Duplicatas**
  - Prevenção de mangás com mesmo nome
  - Comparação case-insensitive
  - Exclusão do mangá atual na validação de edição

- **Sistema de XP**
  - Correção da lógica de regressão multi-nível
  - Cálculo correto de XP restante após regressão
  - Notificações precisas de mudança de nível

### 🗑️ Removido
- **Funcionalidades Descontinuadas**
  - Sistema de busca de imagens integrada
  - Botões de busca por imagem
  - APIs de terceiros para imagens

### 🔒 Segurança
- **Validação de Dados**
  - Validação client-side em tempo real
  - Sanitização de dados de entrada
  - Tipagem TypeScript para prevenir erros

### 📱 Responsividade
- **Design Adaptativo**
  - Grid responsivo: 1 coluna (mobile) → 2 colunas (tablet) → 3 colunas (desktop)
  - Modais adaptativos para diferentes telas
  - Navegação otimizada para mobile

### 🎨 Design System
- **Componentes**
  - Sistema de cores consistente
  - Tipografia padronizada
  - Espaçamentos uniformes
  - Estados visuais claros

### 📊 Performance
- **Otimizações**
  - Lazy loading de componentes
  - Memoização para evitar re-renders
  - Bundle splitting por rotas

## [0.9.0] - 2025-10-16

### ✨ Adicionado
- **Estrutura Base do Projeto**
  - Configuração inicial do Next.js
  - Setup do TypeScript
  - Configuração do Tailwind CSS
  - Estrutura de pastas

- **Sistema de Autenticação Básico**
  - Configuração do NextAuth.js
  - Páginas de login e registro

- **Componentes Base**
  - Componentes shadcn/ui
  - Layout principal
  - Sistema de modais

### 🔧 Melhorado
- **Configuração do Projeto**
  - ESLint e Prettier configurados
  - Scripts de desenvolvimento
  - Estrutura de arquivos otimizada

---

## 📋 Próximas Versões

### [1.1.0] - Planejado
- [ ] Sistema de conquistas/achievements
- [ ] Estatísticas avançadas de leitura
- [ ] Sistema de recomendações
- [ ] Exportação/importação de dados

### [1.2.0] - Planejado
- [ ] Modo offline com PWA
- [ ] Sistema de amigos/ranking
- [ ] Integração com APIs de mangás
- [ ] Sistema de temas personalizáveis

### [2.0.0] - Planejado
- [ ] Refatoração completa da arquitetura
- [ ] Migração para banco de dados
- [ ] Sistema de notificações push
- [ ] API pública para desenvolvedores

---

## 📝 Notas de Versão

### Versionamento
- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Funcionalidades adicionadas de forma compatível
- **PATCH**: Correções de bugs compatíveis

### Convenções de Commit
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Mudanças na documentação
- `style:` Formatação, ponto e vírgula, etc.
- `refactor:` Refatoração de código
- `test:` Adição de testes
- `chore:` Mudanças em ferramentas, configurações, etc.

---

*Changelog mantido desde: 17 de Outubro de 2025*

