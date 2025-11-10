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
import { Plus, Edit, Trash2, Shield, ArrowLeft } from "lucide-react"
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
}

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [rewards, setRewards] = useState<MangaReward[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReward, setEditingReward] = useState<MangaReward | null>(null)
  const [formData, setFormData] = useState({
    mangaId: "",
    mangaTitle: "",
    episode: "",
    experience: "",
    abilities: "",
    items: "",
    titles: "",
    attributes: "",
  })

  // Carregar recompensas (área secreta - sem verificação de admin)
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

  const handleOpenDialog = (reward?: MangaReward) => {
    if (reward) {
      setEditingReward(reward)
      setFormData({
        mangaId: reward.mangaId,
        mangaTitle: reward.mangaTitle,
        episode: reward.episode.toString(),
        experience: reward.experience?.toString() || "",
        abilities: reward.abilities ? JSON.stringify(reward.abilities, null, 2) : "",
        items: reward.items ? JSON.stringify(reward.items, null, 2) : "",
        titles: reward.titles ? JSON.stringify(reward.titles, null, 2) : "",
        attributes: reward.attributes ? JSON.stringify(reward.attributes, null, 2) : "",
      })
    } else {
      setEditingReward(null)
      setFormData({
        mangaId: "",
        mangaTitle: "",
        episode: "",
        experience: "",
        abilities: "",
        items: "",
        titles: "",
        attributes: "",
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
      abilities: "",
      items: "",
      titles: "",
      attributes: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let response
      const payload: any = {
        mangaId: formData.mangaId.trim(),
        mangaTitle: formData.mangaTitle.trim(),
        episode: parseInt(formData.episode),
        experience: formData.experience ? parseInt(formData.experience) : null,
      }

      // Parse JSON fields
      if (formData.abilities.trim()) {
        try {
          payload.abilities = JSON.parse(formData.abilities)
        } catch {
          toast({
            title: "Erro",
            description: "Formato JSON inválido no campo Abilities",
            variant: "destructive"
          })
          return
        }
      }

      if (formData.items.trim()) {
        try {
          payload.items = JSON.parse(formData.items)
        } catch {
          toast({
            title: "Erro",
            description: "Formato JSON inválido no campo Items",
            variant: "destructive"
          })
          return
        }
      }

      if (formData.titles.trim()) {
        try {
          payload.titles = JSON.parse(formData.titles)
        } catch {
          toast({
            title: "Erro",
            description: "Formato JSON inválido no campo Titles",
            variant: "destructive"
          })
          return
        }
      }

      if (formData.attributes.trim()) {
        try {
          payload.attributes = JSON.parse(formData.attributes)
        } catch {
          toast({
            title: "Erro",
            description: "Formato JSON inválido no campo Attributes",
            variant: "destructive"
          })
          return
        }
      }

      if (editingReward) {
        // Atualizar
        response = await fetch("/api/rewards", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingReward.id, ...payload })
        })
      } else {
        // Criar
        response = await fetch("/api/rewards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: editingReward ? "Recompensa atualizada com sucesso!" : "Recompensa criada com sucesso!",
        })
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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-800 via-purple-800 to-indigo-800 border-2 border-amber-500/30">
              <DialogHeader>
                <DialogTitle className="text-amber-200 font-serif text-2xl">
                  {editingReward ? "Editar Recompensa" : "Nova Recompensa"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <div>
                  <Label htmlFor="abilities" className="text-amber-200">Abilities (JSON)</Label>
                  <Textarea
                    id="abilities"
                    value={formData.abilities}
                    onChange={(e) => setFormData({ ...formData, abilities: e.target.value })}
                    placeholder='[{"name": "Electric Control", "description": "...", "type": "active", "level": 1, "category": "attack", "power": 4, "manaCost": 15, "cooldown": 45}]'
                    rows={4}
                    className="bg-slate-700/50 border-amber-500/30 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="items" className="text-amber-200">Items (JSON)</Label>
                  <Textarea
                    id="items"
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                    placeholder='[{"name": "Sword", "description": "...", "type": "weapon", "rarity": "rare", "effects": {"strength": 5}}]'
                    rows={4}
                    className="bg-slate-700/50 border-amber-500/30 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="titles" className="text-amber-200">Titles (JSON)</Label>
                  <Textarea
                    id="titles"
                    value={formData.titles}
                    onChange={(e) => setFormData({ ...formData, titles: e.target.value })}
                    placeholder='[{"name": "Hero", "description": "...", "effects": {"strength": 2, "intelligence": 3}}]'
                    rows={4}
                    className="bg-slate-700/50 border-amber-500/30 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="attributes" className="text-amber-200">Attributes (JSON)</Label>
                  <Textarea
                    id="attributes"
                    value={formData.attributes}
                    onChange={(e) => setFormData({ ...formData, attributes: e.target.value })}
                    placeholder='{"strength": 2, "intelligence": 3, "agility": 1}'
                    rows={3}
                    className="bg-slate-700/50 border-amber-500/30 text-white font-mono text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
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

