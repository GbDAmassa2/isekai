"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsekai } from "./isekai-provider"
import { AddMangaDialog } from "./add-manga-dialog"
import { AddContentDialog } from "./add-content-dialog"
import { EditAbilityDialog } from "./edit-ability-dialog"
import { EditItemIsekaiDialog } from "./edit-item-isekai-dialog"
import { EditAttributesDialog } from "./edit-attributes-dialog"
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
          <Button
            onClick={() => setIsMinimized(false)}
            className="w-16 h-16 bg-gradient-to-br from-slate-800 via-purple-800 to-indigo-800 border-2 border-amber-500/30 shadow-2xl shadow-purple-500/20 hover:scale-110 transition-all duration-300 rounded-full"
            title="Abrir Painel do Personagem"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">⚔️</div>
              <div className="text-xs font-bold text-amber-200">{profile.level}</div>
            </div>
          </Button>
          
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
              className="text-xs border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Atributos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleModalOpen("abilities")}
              className="text-xs border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
            >
              <Zap className="w-3 h-3 mr-1" />
              Habilidades
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleModalOpen("inventory")}
              className="text-xs border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
            >
              <Package className="w-3 h-3 mr-1" />
              Inventário
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleModalOpen("mangas")}
              className="text-xs border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              Mangás
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleModalOpen("titles")}
              className="text-xs border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
            >
              <Trophy className="w-3 h-3 mr-1" />
              Títulos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleModalOpen("settings")}
              className="text-xs border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
            >
              <Settings className="w-3 h-3 mr-1" />
              Config
            </Button>
          </div>
        </CardContent>
        </Card>
      )}

      {/* Modal de Atributos */}
      <Dialog open={activeModal === "attributes"} onOpenChange={(open) => {
        if (!open) {
          setActiveModal(null)
          setIsMinimized(false)
        }
      }}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-800 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-amber-200 font-serif text-2xl">⚔️ Atributos do Personagem</DialogTitle>
            <p className="text-amber-300/80 text-sm">Informações completas sobre seus atributos e estatísticas</p>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Status Vitais Detalhados */}
            <div className="bg-slate-700/30 rounded-lg p-6 border border-amber-500/20">
              <h3 className="text-xl font-bold text-amber-200 mb-4 font-serif">💖 Status Vitais</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* HP */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Heart className="w-8 h-8 text-red-500" />
                    <div>
                      <h4 className="text-lg font-semibold text-red-200">Vida (HP)</h4>
                      <p className="text-sm text-red-300/80">Pontos de vida</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-red-300">Atual</span>
                      <span className="font-bold text-red-200">{Math.floor(hpCurrent)} / {hpMax}</span>
                    </div>
                    <Progress value={hpPercentage} className="h-3 bg-slate-600" />
                    <div className="text-xs text-red-300/60">
                      Base: 100 + ({profile.attributes.vitality || 0} × 10) = {hpMax}
                    </div>
                  </div>
                </div>

                {/* MP */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Droplet className="w-8 h-8 text-blue-500" />
                    <div>
                      <h4 className="text-lg font-semibold text-blue-200">Mana (MP)</h4>
                      <p className="text-sm text-blue-300/80">Pontos de mana</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-300">Atual</span>
                      <span className="font-bold text-blue-200">{Math.floor(mpCurrent)} / {mpMax}</span>
                    </div>
                    <Progress value={mpPercentage} className="h-3 bg-slate-600" />
                    <div className="text-xs text-blue-300/60">
                      Base: 50 + ({profile.attributes.intelligence || 0} × 5) = {mpMax}
                    </div>
                  </div>
                </div>

                {/* Stamina */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Wind className="w-8 h-8 text-green-500" />
                    <div>
                      <h4 className="text-lg font-semibold text-green-200">Stamina</h4>
                      <p className="text-sm text-green-300/80">Energia física</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-300">Atual</span>
                      <span className="font-bold text-green-200">{Math.floor(staminaCurrent)} / {staminaMax}</span>
                    </div>
                    <Progress value={staminaPercentage} className="h-3 bg-slate-600" />
                    <div className="text-xs text-green-300/60">
                      Base: 80 + ({profile.attributes.agility || 0} × 3) = {staminaMax}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Atributos Primários */}
            <div className="bg-slate-700/30 rounded-lg p-6 border border-amber-500/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-amber-200 font-serif">⭐ Atributos Primários</h3>
                <Button
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  size="sm"
                  onClick={() => setEditAttributesDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Editar Atributos
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(profile.attributes).map(([key, value]) => (
                  <div 
                    key={key} 
                    className="flex flex-col items-center gap-3 p-4 bg-slate-600/30 rounded-lg border border-amber-500/20 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {key === "strength" && "⚔️"}
                      {key === "agility" && "⚡"}
                      {key === "intelligence" && "🔮"}
                      {key === "vitality" && "❤️"}
                      {key === "luck" && "🍀"}
                      {!["strength", "agility", "intelligence", "vitality", "luck"].includes(key) && "✨"}
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-amber-300 capitalize font-serif mb-1">{key}</div>
                      <div className="text-3xl font-bold text-amber-200">{value}</div>
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
              </div>
            </div>

            {/* Atributos Derivados */}
            <div className="bg-slate-700/30 rounded-lg p-6 border border-amber-500/20">
              <h3 className="text-xl font-bold text-amber-200 mb-4 font-serif">🛡️ Atributos Derivados</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Ataque Físico */}
                <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="text-3xl">⚔️</div>
                  <div>
                    <div className="text-sm text-red-300">Ataque Físico</div>
                    <div className="text-xl font-bold text-red-200">
                      {Math.floor((profile.attributes.strength || 0) * 2.5)}
                    </div>
                  </div>
                </div>

                {/* Ataque Mágico */}
                <div className="flex items-center gap-3 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="text-3xl">🔮</div>
                  <div>
                    <div className="text-sm text-purple-300">Ataque Mágico</div>
                    <div className="text-xl font-bold text-purple-200">
                      {Math.floor((profile.attributes.intelligence || 0) * 3)}
                    </div>
                  </div>
                </div>

                {/* Defesa Física */}
                <div className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-3xl">🛡️</div>
                  <div>
                    <div className="text-sm text-blue-300">Defesa Física</div>
                    <div className="text-xl font-bold text-blue-200">
                      {Math.floor((profile.attributes.vitality || 0) * 1.5)}
                    </div>
                  </div>
                </div>

                {/* Defesa Mágica */}
                <div className="flex items-center gap-3 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <div className="text-3xl">🔰</div>
                  <div>
                    <div className="text-sm text-cyan-300">Defesa Mágica</div>
                    <div className="text-xl font-bold text-cyan-200">
                      {Math.floor((profile.attributes.intelligence || 0) * 2)}
                    </div>
                  </div>
                </div>

                {/* Velocidade */}
                <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-3xl">💨</div>
                  <div>
                    <div className="text-sm text-green-300">Velocidade</div>
                    <div className="text-xl font-bold text-green-200">
                      {Math.floor((profile.attributes.agility || 0) * 2)}
                    </div>
                  </div>
                </div>

                {/* Crítico */}
                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="text-3xl">💥</div>
                  <div>
                    <div className="text-sm text-yellow-300">Taxa Crítica</div>
                    <div className="text-xl font-bold text-yellow-200">
                      {Math.floor((profile.attributes.luck || 0) * 1.2)}%
                    </div>
                  </div>
                </div>

                {/* Evasão */}
                <div className="flex items-center gap-3 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <div className="text-3xl">🌪️</div>
                  <div>
                    <div className="text-sm text-indigo-300">Evasão</div>
                    <div className="text-xl font-bold text-indigo-200">
                      {Math.floor((profile.attributes.agility || 0) * 1.5)}%
                    </div>
                  </div>
                </div>

                {/* Regeneração */}
                <div className="flex items-center gap-3 p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
                  <div className="text-3xl">💚</div>
                  <div>
                    <div className="text-sm text-pink-300">Regeneração</div>
                    <div className="text-xl font-bold text-pink-200">
                      {Math.floor((profile.attributes.vitality || 0) * 0.8)}/turno
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo de Progressão */}
            <div className="bg-slate-700/30 rounded-lg p-6 border border-amber-500/20">
              <h3 className="text-xl font-bold text-amber-200 mb-4 font-serif">📊 Resumo de Progressão</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-600/30 rounded-lg">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="text-sm text-amber-300">Mangás Lidos</div>
                  <div className="text-xl font-bold text-amber-200">{profile.totalMangasRead}</div>
                </div>
                <div className="text-center p-4 bg-slate-600/30 rounded-lg">
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="text-sm text-amber-300">Habilidades</div>
                  <div className="text-xl font-bold text-amber-200">{profile.totalAbilities}</div>
                </div>
                <div className="text-center p-4 bg-slate-600/30 rounded-lg">
                  <div className="text-2xl mb-2">👑</div>
                  <div className="text-sm text-amber-300">Títulos</div>
                  <div className="text-xl font-bold text-amber-200">{profile.titles.length}</div>
                </div>
                <div className="text-center p-4 bg-slate-600/30 rounded-lg">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm text-amber-300">Nível</div>
                  <div className="text-xl font-bold text-amber-200">{profile.level}</div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Habilidades */}
      <Dialog open={activeModal === "abilities"} onOpenChange={(open) => {
        if (!open) {
          setActiveModal(null)
          setIsMinimized(false)
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-amber-200 font-serif">⭐ Habilidades</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
                  <Card key={ability.id} className="bg-slate-700/30 border-amber-500/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-amber-200">{ability.name}</h4>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <Badge variant={ability.type === "active" ? "default" : "secondary"} className="text-xs">
                              {ability.type === "active" ? "Ativa" : "Passiva"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">Nível {ability.level}</Badge>
                            <Badge className="bg-gradient-power text-xs">Poder: {ability.power}</Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-amber-300/80 mb-3">{ability.description}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => {
                            setAbilityToEdit(ability)
                            setEditAbilityDialogOpen(true)
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
                            if (confirm(`Tem certeza que deseja excluir a habilidade "${ability.name}"?`)) {
                              deleteAbility(ability.id)
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Inventário */}
      <Dialog open={activeModal === "inventory"} onOpenChange={(open) => {
        if (!open) {
          setActiveModal(null)
          setIsMinimized(false)
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-amber-200 font-serif">🎒 Inventário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
                  <Card key={item.id} className="bg-slate-700/30 border-amber-500/20">
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Mangás */}
      <Dialog open={activeModal === "mangas"} onOpenChange={(open) => {
        if (!open) {
          setActiveModal(null)
          setIsMinimized(false)
        }
      }}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto bg-slate-800 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-amber-200 font-serif">📚 Biblioteca</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
                    className="relative overflow-hidden bg-slate-700/30 border-amber-500/20 hover:scale-105 transition-all duration-300 cursor-pointer group"
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Títulos */}
      <Dialog open={activeModal === "titles"} onOpenChange={(open) => {
        if (!open) {
          setActiveModal(null)
          setIsMinimized(false)
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-amber-200 font-serif">👑 Títulos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
                    className="bg-slate-700/30 border-amber-500/20 hover:scale-105 transition-all duration-300 cursor-pointer group"
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Configurações */}
      <Dialog open={activeModal === "settings"} onOpenChange={(open) => {
        if (!open) {
          setActiveModal(null)
          setIsMinimized(false)
        }
      }}>
        <DialogContent className="max-w-2xl bg-slate-800 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-amber-200 font-serif">⚙️ Configurações</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleExportData}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                📥 Exportar Progresso
              </Button>
              <Button
                onClick={handleImportData}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                📤 Importar Progresso
              </Button>
            </div>
            <div className="pt-4 border-t border-amber-500/20">
              <Button
                onClick={() => {
                  if (confirm("Tem certeza que deseja resetar seu perfil? Esta ação não pode ser desfeita!")) {
                    resetProfile()
                  }
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                🔄 Resetar Perfil
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
    </div>
  )
}
