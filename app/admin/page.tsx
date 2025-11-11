"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Shield, ArrowLeft, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MangaReward {
  id: string
  mangaId: string
  mangaTitle: string
  episode: number
  experience: number | null
  abilities: any[] | null
  items: any[] | null
  titles: any[] | null
  attributes: Record<string, number> | null
  aliases: string[] | null
}

interface AbilityForm {
  name: string
  description: string
  type: "active" | "passive"
  level: number
  category: "attack" | "defense" | "support" | "utility" | "special"
  power: number
  manaCost: number | ""
  cooldown: number | ""
}

interface ItemForm {
  name: string
  description: string
  type: "weapon" | "armor" | "accessory" | "consumable" | "material"
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  effects: {
    strength: number | ""
    agility: number | ""
    intelligence: number | ""
    vitality: number | ""
    luck: number | ""
  }
}

interface TitleForm {
  name: string
  description: string
  effects: {
    strength: number | ""
    agility: number | ""
    intelligence: number | ""
    vitality: number | ""
    luck: number | ""
  }
}

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [rewards, setRewards] = useState<MangaReward[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReward, setEditingReward] = useState<MangaReward | null>(null)
  
  // Form data com arrays de objetos ao invés de JSON strings
  const [formData, setFormData] = useState({
    mangaId: "",
    mangaTitle: "",
    episode: "",
    experience: "",
    abilities: [] as AbilityForm[],
    items: [] as ItemForm[],
    titles: [] as TitleForm[],
    attributes: {
      strength: "",
      agility: "",
      intelligence: "",
      vitality: "",
      luck: "",
    },
    aliases: [] as string[],
  })
  const [newAlias, setNewAlias] = useState("")

  // Carregar recompensas
  useEffect(() => {
    loadRewards()
  }, [])

  const loadRewards = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/rewards")
      const data = await response.json()
      
      if (data.success) {
        setRewards(data.rewards)
      } else {
        toast({
          title: "Erro",
          description: "Erro ao carregar recompensas",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Erro ao carregar recompensas:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar recompensas",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getDefaultAbility = (): AbilityForm => ({
    name: "",
    description: "",
    type: "active",
    level: 1,
    category: "attack",
    power: 4,
    manaCost: "",
    cooldown: "",
  })

  const getDefaultItem = (): ItemForm => ({
    name: "",
    description: "",
    type: "weapon",
    rarity: "rare",
    effects: {
      strength: "",
      agility: "",
      intelligence: "",
      vitality: "",
      luck: "",
    }
  })

  const getDefaultTitle = (): TitleForm => ({
    name: "",
    description: "",
    effects: {
      strength: "",
      agility: "",
      intelligence: "",
      vitality: "",
      luck: "",
    }
  })

  const handleOpenDialog = (reward?: MangaReward) => {
    if (reward) {
      setEditingReward(reward)
      setFormData({
        mangaId: reward.mangaId,
        mangaTitle: reward.mangaTitle,
        episode: reward.episode.toString(),
        experience: reward.experience?.toString() || "",
        abilities: (reward.abilities || []).map((a: any) => ({
          name: a.name || "",
          description: a.description || "",
          type: a.type || "active",
          level: a.level || 1,
          category: a.category || "attack",
          power: a.power || 0,
          manaCost: a.manaCost || "",
          cooldown: a.cooldown || "",
        })),
        items: (reward.items || []).map((i: any) => ({
          name: i.name || "",
          description: i.description || "",
          type: i.type || "weapon",
          rarity: i.rarity || "rare",
          effects: {
            strength: i.effects?.strength || "",
            agility: i.effects?.agility || "",
            intelligence: i.effects?.intelligence || "",
            vitality: i.effects?.vitality || "",
            luck: i.effects?.luck || "",
          }
        })),
        titles: (reward.titles || []).map((t: any) => ({
          name: t.name || "",
          description: t.description || "",
          effects: {
            strength: t.effects?.strength || "",
            agility: t.effects?.agility || "",
            intelligence: t.effects?.intelligence || "",
            vitality: t.effects?.vitality || "",
            luck: t.effects?.luck || "",
          }
        })),
        attributes: {
          strength: reward.attributes?.strength?.toString() || "",
          agility: reward.attributes?.agility?.toString() || "",
          intelligence: reward.attributes?.intelligence?.toString() || "",
          vitality: reward.attributes?.vitality?.toString() || "",
          luck: reward.attributes?.luck?.toString() || "",
        },
        aliases: reward.aliases || [],
      })
    } else {
      setEditingReward(null)
      setFormData({
        mangaId: "",
        mangaTitle: "",
        episode: "",
        experience: "",
        abilities: [],
        items: [],
        titles: [],
        attributes: {
          strength: "",
          agility: "",
          intelligence: "",
          vitality: "",
          luck: "",
        },
        aliases: [],
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingReward(null)
    setFormData({
      mangaId: "",
      mangaTitle: "",
      episode: "",
      experience: "",
      abilities: [],
      items: [],
      titles: [],
      attributes: {
        strength: "",
        agility: "",
        intelligence: "",
        vitality: "",
        luck: "",
      },
      aliases: [],
    })
    setNewAlias("")
  }

  const addAbility = () => {
    setFormData({
      ...formData,
      abilities: [...formData.abilities, getDefaultAbility()]
    })
  }

  const removeAbility = (index: number) => {
    setFormData({
      ...formData,
      abilities: formData.abilities.filter((_, i) => i !== index)
    })
  }

  const updateAbility = (index: number, field: keyof AbilityForm, value: any) => {
    const updated = [...formData.abilities]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, abilities: updated })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, getDefaultItem()]
    })
  }

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  const updateItem = (index: number, field: keyof ItemForm, value: any) => {
    const updated = [...formData.items]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, items: updated })
  }

  const updateItemEffect = (index: number, effect: string, value: string) => {
    const updated = [...formData.items]
    updated[index] = {
      ...updated[index],
      effects: { ...updated[index].effects, [effect]: value }
    }
    setFormData({ ...formData, items: updated })
  }

  const addTitle = () => {
    setFormData({
      ...formData,
      titles: [...formData.titles, getDefaultTitle()]
    })
  }

  const removeTitle = (index: number) => {
    setFormData({
      ...formData,
      titles: formData.titles.filter((_, i) => i !== index)
    })
  }

  const updateTitle = (index: number, field: keyof TitleForm, value: any) => {
    const updated = [...formData.titles]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, titles: updated })
  }

  const updateTitleEffect = (index: number, effect: string, value: string) => {
    const updated = [...formData.titles]
    updated[index] = {
      ...updated[index],
      effects: { ...updated[index].effects, [effect]: value }
    }
    setFormData({ ...formData, titles: updated })
  }

  const addAlias = () => {
    if (newAlias.trim()) {
      setFormData({
        ...formData,
        aliases: [...formData.aliases, newAlias.trim()]
      })
      setNewAlias("")
    }
  }

  const removeAlias = (index: number) => {
    setFormData({
      ...formData,
      aliases: formData.aliases.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload: any = {
        mangaId: formData.mangaId.trim(),
        mangaTitle: formData.mangaTitle.trim(),
        episode: parseInt(formData.episode),
        experience: formData.experience ? parseInt(formData.experience) : null,
      }

      // Converter abilities para formato JSON
      const filteredAbilities = formData.abilities
        .filter(a => a.name.trim())
        .map(a => ({
          name: a.name.trim(),
          description: a.description.trim(),
          type: a.type,
          level: a.level,
          category: a.category,
          power: a.power,
          ...(a.manaCost !== "" && a.manaCost !== null && { manaCost: Number(a.manaCost) }),
          ...(a.cooldown !== "" && a.cooldown !== null && { cooldown: Number(a.cooldown) }),
        }))
      if (filteredAbilities.length > 0) {
        payload.abilities = filteredAbilities
      }

      // Converter items para formato JSON
      const filteredItems = formData.items
        .filter(i => i.name.trim())
        .map(i => {
          const effects: Record<string, number> = {}
          Object.entries(i.effects).forEach(([key, value]) => {
            if (value !== "" && value !== null) {
              effects[key] = Number(value)
            }
          })
          return {
            name: i.name.trim(),
            description: i.description.trim(),
            type: i.type,
            rarity: i.rarity,
            ...(Object.keys(effects).length > 0 && { effects }),
          }
        })
      if (filteredItems.length > 0) {
        payload.items = filteredItems
      }

      // Converter titles para formato JSON
      const filteredTitles = formData.titles
        .filter(t => t.name.trim())
        .map(t => {
          const effects: Record<string, number> = {}
          Object.entries(t.effects).forEach(([key, value]) => {
            if (value !== "" && value !== null) {
              effects[key] = Number(value)
            }
          })
          return {
            name: t.name.trim(),
            description: t.description.trim(),
            ...(Object.keys(effects).length > 0 && { effects }),
          }
        })
      if (filteredTitles.length > 0) {
        payload.titles = filteredTitles
      }

      // Converter attributes para formato JSON
      const attributes: Record<string, number> = {}
      Object.entries(formData.attributes).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          attributes[key] = Number(value)
        }
      })
      if (Object.keys(attributes).length > 0) {
        payload.attributes = attributes
      }

      // Aliases
      if (formData.aliases.length > 0) {
        payload.aliases = formData.aliases
      }

      let response
      if (editingReward) {
        response = await fetch("/api/rewards", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingReward.id, ...payload })
        })
      } else {
        response = await fetch("/api/rewards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      }

      const data = await response.json()

      if (data.success) {
        if (data.warning) {
          toast({
            title: "⚠️ Aviso",
            description: data.message || "Recompensa criada, mas aliases não foram salvos. Execute a migration: npx prisma migrate dev",
            variant: "default"
          })
        } else {
          toast({
            title: "Sucesso",
            description: editingReward ? "Recompensa atualizada com sucesso!" : "Recompensa criada com sucesso!",
          })
        }
        handleCloseDialog()
        loadRewards()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao salvar recompensa",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Erro ao salvar recompensa:", error)
      toast({
        title: "Erro",
        description: "Erro ao salvar recompensa",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/rewards?id=${id}`, {
        method: "DELETE"
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Recompensa deletada com sucesso!",
        })
        loadRewards()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao deletar recompensa",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Erro ao deletar recompensa:", error)
      toast({
        title: "Erro",
        description: "Erro ao deletar recompensa",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-amber-200 font-serif text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-amber-200 font-serif flex items-center gap-2">
                <Shield className="h-8 w-8" />
                Área Secreta
              </h1>
              <p className="text-amber-300/80 mt-1">Gerenciar Recompensas de Mangás</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Recompensa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-800 via-purple-800 to-indigo-800 border-2 border-amber-500/30">
              <DialogHeader>
                <DialogTitle className="text-amber-200 font-serif text-2xl">
                  {editingReward ? "Editar Recompensa" : "Nova Recompensa"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campos básicos */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mangaId" className="text-amber-200">Manga ID *</Label>
                    <Input
                      id="mangaId"
                      value={formData.mangaId}
                      onChange={(e) => setFormData({ ...formData, mangaId: e.target.value })}
                      placeholder="ex: eleceed"
                      required
                      className="bg-slate-700/50 border-amber-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mangaTitle" className="text-amber-200">Título do Mangá *</Label>
                    <Input
                      id="mangaTitle"
                      value={formData.mangaTitle}
                      onChange={(e) => setFormData({ ...formData, mangaTitle: e.target.value })}
                      placeholder="ex: Eleceed"
                      required
                      className="bg-slate-700/50 border-amber-500/30 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="episode" className="text-amber-200">Episódio *</Label>
                    <Input
                      id="episode"
                      type="number"
                      min="1"
                      value={formData.episode}
                      onChange={(e) => setFormData({ ...formData, episode: e.target.value })}
                      placeholder="ex: 1"
                      required
                      className="bg-slate-700/50 border-amber-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience" className="text-amber-200">Experiência (XP)</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="ex: 50"
                      className="bg-slate-700/50 border-amber-500/30 text-white"
                    />
                  </div>
                </div>

                {/* Abilities */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-amber-200 text-lg font-semibold">⚡ Habilidades</Label>
                    <Button
                      type="button"
                      onClick={addAbility}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  {formData.abilities.map((ability, index) => (
                    <Card key={index} className="bg-slate-700/30 border-purple-500/30 p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-amber-200 font-semibold">Habilidade {index + 1}</h4>
                        <Button
                          type="button"
                          onClick={() => removeAbility(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 space-y-0">
                        <div className="col-span-2">
                          <Label className="text-amber-300 text-sm">Nome *</Label>
                          <Input
                            value={ability.name}
                            onChange={(e) => updateAbility(index, "name", e.target.value)}
                            placeholder="Nome da habilidade"
                            className="bg-slate-600/50 border-amber-500/30 text-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-amber-300 text-sm">Descrição</Label>
                          <Textarea
                            value={ability.description}
                            onChange={(e) => updateAbility(index, "description", e.target.value)}
                            placeholder="Descrição da habilidade"
                            rows={2}
                            className="bg-slate-600/50 border-amber-500/30 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-amber-300 text-sm">Tipo</Label>
                          <Select
                            value={ability.type}
                            onValueChange={(v) => updateAbility(index, "type", v)}
                          >
                            <SelectTrigger className="bg-slate-600/50 border-amber-500/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="passive">Passive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-amber-300 text-sm">Categoria</Label>
                          <Select
                            value={ability.category}
                            onValueChange={(v) => updateAbility(index, "category", v)}
                          >
                            <SelectTrigger className="bg-slate-600/50 border-amber-500/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="attack">Attack</SelectItem>
                              <SelectItem value="defense">Defense</SelectItem>
                              <SelectItem value="support">Support</SelectItem>
                              <SelectItem value="utility">Utility</SelectItem>
                              <SelectItem value="special">Special</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-amber-300 text-sm">Level</Label>
                          <Input
                            type="number"
                            min="1"
                            value={ability.level}
                            onChange={(e) => updateAbility(index, "level", parseInt(e.target.value) || 1)}
                            className="bg-slate-600/50 border-amber-500/30 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-amber-300 text-sm">Power</Label>
                          <Input
                            type="number"
                            min="0"
                            value={ability.power}
                            onChange={(e) => updateAbility(index, "power", parseInt(e.target.value) || 0)}
                            className="bg-slate-600/50 border-amber-500/30 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-amber-300 text-sm">Mana Cost (opcional)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={ability.manaCost}
                            onChange={(e) => updateAbility(index, "manaCost", e.target.value === "" ? "" : parseInt(e.target.value) || "")}
                            placeholder="Opcional"
                            className="bg-slate-600/50 border-amber-500/30 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-amber-300 text-sm">Cooldown (opcional)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={ability.cooldown}
                            onChange={(e) => updateAbility(index, "cooldown", e.target.value === "" ? "" : parseInt(e.target.value) || "")}
                            placeholder="Opcional"
                            className="bg-slate-600/50 border-amber-500/30 text-white"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-amber-200 text-lg font-semibold">🎒 Itens</Label>
                    <Button
                      type="button"
                      onClick={addItem}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  {formData.items.map((item, index) => (
                    <Card key={index} className="bg-slate-700/30 border-blue-500/30 p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-amber-200 font-semibold">Item {index + 1}</h4>
                        <Button
                          type="button"
                          onClick={() => removeItem(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 space-y-0">
                        <div className="col-span-2">
                          <Label className="text-amber-300 text-sm">Nome *</Label>
                          <Input
                            value={item.name}
                            onChange={(e) => updateItem(index, "name", e.target.value)}
                            placeholder="Nome do item"
                            className="bg-slate-600/50 border-amber-500/30 text-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-amber-300 text-sm">Descrição</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) => updateItem(index, "description", e.target.value)}
                            placeholder="Descrição do item"
                            rows={2}
                            className="bg-slate-600/50 border-amber-500/30 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-amber-300 text-sm">Tipo</Label>
                          <Select
                            value={item.type}
                            onValueChange={(v) => updateItem(index, "type", v)}
                          >
                            <SelectTrigger className="bg-slate-600/50 border-amber-500/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weapon">Weapon</SelectItem>
                              <SelectItem value="armor">Armor</SelectItem>
                              <SelectItem value="accessory">Accessory</SelectItem>
                              <SelectItem value="consumable">Consumable</SelectItem>
                              <SelectItem value="material">Material</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-amber-300 text-sm">Rarity</Label>
                          <Select
                            value={item.rarity}
                            onValueChange={(v) => updateItem(index, "rarity", v)}
                          >
                            <SelectTrigger className="bg-slate-600/50 border-amber-500/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="common">Common</SelectItem>
                              <SelectItem value="uncommon">Uncommon</SelectItem>
                              <SelectItem value="rare">Rare</SelectItem>
                              <SelectItem value="epic">Epic</SelectItem>
                              <SelectItem value="legendary">Legendary</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-amber-300 text-sm mb-2 block">Efeitos (opcional)</Label>
                          <div className="grid grid-cols-5 gap-2">
                            {["strength", "agility", "intelligence", "vitality", "luck"].map((attr) => (
                              <div key={attr}>
                                <Label className="text-amber-300/80 text-xs capitalize">{attr}</Label>
                                <Input
                                  type="number"
                                  value={item.effects[attr as keyof typeof item.effects]}
                                  onChange={(e) => updateItemEffect(index, attr, e.target.value === "" ? "" : e.target.value)}
                                  placeholder="0"
                                  className="bg-slate-600/50 border-amber-500/30 text-white"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Titles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-amber-200 text-lg font-semibold">👑 Títulos</Label>
                    <Button
                      type="button"
                      onClick={addTitle}
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  {formData.titles.map((title, index) => (
                    <Card key={index} className="bg-slate-700/30 border-yellow-500/30 p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-amber-200 font-semibold">Título {index + 1}</h4>
                        <Button
                          type="button"
                          onClick={() => removeTitle(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 space-y-0">
                        <div className="col-span-2">
                          <Label className="text-amber-300 text-sm">Nome *</Label>
                          <Input
                            value={title.name}
                            onChange={(e) => updateTitle(index, "name", e.target.value)}
                            placeholder="Nome do título"
                            className="bg-slate-600/50 border-amber-500/30 text-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-amber-300 text-sm">Descrição</Label>
                          <Textarea
                            value={title.description}
                            onChange={(e) => updateTitle(index, "description", e.target.value)}
                            placeholder="Descrição do título"
                            rows={2}
                            className="bg-slate-600/50 border-amber-500/30 text-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-amber-300 text-sm mb-2 block">Efeitos (opcional)</Label>
                          <div className="grid grid-cols-5 gap-2">
                            {["strength", "agility", "intelligence", "vitality", "luck"].map((attr) => (
                              <div key={attr}>
                                <Label className="text-amber-300/80 text-xs capitalize">{attr}</Label>
                                <Input
                                  type="number"
                                  value={title.effects[attr as keyof typeof title.effects]}
                                  onChange={(e) => updateTitleEffect(index, attr, e.target.value === "" ? "" : e.target.value)}
                                  placeholder="0"
                                  className="bg-slate-600/50 border-amber-500/30 text-white"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Attributes */}
                <div className="space-y-3">
                  <Label className="text-amber-200 text-lg font-semibold">📈 Atributos Diretos</Label>
                  <Card className="bg-slate-700/30 border-green-500/30 p-4">
                    <div className="grid grid-cols-5 gap-3">
                      {["strength", "agility", "intelligence", "vitality", "luck"].map((attr) => (
                        <div key={attr}>
                          <Label className="text-amber-300 text-sm capitalize">{attr}</Label>
                          <Input
                            type="number"
                            value={formData.attributes[attr as keyof typeof formData.attributes]}
                            onChange={(e) => setFormData({
                              ...formData,
                              attributes: {
                                ...formData.attributes,
                                [attr]: e.target.value === "" ? "" : e.target.value
                              }
                            })}
                            placeholder="0"
                            className="bg-slate-600/50 border-amber-500/30 text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Aliases */}
                <div className="space-y-3">
                  <Label className="text-amber-200 text-lg font-semibold">🏷️ Aliases / Nomes Alternativos</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newAlias}
                      onChange={(e) => setNewAlias(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAlias())}
                      placeholder="Digite um nome alternativo"
                      className="bg-slate-700/50 border-amber-500/30 text-white"
                    />
                    <Button
                      type="button"
                      onClick={addAlias}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.aliases.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.aliases.map((alias, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-amber-500/30 text-amber-200 bg-slate-700/50"
                        >
                          {alias}
                          <button
                            type="button"
                            onClick={() => removeAlias(index)}
                            className="ml-2 hover:text-red-400"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-amber-500/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                    className="border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {editingReward ? "Atualizar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <Card className="bg-slate-800/50 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-amber-200 font-serif">Recompensas Cadastradas</CardTitle>
            <CardDescription className="text-amber-300/80">
              Total: {rewards.length} recompensa(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rewards.length === 0 ? (
              <div className="text-center py-8 text-amber-300/60">
                Nenhuma recompensa cadastrada. Clique em "Nova Recompensa" para começar.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-amber-500/20">
                      <TableHead className="text-amber-200">Mangá</TableHead>
                      <TableHead className="text-amber-200">Episódio</TableHead>
                      <TableHead className="text-amber-200">XP</TableHead>
                      <TableHead className="text-amber-200">Recompensas</TableHead>
                      <TableHead className="text-amber-200 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rewards.map((reward) => (
                      <TableRow key={reward.id} className="border-amber-500/10">
                        <TableCell className="text-amber-100">
                          <div>
                            <div className="font-semibold">{reward.mangaTitle}</div>
                            <div className="text-xs text-amber-300/60">{reward.mangaId}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-amber-100">{reward.episode}</TableCell>
                        <TableCell className="text-amber-100">
                          {reward.experience ? (
                            <Badge variant="outline" className="border-amber-500/30 text-amber-200">
                              +{reward.experience} XP
                            </Badge>
                          ) : (
                            <span className="text-amber-300/40">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-amber-100">
                          <div className="flex flex-wrap gap-1">
                            {reward.abilities && reward.abilities.length > 0 && (
                              <Badge variant="outline" className="border-purple-500/30 text-purple-200 text-xs">
                                {reward.abilities.length} Ability
                              </Badge>
                            )}
                            {reward.items && reward.items.length > 0 && (
                              <Badge variant="outline" className="border-blue-500/30 text-blue-200 text-xs">
                                {reward.items.length} Item
                              </Badge>
                            )}
                            {reward.titles && reward.titles.length > 0 && (
                              <Badge variant="outline" className="border-yellow-500/30 text-yellow-200 text-xs">
                                {reward.titles.length} Title
                              </Badge>
                            )}
                            {reward.attributes && Object.keys(reward.attributes).length > 0 && (
                              <Badge variant="outline" className="border-green-500/30 text-green-200 text-xs">
                                Attributes
                              </Badge>
                            )}
                            {!reward.abilities?.length && !reward.items?.length && !reward.titles?.length && !reward.attributes && (
                              <span className="text-amber-300/40 text-xs">Nenhuma</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(reward)}
                              className="border-blue-500/30 text-blue-200 hover:bg-blue-500/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-500/30 text-red-200 hover:bg-red-500/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-gradient-to-br from-slate-800 via-purple-800 to-indigo-800 border-2 border-amber-500/30">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-amber-200">Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription className="text-amber-300/80">
                                    Tem certeza que deseja deletar a recompensa do episódio {reward.episode} de "{reward.mangaTitle}"?
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-amber-500/30 text-amber-200 hover:bg-amber-500/20">
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(reward.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Deletar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
