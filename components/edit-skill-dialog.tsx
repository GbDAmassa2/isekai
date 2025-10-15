"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCharacter } from "@/components/character-provider"
import type { Skill } from "@/lib/character-utils"

interface EditSkillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skill: Skill | null
}

export function EditSkillDialog({ open, onOpenChange, skill }: EditSkillDialogProps) {
  const { editSkill } = useCharacter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"ativa" | "passiva">("ativa")
  const [manaCost, setManaCost] = useState(0)
  const [staminaCost, setStaminaCost] = useState(0)
  const [cooldown, setCooldown] = useState(0)
  const [levelReq, setLevelReq] = useState(1)
  const [strengthReq, setStrengthReq] = useState(0)
  const [agilityReq, setAgilityReq] = useState(0)
  const [intelligenceReq, setIntelligenceReq] = useState(0)
  const [vitalityReq, setVitalityReq] = useState(0)
  const [luckReq, setLuckReq] = useState(0)
  const [damage, setDamage] = useState(0)
  const [healing, setHealing] = useState(0)
  const [buffAttribute, setBuffAttribute] = useState("")
  const [buffValue, setBuffValue] = useState(0)
  const [buffDuration, setBuffDuration] = useState(0)

  useEffect(() => {
    if (skill) {
      setName(skill.nome)
      setDescription(skill.descricao)
      setType(skill.tipo)
      setManaCost(skill.custoMana || 0)
      setStaminaCost(skill.custoStamina || 0)
      setCooldown(skill.cooldown || 0)
      setLevelReq(skill.requisitos.nivel || 1)
      setStrengthReq(skill.requisitos.forca || 0)
      setAgilityReq(skill.requisitos.agilidade || 0)
      setIntelligenceReq(skill.requisitos.inteligencia || 0)
      setVitalityReq(skill.requisitos.vitalidade || 0)
      setLuckReq(skill.requisitos.sorte || 0)
      setDamage(skill.efeitos.dano || 0)
      setHealing(skill.efeitos.cura || 0)
      if (skill.efeitos.buff) {
        setBuffAttribute(skill.efeitos.buff.atributo)
        setBuffValue(skill.efeitos.buff.valor)
        setBuffDuration(skill.efeitos.buff.duracao)
      }
    }
  }, [skill])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !skill) return

    const updatedSkill: Partial<Skill> = {
      nome: name.trim(),
      descricao: description.trim(),
      tipo: type,
      custoMana: manaCost || undefined,
      custoStamina: staminaCost || undefined,
      cooldown: cooldown || undefined,
      requisitos: {
        nivel: levelReq || undefined,
        forca: strengthReq || undefined,
        agilidade: agilityReq || undefined,
        inteligencia: intelligenceReq || undefined,
        vitalidade: vitalityReq || undefined,
        sorte: luckReq || undefined,
      },
      efeitos: {
        dano: damage || undefined,
        cura: healing || undefined,
        buff: buffAttribute && buffValue ? {
          atributo: buffAttribute,
          valor: buffValue,
          duracao: buffDuration
        } : undefined,
      },
    }

    editSkill(skill.id, updatedSkill)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Habilidade</DialogTitle>
          <DialogDescription>
            Edite os detalhes da habilidade {skill?.nome}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Habilidade</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Bola de Fogo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que a habilidade faz..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="passiva">Passiva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cooldown">Cooldown (segundos)</Label>
              <Input
                id="cooldown"
                type="number"
                value={cooldown}
                onChange={(e) => setCooldown(Number(e.target.value))}
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manaCost">Custo de Mana</Label>
              <Input
                id="manaCost"
                type="number"
                value={manaCost}
                onChange={(e) => setManaCost(Number(e.target.value))}
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="staminaCost">Custo de Stamina</Label>
              <Input
                id="staminaCost"
                type="number"
                value={staminaCost}
                onChange={(e) => setStaminaCost(Number(e.target.value))}
                min={0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Requisitos</Label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="levelReq" className="text-xs">Nível</Label>
                <Input
                  id="levelReq"
                  type="number"
                  value={levelReq}
                  onChange={(e) => setLevelReq(Number(e.target.value))}
                  min={1}
                />
              </div>
              <div>
                <Label htmlFor="strengthReq" className="text-xs">Força</Label>
                <Input
                  id="strengthReq"
                  type="number"
                  value={strengthReq}
                  onChange={(e) => setStrengthReq(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="agilityReq" className="text-xs">Agilidade</Label>
                <Input
                  id="agilityReq"
                  type="number"
                  value={agilityReq}
                  onChange={(e) => setAgilityReq(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="intelligenceReq" className="text-xs">Inteligência</Label>
                <Input
                  id="intelligenceReq"
                  type="number"
                  value={intelligenceReq}
                  onChange={(e) => setIntelligenceReq(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="vitalityReq" className="text-xs">Vitalidade</Label>
                <Input
                  id="vitalityReq"
                  type="number"
                  value={vitalityReq}
                  onChange={(e) => setVitalityReq(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="luckReq" className="text-xs">Sorte</Label>
                <Input
                  id="luckReq"
                  type="number"
                  value={luckReq}
                  onChange={(e) => setLuckReq(Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Efeitos</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="damage" className="text-xs">Dano</Label>
                <Input
                  id="damage"
                  type="number"
                  value={damage}
                  onChange={(e) => setDamage(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="healing" className="text-xs">Cura</Label>
                <Input
                  id="healing"
                  type="number"
                  value={healing}
                  onChange={(e) => setHealing(Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Buff (Opcional)</Label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="buffAttribute" className="text-xs">Atributo</Label>
                <Select value={buffAttribute} onValueChange={setBuffAttribute}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forca">Força</SelectItem>
                    <SelectItem value="agilidade">Agilidade</SelectItem>
                    <SelectItem value="inteligencia">Inteligência</SelectItem>
                    <SelectItem value="vitalidade">Vitalidade</SelectItem>
                    <SelectItem value="sorte">Sorte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="buffValue" className="text-xs">Valor</Label>
                <Input
                  id="buffValue"
                  type="number"
                  value={buffValue}
                  onChange={(e) => setBuffValue(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="buffDuration" className="text-xs">Duração (seg)</Label>
                <Input
                  id="buffDuration"
                  type="number"
                  value={buffDuration}
                  onChange={(e) => setBuffDuration(Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Salvar Alterações
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
