"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsekai } from "./isekai-provider"
import type { Ability, Item } from "@/lib/isekai-types"
import { Plus } from "lucide-react"

interface AddContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mangaId: string | null
  initialTab?: "ability" | "item" | "title"
}

export function AddContentDialog({ open, onOpenChange, mangaId, initialTab = "ability" }: AddContentDialogProps) {
  const { addAbility, addItem, addTitle, profile, addCustomAttribute, mangas } = useIsekai()

  // Ability states
  const [abilityName, setAbilityName] = useState("")
  const [abilityDesc, setAbilityDesc] = useState("")
  const [abilityType, setAbilityType] = useState<"active" | "passive">("active")
  const [abilityCategory, setAbilityCategory] = useState<Ability["category"]>("attack")
  const [abilityPower, setAbilityPower] = useState(10)

  // Item states
  const [itemName, setItemName] = useState("")
  const [itemDesc, setItemDesc] = useState("")
  const [itemType, setItemType] = useState<Item["type"]>("weapon")
  const [itemRarity, setItemRarity] = useState<Item["rarity"]>("common")

  // Title states
  const [titleName, setTitleName] = useState("")
  const [titleDesc, setTitleDesc] = useState("")

  // Shared attribute effects
  const [effects, setEffects] = useState<Record<string, number>>({})

  // Custom attribute
  const [newAttribute, setNewAttribute] = useState("")

  const [activeTab, setActiveTab] = useState<"ability" | "item" | "title">(initialTab)
  const [selectedMangaId, setSelectedMangaId] = useState<string | null>(mangaId)
  const [isAnimating, setIsAnimating] = useState(false)

  // Sync selected manga when dialog opens or prop changes
  useEffect(() => {
    setSelectedMangaId(mangaId ?? null)
    setActiveTab(initialTab)
  }, [open, mangaId, initialTab])

  // Animation control
  useEffect(() => {
    if (open) {
      setIsAnimating(true)
    } else {
      setIsAnimating(false)
    }
  }, [open])

  const allAttributes = ["strength", "agility", "intelligence", "vitality", "luck", ...profile.customAttributes]

  const handleAbilitySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!abilityName.trim() || !selectedMangaId) return

    addAbility(
      {
        name: abilityName.trim(),
        description: abilityDesc.trim(),
        type: abilityType,
        category: abilityCategory,
        power: abilityPower,
        effects,
      },
      selectedMangaId,
    )

    resetForm()
  }

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemName.trim() || !selectedMangaId) return

    addItem(
      {
        name: itemName.trim(),
        description: itemDesc.trim(),
        type: itemType,
        rarity: itemRarity,
        effects,
        source: selectedMangaId,
      },
      selectedMangaId,
    )

    resetForm()
  }

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleName.trim() || !selectedMangaId) return

    addTitle(
      {
        name: titleName.trim(),
        description: titleDesc.trim(),
        effects,
        source: selectedMangaId,
      },
      selectedMangaId,
    )

    resetForm()
  }

  const resetForm = () => {
    setAbilityName("")
    setAbilityDesc("")
    setItemName("")
    setItemDesc("")
    setTitleName("")
    setTitleDesc("")
    setEffects({})
    
    // Animation de fechamento
    setIsAnimating(false)
    setTimeout(() => {
      onOpenChange(false)
    }, 300)
  }

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onOpenChange(false)
    }, 300)
  }

  const handleAddCustomAttribute = () => {
    if (newAttribute.trim()) {
      addCustomAttribute(newAttribute.trim())
      setNewAttribute("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`max-h-[90vh] overflow-y-auto max-w-[95vw] md:max-w-2xl bg-slate-800 border-amber-500/30 text-amber-100 transition-all duration-300 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {/* Efeito de desdobramento */}
        <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/10 via-amber-500/5 to-transparent transition-all duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-amber-200 font-serif">✨ Adicionar Conteúdo do Manga</DialogTitle>
          <DialogDescription className="text-amber-300/80 font-serif">
            Adicione habilidades, itens ou títulos. Habilidades similares serão evoluídas!
          </DialogDescription>
        </DialogHeader>

        {/* Manga source selector */}
        <div className="mb-4 relative z-10">
          <Label className="text-amber-200 font-serif">Vincular ao Manga</Label>
          <Select value={selectedMangaId ?? undefined} onValueChange={(v) => setSelectedMangaId(v)}>
            <SelectTrigger className="bg-slate-700 border-amber-500/30 text-amber-100 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200">
              <SelectValue placeholder="Selecione um manga" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-amber-500/30 text-amber-100">
              {mangas.map((m) => (
                <SelectItem key={m.id} value={m.id} className="hover:bg-slate-600 focus:bg-slate-600">
                  {m.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full relative z-10">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700/50 border-amber-500/20">
            <TabsTrigger value="ability" className="font-serif text-amber-200 data-[state=active]:bg-amber-600 data-[state=active]:text-white hover:bg-amber-500/20 transition-all duration-200">⭐ Habilidade</TabsTrigger>
            <TabsTrigger value="item" className="font-serif text-amber-200 data-[state=active]:bg-amber-600 data-[state=active]:text-white hover:bg-amber-500/20 transition-all duration-200">🎒 Item</TabsTrigger>
            <TabsTrigger value="title" className="font-serif text-amber-200 data-[state=active]:bg-amber-600 data-[state=active]:text-white hover:bg-amber-500/20 transition-all duration-200">👑 Título</TabsTrigger>
          </TabsList>

          <TabsContent value="ability">
            <form onSubmit={handleAbilitySubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="abilityName" className="text-amber-200 font-serif">Nome da Habilidade</Label>
                <Input
                  id="abilityName"
                  value={abilityName}
                  onChange={(e) => setAbilityName(e.target.value)}
                  placeholder="Ex: Bola de Fogo"
                  required
                  className="bg-slate-700 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="abilityDesc" className="text-amber-200 font-serif">Descrição</Label>
                <Textarea
                  id="abilityDesc"
                  value={abilityDesc}
                  onChange={(e) => setAbilityDesc(e.target.value)}
                  placeholder="Descreva o que a habilidade faz..."
                  rows={3}
                  className="bg-slate-700 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-amber-200 font-serif">Tipo</Label>
                  <Select value={abilityType} onValueChange={(v) => setAbilityType(v as any)}>
                    <SelectTrigger className="bg-slate-700 border-amber-500/30 text-amber-100 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-amber-500/30 text-amber-100">
                      <SelectItem value="active" className="hover:bg-slate-600 focus:bg-slate-600">Ativa</SelectItem>
                      <SelectItem value="passive" className="hover:bg-slate-600 focus:bg-slate-600">Passiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-amber-200 font-serif">Categoria</Label>
                  <Select value={abilityCategory} onValueChange={(v) => setAbilityCategory(v as any)}>
                    <SelectTrigger className="bg-slate-700 border-amber-500/30 text-amber-100 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-amber-500/30 text-amber-100">
                      <SelectItem value="attack" className="hover:bg-slate-600 focus:bg-slate-600">Ataque</SelectItem>
                      <SelectItem value="defense" className="hover:bg-slate-600 focus:bg-slate-600">Defesa</SelectItem>
                      <SelectItem value="support" className="hover:bg-slate-600 focus:bg-slate-600">Suporte</SelectItem>
                      <SelectItem value="utility" className="hover:bg-slate-600 focus:bg-slate-600">Utilidade</SelectItem>
                      <SelectItem value="special" className="hover:bg-slate-600 focus:bg-slate-600">Especial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-amber-200 font-serif">Poder</Label>
                  <Input
                    type="number"
                    value={abilityPower}
                    onChange={(e) => setAbilityPower(Number(e.target.value))}
                    min={1}
                    className="bg-slate-700 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200"
                  />
                </div>
              </div>

              <AttributeEffects effects={effects} setEffects={setEffects} attributes={allAttributes} />

              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-serif hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30">
                ⭐ Adicionar Habilidade
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="item">
            <form onSubmit={handleItemSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Nome do Item</Label>
                <Input
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Ex: Espada Flamejante"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemDesc">Descrição</Label>
                <Textarea
                  id="itemDesc"
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder="Descreva o item..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={itemType} onValueChange={(v) => setItemType(v as any)}>
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
                  <Label>Raridade</Label>
                  <Select value={itemRarity} onValueChange={(v) => setItemRarity(v as any)}>
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

              <AttributeEffects effects={effects} setEffects={setEffects} attributes={allAttributes} />

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-serif hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30">
                🎒 Adicionar Item
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="title">
            <form onSubmit={handleTitleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titleName">Nome do Título</Label>
                <Input
                  id="titleName"
                  value={titleName}
                  onChange={(e) => setTitleName(e.target.value)}
                  placeholder="Ex: Matador de Dragões"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="titleDesc">Descrição</Label>
                <Textarea
                  id="titleDesc"
                  value={titleDesc}
                  onChange={(e) => setTitleDesc(e.target.value)}
                  placeholder="Como você conquistou este título..."
                  rows={3}
                />
              </div>

              <AttributeEffects effects={effects} setEffects={setEffects} attributes={allAttributes} />

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-serif hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30">
                👑 Adicionar Título
              </Button>
            </form>
          </TabsContent>
        </Tabs>


      </DialogContent>
    </Dialog>
  )
}

function AttributeEffects({
  effects,
  setEffects,
  attributes,
}: {
  effects: Record<string, number>
  setEffects: (effects: Record<string, number>) => void
  attributes: string[]
}) {
  const [newAttribute, setNewAttribute] = useState("")

  const handleAddAttribute = () => {
    if (newAttribute.trim() && !attributes.includes(newAttribute.trim())) {
      const newAttr = newAttribute.trim()
      setEffects({ ...effects, [newAttr]: 0 })
      setNewAttribute("")
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-amber-200 font-serif">✨ Bônus de Atributos</Label>
      <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
        {attributes.map((attr) => (
          <div key={attr}>
            <Label htmlFor={attr} className="text-xs capitalize text-amber-300 font-serif">
              {attr}
            </Label>
            <Input
              id={attr}
              type="number"
              value={effects[attr] || 0}
              onChange={(e) => setEffects({ ...effects, [attr]: Number(e.target.value) })}
              min={0}
              className="bg-slate-700 border-amber-500/30 text-amber-100 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200"
            />
          </div>
        ))}
        {Object.keys(effects).map((attr) => 
          !attributes.includes(attr) && (
            <div key={attr}>
              <Label htmlFor={attr} className="text-xs capitalize text-amber-300 font-serif">
                {attr}
              </Label>
              <Input
                id={attr}
                type="number"
                value={effects[attr] || 0}
                onChange={(e) => setEffects({ ...effects, [attr]: Number(e.target.value) })}
                min={0}
                className="bg-slate-700 border-amber-500/30 text-amber-100 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200"
              />
            </div>
          )
        )}
      </div>
      <div className="flex gap-2">
        <Input
          value={newAttribute}
          onChange={(e) => setNewAttribute(e.target.value)}
          placeholder="Novo atributo..."
          className="flex-1 bg-slate-700 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200"
        />
        <Button
          type="button"
          size="sm"
          onClick={handleAddAttribute}
          disabled={!newAttribute.trim() || attributes.includes(newAttribute.trim())}
          className="bg-amber-600 hover:bg-amber-700 text-white hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
