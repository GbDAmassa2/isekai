"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Manga, Ability, Item, Title, UserProfile } from "@/lib/isekai-types"
import { calculateTotalAttributes } from "@/lib/isekai-types"
import { useToast } from "@/hooks/use-toast"
import { NotificationManager } from "./animated-notification"

interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  description?: string
  duration?: number
}

interface IsekaiContextType {
  profile: UserProfile
  mangas: Manga[]
  abilities: Ability[]
  items: Item[]
  titles: Title[]
  notifications: Notification[]
  addManga: (manga: Omit<Manga, "id" | "dateAdded">) => void
  addAbility: (ability: Omit<Ability, "id" | "level" | "sources">, mangaId: string) => void
  editAbility: (abilityId: string, updatedAbility: Partial<Ability>) => void
  deleteAbility: (abilityId: string) => void
  addItem: (item: Omit<Item, "id">, mangaId: string) => void
  editItem: (itemId: string, updatedItem: Partial<Item>) => void
  deleteItem: (itemId: string) => void
  addTitle: (title: Omit<Title, "id">, mangaId: string) => void
  editTitle: (titleId: string, updatedTitle: Partial<Title>) => void
  deleteTitle: (titleId: string) => void
  toggleTitle: (titleId: string) => void
  addCustomAttribute: (attributeName: string) => void
  updateAttribute: (attributeName: string, value: number) => void
  removeCustomAttribute: (attributeName: string) => void
  resetManualAttribute: (attributeName: string) => void
  resetProfile: () => void
  addExperience: (amount: number) => void
  removeExperience: (amount: number) => void
  removeManga: (id: string) => void
  getMangaById: (id: string) => Manga | undefined
  updateMangaEpisode: (mangaId: string, episode: number) => void
  incrementEpisode: (mangaId: string) => void
  decrementEpisode: (mangaId: string) => void
  exportData: () => string
  importData: (json: string) => boolean
  addNotification: (notification: Omit<Notification, "id">) => void
  removeNotification: (id: string) => void
}

const IsekaiContext = createContext<IsekaiContextType | undefined>(undefined)

interface IsekaiProviderProps {
  children: ReactNode
  userName: string
}

export function IsekaiProvider({ children, userName }: IsekaiProviderProps) {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [profile, setProfile] = useState<UserProfile>({
    name: userName,
    level: 1,
    experience: 0,
    totalMangasRead: 0,
    totalAbilities: 0,
    attributes: {
      strength: 1,
      agility: 1,
      intelligence: 1,
      vitality: 1,
      luck: 1,
    },
    customAttributes: [],
    manualAttributes: [],
    titles: ["Leitor Iniciante"],
  })

  const [mangas, setMangas] = useState<Manga[]>([])
  const [abilities, setAbilities] = useState<Ability[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [titles, setTitles] = useState<Title[]>([])

  useEffect(() => {
    const userKey = `isekai-data-${userName}`
    const savedData = localStorage.getItem(userKey)

    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        if (data.profile) {
          setProfile({ ...data.profile, name: userName })
        }
        if (data.mangas) setMangas(data.mangas)
        if (data.abilities) setAbilities(data.abilities)
        if (data.items) setItems(data.items)
        if (data.titles) setTitles(data.titles)
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error)
      }
    }
  }, [userName])

  // Keep totalMangasRead in sync with current manga list
  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      totalMangasRead: mangas.length,
    }))
  }, [mangas.length])

  // Save all data together for this user
  useEffect(() => {
    // Só salva se não for o estado inicial vazio
    if (profile.name && (mangas.length > 0 || abilities.length > 0 || items.length > 0 || titles.length > 0 || profile.experience > 0)) {
      const userKey = `isekai-data-${userName}`
      const data = {
        profile: { ...profile, name: userName },
        mangas,
        abilities,
        items,
        titles
      }
      localStorage.setItem(userKey, JSON.stringify(data))
    }
  }, [profile, mangas, abilities, items, titles, userName])


  useEffect(() => {
    const baseAttributes = calculateTotalAttributes(abilities)
    console.log('Atributos base:', baseAttributes)

    const itemAttributes = items.reduce(
      (total, item) => {
        const result = { ...total }
        Object.keys(item.effects).forEach((key) => {
          if (item.effects[key]) {
            result[key] = (result[key] || 0) + (item.effects[key] || 0)
          }
        })
        return result
      },
      {} as Record<string, number>,
    )
    console.log('Bônus de itens:', itemAttributes)

    const activeTitles = titles.filter((t) => t.active)
    console.log('Títulos ativos:', activeTitles.map(t => ({ name: t.name, active: t.active, effects: t.effects })))
    
    const titleAttributes = activeTitles.reduce(
        (total, title) => {
          const result = { ...total }
          Object.keys(title.effects).forEach((key) => {
            if (title.effects[key]) {
              result[key] = (result[key] || 0) + (title.effects[key] || 0)
            }
          })
          return result
        },
        {} as Record<string, number>,
      )
    console.log('Bônus de títulos:', titleAttributes)

    setProfile((prev) => {
      // Preservar atributos base editados manualmente
      const manualAttributes = Object.fromEntries(
        Object.entries(prev.attributes).filter(([key]) => 
          prev.manualAttributes?.includes(key) || false
        )
      )
      
      // Calcular atributos finais: base + itens + títulos + personalizados + manuais
      const finalAttributes = { ...baseAttributes }
      
      // Inicializar atributos personalizados com valor atual se não existirem
      prev.customAttributes.forEach((attrName) => {
        if (!finalAttributes[attrName]) {
          // Usar o valor atual do atributo ou 1 como padrão
          finalAttributes[attrName] = prev.attributes[attrName] || 1
        }
      })
      
      // Somar bônus de itens para TODOS os atributos (incluindo personalizados)
      Object.keys(itemAttributes).forEach((key) => {
        finalAttributes[key] = (finalAttributes[key] || 0) + itemAttributes[key]
      })
      
      // Somar bônus de títulos para TODOS os atributos (incluindo personalizados)
      Object.keys(titleAttributes).forEach((key) => {
        finalAttributes[key] = (finalAttributes[key] || 0) + titleAttributes[key]
      })
      
      // Aplicar atributos manuais por último (sobrescrevem os calculados)
      Object.keys(manualAttributes).forEach((key) => {
        finalAttributes[key] = manualAttributes[key]
      })
      
      console.log('Atributos após somar bônus:', finalAttributes)
      console.log('Atributos manuais:', manualAttributes)
      console.log('Atributos finais:', finalAttributes)
      
      return {
        ...prev,
        attributes: finalAttributes,
        totalAbilities: abilities.length,
        titles: prev.titles.filter((t) => titles.some((x) => x.id === t.id)),
      }
    })
  }, [abilities, items, titles])

  useEffect(() => {
    const experienceNeeded = profile.level * 100
    if (profile.experience >= experienceNeeded) {
      setProfile((prev) => ({
        ...prev,
        level: prev.level + 1,
        experience: prev.experience - experienceNeeded,
      }))
      toast({
        title: "Level Up!",
        description: `Você alcançou o nível ${profile.level + 1}!`,
      })
    }
  }, [profile.experience, profile.level, toast])

  const addManga = (manga: Omit<Manga, "id" | "dateAdded">) => {
    const newManga: Manga = {
      ...manga,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString(),
    }

    setMangas((prev) => [...prev, newManga])
    setProfile((prev) => ({
      ...prev,
      totalMangasRead: prev.totalMangasRead + 1,
    }))

    addNotification({
      type: "success",
      title: "📚 Manga Adicionado!",
      description: `${manga.title} foi adicionado à sua biblioteca.`,
    })
  }

  const addAbility = (ability: Omit<Ability, "id" | "level" | "sources">, mangaId: string) => {
    const newAbility: Ability = {
      ...ability,
      id: Date.now().toString(),
      level: 1,
      sources: [mangaId],
    }

    setAbilities((prev) => [...prev, newAbility])

    toast({
      title: "Nova Habilidade!",
      description: `Você adquiriu ${ability.name}!`,
    })
  }

  const addItem = (item: Omit<Item, "id">, mangaId: string) => {
    const newItem: Item = {
      ...item,
      id: Date.now().toString(),
      source: mangaId,
    }

    setItems((prev) => [...prev, newItem])

    toast({
      title: "Novo Item!",
      description: `Você adquiriu ${item.name}!`,
    })
  }

  const addTitle = (title: Omit<Title, "id">, mangaId: string) => {
    const newTitle: Title = {
      ...title,
      id: Date.now().toString(),
      source: mangaId,
      active: true,
    }

    setTitles((prev) => [...prev, newTitle])

    toast({
      title: "Novo Título!",
      description: `Você conquistou o título: ${title.name}!`,
    })
  }

  const toggleTitle = (titleId: string) => {
    setTitles((prev) => 
      prev.map((title) => 
        title.id === titleId 
          ? { ...title, active: !title.active }
          : title
      )
    )
  }

  const editTitle = (titleId: string, updatedTitle: Partial<Title>) => {
    setTitles((prev) => 
      prev.map((title) => 
        title.id === titleId 
          ? { ...title, ...updatedTitle }
          : title
      )
    )
    
    toast({
      title: "Título atualizado!",
      description: "O título foi atualizado com sucesso.",
    })
  }

  const deleteTitle = (titleId: string) => {
    setTitles((prev) => prev.filter((title) => title.id !== titleId))
    
    toast({
      title: "Título removido!",
      description: "O título foi removido com sucesso.",
    })
  }

  const addCustomAttribute = (attributeName: string) => {
    if (!profile.customAttributes.includes(attributeName)) {
      setProfile((prev) => ({
        ...prev,
        customAttributes: [...prev.customAttributes, attributeName],
        attributes: {
          ...prev.attributes,
          [attributeName]: 1,
        },
      }))
      toast({
        title: "Novo Atributo!",
        description: `Atributo ${attributeName} adicionado!`,
      })
    }
  }

  const updateAttribute = (attributeName: string, value: number) => {
    setProfile((prev) => {
      const updatedProfile = {
        ...prev,
        attributes: {
          ...prev.attributes,
          [attributeName]: Math.max(0, value),
        },
      }
      
      // Se for um atributo base ou customizado, marcar como editado manualmente
      if (["strength", "agility", "intelligence", "vitality", "luck"].includes(attributeName) || 
          prev.customAttributes.includes(attributeName)) {
        if (!updatedProfile.manualAttributes) {
          updatedProfile.manualAttributes = []
        }
        if (!updatedProfile.manualAttributes.includes(attributeName)) {
          updatedProfile.manualAttributes.push(attributeName)
        }
      }
      
      return updatedProfile
    })
  }

  const removeCustomAttribute = (attributeName: string) => {
    if (["strength", "agility", "intelligence", "vitality", "luck"].includes(attributeName)) {
      toast({
        title: "Erro!",
        description: "Não é possível remover atributos base.",
        variant: "destructive",
      })
      return
    }

    setProfile((prev) => {
      const newAttributes = { ...prev.attributes }
      delete newAttributes[attributeName]
      
      return {
        ...prev,
        customAttributes: prev.customAttributes.filter(attr => attr !== attributeName),
        attributes: newAttributes,
      }
    })
    
    toast({
      title: "Atributo Removido!",
      description: `Atributo ${attributeName} foi removido.`,
    })
  }

  const resetManualAttribute = (attributeName: string) => {
    setProfile((prev) => ({
      ...prev,
      manualAttributes: prev.manualAttributes?.filter(attr => attr !== attributeName) || []
    }))
    
    toast({
      title: "Atributo resetado!",
      description: `Atributo ${attributeName} voltará a ser calculado automaticamente!`,
    })
  }

  const resetProfile = () => {
    console.log('Resetando perfil...')
    const defaultProfile: UserProfile = {
      name: userName,
      level: 1,
      experience: 0,
      totalMangasRead: 0,
      totalAbilities: 0,
      attributes: {
        strength: 1,
        agility: 1,
        intelligence: 1,
        vitality: 1,
        luck: 1,
      },
      customAttributes: [],
      manualAttributes: [],
      titles: [],
    }
    
    setProfile(defaultProfile)
    setMangas([])
    setAbilities([])
    setItems([])
    setTitles([])
    
    toast({
      title: "Perfil resetado!",
      description: "Seu nível foi resetado para 1 e XP para 0.",
    })
  }

  const addExperience = (amount: number) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience + amount,
    }))
  }

  const removeExperience = (amount: number) => {
    setProfile((prev) => {
      const newExperience = prev.experience - Math.max(0, amount)
      
      // Se o XP ficou negativo, regredir de nível
      if (newExperience < 0 && prev.level > 1) {
        const experienceNeeded = (prev.level - 1) * 100
        const finalExperience = experienceNeeded + newExperience
        
        // Usar setTimeout para chamar toast após o setState
        setTimeout(() => {
          toast({
            title: "Level Down!",
            description: `Você regrediu para o nível ${prev.level - 1}!`,
          })
        }, 0)
        
        return {
          ...prev,
          level: prev.level - 1,
          experience: Math.max(0, finalExperience),
        }
      }
      
      return {
        ...prev,
        experience: Math.max(0, newExperience),
      }
    })
  }

  const removeManga = (id: string) => {
    setMangas((prev) => prev.filter((m) => m.id !== id))
    setAbilities((prev) => prev.filter((a) => !a.sources.includes(id)))
    setItems((prev) => prev.filter((i) => i.source !== id))
    setTitles((prev) => prev.filter((t) => t.source !== id))

    // Also ensure derived totals reflect removal
    setProfile((prev) => ({
      ...prev,
      totalMangasRead: Math.max(0, prev.totalMangasRead - 1),
    }))
  }

  const updateMangaEpisode = (mangaId: string, episode: number) => {
    setMangas((prev) =>
      prev.map((manga) =>
        manga.id === mangaId ? { ...manga, currentEpisode: episode } : manga
      )
    )
    
    addNotification({
      type: "success",
      title: "📖 Episódio Atualizado!",
      description: `Episódio atual definido como ${episode}.`,
    })
  }

  const incrementEpisode = (mangaId: string) => {
    setMangas((prev) =>
      prev.map((manga) => {
        if (manga.id === mangaId) {
          const newEpisode = (manga.currentEpisode || 0) + 1
          return { ...manga, currentEpisode: newEpisode }
        }
        return manga
      })
    )
    
    // Ganha 10 XP por episódio lido
    addExperience(10)
    
    addNotification({
      type: "success",
      title: "📈 Episódio Avançado!",
      description: "Você avançou para o próximo episódio! +10 XP",
    })
  }

  const decrementEpisode = (mangaId: string) => {
    setMangas((prev) =>
      prev.map((manga) => {
        if (manga.id === mangaId) {
          const currentEp = manga.currentEpisode || 0
          const newEpisode = Math.max(0, currentEp - 1)
          
          return { ...manga, currentEpisode: newEpisode }
        }
        return manga
      })
    )
    
    // Sempre remove XP, mesmo se episódio já estiver em 0
    removeExperience(10)
    
    addNotification({
      type: "info",
      title: "📉 Episódio Retrocedido!",
      description: "Você voltou para o episódio anterior. -10 XP",
    })
  }

  const editAbility = (abilityId: string, updatedAbility: Partial<Ability>) => {
    setAbilities((prev) =>
      prev.map((ability) =>
        ability.id === abilityId ? { ...ability, ...updatedAbility } : ability
      )
    )
    toast({
      title: "Habilidade Editada!",
      description: "A habilidade foi atualizada com sucesso.",
    })
  }

  const deleteAbility = (abilityId: string) => {
    setAbilities((prev) => prev.filter((ability) => ability.id !== abilityId))
    toast({
      title: "Habilidade Excluída!",
      description: "A habilidade foi removida permanentemente.",
    })
  }

  const editItem = (itemId: string, updatedItem: Partial<Item>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, ...updatedItem } : item
      )
    )
    toast({
      title: "Item Editado!",
      description: "O item foi atualizado com sucesso.",
    })
  }

  const deleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
    toast({
      title: "Item Excluído!",
      description: "O item foi removido permanentemente.",
    })
  }

  const getMangaById = (id: string) => mangas.find((m) => m.id === id)

  const exportData = () => {
    console.log("Exportando mangás:", mangas.map(m => ({ title: m.title, currentEpisode: m.currentEpisode })))
    console.log("Exportando títulos:", titles.map(t => ({ name: t.name, active: t.active, effects: t.effects })))
    const payload = {
      profile: { ...profile, name: userName },
      mangas,
      abilities,
      items,
      titles,
      version: 1,
      exportedAt: new Date().toISOString(),
    }
    return JSON.stringify(payload, null, 2)
  }

  const importData = (json: string) => {
    try {
      const data = JSON.parse(json)
      if (!data || typeof data !== "object") return false
      if (!Array.isArray(data.mangas) || !Array.isArray(data.abilities) || !Array.isArray(data.items) || !Array.isArray(data.titles)) return false

      setProfile((prev) => ({ 
        ...prev, 
        ...(data.profile || {}), 
        name: userName,
        manualAttributes: data.profile?.manualAttributes || []
      }))
      setMangas(data.mangas)
      setAbilities(data.abilities)
      setItems(data.items)
      // Garantir que títulos importados sejam ativos por padrão
      const titlesWithActive = data.titles.map((title: Title) => ({
        ...title,
        active: title.active !== undefined ? title.active : true
      }))
      console.log("Títulos importados:", titlesWithActive.map(t => ({ name: t.name, active: t.active, effects: t.effects })))
      setTitles(titlesWithActive)
      
      // Forçar recálculo dos atributos após importação
      setTimeout(() => {
        console.log("Forçando recálculo dos atributos após importação")
        // Trigger recalculation by updating a dummy state
        setProfile(prev => ({ ...prev }))
      }, 100)
      
      console.log("Dados importados:", data.mangas)
      console.log("Episódios dos mangás:", data.mangas.map(m => ({ title: m.title, currentEpisode: m.currentEpisode })))
      return true
    } catch (error) {
      console.error("Erro na importação:", error)
      return false
    }
  }

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { ...notification, id }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <IsekaiContext.Provider
      value={{
        profile,
        mangas,
        abilities,
        items,
        titles,
        notifications,
        addManga,
        addAbility,
        editAbility,
        deleteAbility,
        addItem,
        editItem,
        deleteItem,
        addTitle,
        editTitle,
        deleteTitle,
        toggleTitle,
        addCustomAttribute,
        updateAttribute,
        removeCustomAttribute,
        resetManualAttribute,
        resetProfile,
        addExperience,
        removeExperience,
        removeManga,
        getMangaById,
        updateMangaEpisode,
        incrementEpisode,
        decrementEpisode,
        exportData,
        importData,
        addNotification,
        removeNotification,
      }}
    >
      {children}
      <NotificationManager 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </IsekaiContext.Provider>
  )
}

export function useIsekai() {
  const context = useContext(IsekaiContext)
  if (!context) {
    throw new Error("useIsekai must be used within IsekaiProvider")
  }
  return context
}
