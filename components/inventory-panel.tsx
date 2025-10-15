"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCharacter } from "@/components/character-provider"
import { ITEMS_DATABASE, type Item, type InventoryItem } from "@/lib/character-utils"
import { Package, Sword, Shield, Gem, BotIcon as Potion, Box, ShoppingBag, TrendingUp, Edit, Trash2, Plus } from "lucide-react"
import { EditItemDialog } from "@/components/edit-item-dialog"
import { DeleteItemDialog } from "@/components/delete-item-dialog"

export function InventoryPanel() {
  const { character, updateCharacter, addItem, editItem, deleteItem } = useCharacter()
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null)
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null)
  const [itemsDatabase, setItemsDatabase] = useState<Item[]>(ITEMS_DATABASE)

  // Carregar items do localStorage
  useEffect(() => {
    if (character?.userId) {
      const savedItems = localStorage.getItem(`isekai_items_${character.userId}`)
      if (savedItems) {
        setItemsDatabase(JSON.parse(savedItems))
      } else {
        setItemsDatabase(ITEMS_DATABASE)
      }
    }
  }, [character?.userId])

  if (!character) return null

  const getItemDetails = (itemId: number): Item | undefined => {
    return itemsDatabase.find((item) => item.id === itemId)
  }

  const getRaridadeColor = (raridade: string) => {
    switch (raridade) {
      case "comum":
        return "bg-gray-500"
      case "incomum":
        return "bg-green-500"
      case "raro":
        return "bg-blue-500"
      case "epico":
        return "bg-purple-500"
      case "lendario":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getItemIcon = (tipo: string) => {
    switch (tipo) {
      case "arma":
        return Sword
      case "armadura":
        return Shield
      case "acessorio":
        return Gem
      case "consumivel":
        return Potion
      case "material":
        return Box
      default:
        return Package
    }
  }

  const isEquipped = (itemId: number): boolean => {
    return Object.values(character.equipamentos).includes(itemId)
  }

  const canEquip = (item: Item): boolean => {
    if (item.tipo === "consumivel" || item.tipo === "material") return false

    const req = item.requisitos
    if (!req) return true

    if (req.nivel && character.nivel < req.nivel) return false
    if (req.forca && character.forca < req.forca) return false
    if (req.agilidade && character.agilidade < req.agilidade) return false
    if (req.inteligencia && character.inteligencia < req.inteligencia) return false

    return true
  }

  const equipItem = (item: Item) => {
    if (!canEquip(item)) return

    const updatedEquipments = { ...character.equipamentos }

    if (item.tipo === "arma") {
      updatedEquipments.arma = item.id
    } else if (item.tipo === "armadura") {
      updatedEquipments.armadura = item.id
    } else if (item.tipo === "acessorio") {
      if (!updatedEquipments.acessorio1) {
        updatedEquipments.acessorio1 = item.id
      } else if (!updatedEquipments.acessorio2) {
        updatedEquipments.acessorio2 = item.id
      } else {
        updatedEquipments.acessorio1 = item.id
      }
    }

    updateCharacter({ ...character, equipamentos: updatedEquipments })
  }

  const unequipItem = (itemId: number) => {
    const updatedEquipments = { ...character.equipamentos }

    if (updatedEquipments.arma === itemId) delete updatedEquipments.arma
    if (updatedEquipments.armadura === itemId) delete updatedEquipments.armadura
    if (updatedEquipments.acessorio1 === itemId) delete updatedEquipments.acessorio1
    if (updatedEquipments.acessorio2 === itemId) delete updatedEquipments.acessorio2

    updateCharacter({ ...character, equipamentos: updatedEquipments })
  }

  const consumeItem = (invItem: InventoryItem) => {
    const item = getItemDetails(invItem.itemId)
    if (!item || item.tipo !== "consumivel") return

    // Apply effects
    const updatedCharacter = { ...character }
    if (item.efeitos?.vidaMaxima) {
      updatedCharacter.vidaAtual = Math.min(
        updatedCharacter.vidaAtual + item.efeitos.vidaMaxima,
        updatedCharacter.vidaMaxima,
      )
    }
    if (item.efeitos?.manaMaxima) {
      updatedCharacter.manaAtual = Math.min(
        updatedCharacter.manaAtual + item.efeitos.manaMaxima,
        updatedCharacter.manaMaxima,
      )
    }

    // Remove item from inventory
    const updatedInventory = character.inventario
      .map((i) => (i.id === invItem.id ? { ...i, quantidade: i.quantidade - 1 } : i))
      .filter((i) => i.quantidade > 0)

    updatedCharacter.inventario = updatedInventory
    updateCharacter(updatedCharacter)
  }

  const addItemToInventory = (itemId: number) => {
    const existingItem = character.inventario.find((i) => i.itemId === itemId)

    if (existingItem) {
      const updatedInventory = character.inventario.map((i) =>
        i.itemId === itemId ? { ...i, quantidade: i.quantidade + 1 } : i,
      )
      updateCharacter({ ...character, inventario: updatedInventory })
    } else {
      const newItem: InventoryItem = {
        id: Date.now(),
        itemId,
        quantidade: 1,
      }
      updateCharacter({ ...character, inventario: [...character.inventario, newItem] })
    }
  }

  const handleEditItem = (item: Item) => {
    setItemToEdit(item)
    setEditDialogOpen(true)
  }

  const handleDeleteItem = (item: Item) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const inventoryByType = {
    arma: character.inventario.filter((i) => getItemDetails(i.itemId)?.tipo === "arma"),
    armadura: character.inventario.filter((i) => getItemDetails(i.itemId)?.tipo === "armadura"),
    acessorio: character.inventario.filter((i) => getItemDetails(i.itemId)?.tipo === "acessorio"),
    consumivel: character.inventario.filter((i) => getItemDetails(i.itemId)?.tipo === "consumivel"),
    material: character.inventario.filter((i) => getItemDetails(i.itemId)?.tipo === "material"),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Inventário</CardTitle>
              <CardDescription>Gerencie seus itens e equipamentos</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newItem: Omit<Item, "id"> = {
                    nome: "Novo Item",
                    descricao: "Descrição do novo item",
                    tipo: "arma",
                    raridade: "comum",
                    preco: 100,
                    efeitos: {}
                  }
                  addItem(newItem)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
              <Badge className="bg-gradient-mystic text-lg px-4 py-2">
                <Package className="w-4 h-4 mr-2" />
                {character.inventario.reduce((acc, item) => acc + item.quantidade, 0)} Itens
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Equipped Items */}
      <Card>
        <CardHeader>
          <CardTitle>Equipamentos Atuais</CardTitle>
          <CardDescription>Itens que você está usando</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Weapon Slot */}
            <div className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center">
              {character.equipamentos.arma ? (
                <div className="space-y-2">
                  <div
                    className={`w-12 h-12 rounded-full ${getRaridadeColor(getItemDetails(character.equipamentos.arma)?.raridade || "")} mx-auto flex items-center justify-center`}
                  >
                    <Sword className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm font-medium">{getItemDetails(character.equipamentos.arma)?.nome}</div>
                  <Button size="sm" variant="outline" onClick={() => unequipItem(character.equipamentos.arma!)}>
                    Desequipar
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 text-muted-foreground">
                  <Sword className="w-12 h-12 mx-auto opacity-20" />
                  <div className="text-sm">Arma</div>
                </div>
              )}
            </div>

            {/* Armor Slot */}
            <div className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center">
              {character.equipamentos.armadura ? (
                <div className="space-y-2">
                  <div
                    className={`w-12 h-12 rounded-full ${getRaridadeColor(getItemDetails(character.equipamentos.armadura)?.raridade || "")} mx-auto flex items-center justify-center`}
                  >
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm font-medium">{getItemDetails(character.equipamentos.armadura)?.nome}</div>
                  <Button size="sm" variant="outline" onClick={() => unequipItem(character.equipamentos.armadura!)}>
                    Desequipar
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 text-muted-foreground">
                  <Shield className="w-12 h-12 mx-auto opacity-20" />
                  <div className="text-sm">Armadura</div>
                </div>
              )}
            </div>

            {/* Accessory Slot 1 */}
            <div className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center">
              {character.equipamentos.acessorio1 ? (
                <div className="space-y-2">
                  <div
                    className={`w-12 h-12 rounded-full ${getRaridadeColor(getItemDetails(character.equipamentos.acessorio1)?.raridade || "")} mx-auto flex items-center justify-center`}
                  >
                    <Gem className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm font-medium">{getItemDetails(character.equipamentos.acessorio1)?.nome}</div>
                  <Button size="sm" variant="outline" onClick={() => unequipItem(character.equipamentos.acessorio1!)}>
                    Desequipar
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 text-muted-foreground">
                  <Gem className="w-12 h-12 mx-auto opacity-20" />
                  <div className="text-sm">Acessório 1</div>
                </div>
              )}
            </div>

            {/* Accessory Slot 2 */}
            <div className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center">
              {character.equipamentos.acessorio2 ? (
                <div className="space-y-2">
                  <div
                    className={`w-12 h-12 rounded-full ${getRaridadeColor(getItemDetails(character.equipamentos.acessorio2)?.raridade || "")} mx-auto flex items-center justify-center`}
                  >
                    <Gem className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm font-medium">{getItemDetails(character.equipamentos.acessorio2)?.nome}</div>
                  <Button size="sm" variant="outline" onClick={() => unequipItem(character.equipamentos.acessorio2!)}>
                    Desequipar
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 text-muted-foreground">
                  <Gem className="w-12 h-12 mx-auto opacity-20" />
                  <div className="text-sm">Acessório 2</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Tabs */}
      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="arma">Armas</TabsTrigger>
          <TabsTrigger value="armadura">Armaduras</TabsTrigger>
          <TabsTrigger value="acessorio">Acessórios</TabsTrigger>
          <TabsTrigger value="consumivel">Consumíveis</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {character.inventario.map((invItem) => {
              const item = getItemDetails(invItem.itemId)
              if (!item) return null
              const Icon = getItemIcon(item.tipo)
              const equipped = isEquipped(item.id)

              return (
                <Card key={invItem.id} className={equipped ? "border-primary bg-primary/5" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full ${getRaridadeColor(item.raridade)} flex items-center justify-center`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{item.nome}</CardTitle>
                          <div className="flex gap-1 mt-1">
                            <Badge variant="outline" className="text-xs capitalize">
                              {item.tipo}
                            </Badge>
                            <Badge className={`text-xs ${getRaridadeColor(item.raridade)}`}>{item.raridade}</Badge>
                          </div>
                        </div>
                      </div>
                      {invItem.quantidade > 1 && (
                        <Badge variant="secondary" className="text-sm">
                          x{invItem.quantidade}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{item.descricao}</p>

                    {/* Effects */}
                    {item.efeitos && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground">Efeitos:</div>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(item.efeitos).map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {key}: +{value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        {item.tipo === "consumivel" ? (
                          <Button size="sm" className="flex-1" onClick={() => consumeItem(invItem)}>
                            Usar
                          </Button>
                        ) : equipped ? (
                          <Button
                            size="sm"
                            className="flex-1 bg-transparent"
                            variant="outline"
                            onClick={() => unequipItem(item.id)}
                          >
                            Desequipar
                          </Button>
                        ) : (
                          <Button size="sm" className="flex-1" disabled={!canEquip(item)} onClick={() => equipItem(item)}>
                            {canEquip(item) ? "Equipar" : "Requisitos não atendidos"}
                          </Button>
                        )}
                      </div>
                      
                      {/* Edit/Delete Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteItem(item)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {["arma", "armadura", "acessorio", "consumivel"].map((tipo) => (
          <TabsContent key={tipo} value={tipo} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inventoryByType[tipo as keyof typeof inventoryByType].map((invItem) => {
                const item = getItemDetails(invItem.itemId)
                if (!item) return null
                const Icon = getItemIcon(item.tipo)
                const equipped = isEquipped(item.id)

                return (
                  <Card key={invItem.id} className={equipped ? "border-primary bg-primary/5" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-full ${getRaridadeColor(item.raridade)} flex items-center justify-center`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{item.nome}</CardTitle>
                            <Badge className={`text-xs mt-1 ${getRaridadeColor(item.raridade)}`}>{item.raridade}</Badge>
                          </div>
                        </div>
                        {invItem.quantidade > 1 && (
                          <Badge variant="secondary" className="text-sm">
                            x{invItem.quantidade}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{item.descricao}</p>

                      {item.efeitos && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground">Efeitos:</div>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(item.efeitos).map(([key, value]) => (
                              <Badge key={key} variant="secondary" className="text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {key}: +{value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex gap-2">
                          {item.tipo === "consumivel" ? (
                            <Button size="sm" className="flex-1" onClick={() => consumeItem(invItem)}>
                              Usar
                            </Button>
                          ) : equipped ? (
                            <Button
                              size="sm"
                              className="flex-1 bg-transparent"
                              variant="outline"
                              onClick={() => unequipItem(item.id)}
                            >
                              Desequipar
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="flex-1"
                              disabled={!canEquip(item)}
                              onClick={() => equipItem(item)}
                            >
                              {canEquip(item) ? "Equipar" : "Requisitos não atendidos"}
                            </Button>
                          )}
                        </div>
                        
                        {/* Edit/Delete Buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteItem(item)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Shop Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Loja de Itens
          </CardTitle>
          <CardDescription>Compre novos itens para sua aventura</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {itemsDatabase.slice(0, 6).map((item) => {
              const Icon = getItemIcon(item.tipo)
              return (
                <Card key={item.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${getRaridadeColor(item.raridade)} flex items-center justify-center`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{item.nome}</CardTitle>
                        <Badge className={`text-xs mt-1 ${getRaridadeColor(item.raridade)}`}>{item.raridade}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.descricao}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-sm">
                        {item.preco} Gold
                      </Badge>
                      <Button size="sm" onClick={() => addItemToInventory(item.id)}>
                        Comprar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditItemDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        item={itemToEdit}
      />
      
      <DeleteItemDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={itemToDelete}
      />
    </div>
  )
}
