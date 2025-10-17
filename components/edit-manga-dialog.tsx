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
import type { Manga } from "@/lib/isekai-types"

interface EditMangaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  manga: Manga | null
}

export function EditMangaDialog({ open, onOpenChange, manga }: EditMangaDialogProps) {
  const { mangas, setMangas } = useIsekai()
  const [title, setTitle] = useState("")
  const [type, setType] = useState<"manga" | "manhwa" | "manhua">("manga")
  const [coverImage, setCoverImage] = useState("")
  const [url, setUrl] = useState("")
  const [currentEpisode, setCurrentEpisode] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Atualizar os campos quando o mangá mudar
  useEffect(() => {
    if (manga) {
      setTitle(manga.title)
      setType(manga.type)
      setCoverImage(manga.coverImage || "")
      setUrl(manga.url || "")
      setCurrentEpisode(manga.currentEpisode || 0)
    }
  }, [manga])

  useEffect(() => {
    if (open) {
      setIsAnimating(true)
    } else {
      setIsAnimating(false)
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !manga) return

    // Animação de fechamento
    setIsAnimating(false)
    
    setTimeout(() => {
      // Atualizar o mangá na lista
      setMangas((prev) =>
        prev.map((m) =>
          m.id === manga.id
            ? {
                ...m,
                title: title.trim(),
                type,
                coverImage: coverImage || undefined,
                url: url || undefined,
                currentEpisode: currentEpisode > 0 ? currentEpisode : undefined,
              }
            : m
        )
      )

      onOpenChange(false)
    }, 300)
  }

  const handleClose = () => {
    setIsAnimating(false)
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
          <DialogTitle className="text-amber-200 font-serif">✏️ Editar Manga/Manhwa</DialogTitle>
          <DialogDescription className="text-amber-300/80 font-serif">Edite as informações do seu mangá</DialogDescription>
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
              className="bg-slate-700 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20 transition-all duration-200"
            />
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
          </div>
          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-serif hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30">
            ✨ Salvar Alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
