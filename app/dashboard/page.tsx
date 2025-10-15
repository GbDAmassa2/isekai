"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FloatingCharacterWindow } from "@/components/floating-character-window"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm-20 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Animated Nebula Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Nebula Layers */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-purple-500/30 via-transparent to-transparent animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-radial from-indigo-500/20 via-transparent to-transparent animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
            <div className="absolute bottom-0 left-1/2 w-full h-full bg-gradient-radial from-amber-500/15 via-transparent to-transparent animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
          </div>
          
          {/* Floating Energy Orbs */}
          {[...Array(25)].map((_, i) => {
            const left = ((i * 17) % 100) + ((i * 7) % 20)
            const top = ((i * 23) % 100) + ((i * 11) % 15)
            const delay = (i * 0.2) % 5
            const duration = 3 + (i * 0.15) % 4
            
            return (
              <div
                key={i}
                className="absolute w-3 h-3 bg-gradient-radial from-amber-400/40 via-purple-400/20 to-transparent rounded-full animate-pulse"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  filter: 'blur(1px)'
                }}
              />
            )
          })}
          
          {/* Cosmic Dust */}
          {[...Array(40)].map((_, i) => {
            const left = ((i * 13) % 100) + ((i * 5) % 25)
            const top = ((i * 19) % 100) + ((i * 9) % 20)
            const delay = (i * 0.15) % 6
            const duration = 4 + (i * 0.12) % 3
            
            return (
              <div
                key={`dust-${i}`}
                className="absolute w-1 h-1 bg-white/20 rounded-full animate-bounce"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`
                }}
              />
            )
          })}
          
          {/* Energy Streams */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute top-3/4 right-0 w-full h-px bg-gradient-to-l from-transparent via-amber-400/20 to-transparent animate-pulse" style={{ animationDuration: '8s', animationDelay: '3s' }} />
          </div>
        </div>

        {/* Central Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="text-center space-y-8">
            {/* Animated Title Section */}
            <div className="space-y-4 relative">
              {/* Floating Magic Circles */}
              <div className="absolute -top-8 -left-8 w-16 h-16 border-2 border-amber-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
              <div className="absolute -top-4 -right-12 w-12 h-12 border-2 border-purple-400/30 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
              <div className="absolute -bottom-6 -left-16 w-20 h-20 border-2 border-indigo-400/30 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
              
              {/* Main Title with Glow Effect */}
              <div className="relative">
                <h1 className="text-4xl md:text-6xl font-bold text-amber-200 font-serif animate-pulse">
                  ISEKAI SYSTEM
                </h1>
                {/* Glow effect */}
                <div className="absolute inset-0 text-4xl md:text-6xl font-bold text-amber-400/20 font-serif animate-pulse blur-sm">
                  ISEKAI SYSTEM
                </div>
              </div>
              
              {/* Animated Subtitle */}
              <div className="relative">
                <p className="text-xl md:text-2xl text-amber-300/80 font-serif animate-bounce" style={{ animationDuration: '3s' }}>
                  Bem-vindo ao seu mundo de aventuras
                </p>
                {/* Floating particles around subtitle */}
                <div className="absolute -top-2 -left-4 w-2 h-2 bg-amber-400/60 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
                <div className="absolute -top-1 -right-6 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                <div className="absolute -bottom-1 -left-8 w-1 h-1 bg-indigo-400/60 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
              </div>
            </div>
            
            {/* Animated Cards Section */}
            <div className="max-w-md mx-auto space-y-6">
              {/* Controls Card with Hover Animation */}
              <div className="bg-slate-800/50 border border-amber-500/30 rounded-lg p-4 backdrop-blur-sm hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl animate-bounce">🎮</div>
                  <h3 className="text-lg font-semibold text-amber-200 group-hover:text-amber-100 transition-colors">
                    Controles
                  </h3>
                </div>
                <div className="text-sm text-amber-300/80 space-y-2">
                  <div className="flex items-center gap-2 hover:text-amber-200 transition-colors">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    <p>Clique na janela flutuante para acessar suas informações</p>
                  </div>
                  <div className="flex items-center gap-2 hover:text-amber-200 transition-colors">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <p>Use os botões para navegar entre diferentes seções</p>
                  </div>
                  <div className="flex items-center gap-2 hover:text-amber-200 transition-colors">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    <p>Ganhe XP lendo mangás e completando objetivos</p>
                  </div>
                </div>
              </div>
              
              {/* Progression System Card with Hover Animation */}
              <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl animate-spin" style={{ animationDuration: '4s' }}>✨</div>
                  <h3 className="text-lg font-semibold text-purple-200 group-hover:text-purple-100 transition-colors">
                    Sistema de Progressão
                  </h3>
                </div>
                <div className="text-sm text-purple-300/80 space-y-2">
                  <div className="flex items-center gap-2 hover:text-purple-200 transition-colors">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <p>Adicione mangás que você leu</p>
                  </div>
                  <div className="flex items-center gap-2 hover:text-purple-200 transition-colors">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <p>Crie habilidades e itens baseados no conteúdo</p>
                  </div>
                  <div className="flex items-center gap-2 hover:text-purple-200 transition-colors">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    <p>Colete títulos e aumente seus atributos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Action Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Magical Orbs */}
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-gradient-radial from-amber-400/40 via-purple-400/20 to-transparent rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-gradient-radial from-purple-400/40 via-indigo-400/20 to-transparent rounded-full animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
              <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-gradient-radial from-indigo-400/40 via-amber-400/20 to-transparent rounded-full animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
              
              {/* Energy Lines */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent animate-pulse" style={{ animationDuration: '6s' }} />
              <div className="absolute bottom-1/2 right-0 w-full h-px bg-gradient-to-l from-transparent via-purple-400/20 to-transparent animate-pulse" style={{ animationDuration: '8s', animationDelay: '3s' }} />
            </div>
          </div>
        </div>

        {/* Floating Character Window */}
        <FloatingCharacterWindow userName={userName} />
      </div>
    </IsekaiProvider>
  )
}
