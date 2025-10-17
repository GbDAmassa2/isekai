"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useIsekai } from "./isekai-provider"
import { Upload } from "lucide-react"

interface AddMangaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMangaDialog({ open, onOpenChange }: AddMangaDialogProps) {
  const { addManga, mangas } = useIsekai()
  const [title, setTitle] = useState("")
  const [type, setType] = useState<"manga" | "manhwa" | "manhua">("manga")
  const [coverImage, setCoverImage] = useState("")
  const [url, setUrl] = useState("")
  const [currentEpisode, setCurrentEpisode] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [duplicateError, setDuplicateError] = useState("")

  useEffect(() => {
    if (open) {
      setIsAnimating(true)
    } else {
      setIsAnimating(false)
    }
  }, [open])

  // Limpar erro quando o título muda
  useEffect(() => {
    if (duplicateError) {
      setDuplicateError("")
    }
  }, [title])

  // Função para verificar se já existe um mangá com o mesmo nome
  const checkDuplicate = (mangaTitle: string): boolean => {
    return mangas.some(manga => 
      manga.title.toLowerCase().trim() === mangaTitle.toLowerCase().trim()
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    // Verificar se já existe um mangá com o mesmo nome
    if (checkDuplicate(title.trim())) {
      setDuplicateError(`"${title.trim()}" já existe na sua biblioteca!`)
      return
    }

    // Animação de fechamento
    setIsAnimating(false)
    
    setTimeout(() => {
      addManga({
        title: title.trim(),
        type,
        abilities: [],
        coverImage: coverImage || undefined,
        url: url || undefined,
        currentEpisode: currentEpisode > 0 ? currentEpisode : undefined,
      })

      setTitle("")
      setType("manga")
      setCoverImage("")
      setUrl("")
      setCurrentEpisode(0)
      setDuplicateError("")
      onOpenChange(false)
    }, 300)
  }

  const handleClose = () => {
    setIsAnimating(false)
    setDuplicateError("")
    setTimeout(() => {
      onOpenChange(false)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`bg-slate-800 border-amber-500/30 text-amber-100 transition-all duration-300 max-w-[95vw] md:max-w-md ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {/* Efeito de desdobramento */}
        <div className={`absolute inset-0 bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-transparent transition-all duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-amber-200 font-serif">📚 Adicionar Manga/Manhwa</DialogTitle>
          <DialogDescription className="text-amber-300/80 font-serif">Adicione um manga ou manhwa que você leu para ganhar habilidades</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-amber-200 font-serif">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Solo Leveling"
              required
              className={`bg-slate-700 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200 ${
                duplicateError ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' : ''
              }`}
            />
            {duplicateError && (
              <p className="text-red-400 text-sm font-serif flex items-center gap-1">
                ⚠️ {duplicateError}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="text-amber-200 font-serif">Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger className="bg-slate-700 border-amber-500/30 text-amber-100 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-amber-500/30 text-amber-100">
                <SelectItem value="manga" className="hover:bg-slate-600 focus:bg-slate-600">Manga</SelectItem>
                <SelectItem value="manhwa" className="hover:bg-slate-600 focus:bg-slate-600">Manhwa</SelectItem>
                <SelectItem value="manhua" className="hover:bg-slate-600 focus:bg-slate-600">Manhua</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverImage" className="text-amber-200 font-serif">URL da Capa (opcional)</Label>
            <div className="flex gap-2">
              <Input
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://exemplo.com/capa.jpg"
                className="bg-slate-700 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200"
              />
              <Button type="button" variant="outline" size="icon" className="border-amber-500/30 text-amber-200 hover:bg-amber-500/20 hover:scale-105 transition-all duration-200">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="url" className="text-amber-200 font-serif">🔗 Link do Site (opcional)</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://mangadex.org/title/..."
              className="bg-slate-700 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentEpisode" className="text-amber-200 font-serif">📖 Episódio Atual (opcional)</Label>
            <Input
              id="currentEpisode"
              type="number"
              min="0"
              value={currentEpisode}
              onChange={(e) => setCurrentEpisode(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="bg-slate-700 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200"
            />
            {currentEpisode > 0 && (
              <p className="text-amber-300/70 text-sm font-serif">
                ✨ Você ganhará {currentEpisode * 10} XP por este mangá!
              </p>
            )}
          </div>
          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-serif hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30">
            ✨ Adicionar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
