# 📚 Documentação Completa de Funções - Isekai RPG

Esta documentação lista todas as funções, interfaces, tipos e APIs disponíveis no projeto Isekai.

---

## 📋 Índice

1. [Tipos e Interfaces](#tipos-e-interfaces)
2. [Funções do Provider (IsekaiProvider)](#funções-do-provider-isekaiprovider)
3. [Funções Utilitárias](#funções-utilitárias)
4. [APIs Routes](#apis-routes)
5. [Componentes Principais](#componentes-principais)

---

## 📦 Tipos e Interfaces

### `lib/isekai-types.ts`

#### Interfaces

**Manga**
```typescript
interface Manga {
  id: string
  title: string
  type: "manga" | "manhwa" | "manhua"
  dateAdded: string
  abilities: string[]
  coverImage?: string
  url?: string
  currentEpisode?: number
}
```

**Ability**
```typescript
interface Ability {
  id: string
  name: string
  description: string
  type: "active" | "passive"
  level: number
  sources: string[]
  category: "attack" | "defense" | "support" | "utility" | "special"
  power: number
  manaCost?: number
  cooldown?: number
}
```

**Item**
```typescript
interface Item {
  id: string
  name: string
  description: string
  type: "weapon" | "armor" | "accessory" | "consumable" | "material"
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  source: string
  effects: {
    strength?: number
    agility?: number
    intelligence?: number
    vitality?: number
    luck?: number
    [key: string]: number | undefined
  }
  equipped?: boolean
}
```

**Title**
```typescript
interface Title {
  id: string
  name: string
  description: string
  source: string
  effects: {
    strength?: number
    agility?: number
    intelligence?: number
    vitality?: number
    luck?: number
    [key: string]: number | undefined
  }
  active?: boolean
}
```

**UserProfile**
```typescript
interface UserProfile {
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
    [key: string]: number
  }
  customAttributes: string[]
  manualAttributes?: string[]
  titles: string[]
}
```

#### Funções

**calculateTotalAttributes**
```typescript
function calculateTotalAttributes(abilities: Ability[]): {
  strength: number
  agility: number
  intelligence: number
  vitality: number
  luck: number
}
```
- **Descrição**: Calcula os atributos base do perfil (atualmente retorna valores fixos)
- **Parâmetros**: `abilities` - Array de habilidades
- **Retorno**: Objeto com atributos base

---

## 🎮 Funções do Provider (IsekaiProvider)

### Contexto: `components/isekai-provider.tsx`

O `IsekaiProvider` é o coração do sistema, gerenciando todo o estado da aplicação através do React Context API.

### Estado Disponível

```typescript
interface IsekaiContextType {
  profile: UserProfile
  mangas: Manga[]
  abilities: Ability[]
  items: Item[]
  titles: Title[]
  notifications: Notification[]
  collectedRewards: string[]
}
```

### Funções de Mangás

#### `addManga`
```typescript
addManga(manga: Omit<Manga, "id" | "dateAdded">): void
```
- **Descrição**: Adiciona um novo mangá à biblioteca
- **Parâmetros**: 
  - `manga` - Objeto mangá sem `id` e `dateAdded` (gerados automaticamente)
- **Efeitos**: 
  - Gera ID único
  - Adiciona data de criação
  - Adiciona à lista de mangás
  - Atualiza `totalMangasRead` no perfil
  - Ganha XP baseado no episódio atual (10 XP por episódio)
  - Salva no localStorage

#### `removeManga`
```typescript
removeManga(id: string): void
```
- **Descrição**: Remove um mangá da biblioteca
- **Parâmetros**: 
  - `id` - ID do mangá a ser removido
- **Efeitos**: 
  - Remove o mangá da lista
  - Remove habilidades vinculadas ao mangá
  - Remove itens vinculados ao mangá
  - Remove títulos vinculados ao mangá
  - Remove recompensas coletadas relacionadas
  - Remove XP baseado nos episódios lidos (regressão)
  - Atualiza `totalMangasRead`
  - Salva no localStorage

#### `editManga`
```typescript
editManga(mangaId: string, updatedManga: Partial<Manga>): void
```
- **Descrição**: Edita informações de um mangá existente
- **Parâmetros**: 
  - `mangaId` - ID do mangá
  - `updatedManga` - Objeto parcial com campos a atualizar
- **Efeitos**: 
  - Atualiza o mangá na lista
  - Exibe notificação de sucesso
  - Salva no localStorage

#### `getMangaById`
```typescript
getMangaById(id: string): Manga | undefined
```
- **Descrição**: Busca um mangá pelo ID
- **Parâmetros**: `id` - ID do mangá
- **Retorno**: Mangá encontrado ou `undefined`

#### `updateMangaEpisode`
```typescript
updateMangaEpisode(mangaId: string, episode: number): void
```
- **Descrição**: Atualiza o episódio atual de um mangá
- **Parâmetros**: 
  - `mangaId` - ID do mangá
  - `episode` - Número do episódio
- **Efeitos**: 
  - Atualiza `currentEpisode` do mangá
  - Exibe notificação

#### `incrementEpisode`
```typescript
incrementEpisode(mangaId: string): void
```
- **Descrição**: Incrementa o episódio atual em 1
- **Parâmetros**: `mangaId` - ID do mangá
- **Efeitos**: 
  - Aumenta `currentEpisode` em 1
  - Adiciona 10 XP ao perfil
  - Exibe notificação de sucesso

#### `decrementEpisode`
```typescript
decrementEpisode(mangaId: string): void
```
- **Descrição**: Decrementa o episódio atual em 1
- **Parâmetros**: `mangaId` - ID do mangá
- **Efeitos**: 
  - Diminui `currentEpisode` em 1 (mínimo 0)
  - Remove 10 XP do perfil
  - Remove recompensas de episódios futuros
  - Exibe notificação

### Funções de Habilidades (Abilities)

#### `addAbility`
```typescript
addAbility(
  ability: Omit<Ability, "id" | "level" | "sources">, 
  mangaId: string, 
  silent?: boolean
): void
```
- **Descrição**: Adiciona uma nova habilidade
- **Parâmetros**: 
  - `ability` - Objeto habilidade (sem id, level e sources)
  - `mangaId` - ID do mangá fonte
  - `silent` - Se `true`, não exibe notificação
- **Efeitos**: 
  - Gera ID único
  - Define level como 1
  - Define sources como [mangaId]
  - Adiciona à lista de habilidades
  - Atualiza `totalAbilities` no perfil
  - Salva no localStorage

#### `editAbility`
```typescript
editAbility(abilityId: string, updatedAbility: Partial<Ability>): void
```
- **Descrição**: Edita uma habilidade existente
- **Parâmetros**: 
  - `abilityId` - ID da habilidade
  - `updatedAbility` - Objeto parcial com campos a atualizar
- **Efeitos**: 
  - Atualiza a habilidade
  - Exibe notificação de sucesso
  - Salva no localStorage

#### `deleteAbility`
```typescript
deleteAbility(abilityId: string): void
```
- **Descrição**: Remove uma habilidade
- **Parâmetros**: `abilityId` - ID da habilidade
- **Efeitos**: 
  - Remove da lista
  - Atualiza `totalAbilities`
  - Exibe notificação
  - Salva no localStorage

### Funções de Itens

#### `addItem`
```typescript
addItem(
  item: Omit<Item, "id">, 
  mangaId: string, 
  silent?: boolean
): void
```
- **Descrição**: Adiciona um novo item ao inventário
- **Parâmetros**: 
  - `item` - Objeto item (sem id)
  - `mangaId` - ID do mangá fonte
  - `silent` - Se `true`, não exibe notificação
- **Efeitos**: 
  - Gera ID único
  - Define `source` como mangaId
  - Adiciona à lista de itens
  - Salva no localStorage

#### `editItem`
```typescript
editItem(itemId: string, updatedItem: Partial<Item>): void
```
- **Descrição**: Edita um item existente
- **Parâmetros**: 
  - `itemId` - ID do item
  - `updatedItem` - Objeto parcial com campos a atualizar
- **Efeitos**: 
  - Atualiza o item
  - Exibe notificação
  - Salva no localStorage

#### `deleteItem`
```typescript
deleteItem(itemId: string): void
```
- **Descrição**: Remove um item do inventário
- **Parâmetros**: `itemId` - ID do item
- **Efeitos**: 
  - Remove da lista
  - Exibe notificação
  - Salva no localStorage

### Funções de Títulos

#### `addTitle`
```typescript
addTitle(
  title: Omit<Title, "id">, 
  mangaId: string, 
  silent?: boolean
): void
```
- **Descrição**: Adiciona um novo título honorífico
- **Parâmetros**: 
  - `title` - Objeto título (sem id)
  - `mangaId` - ID do mangá fonte
  - `silent` - Se `true`, não exibe notificação
- **Efeitos**: 
  - Gera ID único
  - Define `source` como mangaId
  - Define `active` como `false` por padrão
  - Adiciona à lista de títulos
  - Salva no localStorage

#### `editTitle`
```typescript
editTitle(titleId: string, updatedTitle: Partial<Title>): void
```
- **Descrição**: Edita um título existente
- **Parâmetros**: 
  - `titleId` - ID do título
  - `updatedTitle` - Objeto parcial com campos a atualizar
- **Efeitos**: 
  - Atualiza o título
  - Recalcula atributos se necessário
  - Salva no localStorage

#### `deleteTitle`
```typescript
deleteTitle(titleId: string): void
```
- **Descrição**: Remove um título
- **Parâmetros**: `titleId` - ID do título
- **Efeitos**: 
  - Remove da lista
  - Recalcula atributos
  - Salva no localStorage

#### `toggleTitle`
```typescript
toggleTitle(titleId: string): void
```
- **Descrição**: Ativa/desativa um título
- **Parâmetros**: `titleId` - ID do título
- **Efeitos**: 
  - Alterna o estado `active`
  - Recalcula atributos (títulos ativos dão bônus)
  - Salva no localStorage

### Funções de Perfil e Atributos

#### `addExperience`
```typescript
addExperience(amount: number): void
```
- **Descrição**: Adiciona experiência ao perfil
- **Parâmetros**: `amount` - Quantidade de XP a adicionar
- **Efeitos**: 
  - Adiciona XP ao perfil
  - Verifica se subiu de nível automaticamente
  - Exibe notificação de level up se aplicável
  - Salva no localStorage

#### `removeExperience`
```typescript
removeExperience(amount: number): void
```
- **Descrição**: Remove experiência do perfil
- **Parâmetros**: `amount` - Quantidade de XP a remover
- **Efeitos**: 
  - Remove XP (não permite XP negativo)
  - Pode regredir de nível se XP ficar negativo
  - Exibe notificação de "Level Down" se aplicável
  - Salva no localStorage

#### `removeMangaExperience` (Interna)
```typescript
removeMangaExperience(amount: number): void
```
- **Descrição**: Remove XP de forma mais agressiva (usada ao remover mangá)
- **Parâmetros**: `amount` - Quantidade de XP a remover
- **Efeitos**: 
  - Remove XP e pode regredir múltiplos níveis
  - Calcula XP necessário para cada nível
  - Exibe notificação de "Level Down" se aplicável
  - Salva no localStorage
- **Nota**: Função interna, não exposta no contexto

#### `addCustomAttribute`
```typescript
addCustomAttribute(attributeName: string): void
```
- **Descrição**: Adiciona um atributo personalizado ao perfil
- **Parâmetros**: `attributeName` - Nome do atributo
- **Efeitos**: 
  - Adiciona ao array `customAttributes`
  - Inicializa com valor 1
  - Salva no localStorage

#### `updateAttribute`
```typescript
updateAttribute(attributeName: string, value: number): void
```
- **Descrição**: Atualiza o valor de um atributo (manual)
- **Parâmetros**: 
  - `attributeName` - Nome do atributo
  - `value` - Novo valor
- **Efeitos**: 
  - Marca como atributo manual
  - Atualiza o valor
  - Salva no localStorage

#### `removeCustomAttribute`
```typescript
removeCustomAttribute(attributeName: string): void
```
- **Descrição**: Remove um atributo personalizado
- **Parâmetros**: `attributeName` - Nome do atributo
- **Efeitos**: 
  - Remove de `customAttributes`
  - Remove dos atributos do perfil
  - Salva no localStorage

#### `resetManualAttribute`
```typescript
resetManualAttribute(attributeName: string): void
```
- **Descrição**: Remove marcação de atributo manual (volta a ser calculado)
- **Parâmetros**: `attributeName` - Nome do atributo
- **Efeitos**: 
  - Remove de `manualAttributes`
  - Recalcula o atributo automaticamente
  - Salva no localStorage

#### `resetProfile`
```typescript
resetProfile(): void
```
- **Descrição**: Reseta o perfil para valores iniciais
- **Efeitos**: 
  - Reseta nível para 1
  - Reseta XP para 0
  - Reseta atributos para valores base
  - Limpa atributos personalizados
  - Salva no localStorage

### Funções de Notificações

#### `addNotification`
```typescript
addNotification(notification: Omit<Notification, "id">): void
```
- **Descrição**: Adiciona uma notificação ao sistema
- **Parâmetros**: 
  - `notification` - Objeto notificação (sem id, gerado automaticamente)
- **Tipos de notificação**: `"success" | "error" | "warning" | "info"`
- **Efeitos**: 
  - Gera ID único
  - Adiciona à lista de notificações
  - Exibe visualmente na tela

#### `removeNotification`
```typescript
removeNotification(id: string): void
```
- **Descrição**: Remove uma notificação
- **Parâmetros**: `id` - ID da notificação
- **Efeitos**: Remove da lista

### Funções de Recompensas

#### `syncMangaRewards`
```typescript
syncMangaRewards(mangaId: string): Promise<void>
```
- **Descrição**: Sincroniza recompensas de um mangá com o banco de dados
- **Parâmetros**: `mangaId` - ID do mangá
- **Funcionamento**: 
  - Busca recompensas no banco de dados (Prisma)
  - Filtra recompensas já coletadas
  - Aplica recompensas pendentes (XP, habilidades, itens, títulos)
  - Atualiza `collectedRewards`
- **Efeitos**: 
  - Adiciona XP se houver
  - Adiciona habilidades se houver
  - Adiciona itens se houver
  - Adiciona títulos se houver
  - Marca recompensas como coletadas
  - Salva no localStorage

#### `clearCollectedRewards`
```typescript
clearCollectedRewards(): void
```
- **Descrição**: Limpa todas as recompensas coletadas (debug)
- **Efeitos**: 
  - Limpa o array `collectedRewards`
  - Salva no localStorage

### Funções Internas (Não Expostas no Contexto)

#### `generateUniqueId` (Interna)
```typescript
generateUniqueId(): string
```
- **Descrição**: Gera um ID único para entidades
- **Retorno**: String com ID único
- **Formato**: `{timestamp}-{counter}-{random1}-{random2}`
- **Uso**: Usado internamente para gerar IDs de mangás, habilidades, itens, títulos

#### `getPossibleRewardPrefixesFromTitle` (Interna)
```typescript
getPossibleRewardPrefixesFromTitle(title: string): string[]
```
- **Descrição**: Gera possíveis prefixos de recompensa baseado no título
- **Parâmetros**: `title` - Título do mangá
- **Retorno**: Array com variações do título (lowercase, com hífen, com underscore)
- **Uso**: Usado para limpar recompensas coletadas ao adicionar/remover mangá

#### `processRewards` (Interna)
```typescript
processRewards(mangaId: string, episode: number): void
```
- **Descrição**: Processa recompensas de um episódio específico
- **Parâmetros**: 
  - `mangaId` - ID do mangá
  - `episode` - Número do episódio
- **Funcionamento**: 
  - Busca recompensas por título (prioridade) ou ID
  - Verifica se já foi coletada
  - Aplica XP, habilidades, itens, títulos, atributos
  - Marca como coletada
- **Nota**: Função interna, chamada por `incrementEpisode` e `processPendingRewards`

#### `processPendingRewards` (Interna)
```typescript
processPendingRewards(mangaId: string, currentEpisode: number, excludeCurrentEpisode?: boolean): void
```
- **Descrição**: Processa todas as recompensas pendentes de um mangá
- **Parâmetros**: 
  - `mangaId` - ID do mangá
  - `currentEpisode` - Episódio atual
  - `excludeCurrentEpisode` - Se `true`, não processa o episódio atual
- **Funcionamento**: 
  - Busca todas as recompensas até o episódio atual
  - Filtra recompensas já coletadas
  - Processa cada recompensa pendente
- **Uso**: Chamada por `syncMangaRewards` e ao incrementar episódio

#### `removeRewards` (Interna)
```typescript
removeRewards(mangaId: string, currentEpisode: number): void
```
- **Descrição**: Remove recompensas de episódios futuros ao decrementar
- **Parâmetros**: 
  - `mangaId` - ID do mangá
  - `currentEpisode` - Novo episódio atual
- **Funcionamento**: 
  - Encontra recompensas de episódios > currentEpisode
  - Remove XP, habilidades, itens, títulos aplicados
  - Remove de `collectedRewards`
- **Uso**: Chamada por `decrementEpisode`

### Funções de Importação/Exportação

#### `exportData`
```typescript
exportData(): string
```
- **Descrição**: Exporta todos os dados do usuário em JSON
- **Retorno**: String JSON com todos os dados
- **Dados exportados**: 
  - Perfil completo
  - Lista de mangás
  - Lista de habilidades
  - Lista de itens
  - Lista de títulos
  - Recompensas coletadas
  - Versão e timestamp

#### `importData`
```typescript
importData(json: string): boolean
```
- **Descrição**: Importa dados de um JSON exportado
- **Parâmetros**: `json` - String JSON com os dados
- **Retorno**: `true` se importação foi bem-sucedida, `false` caso contrário
- **Efeitos**: 
  - Valida o formato JSON
  - Restaura perfil
  - Restaura mangás
  - Restaura habilidades
  - Restaura itens
  - Restaura títulos
  - Restaura recompensas coletadas
  - Salva no localStorage

---

## 🛠️ Funções Utilitárias

### `lib/utils.ts`

#### `cn`
```typescript
function cn(...inputs: ClassValue[]): string
```
- **Descrição**: Utilitário para combinar classes CSS (Tailwind)
- **Parâmetros**: Classes CSS variadas
- **Retorno**: String com classes combinadas e mescladas
- **Uso**: `cn("class1", "class2", condition && "class3")`

### `lib/manga-rewards.ts`

#### `getMangaRewards`
```typescript
function getMangaRewards(mangaId: string, episode: number): MangaReward | null
```
- **Descrição**: Busca recompensas de um mangá por ID e episódio
- **Parâmetros**: 
  - `mangaId` - ID do mangá
  - `episode` - Número do episódio
- **Retorno**: Recompensa encontrada ou `null`

#### `getMangaRewardsByTitle`
```typescript
function getMangaRewardsByTitle(mangaTitle: string, episode: number): MangaReward | null
```
- **Descrição**: Busca recompensas por título do mangá (mais flexível)
- **Parâmetros**: 
  - `mangaTitle` - Título do mangá
  - `episode` - Número do episódio
- **Retorno**: Recompensa encontrada ou `null`
- **Nota**: Normaliza o título para comparação (case-insensitive, remove espaços extras)

#### `getAllMangaRewards`
```typescript
function getAllMangaRewards(mangaId: string): MangaReward[]
```
- **Descrição**: Obtém todas as recompensas de um mangá
- **Parâmetros**: `mangaId` - ID do mangá
- **Retorno**: Array com todas as recompensas do mangá

#### `getAllMangaRewardsByTitle`
```typescript
function getAllMangaRewardsByTitle(mangaTitle: string): MangaReward[]
```
- **Descrição**: Obtém todas as recompensas por título do mangá
- **Parâmetros**: `mangaTitle` - Título do mangá
- **Retorno**: Array com todas as recompensas do mangá

#### `getPendingRewards`
```typescript
function getPendingRewards(
  mangaId: string, 
  currentEpisode: number, 
  collectedRewards: string[]
): MangaReward[]
```
- **Descrição**: Retorna recompensas pendentes (episódios já lidos mas não coletados)
- **Parâmetros**: 
  - `mangaId` - ID do mangá
  - `currentEpisode` - Episódio atual
  - `collectedRewards` - Array de IDs de recompensas já coletadas
- **Retorno**: Array de recompensas pendentes

#### `getRewardId`
```typescript
function getRewardId(mangaId: string, episode: number): string
```
- **Descrição**: Gera ID único para uma recompensa
- **Parâmetros**: 
  - `mangaId` - ID do mangá
  - `episode` - Número do episódio
- **Retorno**: String no formato `"mangaId-episode"`

#### `getRewardsToRemove`
```typescript
function getRewardsToRemove(mangaId: string, currentEpisode: number): MangaReward[]
```
- **Descrição**: Retorna recompensas que devem ser removidas ao voltar episódios
- **Parâmetros**: 
  - `mangaId` - ID do mangá
  - `currentEpisode` - Novo episódio atual
- **Retorno**: Array de recompensas a remover (episódios > currentEpisode)

### `lib/character-utils.ts`

#### `calcularAtributosSecundarios`
```typescript
function calcularAtributosSecundarios(character: Partial<Character>): Partial<Character>
```
- **Descrição**: Calcula atributos secundários baseado nos primários
- **Parâmetros**: `character` - Objeto parcial do personagem
- **Retorno**: Personagem com atributos secundários calculados
- **Cálculos**: 
  - `vidaMaxima = vitalidade * 10 + nivel * 5`
  - `manaMaxima = inteligencia * 8 + nivel * 3`
  - `staminaMaxima = agilidade * 6 + vitalidade * 4 + nivel`
  - `ataqueFisico = forca * 2 + agilidade * 1 + nivel`
  - `ataqueMagico = inteligencia * 2 + sorte * 1 + nivel`
  - `defesaFisica = Math.floor(vitalidade * 1.5 + forca * 0.5 + nivel)`
  - `defesaMagica = Math.floor(inteligencia * 1.5 + vitalidade * 0.5 + nivel)`

#### `calcularExperienciaNecessaria`
```typescript
function calcularExperienciaNecessaria(nivel: number): number
```
- **Descrição**: Calcula XP necessário para subir de nível
- **Parâmetros**: `nivel` - Nível atual
- **Retorno**: Quantidade de XP necessária
- **Fórmula**: `nivel * 100 + (nivel - 1) * 50`

#### `criarPersonagemInicial`
```typescript
function criarPersonagemInicial(userId: number, nome: string): Character
```
- **Descrição**: Cria um personagem inicial com valores padrão
- **Parâmetros**: 
  - `userId` - ID do usuário
  - `nome` - Nome do personagem
- **Retorno**: Personagem completo inicializado
- **Valores padrão**: 
  - Nível 1, XP 0
  - Todos atributos em 5
  - 3 poções de vida, 2 poções de mana
  - Classe: "Aventureiro"

#### `ganharExperiencia`
```typescript
function ganharExperiencia(character: Character, xpGanho: number): Character
```
- **Descrição**: Adiciona XP e verifica level up
- **Parâmetros**: 
  - `character` - Personagem
  - `xpGanho` - XP a adicionar
- **Retorno**: Personagem atualizado
- **Efeitos**: 
  - Adiciona XP
  - Verifica se subiu de nível (loop para múltiplos níveis)
  - Adiciona pontos de atributo e habilidade ao subir
  - Recalcula atributos secundários

#### `perderExperiencia`
```typescript
function perderExperiencia(character: Character, xpPerdido: number): Character
```
- **Descrição**: Remove XP (não permite baixar de nível)
- **Parâmetros**: 
  - `character` - Personagem
  - `xpPerdido` - XP a remover
- **Retorno**: Personagem atualizado
- **Nota**: XP não pode ficar negativo

#### `distribuirPontoAtributo`
```typescript
function distribuirPontoAtributo(
  character: Character,
  atributo: "forca" | "agilidade" | "inteligencia" | "vitalidade" | "sorte",
  quantidade: number
): Character | null
```
- **Descrição**: Distribui pontos de atributo disponíveis
- **Parâmetros**: 
  - `character` - Personagem
  - `atributo` - Nome do atributo
  - `quantidade` - Quantidade de pontos
- **Retorno**: Personagem atualizado ou `null` se não houver pontos suficientes
- **Efeitos**: 
  - Aumenta o atributo
  - Diminui pontos disponíveis
  - Recalcula atributos secundários

### `lib/modal-manager.ts`

#### `openModal`
```typescript
function openModal(options: ModalOptions): void
```
- **Descrição**: Abre um modal
- **Parâmetros**: `options` - Opções do modal

#### `closeModal`
```typescript
function closeModal(): void
```
- **Descrição**: Fecha o modal atual

#### `closeAllModals`
```typescript
function closeAllModals(): void
```
- **Descrição**: Fecha todos os modais abertos

#### `createAttributeSection`
```typescript
function createAttributeSection(attributes: Record<string, number>): ModalSection
```
- **Descrição**: Cria uma seção de modal para exibir atributos
- **Parâmetros**: `attributes` - Objeto com atributos e valores
- **Retorno**: Seção de modal formatada

#### `createMangaList`
```typescript
function createMangaList(mangas: Array<{id: string, title: string, episodes: number, currentEpisode: number}>): ModalSection
```
- **Descrição**: Cria uma seção de modal para exibir lista de mangás
- **Parâmetros**: `mangas` - Array de mangás
- **Retorno**: Seção de modal formatada

#### `createActionFooter`
```typescript
function createActionFooter(buttons: Array<{text: string, onClick: string, variant?: 'primary' | 'secondary' | 'danger'}>): ModalSection
```
- **Descrição**: Cria rodapé de modal com botões de ação
- **Parâmetros**: `buttons` - Array de botões
- **Retorno**: Seção de modal formatada

---

## 🌐 APIs Routes

### Autenticação

#### `POST /api/auth/register`
```typescript
POST /api/auth/register
Body: { name: string, email: string, password: string }
Response: { message: string, userId: string }
```
- **Descrição**: Registra um novo usuário
- **Validações**: 
  - Nome, email e senha obrigatórios
  - Senha mínimo 6 caracteres
  - Email único

#### `GET/POST /api/auth/[...nextauth]`
- **Descrição**: Rotas do NextAuth.js
- **Rotas disponíveis**: 
  - `/api/auth/signin` - Login
  - `/api/auth/signout` - Logout
  - `/api/auth/session` - Sessão atual
  - `/api/auth/csrf` - Token CSRF

### Recompensas

#### `POST /api/rewards/sync`
```typescript
POST /api/rewards/sync
Body: {
  mangaId: string
  mangaTitle: string
  currentEpisode: number
  collectedRewards: string[]
}
Response: {
  success: boolean
  appliedRewards: MangaReward[]
  totalFound: number
  totalNew: number
}
```
- **Descrição**: Sincroniza recompensas de um mangá com o banco de dados
- **Funcionamento**: 
  - Busca recompensas no Prisma
  - Filtra por mangaId ou mangaTitle
  - Filtra por episódio <= currentEpisode
  - Remove recompensas já coletadas
  - Retorna apenas recompensas novas

#### `POST /api/rewards/search`
```typescript
POST /api/rewards/search
Body: {
  mangaId?: string
  mangaTitle?: string
  episode?: number
}
Response: {
  success: boolean
  rewards: MangaReward[]
  count: number
}
```
- **Descrição**: Busca recompensas específicas
- **Parâmetros opcionais**: 
  - `mangaId` ou `mangaTitle` (obrigatório pelo menos um)
  - `episode` - Filtrar por episódio específico

### Mangás

#### `POST /api/manga/check-chapters`
```typescript
POST /api/manga/check-chapters
Body: {
  url: string
  mangaTitle: string
}
Response: {
  success: boolean
  maxEpisode: number | null
  found: boolean
  message: string
  debug?: {
    foundNumbers: number[]
    uniqueCount: number
  }
}
```
- **Descrição**: Detecta automaticamente o número máximo de capítulos em um site
- **Funcionamento**: 
  - Faz web scraping da URL fornecida
  - Procura por padrões como "Capítulo X NEW"
  - Retorna o maior número encontrado
- **Nota**: Pode não funcionar em todos os sites devido a CORS

---

## 🎨 Componentes Principais

### `components/isekai-provider.tsx`

**IsekaiProvider**
- **Descrição**: Provider principal que gerencia todo o estado da aplicação
- **Props**: `{ children: ReactNode, userName: string }`
- **Funcionalidades**: 
  - Gerenciamento de estado global
  - Persistência em localStorage
  - Cálculo automático de atributos
  - Sistema de notificações
  - Sincronização de recompensas

**useIsekai**
```typescript
function useIsekai(): IsekaiContextType
```
- **Descrição**: Hook para acessar o contexto Isekai
- **Retorno**: Todas as funções e estado do provider
- **Uso**: `const { mangas, addManga } = useIsekai()`

### Componentes de Diálogo

#### `AddMangaDialog`
- **Descrição**: Diálogo para adicionar novo mangá
- **Campos**: Título, Tipo, URL da Capa, Link do Site, Episódio Atual
- **Validações**: Título obrigatório, verifica duplicatas

#### `EditMangaDialog`
- **Descrição**: Diálogo para editar mangá existente
- **Campos**: Mesmos do AddMangaDialog
- **Validações**: Título obrigatório, verifica duplicatas (exceto o atual)

#### `AddContentDialog`
- **Descrição**: Diálogo para adicionar conteúdo (habilidade, item ou título)
- **Tabs**: Habilidade, Item, Título
- **Funcionalidades**: Vincula conteúdo ao mangá selecionado

#### `EditAbilityDialog`
- **Descrição**: Diálogo para editar habilidade
- **Campos**: Nome, Descrição, Tipo, Categoria, Poder, Custo de Mana, Cooldown

#### `DeleteSkillDialog`
- **Descrição**: Diálogo de confirmação para excluir habilidade

#### `EditItemDialog` / `EditItemIsekaiDialog`
- **Descrição**: Diálogos para editar itens
- **Campos**: Nome, Descrição, Tipo, Raridade, Preço, Requisitos, Efeitos

#### `DeleteItemDialog`
- **Descrição**: Diálogo de confirmação para excluir item

#### `EditAttributesDialog`
- **Descrição**: Diálogo para editar atributos manualmente
- **Funcionalidades**: Permite editar todos os atributos do perfil

### Componentes de Painel

#### `FloatingCharacterWindow`
- **Descrição**: Janela principal flutuante com todas as funcionalidades
- **Seções**: 
  - Dashboard (perfil, atributos, XP)
  - Biblioteca de Mangás
  - Habilidades
  - Inventário
  - Títulos
- **Funcionalidades**: 
  - Busca e filtros
  - Ações rápidas (editar, excluir, sincronizar)
  - Navegação por tabs

#### `AttributePanel`
- **Descrição**: Painel de exibição de atributos
- **Funcionalidades**: Mostra atributos base, de itens, de títulos e totais

#### `ExperiencePanel`
- **Descrição**: Painel de experiência e nível
- **Funcionalidades**: 
  - Barra de progresso de XP
  - Informações de level up
  - Animações

#### `InventoryPanel`
- **Descrição**: Painel de inventário
- **Funcionalidades**: 
  - Lista de itens por categoria
  - Equipar/desequipar
  - Editar/excluir itens

#### `SkillsPanel`
- **Descrição**: Painel de habilidades
- **Funcionalidades**: 
  - Lista de habilidades disponíveis
  - Desbloquear habilidades
  - Editar/excluir habilidades

### Componentes de UI

Todos os componentes em `components/ui/` seguem o padrão shadcn/ui:
- `Button`, `Input`, `Dialog`, `Card`, `Badge`, `Progress`, etc.
- Documentação completa em: https://ui.shadcn.com/

---

## 💾 Persistência de Dados

### LocalStorage

Todos os dados são salvos automaticamente no `localStorage` com a chave:
```
isekai-data-{userName}
```

**Estrutura salva**:
```json
{
  "profile": UserProfile,
  "mangas": Manga[],
  "abilities": Ability[],
  "items": Item[],
  "titles": Title[],
  "collectedRewards": string[]
}
```

**Quando salva**: 
- Automaticamente após qualquer alteração
- Via `useEffect` que monitora mudanças nos arrays

---

## 🔄 Fluxo de Dados

### Adicionar Mangá
1. Usuário preenche formulário → `AddMangaDialog`
2. Validação de duplicatas
3. Chama `addManga()` → `IsekaiProvider`
4. Gera ID e data
5. Adiciona à lista
6. Calcula XP (10 por episódio)
7. Salva no localStorage
8. Atualiza UI

### Sincronizar Recompensas
1. Usuário clica "Sincronizar" → `FloatingCharacterWindow`
2. Chama `syncMangaRewards(mangaId)` → `IsekaiProvider`
3. Faz fetch para `/api/rewards/sync`
4. API busca no Prisma
5. Filtra recompensas já coletadas
6. Retorna recompensas novas
7. Aplica recompensas (XP, habilidades, itens, títulos)
8. Marca como coletadas
9. Salva no localStorage
10. Atualiza UI

### Sistema de Atributos
1. Atributos base: sempre 1 (via `calculateTotalAttributes`)
2. Bônus de itens: somados de todos os itens
3. Bônus de títulos: somados apenas de títulos ativos
4. Atributos personalizados: adicionados manualmente
5. Atributos manuais: sobrescrevem os calculados
6. Cálculo automático via `useEffect` quando itens/títulos mudam

---

## 📝 Notas Importantes

### IDs Únicos
- Todos os IDs são gerados usando: `Date.now() + counter + random`
- Garante unicidade mesmo em execuções simultâneas

### Regressão de XP
- Ao remover mangá, remove XP baseado nos episódios lidos
- Ao decrementar episódio, remove 10 XP
- Remove recompensas de episódios futuros

### Validações
- Títulos de mangás devem ser únicos
- Episódio não pode ser negativo
- XP não pode ser negativo
- Atributos não podem ser negativos

### Performance
- Dados salvos apenas quando há mudanças
- Cálculos de atributos feitos via `useEffect` (otimizado)
- LocalStorage usado para persistência (não há backend próprio)

---

## 🚀 Como Usar

### Exemplo: Adicionar Mangá
```typescript
const { addManga } = useIsekai()

addManga({
  title: "Solo Leveling",
  type: "manhwa",
  abilities: [],
  coverImage: "https://...",
  url: "https://...",
  currentEpisode: 50
})
```

### Exemplo: Adicionar Habilidade
```typescript
const { addAbility } = useIsekai()

addAbility({
  name: "Shadow Extraction",
  description: "Pode extrair sombras",
  type: "active",
  category: "special",
  power: 5,
  manaCost: 20,
  cooldown: 30
}, mangaId)
```

### Exemplo: Sincronizar Recompensas
```typescript
const { syncMangaRewards } = useIsekai()

await syncMangaRewards(mangaId)
```

---

## 📊 Estatísticas

- **Total de Funções**: ~50+
- **APIs Routes**: 4 principais
- **Componentes**: 20+
- **Tipos/Interfaces**: 10+
- **Funções Utilitárias**: 15+

---

**Última atualização**: Baseado no código atual do projeto
**Versão**: 1.0

