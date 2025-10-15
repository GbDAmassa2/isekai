"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useCharacter } from "@/components/character-provider"
import { useToast } from "@/hooks/use-toast"
import { Star, TrendingUp, Zap, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ExperiencePanel() {
  const { character, addExperience, removeExperience } = useCharacter()
  const { toast } = useToast()
  const [isGainingXP, setIsGainingXP] = useState(false)

  if (!character) return null

  const xpPercentage = (character.experiencia / character.experienciaNecessaria) * 100

  const handleGainXP = (amount: number) => {
    setIsGainingXP(true)
    const previousLevel = character.nivel

    // Adicionar experiência
    addExperience(amount)

    // Verificar se subiu de nível (fazemos isso após um pequeno delay para dar tempo do estado atualizar)
    setTimeout(() => {
      const newCharacter = JSON.parse(localStorage.getItem(`isekai_character_${character.userId}`) || "{}")
      const leveledUp = newCharacter.nivel > previousLevel

      if (leveledUp) {
        toast({
          title: "Level Up!",
          description: `Parabéns! Você alcançou o nível ${newCharacter.nivel}! Ganhou 3 pontos de atributo e 2 pontos de habilidade.`,
        })
      } else {
        toast({
          title: "Experiência ganha!",
          description: `Você ganhou ${amount} XP.`,
        })
      }
      setIsGainingXP(false)
    }, 100)
  }

  const handleLoseXP = (amount: number) => {
    setIsGainingXP(true)
    const previousXP = character.experiencia
    removeExperience(amount)
    setTimeout(() => {
      const newCharacter = JSON.parse(localStorage.getItem(`isekai_character_${character.userId}`) || "{}")
      const lost = Math.max(0, previousXP - (newCharacter.experiencia ?? previousXP))
      if (lost > 0) {
        toast({ title: "XP removida", description: `Você perdeu ${lost} XP.` })
      } else {
        toast({ title: "Sem alteração", description: `Você já está em 0 XP deste nível.` })
      }
      setIsGainingXP(false)
    }, 100)
  }

  return (
    <div className="space-y-6">
      {/* Header com nível atual */}
      <Card className="border-primary/20 bg-gradient-to-r from-card to-accent/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <Star className="w-8 h-8 text-accent" />
                Nível {character.nivel}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Continue ganhando experiência para subir de nível
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Próximo Nível</div>
              <Badge variant="outline" className="text-xl px-4 py-2">
                {character.experiencia} / {character.experienciaNecessaria}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={xpPercentage} className="h-4" />
            <div className="text-sm text-muted-foreground text-right">{Math.round(xpPercentage)}% completo</div>
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre recompensas */}
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertTitle>Recompensas por Nível</AlertTitle>
        <AlertDescription>
          Cada vez que você sobe de nível, você ganha:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>3 Pontos de Atributo para distribuir</li>
            <li>2 Pontos de Habilidade para usar</li>
            <li>Aumento automático em todos os atributos secundários</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Botões para ganhar/remover XP */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Experiência</CardTitle>
          <CardDescription>Ganhe ou remova XP deste nível</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              onClick={() => handleGainXP(50)}
              disabled={isGainingXP}
              className="h-auto py-4 flex-col gap-2"
              variant="outline"
            >
              <TrendingUp className="w-5 h-5" />
              <div>
                <div className="font-bold">+50 XP</div>
                <div className="text-xs text-muted-foreground">Missão Pequena</div>
              </div>
            </Button>

            <Button
              onClick={() => handleGainXP(100)}
              disabled={isGainingXP}
              className="h-auto py-4 flex-col gap-2"
              variant="outline"
            >
              <TrendingUp className="w-5 h-5" />
              <div>
                <div className="font-bold">+100 XP</div>
                <div className="text-xs text-muted-foreground">Missão Média</div>
              </div>
            </Button>

            <Button
              onClick={() => handleGainXP(250)}
              disabled={isGainingXP}
              className="h-auto py-4 flex-col gap-2"
              variant="outline"
            >
              <Zap className="w-5 h-5" />
              <div>
                <div className="font-bold">+250 XP</div>
                <div className="text-xs text-muted-foreground">Missão Grande</div>
              </div>
            </Button>

            <Button
              onClick={() => handleGainXP(500)}
              disabled={isGainingXP}
              className="h-auto py-4 flex-col gap-2 bg-gradient-mystic"
            >
              <Star className="w-5 h-5" />
              <div>
                <div className="font-bold">+500 XP</div>
                <div className="text-xs">Boss Fight</div>
              </div>
            </Button>
            <Button
              onClick={() => handleLoseXP(50)}
              disabled={isGainingXP}
              className="h-auto py-4 flex-col gap-2"
              variant="destructive"
            >
              <TrendingUp className="w-5 h-5 rotate-180" />
              <div>
                <div className="font-bold">-50 XP</div>
                <div className="text-xs text-muted-foreground">Penalidade</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de progressão */}
      <Card>
        <CardHeader>
          <CardTitle>Tabela de Progressão</CardTitle>
          <CardDescription>XP necessária para os próximos níveis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => {
              const level = character.nivel + i
              const xpNeeded = level * 100 + (level - 1) * 50
              const isCurrent = i === 0

              return (
                <div
                  key={level}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isCurrent ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={isCurrent ? "default" : "outline"}>Nível {level}</Badge>
                    {isCurrent && <span className="text-sm text-muted-foreground">(Atual)</span>}
                  </div>
                  <div className="text-sm font-medium">{xpNeeded} XP necessária</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas de progressão */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nível Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{character.nivel}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">XP Total Ganha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {/* Calcular XP total baseado no nível */}
              {Array.from({ length: character.nivel - 1 }, (_, i) => (i + 1) * 100 + i * 50).reduce(
                (a, b) => a + b,
                0,
              ) + character.experiencia}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Próximo Nível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{character.experienciaNecessaria - character.experiencia} XP</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
