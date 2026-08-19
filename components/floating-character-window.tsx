"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Modal, ModalSection, ModalGrid, ModalCard } from "@/components/ui/modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsekai } from "./isekai-provider"
import { useIsMobile } from "@/hooks/use-mobile"
import { AddMangaDialog } from "./add-manga-dialog"
import { AddContentDialog } from "./add-content-dialog"
import { EditAbilityDialog } from "./edit-ability-dialog"
import { EditItemIsekaiDialog } from "./edit-item-isekai-dialog"
import { EditAttributesDialog } from "./edit-attributes-dialog"
import { EditMangaDialog } from "./edit-manga-dialog"
import { 
  Heart, 
  Droplet, 
  Wind, 
  Star, 
  TrendingUp, 
  Zap, 
  Package, 
  Award, 
  Settings, 
  BookOpen, 
  Sparkles, 
  Plus, 
  Minus,
  Edit, 
  Trash2, 
  ExternalLink, 
  ChevronUp, 
  ChevronDown, 
  Hash, 
  LogOut, 
  User,
  Trophy,
  X,
  Search,
  RefreshCw,
  Copy,
  Lock,
  LockOpen,
  Target,
  CalendarDays,
  Medal
} from "lucide-react"
import Image from "next/image"
import type { ReleaseWeekday } from "@/lib/isekai-types"

interface FloatingCharacterWindowProps {
  userName: string
}

export function FloatingCharacterWindow({ userName }: FloatingCharacterWindowProps) {
  const isMobile = useIsMobile()
  
  const { 
    profile, 
    mangas, 
    abilities,
    items, 
    titles, 
    removeManga, 
    getMangaById, 
    addExperience, 
    removeExperience, 
    exportData, 
    importData,
    exportCode,
    updateCode,
    importCode, 
    editAbility, 
    deleteAbility, 
    editItem, 
    deleteItem, 
    resetProfile, 
    toggleTitle, 
    editTitle, 
    deleteTitle, 
    updateMangaEpisode, 
    incrementEpisode, 
    decrementEpisode,
    syncMangaRewards,
    addNotification,
    missions,
    achievements,
    season,
    readingActivities,
    refreshProgression
  } = useIsekai()

  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [shareCode, setShareCode] = useState("")
  const [importCodeValue, setImportCodeValue] = useState("")
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [isImportingCode, setIsImportingCode] = useState(false)

  // Carregar código atual do usuário ao montar o componente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentCodeKey = `isekai-current-code-${userName}`
      let currentCode = localStorage.getItem(currentCodeKey)
      
      // Se não tem código, gerar um estável baseado no userName (mesma lógica do provider)
      if (!currentCode) {
        // Criar hash simples do userName para gerar código sempre igual
        let hash = 0
        for (let i = 0; i < userName.length; i++) {
          const char = userName.charCodeAt(i)
          hash = ((hash << 5) - hash) + char
          hash = hash & hash // Convert to 32bit integer
        }
        // Garantir número positivo e converter para 8 dígitos
        currentCode = Math.abs(hash).toString().padStart(8, '0').slice(-8)
        localStorage.setItem(currentCodeKey, currentCode)
      }
      
      setShareCode(currentCode)
    }
  }, [userName])

  // Minimizar automaticamente quando um modal é aberto
  const handleModalOpen = (modalType: string) => {
    setActiveModal(modalType)
    setIsMinimized(true)
  }

  const [showAddManga, setShowAddManga] = useState(false)
  const [showAddContent, setShowAddContent] = useState(false)
  const [selectedManga, setSelectedManga] = useState<string | null>(null)
  const [contentInitialTab, setContentInitialTab] = useState<"ability" | "item" | "title">("ability")
  const [editAbilityDialogOpen, setEditAbilityDialogOpen] = useState(false)
  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false)
  const [editAttributesDialogOpen, setEditAttributesDialogOpen] = useState(false)
  const [editMangaDialogOpen, setEditMangaDialogOpen] = useState(false)
  const [mangaToEdit, setMangaToEdit] = useState<any>(null)
  const [mangaViewTab, setMangaViewTab] = useState<"all" | "private">("all")
  const [mangaDisplayMode, setMangaDisplayMode] = useState<"compact" | "cinematic">("cinematic")
  const [mangaSearchFilter, setMangaSearchFilter] = useState("")
  const [mangaTypeFilter, setMangaTypeFilter] = useState<"all" | "manga" | "manhwa" | "manhua">("all")
  const [mangaProgressFilter, setMangaProgressFilter] = useState<"all" | "pending" | "upToDate">("all")
  const [abilitySearchFilter, setAbilitySearchFilter] = useState("")
  const [abilityTypeFilter, setAbilityTypeFilter] = useState("all")
  const [abilityCategoryFilter, setAbilityCategoryFilter] = useState("all")
  const [itemSearchFilter, setItemSearchFilter] = useState("")
  const [itemTypeFilter, setItemTypeFilter] = useState("all")
  const [itemRarityFilter, setItemRarityFilter] = useState("all")
  const [titleSearchFilter, setTitleSearchFilter] = useState("")
  const [titleStatusFilter, setTitleStatusFilter] = useState("all")
  const [codexSearchFilter, setCodexSearchFilter] = useState("")
  const [codexStatusFilter, setCodexStatusFilter] = useState("all")
  const [missionTypeFilter, setMissionTypeFilter] = useState<"all" | "daily" | "weekly" | "journey">("all")
  const [abilityToEdit, setAbilityToEdit] = useState<any>(null)
  const [itemToEdit, setItemToEdit] = useState<any>(null)
  const [xpGainAnimation, setXpGainAnimation] = useState<{ show: boolean; amount: number; x: number; y: number }>({ show: false, amount: 0, x: 0, y: 0 })
  const [levelUpAnimation, setLevelUpAnimation] = useState(false)
  const [xpBarGlow, setXpBarGlow] = useState(false)
  const [unlockedPrivateMangas, setUnlockedPrivateMangas] = useState<Set<string>>(new Set())

  const experienceToNextLevel = profile.level * 100
  const experienceProgress = (profile.experience / experienceToNextLevel) * 100

  // Calcular HP, MP e Stamina baseados nos atributos
  const hpMax = 100 + (profile.attributes.vitality || 0) * 10
  const mpMax = 50 + (profile.attributes.intelligence || 0) * 5
  const staminaMax = 80 + (profile.attributes.agility || 0) * 3

  // Estados para persistir valores editados dos status vitais
  const [editedVitals, setEditedVitals] = useState({
    currentHP: hpMax,
    currentMP: mpMax,
    currentStamina: staminaMax,
    maxHP: hpMax,
    maxMP: mpMax,
    maxStamina: staminaMax
  })
  
  // Estado para imagem do usuário (carregar do localStorage)
  const [userImage, setUserImage] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userAvatar') || null
    }
    return null
  })
  
  // Função para lidar com upload de imagem
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Verificar se é uma imagem
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setUserImage(result)
          // Salvar no localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('userAvatar', result)
          }
        }
        reader.readAsDataURL(file)
      } else {
        alert('Por favor, selecione apenas arquivos de imagem!')
      }
    }
  }
  
  // Função para remover imagem
  const handleRemoveImage = () => {
    setUserImage(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userAvatar')
    }
  }
  
  // Usar os valores persistentes
  const currentHP = editedVitals.currentHP
  const currentMP = editedVitals.currentMP
  const currentStamina = editedVitals.currentStamina
  const maxHP = editedVitals.maxHP
  const maxMP = editedVitals.maxMP
  const maxStamina = editedVitals.maxStamina

  const hpCurrent = Math.min(hpMax, hpMax * 0.8) // Simular HP atual
  const mpCurrent = Math.min(mpMax, mpMax * 0.6) // Simular MP atual
  const staminaCurrent = Math.min(staminaMax, staminaMax * 0.9) // Simular Stamina atual

  const hpPercentage = (hpCurrent / hpMax) * 100
  const mpPercentage = (mpCurrent / mpMax) * 100
  const staminaPercentage = (staminaCurrent / staminaMax) * 100

  const rarityColors = {
    common: "bg-gray-500",
    uncommon: "bg-green-500",
    rare: "bg-blue-500",
    epic: "bg-purple-500",
    legendary: "bg-orange-500",
  }

  const handleXpGain = (amount: number, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    
    setXpGainAnimation({ show: true, amount, x, y })
    setXpBarGlow(true)
    
    setTimeout(() => {
      setXpGainAnimation(prev => ({ ...prev, show: false }))
    }, 2000)
    
    setTimeout(() => {
      setXpBarGlow(false)
    }, 1000)
    
    addExperience(amount)
  }

  const handleLevelUp = () => {
    setLevelUpAnimation(true)
    setTimeout(() => {
      setLevelUpAnimation(false)
    }, 3000)
  }

  const handleExportData = () => {
    const data = exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `isekai-progress-${userName}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleUpdateCode = async () => {
    setIsGeneratingCode(true)
    try {
      const code = await updateCode()
      if (!code) {
        addNotification({
          type: "error",
          title: "❌ Erro ao atualizar código",
          description: "Ocorreu um erro ao atualizar o código. Tente novamente.",
        })
        return
      }
      
      // Exibir código na interface (se ainda não estiver exibido)
      if (!shareCode) {
        setShareCode(code)
      }
      
      // Mostrar notificação de sucesso
      addNotification({
        type: "success",
        title: "✅ Código atualizado!",
        description: `Seu código ${code} foi atualizado com os dados mais recentes.`,
      })
    } catch (error) {
      console.error("Erro ao atualizar código:", error)
      addNotification({
        type: "error",
        title: "❌ Erro ao atualizar código",
        description: "Ocorreu um erro ao atualizar o código. Tente novamente.",
      })
    } finally {
      setIsGeneratingCode(false)
    }
  }

  const handleExportCode = async () => {
    setIsGeneratingCode(true)
    try {
      const code = await exportCode()
      if (!code) {
        addNotification({
          type: "error",
          title: "❌ Erro ao gerar código",
          description: "Ocorreu um erro ao gerar o código. Tente novamente.",
        })
        return
      }
      
      // Exibir código na interface
      setShareCode(code)
      
      // Copiar para a área de transferência automaticamente
      try {
        await navigator.clipboard.writeText(code)
      } catch (clipboardError) {
        // Fallback: copiar usando método alternativo
        const textarea = document.createElement("textarea")
        textarea.value = code
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()
        try {
          document.execCommand("copy")
        } catch (e) {
          console.error("Erro ao copiar código:", e)
        }
        document.body.removeChild(textarea)
      }
      
      // Mostrar notificação de sucesso
      addNotification({
        type: "success",
        title: "✅ Novo código gerado!",
        description: `Novo código ${code} gerado e copiado para a área de transferência.`,
      })
    } catch (error) {
      console.error("Erro ao gerar código:", error)
      addNotification({
        type: "error",
        title: "❌ Erro ao gerar código",
        description: "Ocorreu um erro ao gerar o código. Tente novamente.",
      })
    } finally {
      setIsGeneratingCode(false)
    }
  }

  const handleCopyCode = async () => {
    if (!shareCode) return
    
    try {
      await navigator.clipboard.writeText(shareCode)
      addNotification({
        type: "success",
        title: "✅ Código copiado!",
        description: `Código ${shareCode} copiado para a área de transferência.`,
      })
    } catch (error) {
      // Fallback
      const textarea = document.createElement("textarea")
      textarea.value = shareCode
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      addNotification({
        type: "success",
        title: "✅ Código copiado!",
        description: `Código ${shareCode} copiado para a área de transferência.`,
      })
    }
  }

  const handleImportCode = async () => {
    if (!importCodeValue.trim()) {
      addNotification({
        type: "error",
        title: "❌ Código vazio",
        description: "Digite um código de 8 dígitos para importar.",
      })
      return
    }
    
    setIsImportingCode(true)
    try {
      const success = await importCode(importCodeValue.trim())
      if (success) {
        addNotification({
          type: "success",
          title: "✅ Progresso importado!",
          description: "Seu progresso foi importado com sucesso.",
        })
        setImportCodeValue("") // Limpar campo
      } else {
        addNotification({
          type: "error",
          title: "❌ Código não encontrado",
          description: "O código informado não foi encontrado. Verifique se está correto ou se expirou.",
        })
      }
    } catch (error: any) {
      // Isso não deveria acontecer, mas caso aconteça, tratamos aqui
      console.warn("⚠️  Erro inesperado ao importar código:", error?.message || error)
      addNotification({
        type: "error",
        title: "❌ Erro ao importar",
        description: "Ocorreu um erro ao importar o código. Tente novamente.",
      })
    } finally {
      setIsImportingCode(false)
    }
  }

  const handleImportData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const json = e.target?.result as string
            if (importData(json)) {
              alert("✅ Dados importados com sucesso!")
            } else {
              alert("❌ Erro ao importar dados. Verifique se o arquivo está correto.")
            }
          } catch (error) {
            alert("❌ Erro ao importar dados. Verifique se o arquivo está correto.")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      localStorage.removeItem("isekai-user-name")
      window.location.href = "/"
    }
  }

  const getPrivatePasswordKey = () => `isekai-private-manga-password-${userName}`

  const handleUnlockPrivateManga = (mangaId: string) => {
    if (typeof window === "undefined") return

    const passwordKey = getPrivatePasswordKey()
    const existingPassword = localStorage.getItem(passwordKey)

    // Primeiro uso: pedir criação de senha
    if (!existingPassword) {
      const newPassword = window.prompt("Crie uma senha para desbloquear mangás privados:")
      if (!newPassword) return

      if (newPassword.length < 4) {
        addNotification({
          type: "error",
          title: "❌ Senha fraca",
          description: "Use pelo menos 4 caracteres.",
        })
        return
      }

      const confirmPassword = window.prompt("Confirme sua senha:")
      if (newPassword !== confirmPassword) {
        addNotification({
          type: "error",
          title: "❌ Senhas diferentes",
          description: "As senhas não coincidem. Tente novamente.",
        })
        return
      }

      localStorage.setItem(passwordKey, newPassword)
      addNotification({
        type: "success",
        title: "🔐 Senha criada!",
        description: "Agora use a senha para desbloquear mangás privados.",
      })
    }

    const savedPassword = localStorage.getItem(passwordKey)
    const typedPassword = window.prompt("Digite a senha para remover o blur:")
    if (!typedPassword) return

    if (typedPassword !== savedPassword) {
      addNotification({
        type: "error",
        title: "❌ Senha incorreta",
        description: "Não foi possível desbloquear este mangá.",
      })
      return
    }

    setUnlockedPrivateMangas((prev) => {
      const next = new Set(prev)
      next.add(mangaId)
      return next
    })
  }

  // Sempre que sair da aba de mangás, travar novamente os mangás privados
  useEffect(() => {
    if (activeModal !== "mangas") {
      setUnlockedPrivateMangas(new Set())
    }
  }, [activeModal])

  const weekdayToNumber: Record<ReleaseWeekday, number> = {
    domingo: 0,
    segunda: 1,
    terca: 2,
    quarta: 3,
    quinta: 4,
    sexta: 5,
    sabado: 6,
  }

  const countWeekdayOccurrences = (startDate: Date, endDate: Date, weekday: number) => {
    if (endDate <= startDate) return 0

    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)

    const end = new Date(endDate)
    end.setHours(0, 0, 0, 0)

    const first = new Date(start)
    first.setDate(start.getDate() + 1)

    while (first <= end && first.getDay() !== weekday) {
      first.setDate(first.getDate() + 1)
    }

    if (first > end) return 0

    const diffDays = Math.floor((end.getTime() - first.getTime()) / (1000 * 60 * 60 * 24))
    return Math.floor(diffDays / 7) + 1
  }

  const getRemainingEpisodes = (manga: any) => {
    if (!manga.totalChapters || manga.totalChapters <= 0) return 0

    let availableChapters = manga.totalChapters
    const lastUpdated = manga.totalChaptersUpdatedAt || manga.dateAdded

    if (manga.releaseWeekday && weekdayToNumber[manga.releaseWeekday as ReleaseWeekday] !== undefined && lastUpdated) {
      const weeklyIncrements = countWeekdayOccurrences(new Date(lastUpdated), new Date(), weekdayToNumber[manga.releaseWeekday as ReleaseWeekday])
      availableChapters += weeklyIncrements
    }

    const readChapters = manga.currentEpisode || 0
    return Math.max(availableChapters - readChapters, 0)
  }

  const visibleMangas = mangas.filter((manga) => {
    const matchesTab = mangaViewTab === "private" ? Boolean(manga.isPrivate) : !Boolean(manga.isPrivate)
    const matchesSearch = manga.title.toLowerCase().includes(mangaSearchFilter.toLowerCase())
    const matchesType = mangaViewTab === "private" ? true : (mangaTypeFilter === "all" || manga.type.toLowerCase() === mangaTypeFilter)
    const remainingEpisodes = getRemainingEpisodes(manga)
    const matchesProgress =
      mangaProgressFilter === "all" ||
      (mangaProgressFilter === "pending" && remainingEpisodes > 0) ||
      (mangaProgressFilter === "upToDate" && remainingEpisodes === 0)

    return matchesTab && matchesSearch && matchesType && matchesProgress
  })

  const totalPendingCount = mangas.filter((manga) => getRemainingEpisodes(manga) > 0).length
  const upToDateCount = mangas.filter((manga) => getRemainingEpisodes(manga) === 0).length
  const privateCount = mangas.filter((manga) => Boolean(manga.isPrivate)).length

  const abilityCategoryLabels: Record<string, string> = {
    attack: "Ataque",
    defense: "Defesa",
    support: "Suporte",
    utility: "Utilidade",
    special: "Especial",
  }
  const itemTypeLabels: Record<string, string> = {
    weapon: "Arma",
    armor: "Armadura",
    accessory: "Acessório",
    consumable: "Consumível",
    material: "Material",
  }
  const itemRarityLabels: Record<string, string> = {
    common: "Comum",
    uncommon: "Incomum",
    rare: "Raro",
    epic: "Épico",
    legendary: "Lendário",
  }

  const normalizedAbilitySearch = abilitySearchFilter.trim().toLowerCase()
  const filteredAbilities = abilities.filter((ability) => {
    const searchableText = `${ability.name} ${ability.description}`.toLowerCase()
    return (
      (!normalizedAbilitySearch || searchableText.includes(normalizedAbilitySearch)) &&
      (abilityTypeFilter === "all" || ability.type === abilityTypeFilter) &&
      (abilityCategoryFilter === "all" || ability.category === abilityCategoryFilter)
    )
  })

  const normalizedItemSearch = itemSearchFilter.trim().toLowerCase()
  const filteredItems = items.filter((item) => {
    const searchableText = `${item.name} ${item.description}`.toLowerCase()
    return (
      (!normalizedItemSearch || searchableText.includes(normalizedItemSearch)) &&
      (itemTypeFilter === "all" || item.type === itemTypeFilter) &&
      (itemRarityFilter === "all" || item.rarity === itemRarityFilter)
    )
  })

  const normalizedTitleSearch = titleSearchFilter.trim().toLowerCase()
  const filteredTitles = titles.filter((title) => {
    const searchableText = `${title.name} ${title.description}`.toLowerCase()
    return (
      (!normalizedTitleSearch || searchableText.includes(normalizedTitleSearch)) &&
      (titleStatusFilter === "all" || (titleStatusFilter === "active" ? Boolean(title.active) : !title.active))
    )
  })

  const codexEntries = mangas.map((manga) => {
    const mangaAbilities = abilities.filter((ability) => ability.sources?.includes(manga.id))
    const mangaItems = items.filter((item) => item.source === manga.id)
    const mangaTitles = titles.filter((title) => title.source === manga.id)
    const mangaJourneyMissions = missions.filter((mission) => mission.type === "journey" && mission.mangaId === manga.id)
    const remainingEpisodes = getRemainingEpisodes(manga)

    return {
      manga,
      abilities: mangaAbilities,
      items: mangaItems,
      titles: mangaTitles,
      journeyMissions: mangaJourneyMissions,
      remainingEpisodes,
      hasContent: mangaAbilities.length + mangaItems.length + mangaTitles.length > 0,
    }
  })

  const normalizedCodexSearch = codexSearchFilter.trim().toLowerCase()
  const filteredCodexEntries = codexEntries.filter((entry) => {
    const searchableText = [
      entry.manga.title,
      entry.manga.type,
      ...entry.abilities.map((ability) => `${ability.name} ${ability.description}`),
      ...entry.items.map((item) => `${item.name} ${item.description}`),
      ...entry.titles.map((title) => `${title.name} ${title.description}`),
    ].join(" ").toLowerCase()

    const matchesStatus =
      codexStatusFilter === "all" ||
      (codexStatusFilter === "pending" && entry.remainingEpisodes > 0) ||
      (codexStatusFilter === "upToDate" && entry.remainingEpisodes === 0) ||
      (codexStatusFilter === "withContent" && entry.hasContent) ||
      (codexStatusFilter === "withoutContent" && !entry.hasContent)

    return (!normalizedCodexSearch || searchableText.includes(normalizedCodexSearch)) && matchesStatus
  })

  const dailyMissions = missions.filter((mission) => mission.type === "daily")
  const weeklyMissions = missions.filter((mission) => mission.type === "weekly")
  const journeyMissions = missions.filter((mission) => mission.type === "journey")
  const filteredMissions = missions.filter((mission) => missionTypeFilter === "all" || mission.type === missionTypeFilter)
  const completedMissionCount = missions.filter((mission) => mission.completed).length
  const unlockedAchievementCount = achievements.filter((achievement) => achievement.unlocked).length
  const seasonProgress = season.experienceToNextLevel > 0 ? Math.min(100, (season.experience / season.experienceToNextLevel) * 100) : 0
  const totalReadChapters = mangas.reduce((total, manga) => total + (manga.currentEpisode || 0), 0)
  const readingDays = new Set(readingActivities.map((activity) => activity.date)).size
  const nextMission = missions.find((mission) => !mission.completed)

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Level Up Overlay */}
      {levelUpAnimation && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-yellow-300/30 to-amber-400/20 animate-pulse" style={{ animationDuration: '0.5s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl font-bold text-amber-300 animate-bounce font-serif">
              LEVEL UP!
            </div>
          </div>
        </div>
      )}

      {/* XP Gain Animation */}
      {xpGainAnimation.show && (
        <div 
          className="fixed z-50 pointer-events-none text-2xl font-bold text-amber-300 animate-bounce font-serif"
          style={{
            left: xpGainAnimation.x - 50,
            top: xpGainAnimation.y - 20,
            animationDuration: '2s'
          }}
        >
          +{xpGainAnimation.amount} XP
        </div>
      )}

      {/* Ícone Minimizado */}
        {isMinimized && (
          <div className="relative">
            <div className="relative">
              <Button
                onClick={() => setIsMinimized(false)}
                className="w-16 h-16 bg-gradient-to-br from-slate-800 via-purple-800 to-indigo-800 border-2 border-amber-500/30 shadow-2xl shadow-purple-500/20 hover:scale-110 transition-all duration-300 rounded-full overflow-hidden p-0"
                title="Abrir Painel do Personagem"
              >
                {userImage ? (
                  <img 
                    src={userImage} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="text-center w-full h-full flex flex-col items-center justify-center">
                    <div className="text-2xl mb-1">⚔️</div>
                    <div className="text-xs font-bold text-amber-200">{profile.level}</div>
                  </div>
                )}
              </Button>
              
              {/* Botão para alterar avatar no ícone minimizado */}
              <label className="absolute -bottom-1 -right-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="avatar-upload-minimized"
                />
                <div className="w-5 h-5 bg-amber-600 hover:bg-amber-700 rounded-full flex items-center justify-center text-xs text-white shadow-lg hover:scale-110 transition-all duration-300" title="Alterar avatar">
                  📷
                </div>
              </label>
            </div>
            
            {/* Indicador de notificação */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse">
              <div className="w-full h-full bg-red-400 rounded-full animate-ping" />
            </div>
          </div>
        )}

      {/* Janela Principal Flutuante */}
      {!isMinimized && (
        <Card className="w-80 bg-gradient-to-br from-slate-800 via-purple-800 to-indigo-800 border-2 border-amber-500/30 shadow-2xl shadow-purple-500/20">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="avatar-upload-floating"
                />
                {userImage ? (
                  <img 
                    src={userImage} 
                    alt="Avatar do usuário" 
                    className="w-12 h-12 rounded-full border-2 border-amber-500/50 object-cover shadow-lg hover:border-amber-400/70 transition-all duration-300"
                    title="Clique para alterar avatar"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-amber-500/50 bg-slate-700/50 flex items-center justify-center hover:border-amber-400/70 hover:bg-slate-600/50 transition-all duration-300" title="Clique para adicionar avatar">
                    <span className="text-2xl">⚔️</span>
                  </div>
                )}
              </label>
              <div>
                <h2 className="text-lg font-bold text-amber-200 font-serif">{profile.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-amber-600/20 text-amber-200">
                    <Star className="w-3 h-3 mr-1" />
                    Nível {profile.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs text-amber-300">
                    {userName}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-amber-300/60 hover:text-amber-200 hover:bg-amber-500/20"
                title="Minimizar"
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-amber-300/60 hover:text-red-400 hover:bg-red-500/20"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Barra de Experiência */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-amber-300 mb-1">
              <span>XP</span>
              <span>{profile.experience} / {experienceToNextLevel}</span>
            </div>
            <Progress 
              value={experienceProgress} 
              className={`h-2 bg-slate-700 transition-all duration-1000 ease-out ${xpBarGlow ? 'shadow-lg shadow-amber-500/50' : ''}`} 
            />
          </div>

          {/* Status Vitais */}
          <div className="space-y-2 mb-3">
            {/* HP */}
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <div className="flex-1">
                <div className="flex justify-between text-xs text-amber-300">
                  <span>HP</span>
                  <span>{Math.floor(hpCurrent)} / {hpMax}</span>
                </div>
                <Progress value={hpPercentage} className="h-1.5" />
              </div>
            </div>

            {/* MP */}
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <div className="flex justify-between text-xs text-amber-300">
                  <span>MP</span>
                  <span>{Math.floor(mpCurrent)} / {mpMax}</span>
                </div>
                <Progress value={mpPercentage} className="h-1.5" />
              </div>
            </div>

            {/* Stamina */}
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-green-500" />
              <div className="flex-1">
                <div className="flex justify-between text-xs text-amber-300">
                  <span>Stamina</span>
                  <span>{Math.floor(staminaCurrent)} / {staminaMax}</span>
                </div>
                <Progress value={staminaPercentage} className="h-1.5" />
              </div>
            </div>
          </div>

          {/* Botões de Ação Rápida */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button 
              size="sm" 
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
              onClick={(e) => handleXpGain(10, e)}
            >
              +10 XP
            </Button>
            <Button 
              size="sm" 
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
              onClick={(e) => handleXpGain(100, e)}
            >
              +100 XP
            </Button>
          </div>

          {/* Botões de Navegação */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleModalOpen("attributes")}
              className="text-xs border-amber-500/50 bg-slate-800/80 text-amber-200 hover:bg-amber-500/30 hover:text-amber-100"
            >
              <TrendingUp className="w-4 h-4 mr-1 text-amber-300" />
              Atributos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleModalOpen("abilities")}
              className="text-xs border-amber-500/50 bg-slate-800/80 text-amber-200 hover:bg-amber-500/30 hover:text-amber-100"
            >
              <Zap className="w-4 h-4 mr-1 text-yellow-400" />
              Habilidades
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleModalOpen("inventory")}
              className="text-xs border-amber-500/50 bg-slate-800/80 text-amber-200 hover:bg-amber-500/30 hover:text-amber-100"
            >
              <Package className="w-4 h-4 mr-1 text-blue-400" />
              Inventário
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleModalOpen("mangas")}
              className="text-xs border-amber-500/50 bg-slate-800/80 text-amber-200 hover:bg-amber-500/30 hover:text-amber-100"
            >
              <BookOpen className="w-4 h-4 mr-1 text-green-400" />
              Mangás
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleModalOpen("titles")}
              className="text-xs border-amber-500/50 bg-slate-800/80 text-amber-200 hover:bg-amber-500/30 hover:text-amber-100"
            >
              <Trophy className="w-4 h-4 mr-1 text-purple-400" />
              Títulos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleModalOpen("codex")}
              className="text-xs border-amber-500/50 bg-slate-800/80 text-amber-200 hover:bg-amber-500/30 hover:text-amber-100"
            >
              <Sparkles className="w-4 h-4 mr-1 text-indigo-300" />
              Codex
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleModalOpen("missions")}
              className="text-xs border-amber-500/50 bg-slate-800/80 text-amber-200 hover:bg-amber-500/30 hover:text-amber-100"
            >
              <Target className="w-4 h-4 mr-1 text-orange-300" />
              Missões
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleModalOpen("settings")}
              className="text-xs border-amber-500/50 bg-slate-800/80 text-amber-200 hover:bg-amber-500/30 hover:text-amber-100"
            >
              <Settings className="w-4 h-4 mr-1 text-gray-400" />
              Config
            </Button>
          </div>
        </CardContent>
        </Card>
      )}

      {/* Modal de Atributos */}
      <Modal
        isOpen={activeModal === "attributes"}
        onClose={() => {
          setActiveModal(null)
          setIsMinimized(false)
        }}
        title="Atributos do Personagem"
        icon="⚔️"
        size="xl"
      >
        <ModalSection title="Status Vitais" icon="💖">
          <ModalGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            {/* HP */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Heart className="w-10 h-10 text-red-400" />
                <div>
                  <h4 className="text-xl font-semibold text-red-200">Vida (HP)</h4>
                  <p className="text-base text-red-300/80">Pontos de vida</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="text-red-300">Atual</span>
                  <span className="font-bold text-red-200 text-xl">{Math.floor(currentHP)} / {maxHP}</span>
                </div>
                <Progress 
                  value={(currentHP / maxHP) * 100} 
                  className="h-4 bg-slate-600"
                />
                <div className="text-sm text-red-300/60">
                  Base: 100 + ({profile.attributes.vitality || 0} × 10) = {hpMax} | Máximo: {maxHP}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedVitals(prev => ({
                          ...prev,
                          currentHP: Math.max(0, prev.currentHP - 1)
                        }))
                      }}
                      className="text-red-400 border-red-400/50 hover:bg-red-400/20"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedVitals(prev => ({
                          ...prev,
                          currentHP: Math.min(prev.maxHP, prev.currentHP + 1)
                        }))
                      }}
                      className="text-red-400 border-red-400/50 hover:bg-red-400/20"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedVitals(prev => ({
                          ...prev,
                          maxHP: prev.maxHP - 1,
                          currentHP: prev.currentHP > prev.maxHP - 1 ? prev.maxHP - 1 : prev.currentHP
                        }))
                      }}
                      className="text-red-500 border-red-500/50 hover:bg-red-500/20"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedVitals(prev => ({
                          ...prev,
                          maxHP: prev.maxHP + 1
                        }))
                      }}
                      className="text-red-500 border-red-500/50 hover:bg-red-500/20"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <span className="text-xs text-red-300/60 ml-2">Max</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MP */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Droplet className="w-10 h-10 text-blue-400" />
                <div>
                  <h4 className="text-xl font-semibold text-blue-200">Mana (MP)</h4>
                  <p className="text-base text-blue-300/80">Pontos de mana</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="text-blue-300">Atual</span>
                  <span className="font-bold text-blue-200 text-xl">{Math.floor(currentMP)} / {maxMP}</span>
                </div>
                <Progress 
                  value={(currentMP / maxMP) * 100} 
                  className="h-4 bg-slate-600"
                />
                <div className="text-sm text-blue-300/60">
                  Base: 50 + ({profile.attributes.intelligence || 0} × 5) = {mpMax} | Máximo: {maxMP}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedVitals(prev => ({
                          ...prev,
                          currentMP: Math.max(0, prev.currentMP - 1)
                        }))
                      }}
                      className="text-blue-400 border-blue-400/50 hover:bg-blue-400/20"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedVitals(prev => ({
                          ...prev,
                          currentMP: Math.min(prev.maxMP, prev.currentMP + 1)
                        }))
                      }}
                      className="text-blue-400 border-blue-400/50 hover:bg-blue-400/20"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedVitals(prev => ({
                          ...prev,
                          maxMP: prev.maxMP - 1,
                          currentMP: prev.currentMP > prev.maxMP - 1 ? prev.maxMP - 1 : prev.currentMP
                        }))
                      }}
                      className="text-blue-500 border-blue-500/50 hover:bg-blue-500/20"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedVitals(prev => ({
                          ...prev,
                          maxMP: prev.maxMP + 1
                        }))
                      }}
                      className="text-blue-500 border-blue-500/50 hover:bg-blue-500/20"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <span className="text-xs text-blue-300/60 ml-2">Max</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stamina */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Wind className="w-10 h-10 text-green-400" />
                <div>
                  <h4 className="text-xl font-semibold text-green-200">Stamina</h4>
                  <p className="text-base text-green-300/80">Energia física</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="text-green-300">Atual</span>
                  <span className="font-bold text-green-200 text-xl">{Math.floor(currentStamina)} / {maxStamina}</span>
                </div>
                <Progress 
                  value={(currentStamina / maxStamina) * 100} 
                  className="h-4 bg-slate-600"
                />
                <div className="text-sm text-green-300/60">
                  Base: 80 + ({profile.attributes.agility || 0} × 3) = {staminaMax} | Máximo: {maxStamina}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedVitals(prev => ({
                          ...prev,
                          currentStamina: Math.max(0, prev.currentStamina - 1)
                        }))
                      }}
                      className="text-green-400 border-green-400/50 hover:bg-green-400/20"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedVitals(prev => ({
                          ...prev,
                          currentStamina: Math.min(prev.maxStamina, prev.currentStamina + 1)
                        }))
                      }}
                      className="text-green-400 border-green-400/50 hover:bg-green-400/20"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedVitals(prev => ({
                          ...prev,
                          maxStamina: prev.maxStamina - 1,
                          currentStamina: prev.currentStamina > prev.maxStamina - 1 ? prev.maxStamina - 1 : prev.currentStamina
                        }))
                      }}
                      className="text-green-500 border-green-500/50 hover:bg-green-500/20"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedVitals(prev => ({
                          ...prev,
                          maxStamina: prev.maxStamina + 1
                        }))
                      }}
                      className="text-green-500 border-green-500/50 hover:bg-green-500/20"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <span className="text-xs text-green-300/60 ml-2">Max</span>
                  </div>
                </div>
              </div>
            </div>
          </ModalGrid>
        </ModalSection>

        <ModalSection title="Atributos Primários" icon="⭐">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
              onClick={() => setEditAttributesDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Editar Atributos
            </Button>
          </div>
          <ModalGrid columns={{ mobile: 3, tablet: 5, desktop: 5 }} gap="md">
            {Object.entries(profile.attributes).map(([key, value]) => (
              <div 
                key={key} 
                className="flex flex-col items-center gap-3 p-4 bg-slate-600/50 rounded-lg border border-amber-500/30 hover:scale-105 transition-all duration-300 cursor-pointer group shadow-lg shadow-purple-500/10"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300 brightness-110">
                  {key === "strength" && "⚔️"}
                  {key === "agility" && "⚡"}
                  {key === "intelligence" && "🔮"}
                  {key === "vitality" && "❤️"}
                  {key === "luck" && "🍀"}
                  {!["strength", "agility", "intelligence", "vitality", "luck"].includes(key) && "✨"}
                </div>
                <div className="text-center">
                  <div className="text-sm text-amber-300 capitalize font-serif mb-1">{key}</div>
                  <div className="text-2xl font-bold text-amber-200">{value}</div>
                </div>
                {/* Barra de progresso visual */}
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((value / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </ModalGrid>
        </ModalSection>

        <ModalSection title="Resumo de Progressão" icon="📊">
          <ModalGrid columns={{ mobile: 2, tablet: 4, desktop: 4 }} gap="md">
            <div className="text-center p-4 bg-slate-600/50 rounded-lg border border-amber-500/30 shadow-lg shadow-purple-500/10 hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-sm text-amber-300 font-semibold">Mangás Lidos</div>
              <div className="text-xl font-bold text-amber-200">{profile.totalMangasRead}</div>
            </div>
            <div className="text-center p-4 bg-slate-600/50 rounded-lg border border-amber-500/30 shadow-lg shadow-purple-500/10 hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-sm text-amber-300 font-semibold">Habilidades</div>
              <div className="text-xl font-bold text-amber-200">{profile.totalAbilities}</div>
            </div>
            <div className="text-center p-4 bg-slate-600/50 rounded-lg border border-amber-500/30 shadow-lg shadow-purple-500/10 hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2">👑</div>
              <div className="text-sm text-amber-300 font-semibold">Títulos</div>
              <div className="text-xl font-bold text-amber-200">{profile.titles.length}</div>
            </div>
            <div className="text-center p-4 bg-slate-600/50 rounded-lg border border-amber-500/30 shadow-lg shadow-purple-500/10 hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-sm text-amber-300 font-semibold">Nível</div>
              <div className="text-xl font-bold text-amber-200">{profile.level}</div>
            </div>
          </ModalGrid>
        </ModalSection>
      </Modal>

      {/* Modal de Habilidades */}
      <Modal
        isOpen={activeModal === "abilities"}
        onClose={() => {
          setActiveModal(null)
          setIsMinimized(false)
        }}
        title="Habilidades"
        icon="⭐"
        size="lg"
      >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-amber-200 font-serif">Minhas Habilidades</h3>
                <Button
                  onClick={() => {
                    setContentInitialTab("ability")
                    setSelectedManga(mangas[0]?.id || null)
                    setShowAddContent(true)
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Habilidade
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar habilidades por nome ou descrição..."
                  value={abilitySearchFilter}
                  onChange={(e) => setAbilitySearchFilter(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20"
                />
              </div>
              <div className={`flex gap-2 ${isMobile ? "flex-wrap justify-center" : "flex-wrap"}`}>
                {[{ value: "all", label: "Todas" }, { value: "active", label: "Ativas" }, { value: "passive", label: "Passivas" }].map((filter) => (
                  <Button
                    key={filter.value}
                    variant={abilityTypeFilter === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAbilityTypeFilter(filter.value)}
                    className={abilityTypeFilter === filter.value
                      ? "bg-amber-600 hover:bg-amber-700 text-white text-xs"
                      : "bg-slate-700/50 border-amber-500/30 text-amber-200 hover:bg-amber-500/20 text-xs"}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
              <div className={`flex gap-2 ${isMobile ? "flex-wrap justify-center" : "flex-wrap"}`}>
                <span className="text-xs text-amber-300/70 self-center">Categoria:</span>
                {[{ value: "all", label: "Todas" }, ...Object.entries(abilityCategoryLabels).map(([value, label]) => ({ value, label }))].map((filter) => (
                  <Button
                    key={filter.value}
                    variant={abilityCategoryFilter === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAbilityCategoryFilter(filter.value)}
                    className={abilityCategoryFilter === filter.value
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                      : "bg-slate-700/50 border-indigo-500/30 text-indigo-200 hover:bg-indigo-500/20 text-xs"}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
            {abilities.length === 0 ? (
              <div className="text-center text-amber-300/60 py-8">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma habilidade adquirida ainda.</p>
              </div>
            ) : filteredAbilities.length === 0 ? (
              <div className="text-center text-amber-300/60 py-8">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma habilidade encontrada.</p>
                <p className="text-sm">Tente alterar a busca ou os filtros.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAbilities.map((ability) => (
                  <Card key={ability.id} className="bg-slate-700/50 border-amber-500/30 shadow-lg shadow-purple-500/10 hover:scale-105 transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-xl font-bold text-amber-200 mb-2">{ability.name}</h4>
                          <div className="flex gap-3 mt-2 flex-wrap">
                            <Badge variant={ability.type === "active" ? "default" : "secondary"} className="text-sm px-3 py-1">
                              {ability.type === "active" ? "Ativa" : "Passiva"}
                            </Badge>
                            <Badge variant="outline" className="text-sm px-3 py-1">Nível {ability.level}</Badge>
                            <Badge className="bg-gradient-power text-sm px-3 py-1">Poder: {ability.power}</Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-base text-amber-300/80 mb-4">{ability.description}</p>
                      <div className="flex gap-2">
                        <Button
                          size="default"
                          variant="outline"
                          className="flex-1 text-sm"
                          onClick={() => {
                            setAbilityToEdit(ability)
                            setEditAbilityDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          size="default"
                          variant="outline"
                          className="flex-1 text-destructive hover:text-destructive text-sm"
                          onClick={() => {
                            if (confirm(`Tem certeza que deseja excluir a habilidade "${ability.name}"?`)) {
                              deleteAbility(ability.id)
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
      </Modal>

      {/* Modal de Inventário */}
      <Modal
        isOpen={activeModal === "inventory"}
        onClose={() => {
          setActiveModal(null)
          setIsMinimized(false)
        }}
        title="Inventário"
        icon="🎒"
        size="lg"
      >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-amber-200 font-serif">Meu Inventário</h3>
                <Button
                  onClick={() => {
                    setContentInitialTab("item")
                    setSelectedManga(mangas[0]?.id || null)
                    setShowAddContent(true)
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar itens por nome ou descrição..."
                  value={itemSearchFilter}
                  onChange={(e) => setItemSearchFilter(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20"
                />
              </div>
              <div className={`flex gap-2 ${isMobile ? "flex-wrap justify-center" : "flex-wrap"}`}>
                <span className="text-xs text-amber-300/70 self-center">Tipo:</span>
                {[{ value: "all", label: "Todos" }, ...Object.entries(itemTypeLabels).map(([value, label]) => ({ value, label }))].map((filter) => (
                  <Button
                    key={filter.value}
                    variant={itemTypeFilter === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setItemTypeFilter(filter.value)}
                    className={itemTypeFilter === filter.value
                      ? "bg-amber-600 hover:bg-amber-700 text-white text-xs"
                      : "bg-slate-700/50 border-amber-500/30 text-amber-200 hover:bg-amber-500/20 text-xs"}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
              <div className={`flex gap-2 ${isMobile ? "flex-wrap justify-center" : "flex-wrap"}`}>
                <span className="text-xs text-amber-300/70 self-center">Raridade:</span>
                {[{ value: "all", label: "Todas" }, ...Object.entries(itemRarityLabels).map(([value, label]) => ({ value, label }))].map((filter) => (
                  <Button
                    key={filter.value}
                    variant={itemRarityFilter === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setItemRarityFilter(filter.value)}
                    className={itemRarityFilter === filter.value
                      ? "bg-purple-600 hover:bg-purple-700 text-white text-xs"
                      : "bg-slate-700/50 border-purple-500/30 text-purple-200 hover:bg-purple-500/20 text-xs"}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
            {items.length === 0 ? (
              <div className="text-center text-amber-300/60 py-8">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum item adquirido ainda.</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center text-amber-300/60 py-8">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum item encontrado.</p>
                <p className="text-sm">Tente alterar a busca ou os filtros.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="bg-slate-700/50 border-amber-500/30 shadow-lg shadow-purple-500/10 hover:scale-105 transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <h4 className="font-bold text-amber-200">{item.name}</h4>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          <Badge variant="secondary" className="capitalize text-xs">
                            {item.type}
                          </Badge>
                          <Badge className={`${rarityColors[item.rarity]} text-xs`}>{item.rarity}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-amber-300/80 mb-3">{item.description}</p>
                      {item.effects && Object.keys(item.effects).length > 0 && (
                        <div className="space-y-1 mb-3">
                          <div className="text-sm font-semibold text-amber-200">Efeitos:</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(item.effects).map(([key, value]) =>
                              value ? (
                                <div key={key} className="flex items-center gap-1 capitalize text-amber-300">
                                  +{value} {key}
                                </div>
                              ) : null,
                            )}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => {
                            setItemToEdit(item)
                            setEditItemDialogOpen(true)
                          }}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-destructive hover:text-destructive text-xs"
                          onClick={() => {
                            if (confirm(`Tem certeza que deseja excluir o item "${item.name}"?`)) {
                              deleteItem(item.id)
                            }
                          }}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
      </Modal>

      {/* Modal de Mangás */}
      <Modal
        isOpen={activeModal === "mangas"}
        onClose={() => {
          setActiveModal(null)
          setIsMinimized(false)
          setUnlockedPrivateMangas(new Set())
        }}
        title="Biblioteca"
        icon="📚"
        size="lg"
      >
            <div className="space-y-4">
              <div className={`${isMobile ? 'flex-col gap-3' : 'flex justify-between items-center'}`}>
                <h3 className="text-amber-200 font-serif">Minha Biblioteca</h3>
                <Button 
                  onClick={() => setShowAddManga(true)} 
                  className={`bg-amber-600 hover:bg-amber-700 text-white ${isMobile ? 'w-full' : ''}`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Manga
                </Button>
              </div>

              <Tabs value={mangaViewTab} onValueChange={(value) => setMangaViewTab(value as "all" | "private")}>
                <TabsList className="bg-slate-700/60 border border-amber-500/30">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="private">Privado ({privateCount})</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className={`flex gap-2 ${isMobile ? "flex-wrap justify-center" : "flex-wrap"}`}>
                <Button
                  variant={mangaDisplayMode === "compact" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMangaDisplayMode("compact")}
                  className={`text-xs px-3 py-1 ${
                    mangaDisplayMode === "compact"
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-slate-700/50 border-indigo-500/40 text-indigo-200 hover:bg-indigo-500/20"
                  } transition-all duration-200`}
                >
                  Compacto
                </Button>
                <Button
                  variant={mangaDisplayMode === "cinematic" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMangaDisplayMode("cinematic")}
                  className={`text-xs px-3 py-1 ${
                    mangaDisplayMode === "cinematic"
                      ? "bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                      : "bg-slate-700/50 border-fuchsia-500/40 text-fuchsia-200 hover:bg-fuchsia-500/20"
                  } transition-all duration-200`}
                >
                  Cinematic
                </Button>
              </div>

              {/* Mini dashboard */}
              <div className={`grid gap-2 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
                <div className="rounded-md border border-amber-500/30 bg-slate-700/40 p-2">
                  <p className="text-[10px] text-amber-300/70">Visíveis</p>
                  <p className="text-sm font-bold text-amber-100">{visibleMangas.length}</p>
                </div>
                <div className="rounded-md border border-orange-400/40 bg-orange-500/10 p-2">
                  <p className="text-[10px] text-orange-300/80">Pendentes</p>
                  <p className="text-sm font-bold text-orange-200">{totalPendingCount}</p>
                </div>
                <div className="rounded-md border border-green-400/40 bg-green-500/10 p-2">
                  <p className="text-[10px] text-green-300/80">Em dia</p>
                  <p className="text-sm font-bold text-green-200">{upToDateCount}</p>
                </div>
                <div className="rounded-md border border-purple-400/40 bg-purple-500/10 p-2">
                  <p className="text-[10px] text-purple-300/80">Privados</p>
                  <p className="text-sm font-bold text-purple-200">{privateCount}</p>
                </div>
              </div>
              
              {/* Campo de busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar mangás por nome..."
                  value={mangaSearchFilter}
                  onChange={(e) => setMangaSearchFilter(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200"
                />
              </div>
              
              {/* Filtros por tipo */}
              <div className={`flex gap-2 ${isMobile ? 'flex-wrap justify-center' : 'flex-wrap'} ${mangaViewTab === "private" ? "opacity-50 pointer-events-none" : ""}`}>
                <Button
                  variant={mangaTypeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMangaTypeFilter("all")}
                  className={`text-xs px-3 py-1 ${
                    mangaTypeFilter === "all" 
                      ? "bg-amber-600 hover:bg-amber-700 text-white" 
                      : "bg-slate-700/50 border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
                  } transition-all duration-200`}
                >
                  Todos
                </Button>
                <Button
                  variant={mangaTypeFilter === "manga" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMangaTypeFilter("manga")}
                  className={`text-xs px-3 py-1 ${
                    mangaTypeFilter === "manga" 
                      ? "bg-amber-600 hover:bg-amber-700 text-white" 
                      : "bg-slate-700/50 border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
                  } transition-all duration-200`}
                >
                  📖 Mangás
                </Button>
                <Button
                  variant={mangaTypeFilter === "manhwa" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMangaTypeFilter("manhwa")}
                  className={`text-xs px-3 py-1 ${
                    mangaTypeFilter === "manhwa" 
                      ? "bg-amber-600 hover:bg-amber-700 text-white" 
                      : "bg-slate-700/50 border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
                  } transition-all duration-200`}
                >
                  🇰🇷 Manhwas
                </Button>
                <Button
                  variant={mangaTypeFilter === "manhua" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMangaTypeFilter("manhua")}
                  className={`text-xs px-3 py-1 ${
                    mangaTypeFilter === "manhua" 
                      ? "bg-amber-600 hover:bg-amber-700 text-white" 
                      : "bg-slate-700/50 border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
                  } transition-all duration-200`}
                >
                  🇨🇳 Manhuas
                </Button>
              </div>

              {/* Filtro rápido de progresso */}
              <div className={`flex gap-2 ${isMobile ? "flex-wrap justify-center" : "flex-wrap"}`}>
                <Button
                  variant={mangaProgressFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMangaProgressFilter("all")}
                  className={`text-xs px-3 py-1 ${
                    mangaProgressFilter === "all"
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-slate-700/50 border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
                  } transition-all duration-200`}
                >
                  Tudo
                </Button>
                <Button
                  variant={mangaProgressFilter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMangaProgressFilter("pending")}
                  className={`text-xs px-3 py-1 ${
                    mangaProgressFilter === "pending"
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-slate-700/50 border-orange-500/40 text-orange-200 hover:bg-orange-500/20"
                  } transition-all duration-200`}
                >
                  Pendentes
                </Button>
                <Button
                  variant={mangaProgressFilter === "upToDate" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMangaProgressFilter("upToDate")}
                  className={`text-xs px-3 py-1 ${
                    mangaProgressFilter === "upToDate"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-slate-700/50 border-green-500/40 text-green-200 hover:bg-green-500/20"
                  } transition-all duration-200`}
                >
                  Em dia
                </Button>
              </div>
            </div>
            {mangas.length === 0 ? (
              <div className="text-center text-amber-300/60 py-8">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum manga adicionado ainda.</p>
                <p className="text-sm">Comece adicionando os mangás que você leu!</p>
              </div>
            ) : (
              <>
                {visibleMangas.length === 0 && (mangaSearchFilter || mangaTypeFilter !== "all" || mangaViewTab === "private" || mangaProgressFilter !== "all") ? (
                  <div className="text-center text-amber-300/60 py-8">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      {mangaViewTab === "private"
                        ? (mangaSearchFilter
                          ? `Nenhum mangá privado encontrado para "${mangaSearchFilter}"`
                          : "Nenhum mangá privado encontrado")
                        : (mangaSearchFilter && mangaTypeFilter !== "all" 
                        ? `Nenhum ${mangaTypeFilter} encontrado para "${mangaSearchFilter}"`
                        : mangaSearchFilter 
                        ? `Nenhum mangá encontrado para "${mangaSearchFilter}"`
                        : `Nenhum ${mangaTypeFilter} encontrado`
                      )}
                    </p>
                    <p className="text-sm">Tente ajustar os filtros ou buscar por outro termo</p>
                  </div>
                ) : (
                  <div
                    className={`grid gap-4 ${
                      isMobile
                        ? "grid-cols-1"
                        : mangaDisplayMode === "cinematic"
                        ? "grid-cols-1 md:grid-cols-2"
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {visibleMangas.map((manga) => {
                  const isPrivate = Boolean(manga.isPrivate)
                  const isUnlocked = unlockedPrivateMangas.has(manga.id)
                  const shouldBlur = isPrivate && !isUnlocked
                  const remainingEpisodes = getRemainingEpisodes(manga)
                  const statusCardClass =
                    remainingEpisodes > 0
                      ? "border-orange-400/60 shadow-orange-500/20"
                      : "border-green-400/50 shadow-green-500/20"

                  return (
                  <Card 
                    key={manga.id} 
                    className={`relative overflow-hidden bg-slate-700/50 ${statusCardClass} shadow-lg transition-all duration-300 cursor-pointer group ${
                      shouldBlur ? "" : mangaDisplayMode === "cinematic" ? "hover:scale-[1.02]" : "hover:scale-105"
                    }`}
                  >
                    <div className={`h-full ${shouldBlur ? "blur-xl saturate-50 scale-[1.02] pointer-events-none select-none" : ""}`}>
                      {manga.coverImage && (
                        <div className="absolute inset-0">
                          <Image
                            key={`${manga.id}-${manga.coverImage}`}
                            src={manga.coverImage || "/placeholder.svg"}
                            alt={manga.title}
                            fill
                            className={`object-cover ${
                              mangaDisplayMode === "cinematic" ? "scale-110" : ""
                            } transition-transform duration-500`}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div
                            className={`absolute inset-0 ${
                              mangaDisplayMode === "cinematic"
                                ? "bg-gradient-to-t from-black/80 via-black/35 to-black/10"
                                : "bg-black/50"
                            }`}
                          />
                        </div>
                      )}
                      {remainingEpisodes > 0 && (
                        <div
                          className="absolute top-3 right-3 z-30 min-w-7 h-7 rounded-full bg-orange-500 px-2 text-white text-xs font-bold flex items-center justify-center border border-orange-200/40 shadow-lg"
                          title={`${remainingEpisodes} capítulo(s) faltando`}
                        >
                          {remainingEpisodes}
                        </div>
                      )}
                      
                      <CardContent
                        className={`relative z-20 p-4 h-full flex flex-col justify-between ${
                          mangaDisplayMode === "cinematic" ? "min-h-[260px]" : "min-h-[200px]"
                        }`}
                      >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white mb-1 truncate">{manga.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                                {manga.type}
                              </Badge>
                              {isPrivate && (
                                <Badge variant="secondary" className="bg-purple-700/80 text-white border-purple-300/40 text-xs">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Privado
                                </Badge>
                              )}
                              {!isPrivate && (
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${
                                    remainingEpisodes > 0
                                      ? "bg-orange-600/80 text-white border-orange-300/40"
                                      : "bg-green-600/80 text-white border-green-300/40"
                                  }`}
                                >
                                  {remainingEpisodes > 0 ? "Pendente" : "Em dia"}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className={`flex gap-1 flex-shrink-0 ml-2 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`}>
                            {manga.url && (
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={shouldBlur}
                                onClick={() => window.open(manga.url, '_blank')}
                                className={`text-white hover:bg-blue-600/30 bg-black/20 hover:scale-110 transition-all duration-200 ${isMobile ? 'w-7 h-7' : 'w-8 h-8'}`}
                                title="Ir para o site"
                              >
                                <ExternalLink className={isMobile ? 'w-3 h-3' : 'w-3 h-3'} />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={shouldBlur}
                              onClick={() => syncMangaRewards(manga.id).catch(console.error)}
                              className={`text-white hover:bg-green-600/30 bg-black/20 hover:scale-110 transition-all duration-200 ${isMobile ? 'w-7 h-7' : 'w-8 h-8'}`}
                              title="Sincronizar recompensas"
                            >
                              <RefreshCw className={isMobile ? 'w-3 h-3' : 'w-3 h-3'} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={shouldBlur}
                              onClick={() => {
                                setMangaToEdit(manga)
                                setEditMangaDialogOpen(true)
                              }}
                              className={`text-white hover:bg-amber-600/30 bg-black/20 hover:scale-110 transition-all duration-200 ${isMobile ? 'w-7 h-7' : 'w-8 h-8'}`}
                              title="Editar mangá"
                            >
                              <Edit className={isMobile ? 'w-3 h-3' : 'w-3 h-3'} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={shouldBlur}
                              onClick={() => removeManga(manga.id)}
                              className={`text-white hover:bg-red-600/30 bg-black/20 hover:scale-110 transition-all duration-200 ${isMobile ? 'w-7 h-7' : 'w-8 h-8'}`}
                              title="Apagar mangá"
                            >
                              <Trash2 className={isMobile ? 'w-3 h-3' : 'w-3 h-3'} />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className={`${isMobile ? 'flex-col gap-2' : 'flex items-center justify-between'} bg-white/10 rounded-lg p-2 border border-white/20`}>
                            <div className="flex items-center gap-2">
                              <Hash className="w-3 h-3 text-amber-300" />
                              <span className="text-xs text-white/90">Episódio:</span>
                              <span className="text-sm font-bold text-amber-300">
                                {manga.currentEpisode ?? 0}
                              </span>
                            </div>
                            <div className={`flex gap-1 ${isMobile ? 'justify-center w-full' : ''}`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={shouldBlur}
                                onClick={() => decrementEpisode(manga.id)}
                                className={`${isMobile ? 'w-8 h-8' : 'w-6 h-6'} text-white hover:bg-red-500/30 hover:scale-110 transition-all duration-200`}
                                title="Episódio anterior"
                              >
                                <ChevronDown className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={shouldBlur}
                                onClick={() => incrementEpisode(manga.id)}
                                className={`${isMobile ? 'w-8 h-8' : 'w-6 h-6'} text-white hover:bg-green-500/30 hover:scale-110 transition-all duration-200`}
                                title="Próximo episódio"
                              >
                                <ChevronUp className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        disabled={shouldBlur}
                        className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20 text-xs"
                        onClick={() => {
                          setSelectedManga(manga.id)
                          setShowAddContent(true)
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Adicionar Conteúdo
                      </Button>
                      </CardContent>
                    </div>
                    {shouldBlur && (
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/70 backdrop-blur-sm p-4">
                        <div className="text-center">
                          <p className="text-amber-200 font-bold">{manga.title}</p>
                          <p className="text-white font-semibold">Mangá privado</p>
                          <p className="text-xs text-white/80">Desbloqueie com sua senha para remover o blur.</p>
                        </div>
                        <Button
                          onClick={() => handleUnlockPrivateManga(manga.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          size="sm"
                        >
                          <LockOpen className="w-4 h-4 mr-2" />
                          Desbloquear
                        </Button>
                      </div>
                    )}
                  </Card>
                )})}
              </div>
                )}
              </>
            )}
      </Modal>

      {/* Modal de Títulos */}
      <Modal
        isOpen={activeModal === "titles"}
        onClose={() => {
          setActiveModal(null)
          setIsMinimized(false)
        }}
        title="Títulos"
        icon="👑"
        size="md"
      >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-amber-200 font-serif">Meus Títulos</h3>
                <Button
                  onClick={() => {
                    setContentInitialTab("title")
                    setSelectedManga(mangas[0]?.id || null)
                    setShowAddContent(true)
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Título
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar títulos por nome ou descrição..."
                  value={titleSearchFilter}
                  onChange={(e) => setTitleSearchFilter(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20"
                />
              </div>
              <div className={`flex gap-2 ${isMobile ? "flex-wrap justify-center" : "flex-wrap"}`}>
                {[{ value: "all", label: "Todos" }, { value: "active", label: "Ativos" }, { value: "inactive", label: "Inativos" }].map((filter) => (
                  <Button
                    key={filter.value}
                    variant={titleStatusFilter === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTitleStatusFilter(filter.value)}
                    className={titleStatusFilter === filter.value
                      ? "bg-amber-600 hover:bg-amber-700 text-white text-xs"
                      : "bg-slate-700/50 border-amber-500/30 text-amber-200 hover:bg-amber-500/20 text-xs"}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
            {titles.length === 0 ? (
              <div className="text-center text-amber-300/60 py-8">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum título conquistado ainda.</p>
              </div>
            ) : filteredTitles.length === 0 ? (
              <div className="text-center text-amber-300/60 py-8">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum título encontrado.</p>
                <p className="text-sm">Tente alterar a busca ou o filtro.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTitles.map((title) => (
                  <Card 
                    key={title.id} 
                    className="bg-slate-700/50 border-amber-500/30 shadow-lg shadow-purple-500/10 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Trophy className="w-6 h-6 text-amber-400 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-bold text-amber-200 mb-1">{title.name}</h4>
                          {title.active && <Badge className="mb-2 bg-green-600 text-white text-xs">Ativo</Badge>}
                          <p className="text-sm text-amber-300/80 mb-3">{title.description}</p>
                          {title.effects && Object.keys(title.effects).length > 0 && (
                            <div className="space-y-1 mb-3">
                              <div className="text-sm font-semibold text-amber-200">Efeitos:</div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {Object.entries(title.effects).map(([key, value]) =>
                                  value ? (
                                    <div key={key} className="flex items-center gap-1 capitalize text-amber-300">
                                      +{value} {key}
                                    </div>
                                  ) : null,
                                )}
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleTitle(title.id)} 
                              className={`${title.active ? 'text-green-400 hover:bg-green-600/20' : 'text-amber-300 hover:bg-amber-600/20'} text-xs`}
                              title={title.active ? "Desativar título" : "Ativar título"}
                            >
                              <Star className="w-3 h-3 mr-1" />
                              {title.active ? "Ativo" : "Ativar"}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                const newName = prompt('Novo nome do título:', title.name)
                                if (newName && newName.trim()) {
                                  editTitle(title.id, { name: newName.trim() })
                                }
                              }}
                              className="text-amber-300 hover:bg-amber-600/20 text-xs"
                              title="Editar título"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                if (confirm(`Tem certeza que deseja excluir o título "${title.name}"?`)) {
                                  deleteTitle(title.id)
                                }
                              }}
                              className="text-red-400 hover:bg-red-600/20 text-xs"
                              title="Excluir título"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
      </Modal>

      {/* Modal do Codex */}
      <Modal
        isOpen={activeModal === "codex"}
        onClose={() => {
          setActiveModal(null)
          setIsMinimized(false)
        }}
        title="Codex"
        icon="📖"
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-3">
            <div>
              <h3 className="text-amber-200 font-serif text-xl">Codex de Aventuras</h3>
              <p className="text-sm text-amber-300/70">Tudo o que você desbloqueou em cada mangá.</p>
            </div>
            <Badge className="bg-indigo-600/80 text-indigo-100">
              {filteredCodexEntries.length} de {mangas.length} mangás
            </Badge>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar por mangá ou conteúdo desbloqueado..."
              value={codexSearchFilter}
              onChange={(e) => setCodexSearchFilter(e.target.value)}
              className="pl-10 bg-slate-700/50 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20"
            />
          </div>

          <div className={`flex gap-2 ${isMobile ? "flex-wrap justify-center" : "flex-wrap"}`}>
            {[
              { value: "all", label: "Todos" },
              { value: "pending", label: "Pendentes" },
              { value: "upToDate", label: "Em dia" },
              { value: "withContent", label: "Com conteúdo" },
              { value: "withoutContent", label: "Sem conteúdo" },
            ].map((filter) => (
              <Button
                key={filter.value}
                variant={codexStatusFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setCodexStatusFilter(filter.value)}
                className={codexStatusFilter === filter.value
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                  : "bg-slate-700/50 border-indigo-500/30 text-indigo-200 hover:bg-indigo-500/20 text-xs"}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {mangas.length === 0 ? (
            <div className="text-center text-amber-300/60 py-10">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum mangá cadastrado no Codex.</p>
              <p className="text-sm">Adicione uma obra na Biblioteca para começar a registrar sua aventura.</p>
            </div>
          ) : filteredCodexEntries.length === 0 ? (
            <div className="text-center text-amber-300/60 py-10">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum registro encontrado.</p>
              <p className="text-sm">Tente alterar a busca ou os filtros do Codex.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredCodexEntries.map(({ manga, abilities: mangaAbilities, items: mangaItems, titles: mangaTitles, journeyMissions: mangaJourneyMissions, remainingEpisodes, hasContent }) => {
                const currentEpisode = manga.currentEpisode || 0
                const totalChapters = manga.totalChapters || 0
                const progress = totalChapters > 0 ? Math.min(100, (currentEpisode / totalChapters) * 100) : 0
                const mangaTypeLabel = manga.type === "manga" ? "Mangá" : manga.type === "manhwa" ? "Manhwa" : "Manhua"

                return (
                  <Card key={manga.id} className="bg-slate-700/50 border-indigo-500/30 shadow-lg shadow-purple-500/10">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex gap-4">
                        <div className="relative w-20 h-28 flex-shrink-0 overflow-hidden rounded-md border border-indigo-400/40 bg-slate-800/80">
                          {manga.coverImage ? (
                            <img src={manga.coverImage} alt={`Capa de ${manga.title}`} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <BookOpen className="w-8 h-8 text-indigo-300/60" />
                            </div>
                          )}
                          <div className={`absolute top-1 right-1 rounded-full px-2 py-1 text-[10px] font-bold shadow-lg ${remainingEpisodes > 0 ? "bg-orange-500 text-white" : "bg-emerald-500 text-white"}`}>
                            {remainingEpisodes > 0 ? remainingEpisodes : "✓"}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-bold text-amber-100 truncate">{manga.title}</h4>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="outline" className="text-[10px] text-amber-200">{mangaTypeLabel}</Badge>
                                <Badge className={remainingEpisodes > 0 ? "bg-orange-600 text-white text-[10px]" : "bg-emerald-600 text-white text-[10px]"}>
                                  {remainingEpisodes > 0 ? "Pendente" : "Em dia"}
                                </Badge>
                              </div>
                            </div>
                            <span className="text-xs text-amber-300/70 whitespace-nowrap">
                              {remainingEpisodes > 0 ? `${remainingEpisodes} restantes` : "Concluído"}
                            </span>
                          </div>
                          <div className="text-xs text-amber-300/80">
                            Capítulos: <strong className="text-amber-100">{currentEpisode}</strong> / {totalChapters > 0 ? totalChapters : "—"}
                          </div>
                          <Progress value={progress} className="h-2 bg-slate-600" />
                          {mangaJourneyMissions.length > 0 && (
                            <div className="rounded bg-indigo-500/10 p-2 text-xs text-indigo-200">
                              <div className="mb-1 flex justify-between gap-2">
                                <span>Jornada</span>
                                <span>{mangaJourneyMissions.filter((mission) => mission.completed).length}/{mangaJourneyMissions.length} marcos</span>
                              </div>
                              <Progress
                                value={(mangaJourneyMissions.filter((mission) => mission.completed).length / mangaJourneyMissions.length) * 100}
                                className="h-1.5 bg-slate-600"
                              />
                            </div>
                          )}
                          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                            <div className="rounded bg-amber-500/10 p-1 text-amber-200">{mangaAbilities.length} habilidades</div>
                            <div className="rounded bg-blue-500/10 p-1 text-blue-200">{mangaItems.length} itens</div>
                            <div className="rounded bg-purple-500/10 p-1 text-purple-200">{mangaTitles.length} títulos</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                          <h5 className="text-sm font-semibold text-amber-200 mb-2">Habilidades</h5>
                          {mangaAbilities.length === 0 ? (
                            <p className="text-xs text-amber-300/50">Nenhuma desbloqueada.</p>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {mangaAbilities.map((ability) => (
                                <Badge key={ability.id} className="bg-amber-600/70 text-[10px]">{ability.name}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                          <h5 className="text-sm font-semibold text-blue-200 mb-2">Itens</h5>
                          {mangaItems.length === 0 ? (
                            <p className="text-xs text-blue-300/50">Nenhum desbloqueado.</p>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {mangaItems.map((item) => (
                                <Badge key={item.id} className="bg-blue-600/70 text-[10px]">
                                  {item.name} · {itemRarityLabels[item.rarity] || item.rarity}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3">
                          <h5 className="text-sm font-semibold text-purple-200 mb-2">Títulos</h5>
                          {mangaTitles.length === 0 ? (
                            <p className="text-xs text-purple-300/50">Nenhum desbloqueado.</p>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {mangaTitles.map((title) => (
                                <Badge key={title.id} className={title.active ? "bg-purple-600/70 text-[10px]" : "bg-slate-600 text-[10px]"}>
                                  {title.name}{title.active ? " · Ativo" : ""}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {!hasContent && (
                        <p className="text-center text-xs text-indigo-200/60">Leia mais capítulos para desbloquear conteúdo neste mangá.</p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de Missões e Jornadas */}
      <Modal
        isOpen={activeModal === "missions"}
        onClose={() => {
          setActiveModal(null)
          setIsMinimized(false)
        }}
        title="Quadro de Missões"
        icon="🧭"
        size="xl"
      >
        <div className="space-y-5">
          <Card className="overflow-hidden border-orange-400/30 bg-gradient-to-br from-orange-950/70 via-slate-800/80 to-purple-950/70 shadow-lg shadow-orange-500/10">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge className="bg-orange-600/80 text-white">Temporada ativa</Badge>
                    <Badge variant="outline" className="border-orange-300/30 text-orange-200">Nível {season.level}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-orange-100 font-serif">{season.title}</h3>
                  <p className="text-sm text-orange-200/70 mt-1">{season.subtitle}</p>
                </div>
                <div className="w-full md:w-64 space-y-2">
                  <div className="flex justify-between text-xs text-orange-200">
                    <span>Progresso da temporada</span>
                    <span>{season.experience} / {season.experienceToNextLevel} XP</span>
                  </div>
                  <Progress value={seasonProgress} className="h-3 bg-slate-700" />
                  <p className="text-right text-[11px] text-orange-200/60">Complete missões para evoluir sua temporada.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-orange-400/20 bg-orange-500/10 p-3 text-center">
              <Target className="mx-auto mb-1 h-5 w-5 text-orange-300" />
              <p className="text-[11px] text-orange-200/70">Missões concluídas</p>
              <p className="text-lg font-bold text-orange-100">{completedMissionCount}/{missions.length}</p>
            </div>
            <div className="rounded-lg border border-blue-400/20 bg-blue-500/10 p-3 text-center">
              <BookOpen className="mx-auto mb-1 h-5 w-5 text-blue-300" />
              <p className="text-[11px] text-blue-200/70">Capítulos lidos</p>
              <p className="text-lg font-bold text-blue-100">{totalReadChapters}</p>
            </div>
            <div className="rounded-lg border border-green-400/20 bg-green-500/10 p-3 text-center">
              <CalendarDays className="mx-auto mb-1 h-5 w-5 text-green-300" />
              <p className="text-[11px] text-green-200/70">Dias de leitura</p>
              <p className="text-lg font-bold text-green-100">{readingDays}</p>
            </div>
            <div className="rounded-lg border border-purple-400/20 bg-purple-500/10 p-3 text-center">
              <Medal className="mx-auto mb-1 h-5 w-5 text-purple-300" />
              <p className="text-[11px] text-purple-200/70">Conquistas</p>
              <p className="text-lg font-bold text-purple-100">{unlockedAchievementCount}/{achievements.length}</p>
            </div>
          </div>

          {nextMission && (
            <Card className="border-indigo-400/30 bg-indigo-950/40">
              <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{nextMission.icon}</div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Próximo objetivo</p>
                    <h4 className="font-bold text-indigo-100">{nextMission.title}</h4>
                    <p className="text-xs text-indigo-200/70">{nextMission.description}</p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xs text-indigo-200/60">Recompensa</p>
                  <p className="font-bold text-indigo-200">+{nextMission.rewardXP} XP</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-amber-100 font-serif">Missões ativas</h3>
              <p className="text-xs text-amber-200/60">Leia, avance e transforme cada capítulo em progresso.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {([
                ["all", "Todas"],
                ["daily", "Diárias"],
                ["weekly", "Semanais"],
                ["journey", "Jornadas"],
              ] as const).map(([value, label]) => (
                <Button
                  key={value}
                  size="sm"
                  variant={missionTypeFilter === value ? "default" : "outline"}
                  onClick={() => setMissionTypeFilter(value)}
                  className={missionTypeFilter === value ? "bg-orange-600 hover:bg-orange-700 text-white" : "border-orange-500/30 text-orange-200 hover:bg-orange-500/10"}
                >
                  {label}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={refreshProgression}
                className="border-indigo-400/30 text-indigo-200 hover:bg-indigo-500/10"
                title="Atualizar progresso das missões"
              >
                <RefreshCw className="mr-1 h-3.5 w-3.5" />
                Atualizar
              </Button>
            </div>
          </div>

          {filteredMissions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-orange-400/30 bg-slate-800/30 p-8 text-center">
              <Target className="mx-auto mb-3 h-10 w-10 text-orange-300/50" />
              <p className="text-orange-200/70">Nenhuma missão disponível neste filtro.</p>
              <p className="text-xs text-orange-200/50 mt-1">Cadastre um mangá ou avance sua leitura para criar novas Jornadas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {filteredMissions.map((mission) => {
                const progressPercent = mission.target > 0 ? Math.min(100, (mission.progress / mission.target) * 100) : 0
                const typeLabel = mission.type === "daily" ? "Diária" : mission.type === "weekly" ? "Semanal" : "Jornada"
                const linkedManga = mission.mangaId ? getMangaById(mission.mangaId) : undefined
                return (
                  <Card key={mission.id} className={`border transition-colors ${mission.completed ? "border-emerald-400/30 bg-emerald-950/20" : "border-orange-400/20 bg-slate-800/60"}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="text-2xl">{mission.icon}</div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="truncate font-bold text-amber-100">{mission.title}</h4>
                              <Badge variant="outline" className="border-amber-400/30 text-[10px] text-amber-200">{typeLabel}</Badge>
                            </div>
                            <p className="mt-1 text-xs text-amber-200/65">{mission.description}</p>
                            {linkedManga && <p className="mt-1 truncate text-[11px] text-indigo-200/70">Obra: {linkedManga.title}</p>}
                          </div>
                        </div>
                        {mission.completed ? (
                          <Badge className="shrink-0 bg-emerald-600/80 text-white">Concluída</Badge>
                        ) : (
                          <Badge className="shrink-0 bg-orange-600/70 text-white">+{mission.rewardXP} XP</Badge>
                        )}
                      </div>
                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-[11px] text-amber-200/70">
                          <span>{mission.completed ? "Objetivo alcançado" : "Progresso"}</span>
                          <span>{mission.progress} / {mission.target}</span>
                        </div>
                        <Progress value={progressPercent} className={`h-2 ${mission.completed ? "bg-emerald-950" : "bg-slate-700"}`} />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-purple-100 font-serif">Conquistas</h3>
                <p className="text-xs text-purple-200/60">Feitos permanentes que registram sua evolução.</p>
              </div>
              <Badge className="bg-purple-600/70 text-white">{unlockedAchievementCount} desbloqueadas</Badge>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {achievements.map((achievement) => {
                const achievementPercent = achievement.target > 0 ? Math.min(100, (achievement.progress / achievement.target) * 100) : 0
                return (
                  <Card key={achievement.id} className={`border ${achievement.unlocked ? "border-purple-400/40 bg-purple-950/30" : "border-slate-600/60 bg-slate-800/40"}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className={`text-2xl ${achievement.unlocked ? "" : "grayscale opacity-50"}`}>{achievement.icon}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="truncate font-semibold text-purple-100">{achievement.title}</h4>
                            {achievement.unlocked && <Badge className="bg-purple-600/80 text-[10px] text-white">Desbloqueada</Badge>}
                          </div>
                          <p className="mt-1 text-xs text-purple-200/60">{achievement.description}</p>
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-[10px] text-purple-200/60"><span>{achievement.progress} / {achievement.target}</span><span>+{achievement.rewardXP} XP</span></div>
                            <Progress value={achievementPercent} className="h-1.5 bg-slate-700" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal de Configurações */}
      <Modal
        isOpen={activeModal === "settings"}
        onClose={() => {
          setActiveModal(null)
          setIsMinimized(false)
        }}
        title="Configurações"
        icon="⚙️"
        size="md"
      >
        <ModalSection title="Avatar do Personagem" icon="🖼️">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {userImage ? (
                <div className="flex items-center gap-4">
                  <img 
                    src={userImage} 
                    alt="Avatar atual" 
                    className="w-20 h-20 rounded-full border-2 border-amber-500/50 object-cover shadow-lg"
                  />
                  <div>
                    <p className="text-amber-200 font-semibold">Avatar Atual</p>
                    <p className="text-amber-300/80 text-sm">Imagem do seu personagem</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full border-2 border-amber-500/50 bg-slate-700/50 flex items-center justify-center">
                    <span className="text-4xl">⚔️</span>
                  </div>
                  <div>
                    <p className="text-amber-200 font-semibold">Avatar Padrão</p>
                    <p className="text-amber-300/80 text-sm">Nenhuma imagem selecionada</p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <Button
                  asChild
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <label htmlFor="avatar-upload" className="cursor-pointer flex items-center justify-center gap-2">
                    <span className="text-lg">📷</span>
                    {userImage ? 'Alterar Avatar' : 'Adicionar Avatar'}
                  </label>
                </Button>
              </label>
              {userImage && (
                <Button
                  variant="outline"
                  onClick={handleRemoveImage}
                  className="w-full text-red-400 border-red-400/50 hover:bg-red-400/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover Avatar
                </Button>
              )}
            </div>
          </div>
        </ModalSection>

        <ModalSection title="Gerenciamento de Dados" icon="💾">
          {/* Área de Código de 8 dígitos */}
          <div className="space-y-4 mb-4">
            <div className="space-y-2">
              <Label className="text-amber-200 font-serif">Seu Código de Compartilhamento</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={shareCode}
                  readOnly
                  placeholder="Clique em 'Gerar Código' para criar um código"
                  className="bg-slate-700 border-amber-500/30 text-amber-100 font-mono text-lg text-center font-bold tracking-widest"
                  maxLength={8}
                />
                {shareCode && (
                  <Button
                    onClick={handleCopyCode}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    size="icon"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  onClick={handleUpdateCode}
                  disabled={isGeneratingCode}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  title="Atualizar código atual com dados mais recentes"
                >
                  {isGeneratingCode ? "Atualizando..." : "Atualizar"}
                </Button>
                <Button
                  onClick={handleExportCode}
                  disabled={isGeneratingCode}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  title="Gerar um novo código (código anterior será invalidado)"
                >
                  {isGeneratingCode ? "Gerando..." : "Novo Código"}
                </Button>
              </div>
              <p className="text-xs text-amber-300/60 font-serif">
                💡 Use "Atualizar" para manter o mesmo código atualizado ou "Novo Código" para gerar um novo
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-amber-200 font-serif">Importar por Código</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={importCodeValue}
                  onChange={(e) => setImportCodeValue(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="Digite o código de 8 dígitos"
                  className="bg-slate-700 border-amber-500/30 text-amber-100 font-mono text-lg text-center font-bold tracking-widest"
                  maxLength={8}
                />
                <Button
                  onClick={handleImportCode}
                  disabled={isImportingCode || !importCodeValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isImportingCode ? "Importando..." : "Importar"}
                </Button>
              </div>
              <p className="text-xs text-amber-300/60 font-serif">
                Cole um código de 8 dígitos para importar o progresso
              </p>
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-amber-500/30"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800/50 px-2 text-amber-300/60 font-serif">
                Ou use arquivos JSON
              </span>
            </div>
          </div>

          {/* Botões de JSON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={handleExportData}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 h-auto"
              >
                <div className="text-xl mb-1">📥</div>
                <div className="font-semibold text-sm">Exportar JSON</div>
                <div className="text-xs opacity-80">Salvar arquivo</div>
              </Button>
              <Button
                onClick={handleImportData}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 h-auto"
              >
                <div className="text-xl mb-1">📤</div>
                <div className="font-semibold text-sm">Importar JSON</div>
                <div className="text-xs opacity-80">Carregar arquivo</div>
              </Button>
            </div>
            <div className="pt-3 border-t border-amber-500/20">
              <Button
                onClick={() => {
                  if (confirm("Tem certeza que deseja resetar seu perfil? Esta ação não pode ser desfeita!")) {
                    resetProfile()
                  }
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 h-auto"
              >
                <div className="text-xl mb-1">🔄</div>
                <div className="font-semibold text-sm">Resetar Perfil</div>
                <div className="text-xs opacity-80">Ação irreversível</div>
              </Button>
            </div>
        </ModalSection>
      </Modal>

      {/* Dialogs existentes */}
      <AddMangaDialog open={showAddManga} onOpenChange={setShowAddManga} />
      <AddContentDialog open={showAddContent} onOpenChange={setShowAddContent} mangaId={selectedManga} initialTab={contentInitialTab} />
      
      <EditAbilityDialog
        open={editAbilityDialogOpen}
        onOpenChange={setEditAbilityDialogOpen}
        ability={abilityToEdit}
      />
      
      <EditItemIsekaiDialog
        open={editItemDialogOpen}
        onOpenChange={setEditItemDialogOpen}
        item={itemToEdit}
      />
      
      <EditAttributesDialog
        open={editAttributesDialogOpen}
        onOpenChange={setEditAttributesDialogOpen}
      />
      
      <EditMangaDialog
        open={editMangaDialogOpen}
        onOpenChange={setEditMangaDialogOpen}
        manga={mangaToEdit}
      />
    </div>
  )
}
