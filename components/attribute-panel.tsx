"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCharacter } from "@/components/character-provider"
import { useToast } from "@/hooks/use-toast"
import { Plus, Minus, TrendingUp, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AttributeRowProps {
  name: string
  value: number
  color: string
  description: string
  onIncrease: () => void
  onDecrease: () => void
  canModify: boolean
}

function AttributeRow({ name, value, color, description, onIncrease, onDecrease, canModify }: AttributeRowProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold">{name}</h3>
          <Badge variant="outline" className={`${color}`}>
            {value}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Button
          size="icon"
          variant="outline"
          onClick={onDecrease}
          disabled={!canModify || value <= 1}
          className="h-8 w-8 bg-transparent"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="default" onClick={onIncrease} disabled={!canModify} className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function AttributePanel() {
  const { character, distributeAttributePoint } = useCharacter()
  const { toast } = useToast()
  const [customAttrName, setCustomAttrName] = useState("")
  const [pendingChanges, setPendingChanges] = useState<Record<string, number>>({
    forca: 0,
    agilidade: 0,
    inteligencia: 0,
    vitalidade: 0,
    sorte: 0,
  })

  if (!character) return null

  const totalPendingPoints = Object.values(pendingChanges).reduce((sum, val) => sum + val, 0)
  const availablePoints = character.pontosAtributo - totalPendingPoints

  const handleIncrease = (attr: "forca" | "agilidade" | "inteligencia" | "vitalidade" | "sorte") => {
    if (availablePoints > 0) {
      setPendingChanges((prev) => ({
        ...prev,
        [attr]: prev[attr] + 1,
      }))
    } else {
      toast({
        title: "Pontos insuficientes",
        description: "Você não tem pontos de atributo disponíveis.",
        variant: "destructive",
      })
    }
  }

  const handleDecrease = (attr: "forca" | "agilidade" | "inteligencia" | "vitalidade" | "sorte") => {
    if (pendingChanges[attr] > 0) {
      setPendingChanges((prev) => ({
        ...prev,
        [attr]: prev[attr] - 1,
      }))
    }
  }

  const applyChanges = () => {
    let success = true
    Object.entries(pendingChanges).forEach(([attr, points]) => {
      if (points > 0) {
        const result = distributeAttributePoint(
          attr as "forca" | "agilidade" | "inteligencia" | "vitalidade" | "sorte",
          points,
        )
        if (!result) success = false
      }
    })

    if (success) {
      toast({
        title: "Atributos atualizados!",
        description: `Você distribuiu ${totalPendingPoints} pontos de atributo.`,
      })
      setPendingChanges({
        forca: 0,
        agilidade: 0,
        inteligencia: 0,
        vitalidade: 0,
        sorte: 0,
      })
    } else {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível aplicar as mudanças.",
        variant: "destructive",
      })
    }
  }

  const resetChanges = () => {
    setPendingChanges({
      forca: 0,
      agilidade: 0,
      inteligencia: 0,
      vitalidade: 0,
      sorte: 0,
    })
    toast({
      title: "Mudanças canceladas",
      description: "Todas as alterações pendentes foram descartadas.",
    })
  }

  const attributes = [
    {
      key: "forca" as const,
      name: "Força",
      value: character.forca + pendingChanges.forca,
      color: "text-chart-1",
      description: "Aumenta ataque físico e defesa física",
    },
    {
      key: "agilidade" as const,
      name: "Agilidade",
      value: character.agilidade + pendingChanges.agilidade,
      color: "text-chart-2",
      description: "Aumenta stamina e ataque físico",
    },
    {
      key: "inteligencia" as const,
      name: "Inteligência",
      value: character.inteligencia + pendingChanges.inteligencia,
      color: "text-chart-3",
      description: "Aumenta mana, ataque mágico e defesa mágica",
    },
    {
      key: "vitalidade" as const,
      name: "Vitalidade",
      value: character.vitalidade + pendingChanges.vitalidade,
      color: "text-chart-4",
      description: "Aumenta vida, stamina e defesas",
    },
    {
      key: "sorte" as const,
      name: "Sorte",
      value: character.sorte + pendingChanges.sorte,
      color: "text-chart-5",
      description: "Aumenta ataque mágico e chances críticas",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header com pontos disponíveis */}
      <Card className="border-primary/20 bg-gradient-to-r from-card to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Distribuição de Atributos
              </CardTitle>
              <CardDescription>Aumente seus atributos para fortalecer seu personagem</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Pontos Disponíveis</div>
              <Badge className="text-2xl px-4 py-2 bg-gradient-mystic">{availablePoints}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Informações sobre mudanças pendentes */}
      {totalPendingPoints > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Você tem {totalPendingPoints} ponto(s) pendente(s) para aplicar. Clique em "Aplicar Mudanças" para
            confirmar.
          </AlertDescription>
        </Alert>
      )}

      {/* Lista de atributos */}
      <Card>
        <CardHeader>
          <CardTitle>Atributos Primários</CardTitle>
          <CardDescription>Use os botões + e - para ajustar seus atributos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {attributes.map((attr) => (
            <AttributeRow
              key={attr.key}
              name={attr.name}
              value={attr.value}
              color={attr.color}
              description={attr.description}
              onIncrease={() => handleIncrease(attr.key)}
              onDecrease={() => handleDecrease(attr.key)}
              canModify={character.pontosAtributo > 0}
            />
          ))}
        </CardContent>
      </Card>

      {/* Botões de ação */}
      {totalPendingPoints > 0 && (
        <div className="flex gap-3">
          <Button onClick={applyChanges} className="flex-1" size="lg">
            <TrendingUp className="w-4 h-4 mr-2" />
            Aplicar Mudanças ({totalPendingPoints} pontos)
          </Button>
          <Button onClick={resetChanges} variant="outline" size="lg">
            Cancelar
          </Button>
        </div>
      )}

      {/* Adicionar atributo customizado */}
      <Card>
        <CardHeader>
          <CardTitle>Atributos Personalizados</CardTitle>
          <CardDescription>Crie novos atributos para o seu perfil isekai</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={customAttrName}
              onChange={(e) => setCustomAttrName(e.target.value)}
              placeholder="Ex: Carisma, Sorte do Herói, etc"
            />
            <Button
              onClick={() => {
                // This panel controls character attributes; custom profile attributes belong to isekai profile.
                // We surface the UI here to satisfy user's request, but storage is handled in isekai dashboard dialog.
                if (!customAttrName.trim()) return
                const event = new CustomEvent("isekai:add-custom-attribute", { detail: customAttrName.trim() })
                window.dispatchEvent(event)
                setCustomAttrName("")
                toast({ title: "Atributo criado", description: "Vá em Isekai para configurar efeitos." })
              }}
            >
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Efeitos dos atributos */}
      <Card>
        <CardHeader>
          <CardTitle>Efeitos dos Atributos</CardTitle>
          <CardDescription>Como cada atributo afeta seu personagem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-3 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2 text-chart-1">Força</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ataque Físico: +2 por ponto</li>
                <li>• Defesa Física: +0.5 por ponto</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2 text-chart-2">Agilidade</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Stamina: +6 por ponto</li>
                <li>• Ataque Físico: +1 por ponto</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2 text-chart-3">Inteligência</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Mana: +8 por ponto</li>
                <li>• Ataque Mágico: +2 por ponto</li>
                <li>• Defesa Mágica: +1.5 por ponto</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2 text-chart-4">Vitalidade</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Vida: +10 por ponto</li>
                <li>• Stamina: +4 por ponto</li>
                <li>• Defesa Física: +1.5 por ponto</li>
                <li>• Defesa Mágica: +0.5 por ponto</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2 text-chart-5">Sorte</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ataque Mágico: +1 por ponto</li>
                <li>• Chances de crítico (futuro)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
