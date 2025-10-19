import { Ability, Item, Title } from './isekai-types'

export interface MangaReward {
  mangaId: string
  mangaTitle: string
  episode: number
  rewards: {
    experience?: number
    abilities?: Omit<Ability, 'id' | 'sources'>[]
    items?: Omit<Item, 'id' | 'source'>[]
    titles?: Omit<Title, 'id' | 'source'>[]
    attributes?: {
      strength?: number
      agility?: number
      intelligence?: number
      vitality?: number
      luck?: number
    }
  }
}

// Base de dados de recompensas pré-programadas
export const MANGA_REWARDS: MangaReward[] = [
  // Solo Leveling - Exemplo de recompensas
  {
    mangaId: "solo-leveling", // ID único do mangá
    mangaTitle: "Solo Leveling",
    episode: 1,
    rewards: {
      experience: 50,
      abilities: [{
        name: "Shadow Extraction",
        description: "Pode extrair sombras de criaturas mortas e controlá-las",
        type: "active" as const,
        level: 1,
        category: "special" as const,
        power: 5,
        manaCost: 20,
        cooldown: 30
      }]
    }
  },
  {
    mangaId: "solo-leveling",
    mangaTitle: "Solo Leveling", 
    episode: 5,
    rewards: {
      experience: 100,
      items: [{
        name: "Sistema de Caçador",
        description: "Interface que permite verificar status e missões",
        type: "accessory" as const,
        rarity: "legendary" as const,
        effects: {
          intelligence: 10,
          luck: 5
        }
      }]
    }
  },
  {
    mangaId: "solo-leveling",
    mangaTitle: "Solo Leveling",
    episode: 10,
    rewards: {
      experience: 200,
      abilities: [{
        name: "Stealth",
        description: "Pode se tornar invisível por um período limitado",
        type: "active" as const,
        level: 1,
        category: "utility" as const,
        power: 3,
        manaCost: 15,
        cooldown: 60
      }]
    }
  },
  
  // Exemplos para outros mangás populares
  {
    mangaId: "lookism",
    mangaTitle: "Lookism",
    episode: 1,
    rewards: {
      experience: 30,
      abilities: [{
        name: "Fighting Instinct",
        description: "Instinto natural para combate e percepção de perigo",
        type: "passive" as const,
        level: 1,
        category: "defense" as const,
        power: 3
      }]
    }
  },
  {
    mangaId: "eleceed",
    mangaTitle: "Eleceed",
    episode: 1,
    rewards: {
      experience: 0,
      abilities: [{
        name: "Electric Control",
        description: "Controle básico sobre eletricidade",
        type: "active" as const,
        level: 1,
        category: "attack" as const,
        power: 4,
        manaCost: 15,
        cooldown: 45
      }]
    }
  },
  {
    mangaId: "eleceed",
    mangaTitle: "Eleceed",
    episode: 2,
    rewards: {
      experience: 0,
      abilities: [{
        name: "Electric Control2",
        description: "Controle básico sobre eletricidade",
        type: "active" as const,
        level: 1,
        category: "attack" as const,
        power: 4,
        manaCost: 15,
        cooldown: 45
      }]
    }
  },
  {
    mangaId: "eleceed",
    mangaTitle: "Eleceed",
    episode: 4,
    rewards: {
      experience: 0,
      abilities: [{
        name: "Electric Control3,
        description: "Controle básico sobre eletricidade",
        type: "active" as const,
        level: 1,
        category: "attack" as const,
        power: 4,
        manaCost: 15,
        cooldown: 45
      }]
    }
  },
  {
    mangaId: "eleceed",
    mangaTitle: "Eleceed",
    episode: 3,
    rewards: {
      attributes: {
        strength: 2,
        intelligence: 3,
        agility: 1
      }
    }
  },
  {
    mangaId: "the greatest estate developer",
    mangaTitle: "The Greatest Estate Developer",
    episode: 1,
    rewards: {
      experience: 60,
      titles: [{
        name: "Constructor",
        description: "Especialista em construção e desenvolvimento",
        effects: {
          intelligence: 5,
          strength: 2
        }
      }]
    }
  }
]

// Função para encontrar recompensas por mangaId e episódio
export function getMangaRewards(mangaId: string, episode: number): MangaReward | null {
  const reward = MANGA_REWARDS.find(reward => 
    reward.mangaId === mangaId && reward.episode === episode
  ) || null
  
  // Debug temporário
  if ((mangaId.toLowerCase().includes('eleceed') || mangaId.toLowerCase().includes('lookism')) && episode === 1) {
    console.log(`[DEBUG] getMangaRewards - buscando "${mangaId}" ep ${episode}:`, reward)
    if (mangaId.toLowerCase().includes('eleceed')) {
      console.log(`[DEBUG] Todos os rewards do Eleceed:`, MANGA_REWARDS.filter(r => r.mangaId.includes('eleceed')))
    }
    if (mangaId.toLowerCase().includes('lookism')) {
      console.log(`[DEBUG] Todos os rewards do Lookism:`, MANGA_REWARDS.filter(r => r.mangaId.includes('lookism')))
    }
  }
  
  return reward
}

// Função para encontrar recompensas por título e episódio (mais flexível)
export function getMangaRewardsByTitle(mangaTitle: string, episode: number): MangaReward | null {
  // Normalizar título para comparação (remover espaços extras, converter para minúsculas)
  const normalizeTitle = (title: string) => title.toLowerCase().trim().replace(/\s+/g, ' ')
  
  const normalizedSearchTitle = normalizeTitle(mangaTitle)
  
  const reward = MANGA_REWARDS.find(reward => {
    const normalizedRewardTitle = normalizeTitle(reward.mangaTitle)
    return normalizedRewardTitle === normalizedSearchTitle && reward.episode === episode
  }) || null
  
  // Debug para verificação
  if (normalizedSearchTitle.includes('eleceed') || normalizedSearchTitle.includes('lookism')) {
    console.log(`[DEBUG] getMangaRewardsByTitle - buscando título "${mangaTitle}" (normalizado: "${normalizedSearchTitle}") ep ${episode}:`, reward)
  }
  
  return reward
}

// Função para obter todas as recompensas de um mangá
export function getAllMangaRewards(mangaId: string): MangaReward[] {
  return MANGA_REWARDS.filter(reward => reward.mangaId === mangaId)
}

// Função para obter todas as recompensas de um mangá por título
export function getAllMangaRewardsByTitle(mangaTitle: string): MangaReward[] {
  const normalizeTitle = (title: string) => title.toLowerCase().trim().replace(/\s+/g, ' ')
  const normalizedSearchTitle = normalizeTitle(mangaTitle)
  
  return MANGA_REWARDS.filter(reward => {
    const normalizedRewardTitle = normalizeTitle(reward.mangaTitle)
    return normalizedRewardTitle === normalizedSearchTitle
  })
}

// Função para verificar se há recompensas pendentes (episódios já lidos mas recompensas não coletadas)
export function getPendingRewards(mangaId: string, currentEpisode: number, collectedRewards: string[]): MangaReward[] {
  const allRewards = getAllMangaRewards(mangaId)
  return allRewards.filter(reward => 
    reward.episode <= currentEpisode && 
    !collectedRewards.includes(`${mangaId}-${reward.episode}`)
  )
}

// IDs únicos para identificar quais recompensas já foram coletadas
export function getRewardId(mangaId: string, episode: number): string {
  return `${mangaId}-${episode}`
}

// Função para obter todas as recompensas que devem ser removidas quando volta a um capítulo anterior
export function getRewardsToRemove(mangaId: string, currentEpisode: number): MangaReward[] {
  return MANGA_REWARDS.filter(reward => 
    reward.mangaId === mangaId && reward.episode > currentEpisode
  )
}
