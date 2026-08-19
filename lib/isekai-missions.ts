import type {
  Achievement,
  Ability,
  Item,
  Manga,
  Mission,
  ReadingActivity,
  SeasonProgress,
  Title,
} from "@/lib/isekai-types"

export interface MissionSnapshot {
  mangas: Manga[]
  abilities: Ability[]
  items: Item[]
  titles: Title[]
  readingActivities: ReadingActivity[]
}

const formatDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const startOfDay = (date: Date) => {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

const startOfWeek = (date: Date) => {
  const result = startOfDay(date)
  const day = result.getDay()
  const distanceToMonday = day === 0 ? 6 : day - 1
  result.setDate(result.getDate() - distanceToMonday)
  return result
}

export const getDailyPeriodKey = (date = new Date()) => formatDateKey(date)

export const getWeeklyPeriodKey = (date = new Date()) => `week-${formatDateKey(startOfWeek(date))}`

const isSameOrAfter = (date: Date, reference: Date) => date.getTime() >= reference.getTime()

const countActivitiesSince = (activities: ReadingActivity[], reference: Date) =>
  activities
    .filter((activity) => isSameOrAfter(new Date(`${activity.date}T00:00:00`), reference))
    .reduce((total, activity) => total + activity.chapters, 0)

const countReadingDaysSince = (activities: ReadingActivity[], reference: Date) =>
  new Set(
    activities
      .filter((activity) => isSameOrAfter(new Date(`${activity.date}T00:00:00`), reference))
      .map((activity) => activity.date),
  ).size

const getJourneyTargets = (manga: Manga) => {
  const totalChapters = manga.totalChapters || 0
  if (totalChapters > 0) {
    return Array.from(new Set([25, 50, 75].map((percentage) => Math.ceil(totalChapters * percentage / 100))))
      .filter((target) => target > 0 && target < totalChapters)
      .concat(totalChapters)
  }

  return [5, 10, 25]
}

const createMission = (mission: Omit<Mission, "progress" | "completed" | "createdAt">, now: Date): Mission => ({
  ...mission,
  progress: 0,
  completed: false,
  createdAt: now.toISOString(),
})

export const createMissionSet = (mangas: Manga[], now = new Date()): Mission[] => {
  const dailyKey = getDailyPeriodKey(now)
  const weeklyKey = getWeeklyPeriodKey(now)
  const missions: Mission[] = [
    createMission({
      id: `daily-read-${dailyKey}`,
      type: "daily",
      objective: "read_chapters",
      title: "Primeiro capítulo do dia",
      description: "Leia pelo menos 1 capítulo hoje.",
      icon: "📖",
      target: 1,
      rewardXP: 25,
      periodKey: dailyKey,
      expiresAt: new Date(startOfDay(now).getTime() + 86400000 - 1).toISOString(),
    }, now),
    createMission({
      id: `daily-advance-${dailyKey}`,
      type: "daily",
      objective: "read_chapters",
      title: "Avanço diário",
      description: "Leia pelo menos 3 capítulos hoje.",
      icon: "✨",
      target: 3,
      rewardXP: 35,
      periodKey: dailyKey,
      expiresAt: new Date(startOfDay(now).getTime() + 86400000 - 1).toISOString(),
    }, now),
    createMission({
      id: `weekly-chapters-${weeklyKey}`,
      type: "weekly",
      objective: "read_chapters",
      title: "Ritmo de leitura",
      description: "Leia 5 capítulos durante esta semana.",
      icon: "🔥",
      target: 5,
      rewardXP: 100,
      periodKey: weeklyKey,
      expiresAt: new Date(startOfWeek(now).getTime() + 7 * 86400000 - 1).toISOString(),
    }, now),
    createMission({
      id: `weekly-days-${weeklyKey}`,
      type: "weekly",
      objective: "read_days",
      title: "Constância de aventureiro",
      description: "Leia em 3 dias diferentes nesta semana.",
      icon: "🗓️",
      target: 3,
      rewardXP: 120,
      periodKey: weeklyKey,
      expiresAt: new Date(startOfWeek(now).getTime() + 7 * 86400000 - 1).toISOString(),
    }, now),
  ]

  mangas.forEach((manga) => {
    getJourneyTargets(manga).forEach((targetEpisode) => {
      const isCompletion = Boolean(manga.totalChapters && targetEpisode === manga.totalChapters)
      missions.push(createMission({
        id: `journey-${manga.id}-${isCompletion ? "complete" : `episode-${targetEpisode}`}`,
        type: "journey",
        objective: isCompletion ? "complete_manga" : "reach_episode",
        title: isCompletion ? `Concluir ${manga.title}` : `Marco: capítulo ${targetEpisode}`,
        description: isCompletion
          ? `Leia todos os capítulos registrados de ${manga.title}.`
          : `Alcance o capítulo ${targetEpisode} em ${manga.title}.`,
        icon: isCompletion ? "🏆" : "🧭",
        target: isCompletion ? 1 : targetEpisode,
        targetEpisode,
        rewardXP: isCompletion ? 300 : Math.max(30, targetEpisode * 5),
        mangaId: manga.id,
      }, now))
    })
  })

  return missions
}

const achievementDefinitions: Omit<Achievement, "progress" | "unlocked" | "unlockedAt">[] = [
  { id: "first-journey", title: "Primeiro Passo", description: "Cadastre seu primeiro mangá.", icon: "🌱", objective: "mangas", target: 1, rewardXP: 50 },
  { id: "chapter-hunter", title: "Caçador de Capítulos", description: "Leia 100 capítulos no total.", icon: "📚", objective: "chapters", target: 100, rewardXP: 200 },
  { id: "skill-collector", title: "Colecionador de Técnicas", description: "Desbloqueie 10 habilidades.", icon: "⚔️", objective: "abilities", target: 10, rewardXP: 200 },
  { id: "item-hoarder", title: "Guardião do Inventário", description: "Colecione 10 itens.", icon: "🎒", objective: "items", target: 10, rewardXP: 200 },
  { id: "title-hunter", title: "Nome de Respeito", description: "Conquiste 5 títulos.", icon: "👑", objective: "titles", target: 5, rewardXP: 150 },
  { id: "journey-master", title: "Mestre das Jornadas", description: "Conclua 3 obras com total de capítulos informado.", icon: "🏅", objective: "completed_journeys", target: 3, rewardXP: 400 },
  { id: "steady-reader", title: "Leitor Incansável", description: "Leia em 7 dias diferentes.", icon: "🔥", objective: "read_days", target: 7, rewardXP: 250 },
]

export const createDefaultAchievements = (): Achievement[] =>
  achievementDefinitions.map((achievement) => ({
    ...achievement,
    progress: 0,
    unlocked: false,
  }))

export const createDefaultSeason = (now = new Date()): SeasonProgress => ({
  id: getWeeklyPeriodKey(now),
  title: "Temporada do Explorador",
  subtitle: "Cada capítulo é um passo em uma nova jornada.",
  level: 1,
  experience: 0,
  experienceToNextLevel: 250,
  startedAt: now.toISOString(),
  completedMissionIds: [],
})

export const getMissionProgress = (mission: Mission, snapshot: MissionSnapshot, now = new Date()) => {
  if (mission.objective === "add_manga") return snapshot.mangas.length
  if (mission.objective === "unlock_content") return snapshot.abilities.length + snapshot.items.length + snapshot.titles.length
  if (mission.objective === "read_days") return countReadingDaysSince(snapshot.readingActivities, startOfWeek(now))
  if (mission.objective === "complete_manga") {
    const manga = snapshot.mangas.find((item) => item.id === mission.mangaId)
    return manga && manga.totalChapters && (manga.currentEpisode || 0) >= manga.totalChapters ? 1 : 0
  }
  if (mission.objective === "reach_episode") {
    const manga = snapshot.mangas.find((item) => item.id === mission.mangaId)
    return Math.min(mission.target, manga?.currentEpisode || 0)
  }

  const reference = mission.type === "daily" ? startOfDay(now) : startOfWeek(now)
  return Math.min(mission.target, countActivitiesSince(snapshot.readingActivities, reference))
}

export const getAchievementProgress = (achievement: Achievement, snapshot: MissionSnapshot) => {
  switch (achievement.objective) {
    case "mangas":
      return snapshot.mangas.length
    case "chapters":
      return snapshot.mangas.reduce((total, manga) => total + (manga.currentEpisode || 0), 0)
    case "abilities":
      return snapshot.abilities.length
    case "items":
      return snapshot.items.length
    case "titles":
      return snapshot.titles.length
    case "completed_journeys":
      return snapshot.mangas.filter((manga) => Boolean(manga.totalChapters) && (manga.currentEpisode || 0) >= (manga.totalChapters || 0)).length
    case "read_days":
      return new Set(snapshot.readingActivities.map((activity) => activity.date)).size
    default:
      return 0
  }
}

export const getSeasonExperienceForMission = (mission: Mission) => Math.max(10, Math.round(mission.rewardXP * 0.6))
