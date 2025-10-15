"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/components/auth-provider"
import {
  criarPersonagemInicial,
  ganharExperiencia,
  perderExperiencia,
  distribuirPontoAtributo,
  type Character,
  type Skill,
  type Item,
} from "@/lib/character-utils"

interface CharacterContextType {
  character: Character | null
  updateCharacter: (character: Character) => void
  addExperience: (xp: number) => void
  removeExperience: (xp: number) => void
  distributeAttributePoint: (
    atributo: "forca" | "agilidade" | "inteligencia" | "vitalidade" | "sorte",
    quantidade: number,
  ) => boolean
  // Skills management
  addSkill: (skill: Omit<Skill, "id">) => void
  editSkill: (skillId: number, updatedSkill: Partial<Skill>) => void
  deleteSkill: (skillId: number) => void
  // Items management
  addItem: (item: Omit<Item, "id">) => void
  editItem: (itemId: number, updatedItem: Partial<Item>) => void
  deleteItem: (itemId: number) => void
  isLoading: boolean
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined)

export function CharacterProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [character, setCharacter] = useState<Character | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [skillsDatabase, setSkillsDatabase] = useState<Skill[]>([])
  const [itemsDatabase, setItemsDatabase] = useState<Item[]>([])

  useEffect(() => {
    if (user) {
      // Tentar carregar personagem do localStorage
      const savedCharacter = localStorage.getItem(`isekai_character_${user.id}`)
      if (savedCharacter) {
        setCharacter(JSON.parse(savedCharacter))
      } else {
        // Criar personagem inicial
        const novoPersonagem = criarPersonagemInicial(user.id, `${user.username} - Herói`)
        setCharacter(novoPersonagem)
        localStorage.setItem(`isekai_character_${user.id}`, JSON.stringify(novoPersonagem))
      }
      
      // Carregar databases de habilidades e itens
      const savedSkills = localStorage.getItem(`isekai_skills_${user.id}`)
      const savedItems = localStorage.getItem(`isekai_items_${user.id}`)
      
      if (savedSkills) {
        setSkillsDatabase(JSON.parse(savedSkills))
      } else {
        // Importar skills padrão
        import("@/lib/character-utils").then(({ SKILLS_DATABASE }) => {
          setSkillsDatabase(SKILLS_DATABASE)
          localStorage.setItem(`isekai_skills_${user.id}`, JSON.stringify(SKILLS_DATABASE))
        })
      }
      
      if (savedItems) {
        setItemsDatabase(JSON.parse(savedItems))
      } else {
        // Importar items padrão
        import("@/lib/character-utils").then(({ ITEMS_DATABASE }) => {
          setItemsDatabase(ITEMS_DATABASE)
          localStorage.setItem(`isekai_items_${user.id}`, JSON.stringify(ITEMS_DATABASE))
        })
      }
    } else {
      setCharacter(null)
      setSkillsDatabase([])
      setItemsDatabase([])
    }
    setIsLoading(false)
  }, [user])

  const updateCharacter = (newCharacter: Character) => {
    setCharacter(newCharacter)
    if (user) {
      localStorage.setItem(`isekai_character_${user.id}`, JSON.stringify(newCharacter))
    }
  }

  const addExperience = (xp: number) => {
    if (character) {
      const updatedCharacter = ganharExperiencia(character, xp)
      updateCharacter(updatedCharacter)
    }
  }

  const removeExperience = (xp: number) => {
    if (character) {
      const updatedCharacter = perderExperiencia(character, xp)
      updateCharacter(updatedCharacter)
    }
  }

  const distributeAttributePoint = (
    atributo: "forca" | "agilidade" | "inteligencia" | "vitalidade" | "sorte",
    quantidade: number,
  ): boolean => {
    if (character) {
      const updatedCharacter = distribuirPontoAtributo(character, atributo, quantidade)
      if (updatedCharacter) {
        updateCharacter(updatedCharacter)
        return true
      }
    }
    return false
  }

  // Skills management functions
  const addSkill = (skill: Omit<Skill, "id">) => {
    const newSkill: Skill = {
      ...skill,
      id: Date.now(),
    }
    setSkillsDatabase(prev => {
      const updated = [...prev, newSkill]
      if (user) {
        localStorage.setItem(`isekai_skills_${user.id}`, JSON.stringify(updated))
      }
      return updated
    })
  }

  const editSkill = (skillId: number, updatedSkill: Partial<Skill>) => {
    setSkillsDatabase(prev => {
      const updated = prev.map(skill => 
        skill.id === skillId 
          ? { ...skill, ...updatedSkill }
          : skill
      )
      if (user) {
        localStorage.setItem(`isekai_skills_${user.id}`, JSON.stringify(updated))
      }
      return updated
    })
  }

  const deleteSkill = (skillId: number) => {
    setSkillsDatabase(prev => {
      const updated = prev.filter(skill => skill.id !== skillId)
      if (user) {
        localStorage.setItem(`isekai_skills_${user.id}`, JSON.stringify(updated))
      }
      return updated
    })
    
    // Remove skill from character if equipped
    if (character) {
      const updatedCharacter = {
        ...character,
        habilidades: character.habilidades.filter(id => id !== skillId)
      }
      updateCharacter(updatedCharacter)
    }
  }

  // Items management functions
  const addItem = (item: Omit<Item, "id">) => {
    const newItem: Item = {
      ...item,
      id: Date.now(),
    }
    setItemsDatabase(prev => {
      const updated = [...prev, newItem]
      if (user) {
        localStorage.setItem(`isekai_items_${user.id}`, JSON.stringify(updated))
      }
      return updated
    })
  }

  const editItem = (itemId: number, updatedItem: Partial<Item>) => {
    setItemsDatabase(prev => {
      const updated = prev.map(item => 
        item.id === itemId 
          ? { ...item, ...updatedItem }
          : item
      )
      if (user) {
        localStorage.setItem(`isekai_items_${user.id}`, JSON.stringify(updated))
      }
      return updated
    })
  }

  const deleteItem = (itemId: number) => {
    setItemsDatabase(prev => {
      const updated = prev.filter(item => item.id !== itemId)
      if (user) {
        localStorage.setItem(`isekai_items_${user.id}`, JSON.stringify(updated))
      }
      return updated
    })
    
    // Remove item from character inventory and equipment if equipped
    if (character) {
      const updatedCharacter = {
        ...character,
        inventario: character.inventario.filter(invItem => invItem.itemId !== itemId),
        equipamentos: {
          ...character.equipamentos,
          arma: character.equipamentos.arma === itemId ? undefined : character.equipamentos.arma,
          armadura: character.equipamentos.armadura === itemId ? undefined : character.equipamentos.armadura,
          acessorio1: character.equipamentos.acessorio1 === itemId ? undefined : character.equipamentos.acessorio1,
          acessorio2: character.equipamentos.acessorio2 === itemId ? undefined : character.equipamentos.acessorio2,
        }
      }
      updateCharacter(updatedCharacter)
    }
  }

  return (
    <CharacterContext.Provider
      value={{
        character,
        updateCharacter,
        addExperience,
        removeExperience,
        distributeAttributePoint,
        addSkill,
        editSkill,
        deleteSkill,
        addItem,
        editItem,
        deleteItem,
        isLoading,
      }}
    >
      {children}
    </CharacterContext.Provider>
  )
}

export function useCharacter() {
  const context = useContext(CharacterContext)
  if (context === undefined) {
    throw new Error("useCharacter must be used within a CharacterProvider")
  }
  return context
}
