"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useIsekai } from "./isekai-provider"
import type { Ability } from "@/lib/isekai-types"

interface AddAbilityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mangaId: string | null
}

export function AddAbilityDialog({ open, onOpenChange, mangaId }: AddAbilityDialogProps) {
  const { addAbility } = useIsekai()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"active" | "passive">("active")
  const [category, setCategory] = useState<Ability["category"]>("attack")
  const [power, setPower] = useState(10)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !mangaId) return

    addAbility(
      {
        name: name.trim(),
        description: description.trim(),
        type,
        category,
        power,
      },
      mangaId,
    )

    // Reset form
    setName("")
    setDescription("")
    setType("active")
    setCategory("attack")
    setPower(10)
    onOpenChange(false)
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Habilidade</DialogTitle>
          <DialogDescription>
            Adicione uma nova habilidade do manga.
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

          <div className="space-y-2">
            <Label htmlFor="power">Poder Base</Label>
            <Input id="power" type="number" value={power} onChange={(e) => setPower(Number(e.target.value))} min={1} />
          </div>


          <Button type="submit" className="w-full">
            Adicionar Habilidade
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
