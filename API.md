# 🔌 API Documentation - Isekai

## 📋 Visão Geral

A API do Isekai é construída usando **Next.js API Routes** e **NextAuth.js** para autenticação. Todas as rotas são protegidas e retornam dados em formato JSON.

## 🔐 Autenticação

### Configuração NextAuth.js
```typescript
// app/api/auth/[...nextauth]/route.ts
export { GET, POST } from "@/lib/auth"
```

### Endpoints de Autenticação
- `GET /api/auth/signin` - Página de login
- `POST /api/auth/signin` - Processar login
- `GET /api/auth/signout` - Logout
- `GET /api/auth/session` - Obter sessão atual
- `GET /api/auth/csrf` - Token CSRF

## 📊 Estrutura de Dados

### Tipos Principais

#### Profile
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

#### Manga
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

#### Ability
```typescript
interface Ability {
  id: string
  name: string
  description: string
  sources: string[] // IDs dos mangás
  dateAdded: string
}
```

#### Item
```typescript
interface Item {
  id: string
  name: string
  description: string
  type: "weapon" | "armor" | "accessory" | "consumable"
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  stats?: {
    strength?: number
    agility?: number
    intelligence?: number
    vitality?: number
    luck?: number
  }
  source?: string // ID do mangá
  equipped: boolean
  dateAdded: string
}
```

#### Title
```typescript
interface Title {
  id: string
  name: string
  description: string
  source?: string // ID do mangá
  dateAdded: string
}
```

## 🎮 Context API - Métodos Disponíveis

### IsekaiContext Methods

#### Profile Management
```typescript
// Atualizar perfil
setProfile(profile: Profile): void

// Adicionar experiência
addExperience(amount: number): void

// Remover experiência (regressão)
removeMangaExperience(amount: number): void
```

#### Manga Management
```typescript
// Adicionar mangá
addManga(manga: Omit<Manga, 'id' | 'dateAdded'>): void

// Remover mangá
removeManga(id: string): void

// Atualizar mangá
setMangas(mangas: Manga[]): void

// Incrementar episódio
incrementEpisode(mangaId: string): void

// Decrementar episódio
decrementEpisode(mangaId: string): void
```

#### Ability Management
```typescript
// Adicionar habilidade
addAbility(ability: Omit<Ability, 'id' | 'dateAdded'>): void

// Remover habilidade
removeAbility(id: string): void

// Atualizar habilidades
setAbilities(abilities: Ability[]): void
```

#### Item Management
```typescript
// Adicionar item
addItem(item: Omit<Item, 'id' | 'dateAdded'>): void

// Remover item
removeItem(id: string): void

// Equipar item
equipItem(itemId: string): void

// Desequipar item
unequipItem(itemId: string): void
```

#### Title Management
```typescript
// Adicionar título
addTitle(title: Omit<Title, 'id' | 'dateAdded'>): void

// Remover título
removeTitle(id: string): void

// Atualizar títulos
setTitles(titles: Title[]): void
```

## 🔧 Utilitários e Helpers

### Character Utils
```typescript
// lib/character-utils.ts

// Calcular XP necessário para próximo nível
export function getXPForNextLevel(currentLevel: number): number

// Calcular nível baseado em XP
export function getLevelFromXP(totalXP: number): number

// Calcular XP restante no nível atual
export function getXPInCurrentLevel(totalXP: number): number

// Verificar se pode subir de nível
export function canLevelUp(currentXP: number, currentLevel: number): boolean
```

### Validation Utils
```typescript
// Validação de duplicatas
export function checkDuplicateManga(mangas: Manga[], title: string, excludeId?: string): boolean

// Validação de campos obrigatórios
export function validateMangaData(data: Partial<Manga>): ValidationResult

// Sanitização de dados
export function sanitizeInput(input: string): string
```

### Storage Utils
```typescript
// Gerenciamento de LocalStorage
export function saveToLocalStorage(key: string, data: any): void
export function loadFromLocalStorage(key: string): any
export function removeFromLocalStorage(key: string): void
export function clearLocalStorage(): void
```

## 🎨 UI Components API

### Modal Components

#### AddMangaDialog
```typescript
interface AddMangaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Props internas
const [title, setTitle] = useState("")
const [type, setType] = useState<"manga" | "manhwa" | "manhua">("manga")
const [coverImage, setCoverImage] = useState("")
const [url, setUrl] = useState("")
const [currentEpisode, setCurrentEpisode] = useState<number>(0)
const [duplicateError, setDuplicateError] = useState("")
```

#### EditMangaDialog
```typescript
interface EditMangaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  manga: Manga | null
}

// Funcionalidades
- Preenchimento automático dos campos
- Validação de duplicatas (excluindo o atual)
- Atualização em tempo real
```

#### AddContentDialog
```typescript
interface AddContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mangaId: string
  initialTab?: "ability" | "item" | "title"
}

// Tabs disponíveis
- Ability Tab: Criar habilidades
- Item Tab: Criar itens
- Title Tab: Criar títulos
```

### Panel Components

#### FloatingCharacterWindow
```typescript
interface FloatingCharacterWindowProps {
  userName: string
}

// Estados internos
const [activeModal, setActiveModal] = useState<string | null>(null)
const [mangaSearchFilter, setMangaSearchFilter] = useState("")
const [mangaTypeFilter, setMangaTypeFilter] = useState<"all" | "manga" | "manhwa" | "manhua">("all")
const [editMangaDialogOpen, setEditMangaDialogOpen] = useState(false)
const [mangaToEdit, setMangaToEdit] = useState<Manga | null>(null)
```

## 🔄 Event Handlers

### Manga Events
```typescript
// Adicionar mangá
const handleAddManga = (mangaData: Omit<Manga, 'id' | 'dateAdded'>) => {
  // Validação de duplicatas
  if (checkDuplicate(mangaData.title)) {
    setDuplicateError(`"${mangaData.title}" já existe na sua biblioteca!`)
    return
  }
  
  // Adicionar ao estado
  addManga(mangaData)
  
  // Calcular XP
  const xpGained = (mangaData.currentEpisode || 0) * 10
  addExperience(xpGained)
  
  // Feedback
  addNotification({
    type: "success",
    title: "📚 Mangá Adicionado!",
    description: `${mangaData.title} foi adicionado à biblioteca. +${xpGained} XP!`
  })
}

// Remover mangá
const handleRemoveManga = (mangaId: string) => {
  const mangaToRemove = mangas.find(m => m.id === mangaId)
  const xpLost = (mangaToRemove?.currentEpisode || 0) * 10
  
  // Remover do estado
  removeManga(mangaId)
  
  // Remover XP
  if (xpLost > 0) {
    removeMangaExperience(xpLost)
  }
  
  // Feedback
  addNotification({
    type: "warning",
    title: "🗑️ Mangá Removido!",
    description: `${mangaToRemove?.title} foi removido. -${xpLost} XP`
  })
}
```

### Search and Filter Events
```typescript
// Busca por nome
const handleSearchChange = (value: string) => {
  setMangaSearchFilter(value)
}

// Filtro por tipo
const handleTypeFilter = (type: "all" | "manga" | "manhwa" | "manhua") => {
  setMangaTypeFilter(type)
}

// Filtro combinado
const filteredMangas = mangas.filter(manga => 
  manga.title.toLowerCase().includes(mangaSearchFilter.toLowerCase()) &&
  (mangaTypeFilter === "all" || manga.type === mangaTypeFilter)
)
```

## 📱 Responsive Breakpoints

### Tailwind CSS Breakpoints
```css
/* Mobile First */
sm: '640px'   /* Small devices */
md: '768px'   /* Medium devices */
lg: '1024px'  /* Large devices */
xl: '1280px'  /* Extra large devices */
2xl: '1536px' /* 2X large devices */
```

### Component Responsiveness
```typescript
// Grid responsivo para mangás
const gridClasses = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Modal responsivo
const modalClasses = "max-w-[95vw] md:max-w-md"

// Botões responsivos
const buttonClasses = "text-xs px-3 py-1"
```

## 🎯 Performance APIs

### Memoization
```typescript
// Memoização de componentes pesados
const MemoizedMangaCard = memo(({ manga, onEdit, onDelete }) => {
  return <MangaCard manga={manga} onEdit={onEdit} onDelete={onDelete} />
})

// Memoização de cálculos
const totalXP = useMemo(() => {
  return mangas.reduce((total, manga) => {
    return total + (manga.currentEpisode || 0) * 10
  }, 0)
}, [mangas])
```

### Lazy Loading
```typescript
// Carregamento sob demanda
const LazyEditDialog = dynamic(() => import('./EditMangaDialog'), {
  loading: () => <Spinner />,
  ssr: false
})
```

## 🔍 Debugging APIs

### Development Tools
```typescript
// Logger para desenvolvimento
const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ISEKAI] ${message}`, data)
    }
  },
  error: (message: string, error?: Error) => {
    console.error(`[ISEKAI ERROR] ${message}`, error)
  }
}

// Debug do estado
const debugState = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Current State:', {
      profile,
      mangas: mangas.length,
      abilities: abilities.length,
      items: items.length,
      titles: titles.length
    })
  }
}
```

## 📊 Analytics APIs

### Event Tracking
```typescript
// Rastreamento de eventos
const trackEvent = (eventName: string, properties?: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
}

// Eventos específicos
const trackMangaAdded = (manga: Manga) => {
  trackEvent('manga_added', {
    manga_type: manga.type,
    episode_count: manga.currentEpisode || 0,
    xp_gained: (manga.currentEpisode || 0) * 10
  })
}

const trackLevelUp = (newLevel: number) => {
  trackEvent('level_up', {
    new_level: newLevel,
    total_xp: profile.experience
  })
}
```

---

## 🚀 Exemplos de Uso

### Exemplo Completo - Adicionar Mangá
```typescript
const AddMangaExample = () => {
  const { addManga, mangas } = useIsekai()
  const [formData, setFormData] = useState({
    title: '',
    type: 'manga' as const,
    currentEpisode: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validação
      if (!formData.title.trim()) {
        throw new Error('Título é obrigatório')
      }
      
      // Verificar duplicatas
      const isDuplicate = mangas.some(m => 
        m.title.toLowerCase() === formData.title.toLowerCase()
      )
      
      if (isDuplicate) {
        throw new Error('Mangá já existe na biblioteca')
      }
      
      // Adicionar mangá
      await addManga({
        title: formData.title.trim(),
        type: formData.type,
        currentEpisode: formData.currentEpisode || undefined
      })
      
      // Reset form
      setFormData({ title: '', type: 'manga', currentEpisode: 0 })
      
      // Feedback
      toast.success('Mangá adicionado com sucesso!')
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

---

*API Documentation atualizada em: 17 de Outubro de 2025*

