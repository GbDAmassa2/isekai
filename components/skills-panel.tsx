"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useCharacter } from "@/components/character-provider"
import { SKILLS_DATABASE, type Skill } from "@/lib/character-utils"
import { Zap, Lock, CheckCircle2, Sparkles, Heart, Shield, TrendingUp, Edit, Trash2, Plus } from "lucide-react"
import { EditSkillDialog } from "@/components/edit-skill-dialog"
import { DeleteSkillDialog } from "@/components/delete-skill-dialog"

export function SkillsPanel() {
  const { character, updateCharacter, addSkill, editSkill, deleteSkill } = useCharacter()
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null)
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null)
  const [skillsDatabase, setSkillsDatabase] = useState<Skill[]>(SKILLS_DATABASE)

  // Carregar skills do localStorage
  useEffect(() => {
    if (character?.userId) {
      const savedSkills = localStorage.getItem(`isekai_skills_${character.userId}`)
      if (savedSkills) {
        setSkillsDatabase(JSON.parse(savedSkills))
      } else {
        setSkillsDatabase(SKILLS_DATABASE)
      }
    }
  }, [character?.userId])

  if (!character) return null

  const canUnlockSkill = (skill: Skill): boolean => {
    if (character.habilidades.includes(skill.id)) return false
    if (character.pontosHabilidade < 1) return false

    const req = skill.requisitos
    if (req.nivel && character.nivel < req.nivel) return false
    if (req.forca && character.forca < req.forca) return false
    if (req.agilidade && character.agilidade < req.agilidade) return false
    if (req.inteligencia && character.inteligencia < req.inteligencia) return false
    if (req.vitalidade && character.vitalidade < req.vitalidade) return false
    if (req.sorte && character.sorte < req.sorte) return false

    if (req.habilidadesPreRequisito) {
      for (const preReqId of req.habilidadesPreRequisito) {
        if (!character.habilidades.includes(preReqId)) return false
      }
    }

    return true
  }

  const unlockSkill = (skillId: number) => {
    if (!canUnlockSkill(SKILLS_DATABASE.find((s) => s.id === skillId)!)) return

    const updatedCharacter = {
      ...character,
      habilidades: [...character.habilidades, skillId],
      pontosHabilidade: character.pontosHabilidade - 1,
    }
    updateCharacter(updatedCharacter)
  }

  const getRaridadeColor = (tipo: "ativa" | "passiva") => {
    return tipo === "ativa" ? "bg-gradient-power" : "bg-gradient-mystic"
  }

  const getSkillIcon = (skill: Skill) => {
    if (skill.efeitos.dano) return Zap
    if (skill.efeitos.cura) return Heart
    if (skill.efeitos.buff) return TrendingUp
    return Sparkles
  }

  const handleEditSkill = (skill: Skill) => {
    setSkillToEdit(skill)
    setEditDialogOpen(true)
  }

  const handleDeleteSkill = (skill: Skill) => {
    setSkillToDelete(skill)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Árvore de Habilidades</CardTitle>
              <CardDescription>Desbloqueie novas habilidades para fortalecer seu personagem</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newSkill: Omit<Skill, "id"> = {
                    nome: "Nova Habilidade",
                    descricao: "Descrição da nova habilidade",
                    tipo: "ativa",
                    requisitos: { nivel: 1 },
                    efeitos: {}
                  }
                  addSkill(newSkill)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Habilidade
              </Button>
              <Badge className="bg-gradient-power text-lg px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                {character.pontosHabilidade} Pontos
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Skills Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skillsDatabase.map((skill) => {
          const isUnlocked = character.habilidades.includes(skill.id)
          const canUnlock = canUnlockSkill(skill)
          const Icon = getSkillIcon(skill)

          return (
            <Card
              key={skill.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isUnlocked
                  ? "border-primary bg-primary/5"
                  : canUnlock
                    ? "border-accent hover:border-primary"
                    : "opacity-60"
              }`}
              onClick={() => setSelectedSkill(skill)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full ${getRaridadeColor(skill.tipo)} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{skill.nome}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {skill.tipo === "ativa" ? "Ativa" : "Passiva"}
                      </Badge>
                    </div>
                  </div>
                  {isUnlocked && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  {!isUnlocked && !canUnlock && <Lock className="w-5 h-5 text-muted-foreground" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{skill.descricao}</p>

                {/* Custos */}
                {(skill.custoMana || skill.custoStamina) && (
                  <div className="flex gap-2 text-xs">
                    {skill.custoMana && (
                      <Badge variant="secondary">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {skill.custoMana} Mana
                      </Badge>
                    )}
                    {skill.custoStamina && (
                      <Badge variant="secondary">
                        <Shield className="w-3 h-3 mr-1" />
                        {skill.custoStamina} Stamina
                      </Badge>
                    )}
                  </div>
                )}

                {/* Requisitos */}
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">Requisitos:</div>
                  <div className="flex flex-wrap gap-1">
                    {skill.requisitos.nivel && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${character.nivel >= skill.requisitos.nivel ? "border-primary" : ""}`}
                      >
                        Nv. {skill.requisitos.nivel}
                      </Badge>
                    )}
                    {skill.requisitos.forca && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${character.forca >= skill.requisitos.forca ? "border-primary" : ""}`}
                      >
                        FOR {skill.requisitos.forca}
                      </Badge>
                    )}
                    {skill.requisitos.agilidade && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${character.agilidade >= skill.requisitos.agilidade ? "border-primary" : ""}`}
                      >
                        AGI {skill.requisitos.agilidade}
                      </Badge>
                    )}
                    {skill.requisitos.inteligencia && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${character.inteligencia >= skill.requisitos.inteligencia ? "border-primary" : ""}`}
                      >
                        INT {skill.requisitos.inteligencia}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {!isUnlocked && (
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={!canUnlock}
                      onClick={(e) => {
                        e.stopPropagation()
                        unlockSkill(skill.id)
                      }}
                    >
                      {canUnlock ? "Desbloquear (1 Ponto)" : "Bloqueado"}
                    </Button>
                  )}
                  {isUnlocked && (
                    <Button size="sm" className="w-full" variant="secondary" disabled>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Desbloqueada
                    </Button>
                  )}
                  
                  {/* Edit/Delete Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditSkill(skill)
                      }}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteSkill(skill)
                      }}
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

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Habilidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Habilidades Desbloqueadas</span>
                <span className="font-medium">
                  {character.habilidades.length} / {skillsDatabase.length}
                </span>
              </div>
              <Progress value={(character.habilidades.length / skillsDatabase.length) * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Habilidades Ativas</div>
                <div className="text-2xl font-bold">
                  {
                    character.habilidades.filter((id) => skillsDatabase.find((s) => s.id === id)?.tipo === "ativa")
                      .length
                  }
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Habilidades Passivas</div>
                <div className="text-2xl font-bold">
                  {
                    character.habilidades.filter((id) => skillsDatabase.find((s) => s.id === id)?.tipo === "passiva")
                      .length
                  }
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditSkillDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        skill={skillToEdit}
      />
      
      <DeleteSkillDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        skill={skillToDelete}
      />
    </div>
  )
}
