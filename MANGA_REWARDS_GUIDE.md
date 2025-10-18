# 🎁 Sistema de Recompensas Pré-programadas

O sistema de recompensas permite definir recompensas automáticas que serão aplicadas quando o usuário atingir capítulos específicos de mangás.

## Como Funciona

1. **Quando você avança um capítulo** (botão + ou altera manualmente), o sistema verifica se há recompensas para aquele mangá e capítulo
2. **Se encontrar recompensas**, elas são aplicadas automaticamente:
   - Experiência (XP)
   - Habilidades
   - Itens
   - Títulos
   - Atributos
3. **Notificação** aparece mostrando quais recompensas foram recebidas
4. **Evita duplicação** - cada recompensa só é dada uma vez

### 🔄 **Sistema de Remoção Automática**

5. **Quando você volta para um capítulo anterior**, o sistema remove automaticamente as recompensas dos capítulos futuros:
   - Se você estava no capítulo 10 e volta para o 5, perde as recompensas dos capítulos 6-10
   - Habilidades, itens e títulos são removidos da sua lista
   - Experiência é subtraída
   - Notificação informa quais recompensas foram removidas

### 🔍 **Sistema de Recuperação de Recompensas Pendentes**

6. **Para mangás já avançados**: Quando você avança um capítulo, o sistema verifica automaticamente se há recompensas pendentes de capítulos anteriores:
   - Se você estava no capítulo 5 do Eleceed (que tem habilidade no cap. 1) e avança para o cap. 6, automaticamente ganha a habilidade do cap. 1
   - Funciona tanto com botão + quanto alteração manual
   - Processa todas as recompensas pendentes em ordem (cap. 1, depois 2, depois 3, etc.)
   - Notificação especial informa quantas recompensas pendentes foram coletadas

## Como Adicionar Recompensas

### 1. Editar o arquivo `lib/manga-rewards.ts`

```typescript
export const MANGA_REWARDS: MangaReward[] = [
  {
    mangaId: "solo-leveling", // ID único do mangá
    mangaTitle: "Solo Leveling",
    episode: 1, // Capítulo que desbloqueia a recompensa
    rewards: {
      experience: 50, // XP extra
      abilities: [{ // Lista de habilidades
        name: "Shadow Extraction",
        description: "Pode extrair sombras de criaturas mortas",
        type: "active",
        level: 1,
        sources: [],
        category: "special",
        power: 5,
        manaCost: 20,
        cooldown: 30
      }],
      items: [{ // Lista de itens
        name: "Sistema de Caçador",
        description: "Interface que permite verificar status",
        type: "accessory",
        rarity: "legendary",
        source: "",
        effects: {
          intelligence: 10,
          luck: 5
        }
      }],
      titles: [{ // Lista de títulos
        name: "Constructor",
        description: "Especialista em construção",
        source: "",
        effects: {
          intelligence: 5,
          strength: 2
        }
      }],
      attributes: { // Atributos diretos
        strength: 5,
        intelligence: 3
      }
    }
  }
]
```

### 2. Identificação do Mangá

O sistema tenta encontrar recompensas usando diferentes formatos:
- ID exato do mangá
- Título em minúsculas com espaços substituídos por hífens
- Título em minúsculas com espaços substituídos por underscores
- Título em minúsculas

**Exemplo:** Para "Solo Leveling", tenta:
- ID real do mangá
- "solo-leveling"
- "solo_leveling" 
- "solo leveling"

### 3. Exemplos Práticos

#### Solo Leveling
```typescript
{
  mangaId: "solo-leveling",
  mangaTitle: "Solo Leveling",
  episode: 1,
  rewards: {
    experience: 50,
    abilities: [{
      name: "Shadow Extraction",
      description: "Pode extrair sombras de criaturas mortas e controlá-las",
      type: "active",
      level: 1,
      sources: [],
      category: "special",
      power: 5,
      manaCost: 20,
      cooldown: 30
    }]
  }
}
```

#### Lookism
```typescript
{
  mangaId: "lookism",
  mangaTitle: "Lookism", 
  episode: 1,
  rewards: {
    experience: 30,
    abilities: [{
      name: "Fighting Instinct",
      description: "Instinto natural para combate",
      type: "passive",
      level: 1,
      sources: [],
      category: "defense",
      power: 3
    }]
  }
}
```

## Tipos de Recompensas Disponíveis

### 🟢 Experiência
```typescript
experience: 100 // Adiciona 100 XP
```

### ⚡ Habilidades
```typescript
abilities: [{
  name: "Nome da Habilidade",
  description: "Descrição detalhada",
  type: "active" | "passive",
  level: 1,
  sources: [],
  category: "attack" | "defense" | "support" | "utility" | "special",
  power: 5,
  manaCost: 20, // Opcional
  cooldown: 30  // Opcional
}]
```

### 🎒 Itens
```typescript
items: [{
  name: "Nome do Item",
  description: "Descrição do item",
  type: "weapon" | "armor" | "accessory" | "consumable" | "material",
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary",
  source: "",
  effects: {
    strength: 10,
    intelligence: 5
  }
}]
```

### 👑 Títulos
```typescript
titles: [{
  name: "Nome do Título",
  description: "Descrição do título",
  source: "",
  effects: {
    strength: 5,
    agility: 3
  }
}]
```

### 📈 Atributos Diretos
```typescript
attributes: {
  strength: 5,
  agility: 3,
  intelligence: 2,
  vitality: 4,
  luck: 1
}
```

## Dicas para Criar Recompensas

1. **Seja temático**: As recompensas devem fazer sentido com o mangá e o capítulo
2. **Graduação**: Capítulos iniciais = recompensas menores, capítulos importantes = recompensas maiores
3. **Variedade**: Misture diferentes tipos de recompensas para manter interessante
4. **Balanceamento**: Não exagere nos valores, especialmente em atributos diretos

## Exemplo Completo

```typescript
// Capítulo 1 - Primeira habilidade do protagonista
{
  mangaId: "solo-leveling",
  mangaTitle: "Solo Leveling",
  episode: 1,
  rewards: {
    experience: 50,
    abilities: [{
      name: "Shadow Extraction",
      description: "Pode extrair sombras de criaturas mortas e controlá-las",
      type: "active",
      level: 1,
      sources: [],
      category: "special",
      power: 5,
      manaCost: 20,
      cooldown: 30
    }]
  }
},

// Capítulo 5 - Sistema aparece
{
  mangaId: "solo-leveling", 
  mangaTitle: "Solo Leveling",
  episode: 5,
  rewards: {
    experience: 100,
    items: [{
      name: "Sistema de Caçador",
      description: "Interface que permite verificar status e missões",
      type: "accessory",
      rarity: "legendary",
      source: "",
      effects: {
        intelligence: 10,
        luck: 5
      }
    }]
  }
}
```

O sistema está pronto para uso! Basta adicionar as recompensas no arquivo `manga-rewards.ts` e elas serão aplicadas automaticamente quando os usuários chegarem aos capítulos correspondentes.
