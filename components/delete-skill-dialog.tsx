"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCharacter } from "@/components/character-provider"
import type { Skill } from "@/lib/character-utils"
import { AlertTriangle } from "lucide-react"

interface DeleteSkillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skill: Skill | null
}

export function DeleteSkillDialog({ open, onOpenChange, skill }: DeleteSkillDialogProps) {
  const { deleteSkill, character } = useCharacter()

  const handleDelete = () => {
    if (skill) {
      deleteSkill(skill.id)
      onOpenChange(false)
    }
  }

  const isSkillInUse = character?.habilidades.includes(skill?.id || 0) || false

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a habilidade <strong>{skill?.nome}</strong>?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {isSkillInUse && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">
                <strong>Atenção:</strong> Esta habilidade está sendo usada pelo seu personagem. 
                Ela será removida das habilidades desbloqueadas.
              </p>
            </div>
          )}
          
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">
              Esta ação não pode ser desfeita. A habilidade será permanentemente removida do sistema.
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="flex-1"
            >
              Excluir Habilidade
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
