export type ReleaseWeekday = "domingo" | "segunda" | "terca" | "quarta" | "quinta" | "sexta" | "sabado"

export interface Manga {
  id: string
  title: string
  type: "manga" | "manhwa" | "manhua"
  dateAdded: string
  abilities: string[]
  coverImage?: string
  url?: string
  currentEpisode?: number
  isPrivate?: boolean
  totalChapters?: number
  releaseWeekday?: ReleaseWeekday
  totalChaptersUpdatedAt?: string
}

export interface Ability {
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

export interface Item {
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

export interface Title {
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

export type MissionType = "daily" | "weekly" | "journey"

export type MissionObjective =
  | "read_chapters"
  | "reach_episode"
  | "complete_manga"
  | "add_manga"
  | "unlock_content"
  | "read_days"

export interface Mission {
  id: string
  type: MissionType
  objective: MissionObjective
  title: string
  description: string
  icon: string
  target: number
  progress: number
  rewardXP: number
  mangaId?: string
  targetEpisode?: number
  periodKey?: string
  completed: boolean
  completedAt?: string
  createdAt: string
  expiresAt?: string
}

export type AchievementObjective =
  | "mangas"
  | "chapters"
  | "abilities"
  | "items"
  | "titles"
  | "completed_journeys"
  | "read_days"

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  objective: AchievementObjective
  target: number
  progress: number
  unlocked: boolean
  unlockedAt?: string
  rewardXP: number
}

export interface ReadingActivity {
  date: string
  chapters: number
}

export interface SeasonProgress {
  id: string
  title: string
  subtitle: string
  level: number
  experience: number
  experienceToNextLevel: number
  startedAt: string
  completedMissionIds: string[]
}

export interface UserProfile {
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

// Função para calcular atributos base (habilidades não dão mais bônus de atributos)
export function calculateTotalAttributes(abilities: Ability[]) {
  return {
    strength: 1,
    agility: 1,
    intelligence: 1,
    vitality: 1,
    luck: 1,
  }
}
