"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCharacter } from "@/components/character-provider"
import type { Item } from "@/lib/character-utils"
import { AlertTriangle } from "lucide-react"

interface DeleteItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Item | null
}

export function DeleteItemDialog({ open, onOpenChange, item }: DeleteItemDialogProps) {
  const { deleteItem, character } = useCharacter()

  const handleDelete = () => {
    if (item) {
      deleteItem(item.id)
      onOpenChange(false)
    }
  }

  const isItemInInventory = character?.inventario.some(invItem => invItem.itemId === item?.id) || false
  const isItemEquipped = character?.equipamentos.arma === item?.id || 
                        character?.equipamentos.armadura === item?.id ||
                        character?.equipamentos.acessorio1 === item?.id ||
                        character?.equipamentos.acessorio2 === item?.id || false

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o item <strong>{item?.nome}</strong>?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {(isItemInInventory || isItemEquipped) && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">
                <strong>Atenção:</strong> Este item está sendo usado pelo seu personagem. 
                {isItemEquipped && " Ele será desequipado."}
                {isItemInInventory && " Ele será removido do inventário."}
              </p>
            </div>
          )}
          
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">
              Esta ação não pode ser desfeita. O item será permanentemente removido do sistema.
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="flex-1"
            >
              Excluir Item
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
