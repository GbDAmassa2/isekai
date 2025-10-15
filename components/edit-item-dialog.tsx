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
import type { Item } from "@/lib/character-utils"

interface EditItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Item | null
}

export function EditItemDialog({ open, onOpenChange, item }: EditItemDialogProps) {
  const { editItem } = useCharacter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<Item["tipo"]>("arma")
  const [rarity, setRarity] = useState<Item["raridade"]>("comum")
  const [price, setPrice] = useState(0)
  const [levelReq, setLevelReq] = useState(1)
  const [strengthReq, setStrengthReq] = useState(0)
  const [agilityReq, setAgilityReq] = useState(0)
  const [intelligenceReq, setIntelligenceReq] = useState(0)
  const [vitalityReq, setVitalityReq] = useState(0)
  const [luckReq, setLuckReq] = useState(0)
  const [attackPhysical, setAttackPhysical] = useState(0)
  const [attackMagical, setAttackMagical] = useState(0)
  const [defensePhysical, setDefensePhysical] = useState(0)
  const [defenseMagical, setDefenseMagical] = useState(0)
  const [maxHealth, setMaxHealth] = useState(0)
  const [maxMana, setMaxMana] = useState(0)
  const [maxStamina, setMaxStamina] = useState(0)

  useEffect(() => {
    if (item) {
      setName(item.nome)
      setDescription(item.descricao)
      setType(item.tipo)
      setRarity(item.raridade)
      setPrice(item.preco)
      setLevelReq(item.requisitos?.nivel || 1)
      setStrengthReq(item.requisitos?.forca || 0)
      setAgilityReq(item.requisitos?.agilidade || 0)
      setIntelligenceReq(item.requisitos?.inteligencia || 0)
      setVitalityReq(item.requisitos?.vitalidade || 0)
      setLuckReq(item.requisitos?.sorte || 0)
      setAttackPhysical(item.efeitos?.ataqueFisico || 0)
      setAttackMagical(item.efeitos?.ataqueMagico || 0)
      setDefensePhysical(item.efeitos?.defesaFisica || 0)
      setDefenseMagical(item.efeitos?.defesaMagica || 0)
      setMaxHealth(item.efeitos?.vidaMaxima || 0)
      setMaxMana(item.efeitos?.manaMaxima || 0)
      setMaxStamina(item.efeitos?.staminaMaxima || 0)
    }
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !item) return

    const updatedItem: Partial<Item> = {
      nome: name.trim(),
      descricao: description.trim(),
      tipo: type,
      raridade: rarity,
      preco: price,
      requisitos: {
        nivel: levelReq || undefined,
        forca: strengthReq || undefined,
        agilidade: agilityReq || undefined,
        inteligencia: intelligenceReq || undefined,
        vitalidade: vitalityReq || undefined,
        sorte: luckReq || undefined,
      },
      efeitos: {
        forca: strengthReq || undefined,
        agilidade: agilityReq || undefined,
        inteligencia: intelligenceReq || undefined,
        vitalidade: vitalityReq || undefined,
        sorte: luckReq || undefined,
        ataqueFisico: attackPhysical || undefined,
        ataqueMagico: attackMagical || undefined,
        defesaFisica: defensePhysical || undefined,
        defesaMagica: defenseMagical || undefined,
        vidaMaxima: maxHealth || undefined,
        manaMaxima: maxMana || undefined,
        staminaMaxima: maxStamina || undefined,
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
            Edite os detalhes do item {item?.nome}
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arma">Arma</SelectItem>
                  <SelectItem value="armadura">Armadura</SelectItem>
                  <SelectItem value="acessorio">Acessório</SelectItem>
                  <SelectItem value="consumivel">Consumível</SelectItem>
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
                  <SelectItem value="comum">Comum</SelectItem>
                  <SelectItem value="incomum">Incomum</SelectItem>
                  <SelectItem value="raro">Raro</SelectItem>
                  <SelectItem value="epico">Épico</SelectItem>
                  <SelectItem value="lendario">Lendário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (Gold)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
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
            <Label>Efeitos de Combate</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="attackPhysical" className="text-xs">Ataque Físico</Label>
                <Input
                  id="attackPhysical"
                  type="number"
                  value={attackPhysical}
                  onChange={(e) => setAttackPhysical(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="attackMagical" className="text-xs">Ataque Mágico</Label>
                <Input
                  id="attackMagical"
                  type="number"
                  value={attackMagical}
                  onChange={(e) => setAttackMagical(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="defensePhysical" className="text-xs">Defesa Física</Label>
                <Input
                  id="defensePhysical"
                  type="number"
                  value={defensePhysical}
                  onChange={(e) => setDefensePhysical(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="defenseMagical" className="text-xs">Defesa Mágica</Label>
                <Input
                  id="defenseMagical"
                  type="number"
                  value={defenseMagical}
                  onChange={(e) => setDefenseMagical(Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Efeitos de Recursos</Label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="maxHealth" className="text-xs">Vida Máxima</Label>
                <Input
                  id="maxHealth"
                  type="number"
                  value={maxHealth}
                  onChange={(e) => setMaxHealth(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="maxMana" className="text-xs">Mana Máxima</Label>
                <Input
                  id="maxMana"
                  type="number"
                  value={maxMana}
                  onChange={(e) => setMaxMana(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="maxStamina" className="text-xs">Stamina Máxima</Label>
                <Input
                  id="maxStamina"
                  type="number"
                  value={maxStamina}
                  onChange={(e) => setMaxStamina(Number(e.target.value))}
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
