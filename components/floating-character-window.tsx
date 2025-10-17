"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Modal, ModalSection, ModalGrid, ModalCard } from "@/components/ui/modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsekai } from "./isekai-provider"
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
  X
} from "lucide-react"
import Image from "next/image"

interface FloatingCharacterWindowProps {
  userName: string
}

export function FloatingCharacterWindow({ userName }: FloatingCharacterWindowProps) {
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
    decrementEpisode 
  } = useIsekai()

  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)

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
  const [abilityToEdit, setAbilityToEdit] = useState<any>(null)
  const [itemToEdit, setItemToEdit] = useState<any>(null)
  const [xpGainAnimation, setXpGainAnimation] = useState<{ show: boolean; amount: number; x: number; y: number }>({ show: false, amount: 0, x: 0, y: 0 })
  const [levelUpAnimation, setLevelUpAnimation] = useState(false)
  const [xpBarGlow, setXpBarGlow] = useState(false)

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
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `isekai-progress-${userName}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
            const data = JSON.parse(e.target?.result as string)
            importData(data)
            alert("Dados importados com sucesso!")
          } catch (error) {
            alert("Erro ao importar dados. Verifique se o arquivo está correto.")
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
            {abilities.length === 0 ? (
              <div className="text-center text-amber-300/60 py-8">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma habilidade adquirida ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {abilities.map((ability) => (
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
            {items.length === 0 ? (
              <div className="text-center text-amber-300/60 py-8">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum item adquirido ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
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
        }}
        title="Biblioteca"
        icon="📚"
        size="lg"
      >
            <div className="flex justify-between items-center">
              <h3 className="text-amber-200 font-serif">Minha Biblioteca</h3>
              <Button 
                onClick={() => setShowAddManga(true)} 
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Manga
              </Button>
            </div>
            {mangas.length === 0 ? (
              <div className="text-center text-amber-300/60 py-8">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum manga adicionado ainda.</p>
                <p className="text-sm">Comece adicionando os mangás que você leu!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mangas.map((manga) => (
                  <Card 
                    key={manga.id} 
                    className="relative overflow-hidden bg-slate-700/50 border-amber-500/30 shadow-lg shadow-purple-500/10 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  >
                    {manga.coverImage && (
                      <div className="absolute inset-0">
                        <Image
                          src={manga.coverImage || "/placeholder.svg"}
                          alt={manga.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/50" />
                      </div>
                    )}
                    
                    <CardContent className="relative z-20 p-4 h-full flex flex-col justify-between min-h-[200px]">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-white mb-1">{manga.title}</h4>
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                              {manga.type}
                            </Badge>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {manga.url && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(manga.url, '_blank')}
                                className="text-white hover:bg-blue-600/30 bg-black/20 hover:scale-110 transition-all duration-200 w-8 h-8"
                                title="Ir para o site"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setMangaToEdit(manga)
                                setEditMangaDialogOpen(true)
                              }}
                              className="text-white hover:bg-amber-600/30 bg-black/20 hover:scale-110 transition-all duration-200 w-8 h-8"
                              title="Editar mangá"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeManga(manga.id)}
                              className="text-white hover:bg-red-600/30 bg-black/20 hover:scale-110 transition-all duration-200 w-8 h-8"
                              title="Apagar mangá"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex items-center justify-between bg-white/10 rounded-lg p-2 border border-white/20">
                            <div className="flex items-center gap-2">
                              <Hash className="w-3 h-3 text-amber-300" />
                              <span className="text-xs text-white/90">Episódio:</span>
                              <span className="text-sm font-bold text-amber-300">
                                {manga.currentEpisode ?? 0}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => decrementEpisode(manga.id)}
                                className="w-6 h-6 text-white hover:bg-red-500/30 hover:scale-110 transition-all duration-200"
                                title="Episódio anterior"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => incrementEpisode(manga.id)}
                                className="w-6 h-6 text-white hover:bg-green-500/30 hover:scale-110 transition-all duration-200"
                                title="Próximo episódio"
                              >
                                <ChevronUp className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
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
                  </Card>
                ))}
              </div>
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
            {titles.length === 0 ? (
              <div className="text-center text-amber-300/60 py-8">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum título conquistado ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {titles.map((title) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={handleExportData}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 h-auto"
              >
                <div className="text-xl mb-1">📥</div>
                <div className="font-semibold text-sm">Exportar Progresso</div>
                <div className="text-xs opacity-80">Salvar seus dados</div>
              </Button>
              <Button
                onClick={handleImportData}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 h-auto"
              >
                <div className="text-xl mb-1">📤</div>
                <div className="font-semibold text-sm">Importar Progresso</div>
                <div className="text-xs opacity-80">Carregar dados salvos</div>
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
