export interface Character {
  id: number
  nome: string
  nivel: number
  experiencia: number
  experienciaNecessaria: number
  userId: number

  // Atributos primários
  forca: number
  agilidade: number
  inteligencia: number
  vitalidade: number
  sorte: number

  // Pontos disponíveis
  pontosAtributo: number
  pontosHabilidade: number

  // Atributos secundários (calculados)
  vidaMaxima: number
  vidaAtual: number
  manaMaxima: number
  manaAtual: number
  staminaMaxima: number
  staminaAtual: number
  ataqueFisico: number
  ataqueMagico: number
  defesaFisica: number
  defesaMagica: number

  // Classe atual
  classeAtual: string

  habilidades: number[] // IDs das habilidades desbloqueadas
  inventario: InventoryItem[]
  equipamentos: EquippedItems
}

export interface Skill {
  id: number
  nome: string
  descricao: string
  tipo: "ativa" | "passiva"
  custoMana?: number
  custoStamina?: number
  cooldown?: number
  requisitos: {
    nivel?: number
    forca?: number
    agilidade?: number
    inteligencia?: number
    vitalidade?: number
    sorte?: number
    habilidadesPreRequisito?: number[]
  }
  efeitos: {
    dano?: number
    cura?: number
    buff?: {
      atributo: string
      valor: number
      duracao: number
    }
  }
}

export interface InventoryItem {
  id: number
  itemId: number
  quantidade: number
}

export interface Item {
  id: number
  nome: string
  descricao: string
  tipo: "arma" | "armadura" | "acessorio" | "consumivel" | "material"
  raridade: "comum" | "incomum" | "raro" | "epico" | "lendario"
  preco: number
  efeitos?: {
    forca?: number
    agilidade?: number
    inteligencia?: number
    vitalidade?: number
    sorte?: number
    ataqueFisico?: number
    ataqueMagico?: number
    defesaFisica?: number
    defesaMagica?: number
    vidaMaxima?: number
    manaMaxima?: number
    staminaMaxima?: number
  }
  requisitos?: {
    nivel?: number
    forca?: number
    agilidade?: number
    inteligencia?: number
  }
}

export interface EquippedItems {
  arma?: number
  armadura?: number
  acessorio1?: number
  acessorio2?: number
}

export const SKILLS_DATABASE: Skill[] = [
  {
    id: 1,
    nome: "Golpe Poderoso",
    descricao: "Um ataque físico devastador que causa dano massivo",
    tipo: "ativa",
    custoStamina: 15,
    cooldown: 5,
    requisitos: { nivel: 1, forca: 8 },
    efeitos: { dano: 50 },
  },
  {
    id: 2,
    nome: "Bola de Fogo",
    descricao: "Lança uma bola de fogo que causa dano mágico",
    tipo: "ativa",
    custoMana: 20,
    cooldown: 3,
    requisitos: { nivel: 2, inteligencia: 10 },
    efeitos: { dano: 60 },
  },
  {
    id: 3,
    nome: "Cura Menor",
    descricao: "Restaura uma quantidade moderada de HP",
    tipo: "ativa",
    custoMana: 25,
    cooldown: 8,
    requisitos: { nivel: 3, inteligencia: 8 },
    efeitos: { cura: 80 },
  },
  {
    id: 4,
    nome: "Esquiva Rápida",
    descricao: "Aumenta temporariamente sua agilidade",
    tipo: "ativa",
    custoStamina: 10,
    cooldown: 10,
    requisitos: { nivel: 4, agilidade: 12 },
    efeitos: { buff: { atributo: "agilidade", valor: 5, duracao: 30 } },
  },
  {
    id: 5,
    nome: "Força Interior",
    descricao: "Aumenta permanentemente sua força",
    tipo: "passiva",
    requisitos: { nivel: 5, forca: 15 },
    efeitos: { buff: { atributo: "forca", valor: 3, duracao: 0 } },
  },
  {
    id: 6,
    nome: "Mente Afiada",
    descricao: "Aumenta permanentemente sua inteligência",
    tipo: "passiva",
    requisitos: { nivel: 5, inteligencia: 15 },
    efeitos: { buff: { atributo: "inteligencia", valor: 3, duracao: 0 } },
  },
  {
    id: 7,
    nome: "Ataque Relâmpago",
    descricao: "Múltiplos ataques rápidos consecutivos",
    tipo: "ativa",
    custoStamina: 25,
    cooldown: 12,
    requisitos: { nivel: 8, agilidade: 18, habilidadesPreRequisito: [4] },
    efeitos: { dano: 120 },
  },
  {
    id: 8,
    nome: "Explosão Arcana",
    descricao: "Uma explosão mágica devastadora",
    tipo: "ativa",
    custoMana: 50,
    cooldown: 15,
    requisitos: { nivel: 10, inteligencia: 20, habilidadesPreRequisito: [2] },
    efeitos: { dano: 200 },
  },
]

export const ITEMS_DATABASE: Item[] = [
  {
    id: 1,
    nome: "Espada de Ferro",
    descricao: "Uma espada básica de ferro",
    tipo: "arma",
    raridade: "comum",
    preco: 100,
    efeitos: { ataqueFisico: 10 },
    requisitos: { nivel: 1, forca: 5 },
  },
  {
    id: 2,
    nome: "Espada de Aço",
    descricao: "Uma espada resistente de aço",
    tipo: "arma",
    raridade: "incomum",
    preco: 500,
    efeitos: { ataqueFisico: 25, forca: 2 },
    requisitos: { nivel: 5, forca: 10 },
  },
  {
    id: 3,
    nome: "Lâmina Mística",
    descricao: "Uma espada imbuída com poder mágico",
    tipo: "arma",
    raridade: "raro",
    preco: 2000,
    efeitos: { ataqueFisico: 35, ataqueMagico: 20, inteligencia: 3 },
    requisitos: { nivel: 10, forca: 12, inteligencia: 10 },
  },
  {
    id: 4,
    nome: "Armadura de Couro",
    descricao: "Proteção básica de couro",
    tipo: "armadura",
    raridade: "comum",
    preco: 80,
    efeitos: { defesaFisica: 8 },
    requisitos: { nivel: 1 },
  },
  {
    id: 5,
    nome: "Armadura de Placas",
    descricao: "Armadura pesada de metal",
    tipo: "armadura",
    raridade: "incomum",
    preco: 600,
    efeitos: { defesaFisica: 30, vitalidade: 3 },
    requisitos: { nivel: 5, vitalidade: 10 },
  },
  {
    id: 6,
    nome: "Manto Arcano",
    descricao: "Um manto que aumenta o poder mágico",
    tipo: "armadura",
    raridade: "raro",
    preco: 1800,
    efeitos: { defesaMagica: 35, manaMaxima: 50, inteligencia: 4 },
    requisitos: { nivel: 8, inteligencia: 12 },
  },
  {
    id: 7,
    nome: "Anel de Força",
    descricao: "Aumenta sua força física",
    tipo: "acessorio",
    raridade: "incomum",
    preco: 400,
    efeitos: { forca: 3 },
    requisitos: { nivel: 3 },
  },
  {
    id: 8,
    nome: "Amuleto da Sorte",
    descricao: "Aumenta sua sorte",
    tipo: "acessorio",
    raridade: "raro",
    preco: 1200,
    efeitos: { sorte: 5 },
    requisitos: { nivel: 6 },
  },
  {
    id: 9,
    nome: "Poção de Vida",
    descricao: "Restaura 100 HP",
    tipo: "consumivel",
    raridade: "comum",
    preco: 50,
    efeitos: { vidaMaxima: 100 },
  },
  {
    id: 10,
    nome: "Poção de Mana",
    descricao: "Restaura 80 Mana",
    tipo: "consumivel",
    raridade: "comum",
    preco: 50,
    efeitos: { manaMaxima: 80 },
  },
]

export function calcularAtributosSecundarios(character: Partial<Character>): Partial<Character> {
  const { forca = 5, agilidade = 5, inteligencia = 5, vitalidade = 5, sorte = 5, nivel = 1 } = character

  const vidaMaxima = vitalidade * 10 + nivel * 5
  const manaMaxima = inteligencia * 8 + nivel * 3
  const staminaMaxima = agilidade * 6 + vitalidade * 4 + nivel
  const ataqueFisico = forca * 2 + agilidade * 1 + nivel
  const ataqueMagico = inteligencia * 2 + sorte * 1 + nivel
  const defesaFisica = Math.floor(vitalidade * 1.5 + forca * 0.5 + nivel)
  const defesaMagica = Math.floor(inteligencia * 1.5 + vitalidade * 0.5 + nivel)

  return {
    ...character,
    vidaMaxima,
    vidaAtual: character.vidaAtual ?? vidaMaxima,
    manaMaxima,
    manaAtual: character.manaAtual ?? manaMaxima,
    staminaMaxima,
    staminaAtual: character.staminaAtual ?? staminaMaxima,
    ataqueFisico,
    ataqueMagico,
    defesaFisica,
    defesaMagica,
  }
}

export function calcularExperienciaNecessaria(nivel: number): number {
  return nivel * 100 + (nivel - 1) * 50
}

export function criarPersonagemInicial(userId: number, nome: string): Character {
  const characterBase = {
    id: Date.now(),
    nome,
    nivel: 1,
    experiencia: 0,
    experienciaNecessaria: calcularExperienciaNecessaria(1),
    userId,
    forca: 5,
    agilidade: 5,
    inteligencia: 5,
    vitalidade: 5,
    sorte: 5,
    pontosAtributo: 0,
    pontosHabilidade: 0,
    classeAtual: "Aventureiro",
    habilidades: [],
    inventario: [
      { id: 1, itemId: 9, quantidade: 3 }, // 3 Poções de Vida
      { id: 2, itemId: 10, quantidade: 2 }, // 2 Poções de Mana
    ],
    equipamentos: {},
  }

  return calcularAtributosSecundarios(characterBase) as Character
}

export function ganharExperiencia(character: Character, xpGanho: number): Character {
  const novoCharacter = { ...character }
  novoCharacter.experiencia += xpGanho

  // Verificar se subiu de nível
  while (novoCharacter.experiencia >= novoCharacter.experienciaNecessaria) {
    novoCharacter.experiencia -= novoCharacter.experienciaNecessaria
    novoCharacter.nivel += 1
    novoCharacter.pontosAtributo += 3
    novoCharacter.pontosHabilidade += 2
    novoCharacter.experienciaNecessaria = calcularExperienciaNecessaria(novoCharacter.nivel)
  }

  // Recalcular atributos secundários
  return calcularAtributosSecundarios(novoCharacter) as Character
}

export function perderExperiencia(character: Character, xpPerdido: number): Character {
  const novoCharacter = { ...character }
  const perda = Math.max(0, xpPerdido)

  // Não permitir baixar de nível; limita a 0 no nível atual
  novoCharacter.experiencia = Math.max(0, novoCharacter.experiencia - perda)

  // Não altera nivel/pontos ao perder XP
  return calcularAtributosSecundarios(novoCharacter) as Character
}

export function distribuirPontoAtributo(
  character: Character,
  atributo: "forca" | "agilidade" | "inteligencia" | "vitalidade" | "sorte",
  quantidade: number,
): Character | null {
  if (character.pontosAtributo < quantidade || quantidade < 0) {
    return null
  }

  const novoCharacter = {
    ...character,
    [atributo]: character[atributo] + quantidade,
    pontosAtributo: character.pontosAtributo - quantidade,
  }

  return calcularAtributosSecundarios(novoCharacter) as Character
}
