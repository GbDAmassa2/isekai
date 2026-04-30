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
