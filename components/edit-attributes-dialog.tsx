"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useIsekai } from "@/components/isekai-provider"
import { Plus, Trash2, RotateCcw } from "lucide-react"

interface EditAttributesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAttributesDialog({ open, onOpenChange }: EditAttributesDialogProps) {
  const { profile, addCustomAttribute, updateAttribute, removeCustomAttribute, resetManualAttribute } = useIsekai()
  const [attributes, setAttributes] = useState<Record<string, number>>({})
  const [newAttributeName, setNewAttributeName] = useState("")

  useEffect(() => {
    if (open) {
      setAttributes({ ...profile.attributes })
    }
  }, [open, profile.attributes])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Salvar todas as alterações de atributos
    Object.entries(attributes).forEach(([key, value]) => {
      if (profile.attributes[key] !== value) {
        updateAttribute(key, value)
      }
    })
    onOpenChange(false)
  }

  const handleAddAttribute = () => {
    if (newAttributeName.trim() && !attributes[newAttributeName.trim()]) {
      addCustomAttribute(newAttributeName.trim())
      setAttributes(prev => ({
        ...prev,
        [newAttributeName.trim()]: 0
      }))
      setNewAttributeName("")
    }
  }

  const handleAttributeChange = (key: string, value: number) => {
    const newValue = Math.max(0, value)
    setAttributes(prev => ({
      ...prev,
      [key]: newValue
    }))
    // Salvar imediatamente no localStorage
    updateAttribute(key, newValue)
  }

  const handleRemoveAttribute = (key: string) => {
    if (["strength", "agility", "intelligence", "vitality", "luck"].includes(key)) {
      return // Não permite remover atributos base
    }
    
    removeCustomAttribute(key)
    const newAttributes = { ...attributes }
    delete newAttributes[key]
    setAttributes(newAttributes)
  }

  const getAttributeIcon = (key: string) => {
    switch (key) {
      case "strength":
        return "💪"
      case "agility":
        return "⚡"
      case "intelligence":
        return "🧠"
      case "vitality":
        return "❤️"
      case "luck":
        return "🍀"
      default:
        return "⭐"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Atributos</DialogTitle>
          <DialogDescription>
            Modifique os valores dos atributos ou adicione novos atributos personalizados
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Label>Atributos Existentes</Label>
            <div className="grid gap-3">
              {Object.entries(attributes).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3 p-3 border rounded-lg">
                  <span className="text-lg">{getAttributeIcon(key)}</span>
                  <div className="flex-1">
                    <Label htmlFor={key} className="text-sm font-medium capitalize">
                      {key}
                    </Label>
                    <Input
                      id={key}
                      type="number"
                      value={value}
                      onChange={(e) => handleAttributeChange(key, Number(e.target.value))}
                      min={0}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-1">
                    {["strength", "agility", "intelligence", "vitality", "luck"].includes(key) && 
                     profile.manualAttributes?.includes(key) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => resetManualAttribute(key)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Resetar para cálculo automático"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                    {!["strength", "agility", "intelligence", "vitality", "luck"].includes(key) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveAttribute(key)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Adicionar Novo Atributo</Label>
            <div className="flex gap-2">
              <Input
                value={newAttributeName}
                onChange={(e) => setNewAttributeName(e.target.value)}
                placeholder="Nome do atributo..."
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddAttribute}
                disabled={!newAttributeName.trim() || attributes[newAttributeName.trim()] !== undefined}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
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
