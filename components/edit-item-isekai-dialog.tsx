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
import type { Item } from "@/lib/isekai-types"

interface EditItemIsekaiDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Item | null
}

export function EditItemIsekaiDialog({ open, onOpenChange, item }: EditItemIsekaiDialogProps) {
  const { editItem } = useIsekai()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<Item["type"]>("weapon")
  const [rarity, setRarity] = useState<Item["rarity"]>("common")
  const [strength, setStrength] = useState(0)
  const [agility, setAgility] = useState(0)
  const [intelligence, setIntelligence] = useState(0)
  const [vitality, setVitality] = useState(0)
  const [luck, setLuck] = useState(0)

  useEffect(() => {
    if (item) {
      setName(item.name)
      setDescription(item.description)
      setType(item.type)
      setRarity(item.rarity)
      setStrength(item.effects.strength || 0)
      setAgility(item.effects.agility || 0)
      setIntelligence(item.effects.intelligence || 0)
      setVitality(item.effects.vitality || 0)
      setLuck(item.effects.luck || 0)
    }
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !item) return

    const updatedItem: Partial<Item> = {
      name: name.trim(),
      description: description.trim(),
      type,
      rarity,
      effects: {
        strength: strength || undefined,
        agility: agility || undefined,
        intelligence: intelligence || undefined,
        vitality: vitality || undefined,
        luck: luck || undefined,
      },
    }

    editItem(item.id, updatedItem)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
          <DialogDescription>
            Edite os detalhes do item {item?.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Item</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Espada de Ferro"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o item..."
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
                  <SelectItem value="weapon">Arma</SelectItem>
                  <SelectItem value="armor">Armadura</SelectItem>
                  <SelectItem value="accessory">Acessório</SelectItem>
                  <SelectItem value="consumable">Consumível</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rarity">Raridade</Label>
              <Select value={rarity} onValueChange={(v) => setRarity(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common">Comum</SelectItem>
                  <SelectItem value="uncommon">Incomum</SelectItem>
                  <SelectItem value="rare">Raro</SelectItem>
                  <SelectItem value="epic">Épico</SelectItem>
                  <SelectItem value="legendary">Lendário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Efeitos de Atributos</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="strength" className="text-xs">
                  Força
                </Label>
                <Input
                  id="strength"
                  type="number"
                  value={strength}
                  onChange={(e) => setStrength(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="agility" className="text-xs">
                  Agilidade
                </Label>
                <Input
                  id="agility"
                  type="number"
                  value={agility}
                  onChange={(e) => setAgility(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="intelligence" className="text-xs">
                  Inteligência
                </Label>
                <Input
                  id="intelligence"
                  type="number"
                  value={intelligence}
                  onChange={(e) => setIntelligence(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="vitality" className="text-xs">
                  Vitalidade
                </Label>
                <Input
                  id="vitality"
                  type="number"
                  value={vitality}
                  onChange={(e) => setVitality(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="luck" className="text-xs">
                  Sorte
                </Label>
                <Input id="luck" type="number" value={luck} onChange={(e) => setLuck(Number(e.target.value))} min={0} />
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
