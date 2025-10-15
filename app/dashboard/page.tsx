"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { IsekaiDashboard } from "@/components/isekai-dashboard"
import { IsekaiProvider } from "@/components/isekai-provider"

export default function Dashboard() {
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se existe um usuário salvo
    const savedUser = localStorage.getItem("isekai-user-name")
    if (!savedUser) {
      router.push("/")
      return
    }

    setUserName(savedUser)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-amber-200 font-serif text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <IsekaiProvider userName={userName}>
      <IsekaiDashboard userName={userName} />
    </IsekaiProvider>
  )
}
