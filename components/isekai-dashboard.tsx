"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useIsekai } from "./isekai-provider"
import { AddMangaDialog } from "./add-manga-dialog"
import { AddContentDialog } from "./add-content-dialog"
import { EditAbilityDialog } from "./edit-ability-dialog"
import { EditItemIsekaiDialog } from "./edit-item-isekai-dialog"
import { EditAttributesDialog } from "./edit-attributes-dialog"
import { BookOpen, Sparkles, Trophy, TrendingUp, Sword, Zap, Heart, Star, Plus, Trash2, Package, Edit, ExternalLink, ChevronUp, ChevronDown, Hash, LogOut, User } from "lucide-react"
import Image from "next/image"

interface IsekaiDashboardProps {
  userName: string
}

export function IsekaiDashboard({ userName }: IsekaiDashboardProps) {
  const { profile, mangas, abilities, items, titles, removeManga, getMangaById, addExperience, removeExperience, exportData, importData, editAbility, deleteAbility, editItem, deleteItem, resetProfile, toggleTitle, editTitle, deleteTitle, updateMangaEpisode, incrementEpisode, decrementEpisode } = useIsekai()
  const [showAddManga, setShowAddManga] = useState(false)
  const [showAddContent, setShowAddContent] = useState(false)
  const [selectedManga, setSelectedManga] = useState<string | null>(null)
  const [contentInitialTab, setContentInitialTab] = useState<"ability" | "item" | "title">("ability")
  const [editAbilityDialogOpen, setEditAbilityDialogOpen] = useState(false)
  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false)
  const [editAttributesDialogOpen, setEditAttributesDialogOpen] = useState(false)
  const [abilityToEdit, setAbilityToEdit] = useState<any>(null)
  const [itemToEdit, setItemToEdit] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [xpGainAnimation, setXpGainAnimation] = useState<{ show: boolean; amount: number; x: number; y: number }>({ show: false, amount: 0, x: 0, y: 0 })
  const [levelUpAnimation, setLevelUpAnimation] = useState(false)
  const [xpBarGlow, setXpBarGlow] = useState(false)
  const [activeTab, setActiveTab] = useState("mangas")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const experienceToNextLevel = profile.level * 100
  const experienceProgress = (profile.experience / experienceToNextLevel) * 100

  const rarityColors = {
    common: "bg-gray-500",
    uncommon: "bg-green-500",
    rare: "bg-blue-500",
    epic: "bg-purple-500",
    legendary: "bg-orange-500",
  }

  useEffect(() => {
    // Animação de entrada
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleXpGain = (amount: number, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    
    setXpGainAnimation({ show: true, amount, x, y })
    setXpBarGlow(true)
    
    // Reset XP gain animation
    setTimeout(() => {
      setXpGainAnimation(prev => ({ ...prev, show: false }))
    }, 2000)
    
    // Reset XP bar glow
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

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab || isTransitioning) return
    
    setIsTransitioning(true)
    
    setTimeout(() => {
      setActiveTab(newTab)
      setIsTransitioning(false)
    }, 250)
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
      // Não removemos os dados do usuário para preservar o progresso
      window.location.href = "/"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-2 md:p-4 lg:p-8 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm-20 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Animated Nebula Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Nebula Layers */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-purple-500/30 via-transparent to-transparent animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-radial from-indigo-500/20 via-transparent to-transparent animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
          <div className="absolute bottom-0 left-1/2 w-full h-full bg-gradient-radial from-amber-500/15 via-transparent to-transparent animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
        </div>
        
        {/* Floating Energy Orbs */}
        {[...Array(25)].map((_, i) => {
          // Deterministic positioning based on index
          const left = ((i * 17) % 100) + ((i * 7) % 20)
          const top = ((i * 23) % 100) + ((i * 11) % 15)
          const delay = (i * 0.2) % 5
          const duration = 3 + (i * 0.15) % 4
          
          return (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gradient-radial from-amber-400/40 via-purple-400/20 to-transparent rounded-full animate-pulse"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                filter: 'blur(1px)'
              }}
            />
          )
        })}
        
        {/* Cosmic Dust */}
        {[...Array(40)].map((_, i) => {
          // Deterministic positioning based on index
          const left = ((i * 13) % 100) + ((i * 5) % 25)
          const top = ((i * 19) % 100) + ((i * 9) % 20)
          const delay = (i * 0.15) % 6
          const duration = 4 + (i * 0.12) % 3
          
          return (
            <div
              key={`dust-${i}`}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-bounce"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`
              }}
            />
          )
        })}
        
        {/* Energy Streams */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute top-3/4 right-0 w-full h-px bg-gradient-to-l from-transparent via-amber-400/20 to-transparent animate-pulse" style={{ animationDuration: '8s', animationDelay: '3s' }} />
        </div>
      </div>

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

      <div className={`max-w-7xl mx-auto space-y-4 md:space-y-6 relative z-10 transition-all duration-1000 px-2 md:px-0 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Header com perfil */}
        <Card className={`border-2 border-amber-500/30 bg-gradient-to-r from-slate-800 via-purple-800 to-indigo-800 text-amber-100 shadow-2xl shadow-purple-500/20 relative overflow-hidden transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Ornamental border */}
          <div className="absolute inset-0 border-2 border-amber-400/20 rounded-lg pointer-events-none" style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(251, 191, 36, 0.1) 50%, transparent 70%)'
          }} />
          <CardHeader className="relative z-10 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <CardTitle className="text-2xl md:text-3xl font-bold text-amber-200 font-serif">{profile.name.toUpperCase()}</CardTitle>
                <CardDescription className="text-amber-300/80 font-serif text-sm md:text-base">
                  Nível {profile.level} - Cavaleiro Isekai
                </CardDescription>
              </div>
              <div className="text-center md:text-right">
                <div className="text-sm text-amber-300/80 font-serif">Experiência</div>
                <div className="text-xl md:text-2xl font-bold text-amber-200 font-serif">
                  {profile.experience} / {experienceToNextLevel}
                </div>
                <div className="mt-2 flex items-center justify-center md:justify-end gap-2">
                  <div className="flex items-center gap-1 text-xs text-amber-300/60">
                    <User className="w-3 h-3" />
                    {userName.toUpperCase()}
                  </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleExportData}
        className="text-amber-300/60 hover:text-green-400 hover:bg-green-500/20 text-xs"
        title="Exportar Progresso"
      >
        📥
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleImportData}
        className="text-amber-300/60 hover:text-blue-400 hover:bg-blue-500/20 text-xs"
        title="Importar Progresso"
      >
        📤
      </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-amber-300/60 hover:text-red-400 hover:bg-red-500/20 text-xs"
                    title="Sair"
                  >
                    <LogOut className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 font-serif hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30 text-xs md:text-sm" onClick={(e) => {
                    console.log('Botão Leu 1 Cap clicado!')
                    handleXpGain(10, e)
                  }}>
                    ⚔️ Leu 1 Cap (+10 XP)
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white border-purple-500 font-serif hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 text-xs md:text-sm" onClick={(e) => {
                    console.log('Botão Completou Leitura clicado!')
                    handleXpGain(1000, e)
                  }}>
                    👑 Completou Leitura (+1000 XP)
                  </Button>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white border-red-500 font-serif hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/30 text-xs md:text-sm" onClick={() => {
                    console.log('Botão Resetar Perfil clicado!')
                    resetProfile()
                  }}>
                    🔄 Resetar Perfil
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative mt-4">
              <Progress value={experienceProgress} className={`h-3 bg-slate-700 transition-all duration-1000 ease-out ${xpBarGlow ? 'shadow-lg shadow-amber-500/50' : ''}`} />
              {xpBarGlow && (
                <div className="absolute inset-0 h-3 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent animate-pulse rounded-full" />
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Estatísticas rápidas */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Card className="bg-slate-800/50 border-amber-500/20 shadow-lg shadow-purple-500/10 hover:scale-105 hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer">
            <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="text-2xl md:text-3xl animate-pulse">📚</div>
                <div>
                  <div className="text-lg md:text-2xl font-bold text-amber-200 font-serif">{profile.totalMangasRead}</div>
                  <div className="text-xs md:text-sm text-amber-300 font-serif">Mangás Lidos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-amber-500/20 shadow-lg shadow-purple-500/10 hover:scale-105 hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer">
            <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="text-2xl md:text-3xl animate-bounce">⭐</div>
                <div>
                  <div className="text-lg md:text-2xl font-bold text-amber-200 font-serif">{profile.totalAbilities}</div>
                  <div className="text-xs md:text-sm text-amber-300 font-serif">Habilidades</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-amber-500/20 shadow-lg shadow-purple-500/10 hover:scale-105 hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer">
            <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="text-2xl md:text-3xl animate-pulse">👑</div>
                <div>
                  <div className="text-lg md:text-2xl font-bold text-amber-200 font-serif">{profile.titles.length}</div>
                  <div className="text-xs md:text-sm text-amber-300 font-serif">Títulos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-amber-500/20 shadow-lg shadow-purple-500/10 hover:scale-105 hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer">
            <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="text-2xl md:text-3xl animate-bounce">📈</div>
                <div>
                  <div className="text-lg md:text-2xl font-bold text-amber-200 font-serif">{profile.level}</div>
                  <div className="text-xs md:text-sm text-amber-300 font-serif">Nível</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Atributos */}
        <Card className="bg-slate-800/50 border-amber-500/20 shadow-lg shadow-purple-500/10">
          <CardHeader className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <div>
                <CardTitle className="text-amber-200 font-serif text-lg md:text-xl">⚔️ Atributos Totais</CardTitle>
                <CardDescription className="text-amber-300/80 font-serif text-sm">Baseado em habilidades, itens e títulos</CardDescription>
              </div>
              <Button
                className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 font-serif text-xs md:text-sm"
                size="sm"
                onClick={() => setEditAttributesDialogOpen(true)}
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Editar Atributos
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
              {Object.entries(profile.attributes).map(([key, value], index) => (
                <div 
                  key={key} 
                  className={`flex items-center gap-1 md:gap-2 p-2 md:p-3 bg-slate-700/30 rounded-lg border border-amber-500/20 hover:scale-105 hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  {key === "strength" && <div className="text-lg md:text-2xl">⚔️</div>}
                  {key === "agility" && <div className="text-lg md:text-2xl">⚡</div>}
                  {key === "intelligence" && <div className="text-lg md:text-2xl">🔮</div>}
                  {key === "vitality" && <div className="text-lg md:text-2xl">❤️</div>}
                  {key === "luck" && <div className="text-lg md:text-2xl">🍀</div>}
                  {!["strength", "agility", "intelligence", "vitality", "luck"].includes(key) && (
                    <div className="text-lg md:text-2xl">✨</div>
                  )}
                  <div>
                    <div className="text-xs md:text-sm text-amber-300 capitalize font-serif">{key}</div>
                    <div className="text-lg md:text-2xl font-bold text-amber-200 font-serif">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs principais */}
        <div className={`space-y-4 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid w-full grid-cols-4 overflow-x-auto md:overflow-visible bg-slate-800/50 border-amber-500/20 rounded-lg p-1 relative min-w-0">
            {/* Indicador animado */}
            <div 
              className={`absolute top-1 bottom-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md transition-all duration-500 ease-out ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
              style={{
                left: `${(activeTab === "mangas" ? 0 : activeTab === "abilities" ? 1 : activeTab === "inventory" ? 2 : 3) * 25}%`,
                width: '25%',
                boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)'
              }}
            />
            
            <button
              onClick={() => handleTabChange("mangas")}
              className={`relative z-10 font-serif text-amber-200 hover:scale-105 transition-all duration-200 py-2 px-2 md:px-4 rounded-md text-xs md:text-sm ${
                activeTab === "mangas" ? "text-white font-bold" : "hover:text-amber-100"
              }`}
            >
              📚 <span className="hidden sm:inline">Biblioteca</span>
            </button>
            <button
              onClick={() => handleTabChange("abilities")}
              className={`relative z-10 font-serif text-amber-200 hover:scale-105 transition-all duration-200 py-2 px-2 md:px-4 rounded-md text-xs md:text-sm ${
                activeTab === "abilities" ? "text-white font-bold" : "hover:text-amber-100"
              }`}
            >
              ⭐ <span className="hidden sm:inline">Habilidades</span>
            </button>
            <button
              onClick={() => handleTabChange("inventory")}
              className={`relative z-10 font-serif text-amber-200 hover:scale-105 transition-all duration-200 py-2 px-2 md:px-4 rounded-md text-xs md:text-sm ${
                activeTab === "inventory" ? "text-white font-bold" : "hover:text-amber-100"
              }`}
            >
              🎒 <span className="hidden sm:inline">Inventário</span>
            </button>
            <button
              onClick={() => handleTabChange("titles")}
              className={`relative z-10 font-serif text-amber-200 hover:scale-105 transition-all duration-200 py-2 px-2 md:px-4 rounded-md text-xs md:text-sm ${
                activeTab === "titles" ? "text-white font-bold" : "hover:text-amber-100"
              }`}
            >
              👑 <span className="hidden sm:inline">Títulos</span>
            </button>
          </div>

          {/* Conteúdo das Abas */}
          <div className="relative overflow-hidden min-h-[400px]">
          {/* Aba de Mangás */}
            <div className={`space-y-4 transition-all duration-500 ease-in-out ${activeTab === "mangas" ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'}`}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
              <h2 className="text-xl md:text-2xl font-bold text-amber-200 font-serif">📚 Minha Biblioteca</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => setShowAddManga(true)} className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 font-serif hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Manga
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const blob = new Blob([exportData()], { type: "application/json" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "isekai-data.json"
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                >
                  Exportar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = "application/json"
                    input.onchange = async () => {
                      const file = input.files?.[0]
                      if (!file) return
                      const text = await file.text()
                      const ok = importData(text)
                      if (!ok) alert("Falha ao importar JSON.")
                    }
                    input.click()
                  }}
                >
                  Importar
                </Button>
              </div>
            </div>

            {mangas.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum manga adicionado ainda.</p>
                  <p className="text-sm">Comece adicionando os mangás que você leu!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {mangas.map((manga, index) => (
                  <Card 
                    key={manga.id} 
                    className={`relative overflow-hidden bg-slate-800/50 border-amber-500/20 shadow-lg shadow-purple-500/10 hover:scale-105 hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer group ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${400 + index * 150}ms` }}
                  >
                    {/* Imagem de fundo */}
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
                    
                    {/* Conteúdo sobreposto */}
                    <div className="relative z-20 p-4 md:p-6 h-full flex flex-col justify-between min-h-[250px] md:min-h-[300px]">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                        <div>
                            <CardTitle className="text-lg md:text-xl text-white font-bold mb-2 font-serif">{manga.title}</CardTitle>
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                            {manga.type}
                          </Badge>
                        </div>
                        <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                     <Button
                       variant="ghost"
                       size="icon"
                       onClick={() => {
                         console.log('Editar mangá:', manga.id)
                       }}
                       className="text-white hover:bg-white/20 bg-black/20 hover:scale-110 transition-all duration-200 hover:shadow-lg hover:shadow-white/20 w-8 h-8 md:w-10 md:h-10"
                       title="Editar mangá"
                     >
                       <Edit className="w-3 h-3 md:w-4 md:h-4" />
                     </Button>
                     <Button
                       variant="ghost"
                       size="icon"
                       onClick={() => removeManga(manga.id)}
                       className="text-white hover:bg-red-600/30 bg-black/20 hover:scale-110 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20 w-8 h-8 md:w-10 md:h-10"
                       title="Apagar mangá"
                     >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </div>
                        </div>
                        <div className="text-sm text-white/80 mb-4">
                          Adicionado em {new Date(manga.dateAdded).toLocaleDateString("pt-BR")}
                        </div>
                        
                        {/* Contador de Episódios */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between bg-white/10 rounded-lg p-3 border border-white/20">
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-amber-300" />
                              <span className="text-sm text-white/90 font-medium">Episódio Atual:</span>
                              <span className="text-lg font-bold text-amber-300">
                                {manga.currentEpisode ?? 0}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => decrementEpisode(manga.id)}
                                className="w-7 h-7 text-white hover:bg-red-500/30 hover:scale-110 transition-all duration-200"
                                title="Episódio anterior"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => incrementEpisode(manga.id)}
                                className="w-7 h-7 text-white hover:bg-green-500/30 hover:scale-110 transition-all duration-200"
                                title="Próximo episódio"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {manga.url && (
                          <div className="mb-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(manga.url, '_blank')}
                              className="bg-blue-600/20 text-blue-200 border-blue-500/30 hover:bg-blue-600/30 hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 text-xs md:text-sm"
                            >
                              <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                              Ir para o Site
                            </Button>
                          </div>
                        )}
                        </div>
                        <Button
                          variant="outline"
                 className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20 font-serif hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-white/20 text-xs md:text-sm"
                          onClick={() => {
                            setSelectedManga(manga.id)
                            setShowAddContent(true)
                          }}
                        >
                          <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                          Adicionar Conteúdo
                        </Button>
                      </div>
                  </Card>
                ))}
              </div>
            )}
            </div>

          {/* Aba de Habilidades */}
            <div className={`space-y-4 transition-all duration-500 ease-in-out ${activeTab === "abilities" ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'}`}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
              <h2 className="text-xl md:text-2xl font-bold text-amber-200 font-serif">⭐ Minhas Habilidades</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => {
                    setContentInitialTab("ability")
                    setSelectedManga(mangas[0]?.id || null)
                    setShowAddContent(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Habilidade
                </Button>
              </div>
            </div>

            {abilities.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma habilidade adquirida ainda.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {abilities.map((ability) => (
                  <Card key={ability.id} className="border-2 border-primary/20">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{ability.name}</CardTitle>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <Badge variant={ability.type === "active" ? "default" : "secondary"}>
                              {ability.type === "active" ? "Ativa" : "Passiva"}
                            </Badge>
                            <Badge variant="outline">Nível {ability.level}</Badge>
                            <Badge className="bg-gradient-power">Poder: {ability.power}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{ability.description}</p>

                      {Object.keys(ability.effects).length > 0 && (
                        <div className="space-y-1">
                          <div className="text-sm font-semibold">Efeitos:</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(ability.effects).map(([key, value]) =>
                              value ? (
                                <div key={key} className="flex items-center gap-1 capitalize">
                                  +{value} {key}
                                </div>
                              ) : null,
                            )}
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">
                        Fontes:{" "}
                        {ability.sources
                          .map((id) => getMangaById(id)?.title)
                          .filter(Boolean)
                          .join(", ")}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
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
                          className="flex-1 text-destructive hover:text-destructive"
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

            {/* Aba de Inventário */}
            <div className={`space-y-4 transition-all duration-500 ease-in-out ${activeTab === "inventory" ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'}`}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
              <h2 className="text-xl md:text-2xl font-bold text-amber-200 font-serif">🎒 Meu Inventário</h2>
              <Button
                onClick={() => {
                  setContentInitialTab("item")
                  setSelectedManga(mangas[0]?.id || null)
                  setShowAddContent(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            </div>

            {items.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum item adquirido ainda.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {items.map((item) => (
                  <Card key={item.id} className="border-2 border-primary/20">
                    <CardHeader>
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="secondary" className="capitalize">
                            {item.type}
                          </Badge>
                          <Badge className={rarityColors[item.rarity]}>{item.rarity}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{item.description}</p>

                      {Object.keys(item.effects).length > 0 && (
                        <div className="space-y-1">
                          <div className="text-sm font-semibold">Efeitos:</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(item.effects).map(([key, value]) =>
                              value ? (
                                <div key={key} className="flex items-center gap-1 capitalize">
                                  +{value} {key}
                                </div>
                              ) : null,
                            )}
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">
                        Fonte: {getMangaById(item.source)?.title || "Desconhecido"}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
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
                          className="flex-1 text-destructive hover:text-destructive"
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

          {/* Aba de Títulos */}
            <div className={`space-y-4 transition-all duration-500 ease-in-out ${activeTab === "titles" ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'}`}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
              <h2 className="text-xl md:text-2xl font-bold text-amber-200 font-serif">👑 Meus Títulos</h2>
              <Button
                onClick={() => {
                  setContentInitialTab("title")
                  setSelectedManga(mangas[0]?.id || null)
                  setShowAddContent(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Título
              </Button>
            </div>

            {titles.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum título conquistado ainda.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {titles.map((title, index) => (
                  <Card 
                    key={title.id} 
                    className={`bg-slate-800/50 border-amber-500/20 shadow-lg shadow-purple-500/10 hover:scale-105 hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer group ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Trophy className="w-8 h-8 text-amber-400 flex-shrink-0" />
                        <div className="flex-1">
                          <CardTitle className="text-lg text-amber-200 font-serif">{title.name}</CardTitle>
                          {title.active && <Badge className="mt-2 bg-green-600 text-white">Ativo</Badge>}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => toggleTitle(title.id)} 
                            className={`${title.active ? 'text-green-400 hover:bg-green-600/20' : 'text-amber-300 hover:bg-amber-600/20'} bg-black/20 hover:scale-110 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20`}
                            title={title.active ? "Desativar título" : "Ativar título"}
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              const newName = prompt('Novo nome do título:', title.name)
                              if (newName && newName.trim()) {
                                editTitle(title.id, { name: newName.trim() })
                              }
                            }}
                            className="text-amber-300 hover:bg-amber-600/20 bg-black/20 hover:scale-110 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20"
                            title="Editar título"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              if (confirm(`Tem certeza que deseja excluir o título "${title.name}"?`)) {
                                deleteTitle(title.id)
                              }
                            }}
                            className="text-red-400 hover:bg-red-600/20 bg-black/20 hover:scale-110 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20"
                            title="Excluir título"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-amber-300/80 font-serif">{title.description}</p>

                      {Object.keys(title.effects).length > 0 && (
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-amber-200 font-serif">Efeitos:</div>
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

                      <div className="text-xs text-amber-300/60 font-serif">
                        Fonte: {getMangaById(title.source)?.title || "Desconhecido"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      <AddMangaDialog open={showAddManga} onOpenChange={setShowAddManga} />
      <AddContentDialog open={showAddContent} onOpenChange={setShowAddContent} mangaId={selectedManga} initialTab={contentInitialTab} />
      
      {/* Edit Dialogs */}
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
