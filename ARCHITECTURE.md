# 🏗️ Arquitetura Técnica - Isekai

## 📋 Visão Geral da Arquitetura

O projeto Isekai utiliza uma arquitetura moderna baseada em **Next.js 15** com **App Router**, implementando padrões de desenvolvimento web contemporâneos.

## 🎯 Padrões Arquiteturais

### 1. Arquitetura em Camadas
```
┌─────────────────────────────────────┐
│           Presentation Layer       │
│     (Components, Pages, UI)        │
├─────────────────────────────────────┤
│           Business Logic Layer      │
│     (Context, Hooks, Utils)       │
├─────────────────────────────────────┤
│           Data Layer               │
│     (LocalStorage, State)         │
├─────────────────────────────────────┤
│           Infrastructure Layer     │
│     (NextAuth, APIs, Config)      │
└─────────────────────────────────────┘
```

### 2. Padrão de Componentes
- **Atomic Design**: Componentes organizados por complexidade
- **Composition Pattern**: Componentes compostos por outros menores
- **Render Props**: Para compartilhamento de lógica

## 🏛️ Estrutura de Componentes

### Componentes de UI (shadcn/ui)
```
components/ui/
├── button.tsx          # Botões padronizados
├── card.tsx            # Cards de conteúdo
├── dialog.tsx          # Modais e diálogos
├── input.tsx           # Campos de entrada
├── select.tsx          # Seletores dropdown
├── tabs.tsx            # Sistema de abas
├── badge.tsx           # Badges e etiquetas
├── progress.tsx        # Barras de progresso
└── ...                 # Outros componentes base
```

### Componentes de Negócio
```
components/
├── floating-character-window.tsx    # Janela principal
├── isekai-provider.tsx              # Context principal
├── add-manga-dialog.tsx             # Modal adicionar mangá
├── edit-manga-dialog.tsx            # Modal editar mangá
├── add-content-dialog.tsx          # Modal adicionar conteúdo
├── edit-ability-dialog.tsx          # Modal editar habilidade
├── edit-item-dialog.tsx             # Modal editar item
├── edit-attributes-dialog.tsx       # Modal editar atributos
├── inventory-panel.tsx              # Painel de inventário
├── skills-panel.tsx                  # Painel de habilidades
├── experience-panel.tsx              # Painel de experiência
├── attribute-panel.tsx               # Painel de atributos
└── ...                               # Outros componentes
```

## 🔄 Gerenciamento de Estado

### Context API Pattern
```typescript
// Estrutura do Context Principal
interface IsekaiContextType {
  // Estado do Perfil
  profile: Profile
  setProfile: (profile: Profile) => void
  
  // Estado dos Mangás
  mangas: Manga[]
  setMangas: (mangas: Manga[]) => void
  
  // Estado das Habilidades
  abilities: Ability[]
  setAbilities: (abilities: Ability[]) => void
  
  // Estado dos Itens
  items: Item[]
  setItems: (items: Item[]) => void
  
  // Estado dos Títulos
  titles: Title[]
  setTitles: (titles: Title[]) => void
  
  // Ações
  addManga: (manga: Omit<Manga, 'id' | 'dateAdded'>) => void
  removeManga: (id: string) => void
  addExperience: (amount: number) => void
  removeMangaExperience: (amount: number) => void
}
```

### Padrões de Estado
- **Single Source of Truth**: Context centralizado
- **Immutable Updates**: Sempre criar novos objetos
- **Local State**: useState para estado local de componentes
- **Derived State**: Cálculos baseados em estado principal

## 🗄️ Persistência de Dados

### LocalStorage Strategy
```typescript
// Padrão de persistência
const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data))
}

const loadFromLocalStorage = (key: string) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}
```

### Estrutura de Dados
```typescript
// Chaves do LocalStorage
const STORAGE_KEYS = {
  PROFILE: 'isekai_profile',
  MANGAS: 'isekai_mangas',
  ABILITIES: 'isekai_abilities',
  ITEMS: 'isekai_items',
  TITLES: 'isekai_titles'
}
```

## 🔐 Autenticação e Segurança

### NextAuth.js Integration
```typescript
// Configuração de autenticação
export const authOptions: NextAuthOptions = {
  providers: [
    // Configuração dos providers
  ],
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error'
  },
  callbacks: {
    session: ({ session, token }) => {
      // Customização da sessão
    },
    jwt: ({ token, user }) => {
      // Customização do JWT
    }
  }
}
```

### Proteção de Rotas
```typescript
// Middleware de proteção
export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token')
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
}
```

## 🎨 Sistema de Design

### Design Tokens
```typescript
// Cores do sistema
const colors = {
  primary: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309'
  },
  slate: {
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  }
}

// Tipografia
const typography = {
  fontFamily: {
    serif: ['serif'],
    sans: ['system-ui', 'sans-serif']
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem'
  }
}
```

### Componentes Temáticos
```typescript
// Padrão de estilização
const themeClasses = {
  input: 'bg-slate-700 border-amber-500/30 text-amber-100',
  button: 'bg-amber-600 hover:bg-amber-700 text-white',
  card: 'bg-slate-700/50 border-amber-500/30'
}
```

## ⚡ Performance e Otimização

### Code Splitting
```typescript
// Lazy loading de componentes
const LazyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false
})
```

### Memoização
```typescript
// Otimização de re-renders
const MemoizedComponent = memo(({ data }) => {
  return <ExpensiveComponent data={data} />
})

// Memoização de cálculos
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])
```

### Bundle Optimization
```typescript
// next.config.mjs
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
    return config
  }
}
```

## 🧪 Padrões de Teste

### Estrutura de Testes
```
__tests__/
├── components/          # Testes de componentes
├── hooks/              # Testes de hooks
├── utils/              # Testes de utilitários
└── integration/        # Testes de integração
```

### Padrões de Teste
```typescript
// Exemplo de teste de componente
describe('AddMangaDialog', () => {
  it('should validate duplicate manga names', () => {
    render(<AddMangaDialog open={true} onOpenChange={jest.fn()} />)
    
    const titleInput = screen.getByPlaceholderText('Ex: Solo Leveling')
    fireEvent.change(titleInput, { target: { value: 'Lookism' } })
    
    expect(screen.getByText('"Lookism" já existe na sua biblioteca!')).toBeInTheDocument()
  })
})
```

## 🔧 Configuração e Build

### Scripts de Desenvolvimento
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### Configuração TypeScript
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 📊 Monitoramento e Logs

### Estrutura de Logs
```typescript
// Sistema de logging
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data)
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error)
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data)
  }
}
```

### Error Boundaries
```typescript
// Tratamento de erros
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary', error)
  }
}
```

## 🚀 Deploy e Infraestrutura

### Build de Produção
```bash
# Comandos de build
npm run build          # Build otimizado
npm run start          # Servidor de produção
npm run lint           # Verificação de código
```

### Variáveis de Ambiente
```env
# Produção
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret

# Desenvolvimento
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-dev-secret
```

## 📈 Métricas e Analytics

### Performance Monitoring
```typescript
// Web Vitals
export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    // Enviar métricas para serviço de monitoramento
    analytics.track('web-vital', {
      name: metric.name,
      value: metric.value,
      delta: metric.delta
    })
  }
}
```

---

## 🔄 Fluxo de Dados

### Fluxo Completo
```
User Action → Component → Context → LocalStorage → UI Update
     ↓              ↓         ↓           ↓            ↓
  Event Handler → State → Persistence → Re-render → Feedback
```

### Exemplo Prático
```typescript
// Fluxo de adicionar mangá
const handleAddManga = (mangaData) => {
  // 1. Validação
  if (checkDuplicate(mangaData.title)) {
    setError('Mangá já existe')
    return
  }
  
  // 2. Atualização do estado
  setMangas(prev => [...prev, newManga])
  
  // 3. Cálculo de XP
  const xpGained = mangaData.currentEpisode * 10
  addExperience(xpGained)
  
  // 4. Persistência
  saveToLocalStorage('isekai_mangas', updatedMangas)
  
  // 5. Feedback visual
  showNotification('Mangá adicionado!')
}
```

---

*Documentação de Arquitetura atualizada em: 17 de Outubro de 2025*

