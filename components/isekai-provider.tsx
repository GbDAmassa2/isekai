"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import type { Manga, Ability, Item, Title, UserProfile } from "@/lib/isekai-types"
import { calculateTotalAttributes } from "@/lib/isekai-types"
import { useToast } from "@/hooks/use-toast"
import { NotificationManager } from "./animated-notification"
import { getMangaRewards, getMangaRewardsByTitle, getRewardId, getRewardsToRemove, getPendingRewards, getAllMangaRewards, getAllMangaRewardsByTitle, type MangaReward } from "@/lib/manga-rewards"

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
  collectedRewards: string[]
  addManga: (manga: Omit<Manga, "id" | "dateAdded">) => void
  addAbility: (ability: Omit<Ability, "id" | "level" | "sources">, mangaId: string, silent?: boolean) => void
  editAbility: (abilityId: string, updatedAbility: Partial<Ability>) => void
  deleteAbility: (abilityId: string) => void
  addItem: (item: Omit<Item, "id">, mangaId: string, silent?: boolean) => void
  editItem: (itemId: string, updatedItem: Partial<Item>) => void
  deleteItem: (itemId: string) => void
  addTitle: (title: Omit<Title, "id">, mangaId: string, silent?: boolean) => void
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
  clearCollectedRewards: () => void
  syncMangaRewards: (mangaId: string) => Promise<void>
}

const IsekaiContext = createContext<IsekaiContextType | undefined>(undefined)

interface IsekaiProviderProps {
  children: ReactNode
  userName: string
}

export function IsekaiProvider({ children, userName }: IsekaiProviderProps) {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  // Contador para garantir IDs únicos mesmo em execuções simultâneas
  const idCounter = useRef(0)
  
  // Função para gerar IDs únicos mais robustos
  const generateUniqueId = () => {
    idCounter.current += 1
    return `${Date.now()}-${idCounter.current}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`
  }
  
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
  const [collectedRewards, setCollectedRewards] = useState<string[]>([])
  const [syncingRewards, setSyncingRewards] = useState<Set<string>>(new Set())
  const [lastNotificationTime, setLastNotificationTime] = useState<Record<string, number>>({})

  // Utilitário: possíveis IDs de recompensa derivados do título
  const getPossibleRewardPrefixesFromTitle = (title: string) => {
    const base = title.toLowerCase()
    return [
      base,
      base.replace(/\s+/g, '-'),
      base.replace(/\s+/g, '_'),
    ]
  }

  useEffect(() => {
    const userKey = `isekai-data-${userName}`
    const savedData = localStorage.getItem(userKey)

    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        if (data.profile) {
          setProfile({ ...data.profile, name: userName })
        }
        if (data.mangas) {
          // Remover duplicatas por ID ao carregar
          const uniqueMangas = data.mangas.filter((manga: Manga, index: number, self: Manga[]) => 
            index === self.findIndex(m => m.id === manga.id)
          )
          setMangas(uniqueMangas)
        }
        if (data.abilities) {
          // Remover duplicatas por ID ao carregar
          const uniqueAbilities = data.abilities.filter((ability: Ability, index: number, self: Ability[]) => 
            index === self.findIndex(a => a.id === ability.id)
          )
          setAbilities(uniqueAbilities)
        }
        if (data.items) {
          // Remover duplicatas por ID ao carregar
          const uniqueItems = data.items.filter((item: Item, index: number, self: Item[]) => 
            index === self.findIndex(i => i.id === item.id)
          )
          setItems(uniqueItems)
        }
        if (data.titles) {
          // Remover duplicatas por ID ao carregar
          const uniqueTitles = data.titles.filter((title: Title, index: number, self: Title[]) => 
            index === self.findIndex(t => t.id === title.id)
          )
          setTitles(uniqueTitles)
        }
        if (data.collectedRewards) setCollectedRewards(data.collectedRewards)
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
        titles,
        collectedRewards
      }
      localStorage.setItem(userKey, JSON.stringify(data))
    }
  }, [profile, mangas, abilities, items, titles, collectedRewards, userName])


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
    const newId = generateUniqueId()
    const newManga: Manga = {
      ...manga,
      id: newId,
      dateAdded: new Date().toISOString(),
    }

    setMangas((prev) => {
      // Verificar se não há ID duplicado
      if (prev.some(m => m.id === newId)) {
        console.warn('ID duplicado detectado para manga, regenerando...', newId)
        newManga.id = generateUniqueId()
      }
      return [...prev, newManga]
    })
    setProfile((prev) => ({
      ...prev,
      totalMangasRead: prev.totalMangasRead + 1,
    }))

    // Ao adicionar um mangá (recomeço), limpamos recompensas coletadas antigas desse título
    const prefixes = getPossibleRewardPrefixesFromTitle(manga.title)
    setCollectedRewards((prev) => prev.filter((rid) => !prefixes.some((p) => rid.startsWith(`${p}-`))))

    // Calcular XP baseado no episódio atual (10 XP por episódio)
    const xpGained = manga.currentEpisode ? manga.currentEpisode * 10 : 0
    if (xpGained > 0) {
      addExperience(xpGained)
    }

    addNotification({
      type: "success",
      title: "📚 Manga Adicionado!",
      description: `${manga.title} foi adicionado à sua biblioteca.${xpGained > 0 ? ` +${xpGained} XP` : ''}`,
    })
  }

  const addAbility = (ability: Omit<Ability, "id" | "level" | "sources">, mangaId: string, silent: boolean = false) => {
    setAbilities((prev) => {
      // Verificar se a habilidade já existe (mesmo nome e mesma fonte)
      const alreadyExists = prev.some(existingAbility => 
        existingAbility.name === ability.name && 
        existingAbility.sources.includes(mangaId)
      )
      
      if (alreadyExists) {
        return prev
      }
      
      const newId = generateUniqueId()
      const newAbility: Ability = {
        ...ability,
        id: newId,
        level: 1,
        sources: [mangaId],
      }
      
      // Verificar se não há ID duplicado (backup adicional)
      if (prev.some(a => a.id === newId)) {
        console.warn('ID duplicado detectado para habilidade, regenerando...', newId)
        newAbility.id = generateUniqueId()
      }
      
      return [...prev, newAbility]
    })

    if (!silent) {
      toast({
        title: "Nova Habilidade!",
        description: `Você adquiriu ${ability.name}!`,
      })
    }
  }

  const addItem = (item: Omit<Item, "id">, mangaId: string, silent: boolean = false) => {
    const newId = generateUniqueId()
    const newItem: Item = {
      ...item,
      id: newId,
      source: mangaId,
    }

    setItems((prev) => {
      // Verificar se não há ID duplicado
      if (prev.some(i => i.id === newId)) {
        console.warn('ID duplicado detectado para item, regenerando...', newId)
        newItem.id = generateUniqueId()
      }
      return [...prev, newItem]
    })

    if (!silent) {
      toast({
        title: "Novo Item!",
        description: `Você adquiriu ${item.name}!`,
      })
    }
  }

  const addTitle = (title: Omit<Title, "id">, mangaId: string, silent: boolean = false) => {
    const newId = generateUniqueId()
    const newTitle: Title = {
      ...title,
      id: newId,
      source: mangaId,
      active: true,
    }

    setTitles((prev) => {
      // Verificar se não há ID duplicado
      if (prev.some(t => t.id === newId)) {
        console.warn('ID duplicado detectado para título, regenerando...', newId)
        newTitle.id = generateUniqueId()
      }
      return [...prev, newTitle]
    })

    if (!silent) {
      toast({
        title: "Novo Título!",
        description: `Você conquistou o título: ${title.name}!`,
      })
    }
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
    setCollectedRewards([])
    
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

  const removeMangaExperience = (amount: number) => {
    setProfile((prev) => {
      const initialLevel = prev.level
      let currentLevel = prev.level
      let currentXp = prev.experience
      let xpToRemove = amount
      
      // Primeiro, remove do XP atual
      if (currentXp >= xpToRemove) {
        currentXp -= xpToRemove
        xpToRemove = 0
      } else {
        xpToRemove -= currentXp
        currentXp = 0
      }
      
      // Se ainda há XP para remover, começar a remover níveis
      while (xpToRemove > 0 && currentLevel > 1) {
        currentLevel--
        const xpForPreviousLevel = currentLevel * 100
        
        if (xpToRemove >= xpForPreviousLevel) {
          xpToRemove -= xpForPreviousLevel
        } else {
          // Coloca o XP restante no nível anterior
          currentXp = xpForPreviousLevel - xpToRemove
          xpToRemove = 0
        }
      }
      
      const levelsLost = initialLevel - currentLevel
      
      // Mostrar notificação se perdeu níveis
      if (levelsLost > 0) {
        setTimeout(() => {
          toast({
            title: "Level Down!",
            description: `Você regrediu ${levelsLost} nível(is)! Agora está no nível ${currentLevel}!`,
          })
        }, 0)
      }
      
      return {
        ...prev,
        level: currentLevel,
        experience: currentXp,
      }
    })
  }

  const removeManga = (id: string) => {
    // Encontrar o mangá antes de removê-lo para calcular o XP perdido
    const mangaToRemove = mangas.find((m) => m.id === id)
    const xpLost = mangaToRemove?.currentEpisode ? mangaToRemove.currentEpisode * 10 : 0
    
    setMangas((prev) => prev.filter((m) => m.id !== id))
    setAbilities((prev) => prev.filter((a) => !a.sources.includes(id)))
    setItems((prev) => prev.filter((i) => i.source !== id))
    setTitles((prev) => prev.filter((t) => t.source !== id))

    // Remover rewardIds ligados a este título (caso seja um recomeço posterior)
    const toRemovePrefixes = (() => {
      const m = mangas.find((x) => x.id === id)
      return m ? getPossibleRewardPrefixesFromTitle(m.title) : []
    })()
    if (toRemovePrefixes.length > 0) {
      setCollectedRewards((prev) => prev.filter((rid) => !toRemovePrefixes.some((p) => rid.startsWith(`${p}-`))))
    }

    // Remover XP baseado no episódio atual do mangá
    if (xpLost > 0) {
      removeMangaExperience(xpLost)
    }

    // Also ensure derived totals reflect removal
    setProfile((prev) => ({
      ...prev,
      totalMangasRead: Math.max(0, prev.totalMangasRead - 1),
    }))

    // Notificação sobre a remoção e perda de XP
    addNotification({
      type: "warning",
      title: "🗑️ Mangá Removido!",
      description: `${mangaToRemove?.title || 'Mangá'} foi removido da biblioteca.${xpLost > 0 ? ` -${xpLost} XP` : ''}`,
    })
  }

  // Função para processar recompensas de um mangá específico e episódio
  const processRewards = (mangaId: string, episode: number) => {
    // Primeiro tenta encontrar pelo ID, depois pelo título
    const manga = mangas.find(m => m.id === mangaId)
    if (!manga) return

    // PRIORIDADE 1: Buscar por título (mais confiável)
    let reward = getMangaRewardsByTitle(manga.title, episode)
    let rewardMangaId = reward ? reward.mangaId : mangaId

    // PRIORIDADE 2: Se não encontrou por título, tentar por ID (fallback)
    if (!reward) {
      // Tenta diferentes formas de identificar o mangá nas recompensas
      const possibleIds = [
        mangaId,
        manga.title.toLowerCase().replace(/\s+/g, '-'),
        manga.title.toLowerCase().replace(/\s+/g, '_'),
        manga.title.toLowerCase()
      ]

      for (const id of possibleIds) {
        reward = getMangaRewards(id, episode)
        if (reward) {
          rewardMangaId = id
          break
        }
      }
    }

    if (!reward) return

    // Usar callback para verificar com o estado mais recente
    setCollectedRewards(prevCollected => {
      // Verificar se já foi coletada usando o mangaId original da recompensa
      const correctRewardId = getRewardId(reward.mangaId, episode)
      const allPossibleRewardIds = possibleIds.map(id => getRewardId(id, episode))
      
      // Para debug: verificar se já foi coletada para este episódio específico
      const episodePattern = new RegExp(`-${episode}$`)
      const alreadyCollected = prevCollected.includes(correctRewardId) || 
                              allPossibleRewardIds.some(id => prevCollected.includes(id)) ||
                              prevCollected.some(id => episodePattern.test(id))
      
      if (alreadyCollected) {
        return prevCollected
      }

      // Usar o mangaId original do arquivo de recompensas para consistência
      const rewardId = correctRewardId

      // Processar recompensas imediatamente
      if (reward.rewards.experience) {
        addExperience(reward.rewards.experience)
      }

      if (reward.rewards.abilities) {
        reward.rewards.abilities.forEach(abilityData => {
          addAbility(abilityData, mangaId)
        })
      }

      if (reward.rewards.items) {
        reward.rewards.items.forEach(itemData => {
          addItem(itemData, mangaId)
        })
      }

      if (reward.rewards.titles) {
        reward.rewards.titles.forEach(titleData => {
          addTitle(titleData, mangaId)
        })
      }

      if (reward.rewards.attributes) {
        Object.entries(reward.rewards.attributes).forEach(([attr, value]) => {
          if (value) {
            console.log(`[DEBUG] processRewards - aplicando atributo ${attr}: +${value}`)
            setProfile((prev) => {
              const newValue = Math.max(1, (prev.attributes[attr] || 1) + value)
              console.log(`[DEBUG] processRewards - ${attr}: ${prev.attributes[attr] || 1} -> ${newValue}`)
              return {
                ...prev,
                attributes: {
                  ...prev.attributes,
                  [attr]: newValue,
                },
              }
            })
          }
        })
      }

      // Notificação de recompensa
      addNotification({
        type: "success",
        title: "🎁 Recompensa Desbloqueada!",
        description: `Você recebeu recompensas por ler o capítulo ${episode} de ${reward.mangaTitle}!`,
      })

      return [...prevCollected, rewardId]
    })
  }

  // Função para processar todas as recompensas pendentes (capítulos anteriores não coletados)
  const processPendingRewards = (mangaId: string, currentEpisode: number, excludeCurrentEpisode: boolean = false) => {
    // Primeiro tenta encontrar pelo ID, depois pelo título
    const manga = mangas.find(m => m.id === mangaId)
    if (!manga) return

    // Tenta diferentes formas de identificar o mangá nas recompensas
    const possibleIds = [
      mangaId,
      manga.title.toLowerCase().replace(/\s+/g, '-'),
      manga.title.toLowerCase().replace(/\s+/g, '_'),
      manga.title.toLowerCase()
    ]

    // Usar callback para garantir que temos o estado mais recente
    setCollectedRewards(prevCollected => {
      let pendingRewards: MangaReward[] = []
      let rewardMangaId = mangaId

      for (const id of possibleIds) {
        pendingRewards = getPendingRewards(id, currentEpisode, prevCollected)
        if (pendingRewards.length > 0) {
          rewardMangaId = id
          break
        }
      }

      // Se deve excluir o episódio atual, filtrar ele das recompensas pendentes
      if (excludeCurrentEpisode) {
        pendingRewards = pendingRewards.filter(reward => reward.episode < currentEpisode)
      }

      if (pendingRewards.length === 0) return prevCollected

      let newCollectedRewards = [...prevCollected]
      
      // Contadores para a notificação
      let abilitiesAdded = 0
      let itemsAdded = 0
      let titlesAdded = 0
      let experienceAdded = 0
      let attributesAdded = 0
      
      // Acumular atributos para aplicar tudo de uma vez
      const attributesToAdd: Record<string, number> = {}

      // Processar cada recompensa pendente em ordem de capítulo
      pendingRewards.sort((a, b) => a.episode - b.episode).forEach(reward => {
        // Verificar com todos os possíveis IDs para evitar duplicação
        const allPossibleRewardIds = possibleIds.map(id => getRewardId(id, reward.episode))
        
        // Verificar se já foi coletada usando o estado original
        const alreadyCollected = allPossibleRewardIds.some(id => prevCollected.includes(id)) || 
                                allPossibleRewardIds.some(id => newCollectedRewards.includes(id))
        
        if (alreadyCollected) return

        // Usar o mangaId original para consistência
        const rewardId = getRewardId(mangaId, reward.episode)

        // Adicionar às recompensas coletadas
        newCollectedRewards.push(rewardId)

        // Processar recompensas
        if (reward.rewards.experience) {
          experienceAdded += reward.rewards.experience
          addExperience(reward.rewards.experience)
        }

        if (reward.rewards.abilities) {
          abilitiesAdded += reward.rewards.abilities.length
          reward.rewards.abilities.forEach(abilityData => {
            addAbility(abilityData, mangaId, true) // Silent mode
          })
        }

        if (reward.rewards.items) {
          itemsAdded += reward.rewards.items.length
          reward.rewards.items.forEach(itemData => {
            addItem(itemData, mangaId, true) // Silent mode
          })
        }

        if (reward.rewards.titles) {
          titlesAdded += reward.rewards.titles.length
          reward.rewards.titles.forEach(titleData => {
            addTitle(titleData, mangaId, true) // Silent mode
          })
        }

        if (reward.rewards.attributes) {
          Object.entries(reward.rewards.attributes).forEach(([attr, value]) => {
            if (value) {
              attributesAdded += value
              // Acumular atributos em vez de aplicar imediatamente
              attributesToAdd[attr] = (attributesToAdd[attr] || 0) + value
            }
          })
        }
      })

      // Aplicar todos os atributos acumulados de uma vez (com verificação anti-duplicação)
      if (Object.keys(attributesToAdd).length > 0) {
        console.log(`[DEBUG] Tentando aplicar atributos (processPendingRewards): ${JSON.stringify(attributesToAdd)}`)
        setProfile((prev) => {
          const updatedAttributes = { ...prev.attributes }
          let hasChanges = false
          
          Object.entries(attributesToAdd).forEach(([attr, value]) => {
            const currentValue = updatedAttributes[attr] || 1
            const newValue = Math.max(1, currentValue + value)
            if (newValue !== currentValue) {
              updatedAttributes[attr] = newValue
              hasChanges = true
              console.log(`[DEBUG] ${attr}: ${currentValue} -> ${newValue} (+${value})`)
            }
          })
          
          if (!hasChanges) {
            console.log(`[DEBUG] Nenhuma mudança nos atributos detectada, mantendo estado atual`)
            return prev
          }
          
          console.log(`[DEBUG] Atributos atualizados (processPendingRewards): ${JSON.stringify(updatedAttributes)}`)
          return {
            ...prev,
            attributes: updatedAttributes
          }
        })
      }

      // Mostrar notificação consolidada com os totais (se houver itens)
      if (pendingRewards.length > 0 && (abilitiesAdded > 0 || itemsAdded > 0 || titlesAdded > 0 || experienceAdded > 0 || attributesAdded > 0)) {
        const messageParts = []
        if (abilitiesAdded > 0) messageParts.push(`${abilitiesAdded} habilidade${abilitiesAdded > 1 ? 's' : ''}`)
        if (itemsAdded > 0) messageParts.push(`${itemsAdded} item${itemsAdded > 1 ? 's' : ''}`)
        if (titlesAdded > 0) messageParts.push(`${titlesAdded} título${titlesAdded > 1 ? 's' : ''}`)
        if (experienceAdded > 0) messageParts.push(`${experienceAdded} XP`)
        if (attributesAdded > 0) messageParts.push(`${attributesAdded} pontos de atributo${attributesAdded > 1 ? 's' : ''}`)

        const message = messageParts.join(', ')

        addNotification({
          type: "success",
          title: "🎁 Você ganhou!",
          description: message
        })
      }

      return newCollectedRewards
    })
  }

  // Função para remover recompensas quando volta a um capítulo anterior
  const removeRewards = (mangaId: string, currentEpisode: number) => {
    // Primeiro tenta encontrar pelo ID, depois pelo título
    const manga = mangas.find(m => m.id === mangaId)
    if (!manga) return

    // Tenta diferentes formas de identificar o mangá nas recompensas
    const possibleIds = [
      mangaId,
      manga.title.toLowerCase().replace(/\s+/g, '-'),
      manga.title.toLowerCase().replace(/\s+/g, '_'),
      manga.title.toLowerCase()
    ]

    let rewardsToRemove: MangaReward[] = []
    let rewardMangaId = mangaId

    for (const id of possibleIds) {
      rewardsToRemove = getRewardsToRemove(id, currentEpisode)
      if (rewardsToRemove.length > 0) {
        rewardMangaId = id
        break
      }
    }

    if (rewardsToRemove.length === 0) return

    // Usar callback para garantir que temos o estado mais recente
    setCollectedRewards(prevCollected => {
      const rewardsToActuallyRemove = rewardsToRemove.filter(reward => {
        const rewardId = getRewardId(rewardMangaId, reward.episode)
        return prevCollected.includes(rewardId)
      })

      if (rewardsToActuallyRemove.length === 0) return prevCollected

      // Processar cada recompensa que precisa ser removida
      rewardsToActuallyRemove.forEach(reward => {
        const rewardId = getRewardId(rewardMangaId, reward.episode)
        
        // Remove da lista de recompensas coletadas
        // Remover habilidades (só remove se vieram exatamente deste mangá e capítulo)
        if (reward.rewards.abilities) {
          reward.rewards.abilities.forEach(abilityData => {
            setAbilities(prev => prev.filter(ability => 
              !(ability.name === abilityData.name && 
                ability.sources.includes(mangaId) &&
                ability.level === abilityData.level)
            ))
          })
        }

        // Remover itens (só remove se vieram exatamente deste mangá)
        if (reward.rewards.items) {
          reward.rewards.items.forEach(itemData => {
            setItems(prev => prev.filter(item => 
              !(item.name === itemData.name && item.source === mangaId)
            ))
          })
        }

        // Remover títulos (só remove se vieram exatamente deste mangá)
        if (reward.rewards.titles) {
          reward.rewards.titles.forEach(titleData => {
            setTitles(prev => prev.filter(title => 
              !(title.name === titleData.name && title.source === mangaId)
            ))
          })
        }

        // Remover atributos (se possível - isso é mais complexo porque pode ter outras fontes)
        if (reward.rewards.attributes) {
          Object.entries(reward.rewards.attributes).forEach(([attr, value]) => {
            if (value) {
              // Só remove se for um atributo customizado, não os base
              if (attr in profile.attributes) {
                setProfile(prev => ({
                  ...prev,
                  attributes: {
                    ...prev.attributes,
                    [attr]: Math.max(1, prev.attributes[attr] - value)
                  }
                }))
              }
            }
          })
        }

        // Remover experiência se houver
        if (reward.rewards.experience) {
          removeExperience(reward.rewards.experience)
        }

        // Notificação de remoção
        addNotification({
          type: "warning",
          title: "🔄 Recompensas Removidas!",
          description: `Recompensas do capítulo ${reward.episode} de ${reward.mangaTitle} foram removidas por retroceder.`,
        })
      })

      // Retornar o novo estado sem as recompensas removidas
      return prevCollected.filter(id => {
        return !rewardsToActuallyRemove.some(reward => {
          const rewardId = getRewardId(rewardMangaId, reward.episode)
          return id === rewardId
        })
      })
    })
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
    let newEpisode = 0
    
    setMangas((prev) =>
      prev.map((manga) => {
        if (manga.id === mangaId) {
          newEpisode = (manga.currentEpisode || 0) + 1
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
    let newEpisode = 0
    let previousEpisode = 0
    
    setMangas((prev) =>
      prev.map((manga) => {
        if (manga.id === mangaId) {
          previousEpisode = manga.currentEpisode || 0
          newEpisode = Math.max(0, previousEpisode - 1)
          
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
    const now = Date.now()
    
    // Não aplicar rate limiting para notificações importantes como episódios
    const shouldSkipRateLimit = [
      "📈 Episódio Avançado!",
      "📉 Episódio Retrocedido!", 
      "📖 Episódio Atualizado!",
      "🔄 Sincronização Concluída!",
      "🎁 Recompensa Desbloqueada!",
      "🔄 Recompensas Removidas!"
    ].includes(notification.title)
    
    if (!shouldSkipRateLimit) {
      const notificationKey = `${notification.type}-${notification.title}`
      const lastTime = lastNotificationTime[notificationKey] || 0
      const minInterval = 1000 // 1 segundo apenas para notificações menos importantes
      
      // Evitar spam apenas para notificações não importantes
      if (now - lastTime < minInterval) {
        return
      }
      
      // Atualizar timestamp apenas se aplicou rate limiting
      setLastNotificationTime(prev => ({
        ...prev,
        [notificationKey]: now
      }))
    }
    
    const id = generateUniqueId()
    
    setNotifications(prev => {
      const newNotifications = [...prev, { ...notification, id }]
      // Manter apenas as 3 notificações mais recentes
      return newNotifications.slice(-3)
    })
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Função para sincronizar recompensas de um mangá específico (NOVA VERSÃO COM API)
  const syncMangaRewards = async (mangaId: string) => {
    const manga = mangas.find(m => m.id === mangaId)
    if (!manga || manga.currentEpisode <= 0) return

    // Evitar múltiplas execuções simultâneas
    if (syncingRewards.has(mangaId)) {
      console.log(`[DEBUG] Já sincronizando ${manga.title}, ignorando...`)
      return
    }

    setSyncingRewards(prev => new Set(prev).add(mangaId))

    try {
      // 1. Chama a API de backend, enviando o contexto necessário
      const response = await fetch('/api/rewards/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mangaId, 
          mangaTitle: manga.title,
          currentEpisode: manga.currentEpisode,
          collectedRewards: collectedRewards
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao sincronizar recompensas')
      }

      // 2. A API já fez todo o trabalho pesado (filtrar, etc.)
      // 'data.appliedRewards' contém apenas as recompensas que o usuário acabou de ganhar.
      const newRewards = data.appliedRewards || []

      if (newRewards.length > 0) {
        console.log(`[DEBUG] Processando ${newRewards.length} recompensas novas para ${manga.title}`)

        // 3. Contadores para a notificação
        let abilitiesAdded = 0
        let itemsAdded = 0
        let titlesAdded = 0
        let experienceAdded = 0
        const newCollectedRewards = [...collectedRewards]

        // 4. Aplica as novas recompensas ao estado (lógica que você já tem!)
        newRewards.forEach((reward: any) => {
          const rewardId = `${reward.mangaId}-${reward.episode}`

          // Adicionar experiência
          if (reward.rewards.experience) {
            experienceAdded += reward.rewards.experience
            addExperience(reward.rewards.experience)
          }

          // Adicionar habilidades (apenas se ainda não tiver)
          if (reward.rewards.abilities) {
            reward.rewards.abilities.forEach((abilityData: any) => {
              const alreadyHas = abilities.some(a => a.name === abilityData.name && a.sources.includes(mangaId))
              if (!alreadyHas) {
                addAbility(abilityData, mangaId, true) // Silent mode
                abilitiesAdded += 1
              }
            })
          }

          // Adicionar itens (apenas se ainda não tiver)
          if (reward.rewards.items) {
            reward.rewards.items.forEach((itemData: any) => {
              const alreadyHas = items.some(i => i.name === itemData.name && i.source === mangaId)
              if (!alreadyHas) {
                addItem(itemData, mangaId, true) // Silent mode
                itemsAdded += 1
              }
            })
          }

          // Adicionar títulos (apenas se ainda não tiver)
          if (reward.rewards.titles) {
            reward.rewards.titles.forEach((titleData: any) => {
              const alreadyHas = titles.some(t => t.name === titleData.name && t.source === mangaId)
              if (!alreadyHas) {
                addTitle(titleData, mangaId, true) // Silent mode
                titlesAdded += 1
              }
            })
          }

          // Adicionar atributos (se necessário, você pode implementar uma função addAttributes)
          if (reward.rewards.attributes) {
            // Implementar lógica para adicionar atributos se necessário
            console.log(`[DEBUG] Atributos recebidos:`, reward.rewards.attributes)
          }

          // Marcar como coletada
          if (!newCollectedRewards.includes(rewardId)) {
            newCollectedRewards.push(rewardId)
          }
        })

        // 5. Atualizar estado das recompensas coletadas
        setCollectedRewards(newCollectedRewards)

        // 6. Mostrar notificação consolidada
        if (abilitiesAdded > 0 || itemsAdded > 0 || titlesAdded > 0 || experienceAdded > 0) {
          const messageParts = []
          if (abilitiesAdded > 0) messageParts.push(`${abilitiesAdded} habilidade${abilitiesAdded > 1 ? 's' : ''}`)
          if (itemsAdded > 0) messageParts.push(`${itemsAdded} item${itemsAdded > 1 ? 's' : ''}`)
          if (titlesAdded > 0) messageParts.push(`${titlesAdded} título${titlesAdded > 1 ? 's' : ''}`)
          if (experienceAdded > 0) messageParts.push(`${experienceAdded} XP`)

          const message = messageParts.join(', ')

          addNotification({
            type: "success",
            title: "🎁 Você ganhou!",
            description: message
          })
        }
      } else {
        console.log(`[DEBUG] Nenhuma recompensa nova encontrada para ${manga.title}`)
      }

    } catch (error) {
      console.error("Erro ao sincronizar recompensas:", error)
      addNotification({
        type: "error",
        title: "❌ Erro na Sincronização",
        description: "Não foi possível sincronizar as recompensas. Tente novamente."
      })
    } finally {
      // Limpar estado de sincronização
      setSyncingRewards(prev => {
        const newSet = new Set(prev)
        newSet.delete(mangaId)
        return newSet
      })
    }
  }

  // Função temporária para debug - limpar recompensas coletadas
  const clearCollectedRewards = () => {
    console.log(`[DEBUG] Limpando recompensas coletadas:`, collectedRewards)
    setCollectedRewards([])
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
        collectedRewards,
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
        clearCollectedRewards,
        syncMangaRewards,
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
