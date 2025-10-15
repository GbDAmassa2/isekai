"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useIsekai } from "@/components/isekai-provider"
import type { Ability } from "@/lib/isekai-types"

interface EditAbilityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ability: Ability | null
}

export function EditAbilityDialog({ open, onOpenChange, ability }: EditAbilityDialogProps) {
  const { editAbility } = useIsekai()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"active" | "passive">("active")
  const [category, setCategory] = useState<Ability["category"]>("attack")
  const [power, setPower] = useState(10)
  const [level, setLevel] = useState(1)
  const [manaCost, setManaCost] = useState(0)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (ability) {
      setName(ability.name)
      setDescription(ability.description)
      setType(ability.type)
      setCategory(ability.category)
      setPower(ability.power)
      setLevel(ability.level)
      setManaCost(ability.manaCost || 0)
      setCooldown(ability.cooldown || 0)
    }
  }, [ability])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !ability) return

    const updatedAbility: Partial<Ability> = {
      name: name.trim(),
      description: description.trim(),
      type,
      category,
      power,
      level,
      manaCost: manaCost || undefined,
      cooldown: cooldown || undefined,
    }

    editAbility(ability.id, updatedAbility)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Habilidade</DialogTitle>
          <DialogDescription>
            Edite os detalhes da habilidade {ability?.name}
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
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="passive">Passiva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attack">Ataque</SelectItem>
                  <SelectItem value="defense">Defesa</SelectItem>
                  <SelectItem value="support">Suporte</SelectItem>
                  <SelectItem value="utility">Utilidade</SelectItem>
                  <SelectItem value="special">Especial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Nível</Label>
              <Input id="level" type="number" value={level} onChange={(e) => setLevel(Number(e.target.value))} min={1} max={100} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="power">Poder Base</Label>
              <Input id="power" type="number" value={power} onChange={(e) => setPower(Number(e.target.value))} min={1} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manaCost">Custo de Mana</Label>
              <Input id="manaCost" type="number" value={manaCost} onChange={(e) => setManaCost(Number(e.target.value))} min={0} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cooldown">Cooldown (segundos)</Label>
              <Input id="cooldown" type="number" value={cooldown} onChange={(e) => setCooldown(Number(e.target.value))} min={0} />
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
