"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useCharacter } from "@/components/character-provider"
import { AttributePanel } from "@/components/attribute-panel"
import { ExperiencePanel } from "@/components/experience-panel"
import { SkillsPanel } from "@/components/skills-panel"
import { InventoryPanel } from "@/components/inventory-panel"
import {
  LogOut,
  Sparkles,
  Swords,
  Shield,
  Zap,
  Heart,
  Droplet,
  Wind,
  TrendingUp,
  Star,
  Award,
  Package,
  Settings,
} from "lucide-react"

export function CharacterDashboard() {
  const { user, logout } = useAuth()
  const { character, isLoading, addExperience } = useCharacter()
  const [activeTab, setActiveTab] = useState("dashboard")

  if (isLoading || !character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando personagem...</p>
        </div>
      </div>
    )
  }

  const xpPercentage = (character.experiencia / character.experienciaNecessaria) * 100
  const vidaPercentage = (character.vidaAtual / character.vidaMaxima) * 100
  const manaPercentage = (character.manaAtual / character.manaMaxima) * 100
  const staminaPercentage = (character.staminaAtual / character.staminaMaxima) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-mystic flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{user?.nomeSystem}</h1>
              <p className="text-sm text-muted-foreground">@{user?.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => addExperience(50)} className="hidden sm:flex">
              <Star className="w-4 h-4 mr-2" />
              +50 XP
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Character Header */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-r from-card to-primary/5">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{character.nome}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm">
                    <Star className="w-3 h-3 mr-1" />
                    Nível {character.nivel}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {character.classeAtual}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Pontos Disponíveis</div>
                <div className="flex gap-2">
                  <Badge className="bg-gradient-mystic">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {character.pontosAtributo} Atributo
                  </Badge>
                  <Badge className="bg-gradient-power">
                    <Zap className="w-3 h-3 mr-1" />
                    {character.pontosHabilidade} Habilidade
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Experiência</span>
                <span className="font-medium">
                  {character.experiencia} / {character.experienciaNecessaria} XP
                </span>
              </div>
              <Progress value={xpPercentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid overflow-x-auto">
            <TabsTrigger value="dashboard" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="atributos" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Atributos</span>
            </TabsTrigger>
            <TabsTrigger value="habilidades" className="gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Habilidades</span>
            </TabsTrigger>
            <TabsTrigger value="inventario" className="gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Inventário</span>
            </TabsTrigger>
            <TabsTrigger value="titulos" className="gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Títulos</span>
            </TabsTrigger>
            <TabsTrigger value="gerenciar" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Gerenciar</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <ExperiencePanel />

            {/* Status Vitais */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    Vida
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {character.vidaAtual} / {character.vidaMaxima}
                  </div>
                  <Progress value={vidaPercentage} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-blue-500" />
                    Mana
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {character.manaAtual} / {character.manaMaxima}
                  </div>
                  <Progress value={manaPercentage} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Wind className="w-4 h-4 text-green-500" />
                    Stamina
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {character.staminaAtual} / {character.staminaMaxima}
                  </div>
                  <Progress value={staminaPercentage} className="h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Atributos de Combate */}
            <Card>
              <CardHeader>
                <CardTitle>Atributos de Combate</CardTitle>
                <CardDescription>Seus poderes ofensivos e defensivos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                      <Swords className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Ataque Físico</div>
                      <div className="text-xl font-bold">{character.ataqueFisico}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Ataque Mágico</div>
                      <div className="text-xl font-bold">{character.ataqueMagico}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Defesa Física</div>
                      <div className="text-xl font-bold">{character.defesaFisica}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Defesa Mágica</div>
                      <div className="text-xl font-bold">{character.defesaMagica}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Atributos Primários */}
            <Card>
              <CardHeader>
                <CardTitle>Atributos Primários</CardTitle>
                <CardDescription>Seus atributos base</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Força</div>
                    <div className="text-2xl font-bold text-chart-1">{character.forca}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Agilidade</div>
                    <div className="text-2xl font-bold text-chart-2">{character.agilidade}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Inteligência</div>
                    <div className="text-2xl font-bold text-chart-3">{character.inteligencia}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Vitalidade</div>
                    <div className="text-2xl font-bold text-chart-4">{character.vitalidade}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Sorte</div>
                    <div className="text-2xl font-bold text-chart-5">{character.sorte}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Atributos Tab */}
          <TabsContent value="atributos">
            <AttributePanel />
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="habilidades">
            <SkillsPanel />
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventario">
            <InventoryPanel />
          </TabsContent>

          {/* Titulos Tab */}
          <TabsContent value="titulos">
            <Card>
              <CardHeader>
                <CardTitle>Títulos</CardTitle>
                <CardDescription>Em desenvolvimento</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          {/* Gerenciar Tab */}
          <TabsContent value="gerenciar">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Sistema</CardTitle>
                <CardDescription>Em desenvolvimento</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
