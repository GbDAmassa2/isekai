# 🤝 Guia de Contribuição - Isekai

Obrigado por considerar contribuir para o projeto Isekai! Este guia irá ajudá-lo a entender como contribuir de forma eficaz.

## 📋 Índice

- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Testes](#testes)
- [Pull Requests](#pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Funcionalidades](#sugerir-funcionalidades)

## 🚀 Como Contribuir

### Tipos de Contribuição

1. **🐛 Reportar Bugs**: Encontrou um problema? Reporte-o!
2. **💡 Sugerir Funcionalidades**: Tem uma ideia? Compartilhe!
3. **🔧 Corrigir Bugs**: Quer ajudar a corrigir problemas?
4. **✨ Implementar Funcionalidades**: Quer adicionar novas features?
5. **📚 Melhorar Documentação**: Ajudar com docs é sempre bem-vindo!
6. **🎨 Melhorar UI/UX**: Contribuições de design são valiosas!

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- **Node.js**: Versão 18+ recomendada
- **npm**: Versão 9+ recomendada
- **Git**: Para controle de versão
- **Editor**: VS Code recomendado (com extensões TypeScript/React)

### Instalação

```bash
# 1. Fork o repositório no GitHub
# 2. Clone seu fork
git clone https://github.com/SEU-USUARIO/isekai.git
cd isekai

# 3. Instale dependências
npm install

# 4. Configure variáveis de ambiente
cp env.example .env.local

# 5. Execute o projeto
npm run dev
```

### Configuração do Editor

#### VS Code Extensões Recomendadas
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

#### Configuração do Prettier
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## 📝 Padrões de Código

### TypeScript

```typescript
// ✅ Bom: Tipagem explícita
interface MangaProps {
  manga: Manga
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

// ❌ Ruim: Tipagem implícita
const MangaCard = ({ manga, onEdit, onDelete }) => {
  // ...
}
```

### React Components

```typescript
// ✅ Bom: Componente funcional com props tipadas
interface AddMangaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMangaDialog({ open, onOpenChange }: AddMangaDialogProps) {
  const [title, setTitle] = useState("")
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* JSX */}
    </Dialog>
  )
}

// ❌ Ruim: Componente sem tipagem
export function AddMangaDialog(props) {
  // ...
}
```

### Naming Conventions

```typescript
// ✅ Bom: Nomes descritivos
const handleMangaSubmit = () => {}
const isDuplicateManga = () => {}
const mangaSearchFilter = ""

// ❌ Ruim: Nomes genéricos
const handleSubmit = () => {}
const checkDuplicate = () => {}
const filter = ""
```

### File Structure

```
components/
├── ui/                    # Componentes base (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── add-manga-dialog.tsx   # Componentes específicos
├── edit-manga-dialog.tsx
└── ...
```

## 🏗️ Estrutura do Projeto

### Organização de Arquivos

```
isekai/
├── app/                   # Next.js App Router
│   ├── api/              # API Routes
│   ├── auth/             # Páginas de autenticação
│   ├── dashboard/        # Dashboard principal
│   └── globals.css       # Estilos globais
├── components/           # Componentes React
│   ├── ui/              # Componentes de UI base
│   └── *.tsx            # Componentes específicos
├── lib/                  # Utilitários e configurações
│   ├── auth.ts          # Configuração NextAuth
│   ├── character-utils.ts # Utilitários de personagem
│   ├── isekai-types.ts   # Tipos TypeScript
│   └── utils.ts          # Utilitários gerais
├── hooks/                # Custom hooks
├── public/               # Assets estáticos
└── styles/              # Arquivos de estilo
```

### Convenções de Importação

```typescript
// ✅ Bom: Imports organizados
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useIsekai } from '@/components/isekai-provider'
import type { Manga } from '@/lib/isekai-types'

// ❌ Ruim: Imports desorganizados
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useIsekai } from '@/components/isekai-provider'
```

## 🔄 Processo de Desenvolvimento

### 1. Criar uma Branch

```bash
# Sempre crie uma branch para suas mudanças
git checkout -b feature/nova-funcionalidade
# ou
git checkout -b fix/correcao-bug
# ou
git checkout -b docs/melhorar-documentacao
```

### 2. Desenvolver a Funcionalidade

```bash
# Faça commits pequenos e frequentes
git add .
git commit -m "feat: adicionar validação de duplicatas no formulário"

# Push para sua branch
git push origin feature/nova-funcionalidade
```

### 3. Convenções de Commit

```bash
# Formato: tipo(escopo): descrição
feat(auth): adicionar sistema de login
fix(manga): corrigir validação de duplicatas
docs(readme): atualizar instruções de instalação
style(ui): melhorar espaçamento dos botões
refactor(utils): simplificar função de cálculo de XP
test(manga): adicionar testes para validação
chore(deps): atualizar dependências
```

### 4. Testar Localmente

```bash
# Execute os testes
npm run test

# Verifique o linting
npm run lint

# Verifique tipos TypeScript
npm run type-check

# Teste a aplicação
npm run dev
```

## 🧪 Testes

### Estrutura de Testes

```
__tests__/
├── components/
│   ├── add-manga-dialog.test.tsx
│   ├── edit-manga-dialog.test.tsx
│   └── ...
├── hooks/
│   ├── use-isekai.test.ts
│   └── ...
├── utils/
│   ├── character-utils.test.ts
│   └── ...
└── integration/
    ├── manga-flow.test.tsx
    └── ...
```

### Exemplo de Teste

```typescript
// __tests__/components/add-manga-dialog.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { AddMangaDialog } from '@/components/add-manga-dialog'

describe('AddMangaDialog', () => {
  it('should validate duplicate manga names', () => {
    const mockOnOpenChange = jest.fn()
    
    render(
      <AddMangaDialog 
        open={true} 
        onOpenChange={mockOnOpenChange} 
      />
    )
    
    const titleInput = screen.getByPlaceholderText('Ex: Solo Leveling')
    fireEvent.change(titleInput, { target: { value: 'Lookism' } })
    
    expect(
      screen.getByText('"Lookism" já existe na sua biblioteca!')
    ).toBeInTheDocument()
  })
})
```

## 📤 Pull Requests

### Antes de Criar um PR

- [ ] Código segue os padrões estabelecidos
- [ ] Testes passam localmente
- [ ] Linting não apresenta erros
- [ ] TypeScript não apresenta erros
- [ ] Documentação foi atualizada (se necessário)
- [ ] Commits seguem as convenções

### Template de PR

```markdown
## 📝 Descrição
Breve descrição das mudanças implementadas.

## 🔗 Issue Relacionada
Closes #123

## 🧪 Testes
- [ ] Testes unitários passam
- [ ] Testes de integração passam
- [ ] Testei manualmente no navegador

## 📸 Screenshots (se aplicável)
Adicione screenshots das mudanças visuais.

## 📋 Checklist
- [ ] Código segue os padrões do projeto
- [ ] Self-review do código foi feita
- [ ] Comentários foram adicionados em código complexo
- [ ] Documentação foi atualizada
- [ ] Não há conflitos de merge
```

### Processo de Review

1. **Automático**: CI/CD verifica linting, testes e tipos
2. **Manual**: Maintainers revisam o código
3. **Feedback**: Sugestões de melhoria são fornecidas
4. **Aprovação**: PR é aprovado e mergeado

## 🐛 Reportar Bugs

### Template de Bug Report

```markdown
## 🐛 Descrição do Bug
Descrição clara e concisa do problema.

## 🔄 Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

## 🎯 Comportamento Esperado
O que deveria acontecer.

## 📱 Ambiente
- OS: [ex: Windows 10]
- Browser: [ex: Chrome 91]
- Versão: [ex: 1.0.0]

## 📸 Screenshots
Adicione screenshots se aplicável.

## 📋 Informações Adicionais
Qualquer contexto adicional sobre o problema.
```

## 💡 Sugerir Funcionalidades

### Template de Feature Request

```markdown
## 💡 Funcionalidade Sugerida
Descrição clara da funcionalidade desejada.

## 🎯 Problema que Resolve
Qual problema esta funcionalidade resolveria?

## 💭 Solução Proposta
Como você imagina que deveria funcionar?

## 🔄 Alternativas Consideradas
Outras soluções que você considerou.

## 📋 Contexto Adicional
Qualquer contexto adicional sobre a funcionalidade.
```

## 🎨 Contribuições de Design

### Padrões de UI/UX

```typescript
// ✅ Bom: Cores consistentes
const themeClasses = {
  primary: 'bg-amber-600 hover:bg-amber-700',
  secondary: 'bg-slate-700 hover:bg-slate-600',
  danger: 'bg-red-600 hover:bg-red-700'
}

// ✅ Bom: Espaçamentos consistentes
const spacingClasses = {
  small: 'p-2',
  medium: 'p-4',
  large: 'p-6'
}
```

### Componentes de UI

- Use componentes do shadcn/ui quando possível
- Mantenha consistência visual
- Considere responsividade
- Teste em diferentes tamanhos de tela

## 📚 Documentação

### Atualizando Documentação

- **README.md**: Instruções principais
- **DOCUMENTATION.md**: Documentação completa
- **API.md**: Documentação da API
- **ARCHITECTURE.md**: Arquitetura técnica
- **CHANGELOG.md**: Histórico de mudanças

### Padrões de Documentação

```markdown
## 📝 Seção
Descrição clara da funcionalidade.

### Exemplo de Código
```typescript
// Código bem comentado
const exemplo = () => {
  // Explicação do que faz
}
```

### Parâmetros
- `parametro`: Descrição do parâmetro
- `outroParam`: Descrição do outro parâmetro
```

## 🚀 Deploy e CI/CD

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
```

## 🤝 Código de Conduta

### Nossos Compromissos

- **Inclusivo**: Ambiente acolhedor para todos
- **Respeitoso**: Tratamento respeitoso entre membros
- **Construtivo**: Feedback construtivo e útil
- **Colaborativo**: Trabalho em equipe valorizado

### Comportamento Esperado

- Use linguagem acolhedora e inclusiva
- Respeite diferentes pontos de vista
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade

## 📞 Contato

### Maintainers

- **Gabriel**: [@GbDAmassa2](https://github.com/GbDAmassa2)

### Canais de Comunicação

- **Issues**: Para bugs e feature requests
- **Discussions**: Para discussões gerais
- **Pull Requests**: Para contribuições de código

## 🙏 Reconhecimento

### Contribuidores

Agradecemos a todos que contribuem para o projeto! Seus nomes serão listados no README.

### Como Ser Reconhecido

- Contribuições significativas de código
- Melhorias na documentação
- Reportes de bugs importantes
- Sugestões de funcionalidades implementadas

---

## 📋 Checklist para Contribuidores

### Antes de Começar
- [ ] Li e entendi o guia de contribuição
- [ ] Configurei o ambiente de desenvolvimento
- [ ] Verifiquei se há issues abertas relacionadas
- [ ] Criei uma branch para minha contribuição

### Durante o Desenvolvimento
- [ ] Sigo os padrões de código estabelecidos
- [ ] Faço commits pequenos e frequentes
- [ ] Escrevo testes para novas funcionalidades
- [ ] Atualizo documentação quando necessário

### Antes de Submeter
- [ ] Todos os testes passam
- [ ] Linting não apresenta erros
- [ ] TypeScript não apresenta erros
- [ ] Testei manualmente no navegador
- [ ] Atualizei o CHANGELOG.md

---

*Guia de Contribuição atualizado em: 17 de Outubro de 2025*

