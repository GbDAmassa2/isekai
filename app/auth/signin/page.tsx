"use client"

import { signIn, getSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Lock } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        router.push("/")
      }
    }
    checkSession()
  }, [router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    setIsLoading(true)
    try {
      await signIn("credentials", { 
        email: email.trim(),
        password: password.trim(),
        callbackUrl: "/" 
      })
    } catch (error) {
      console.error("Erro ao fazer login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background animado */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <Card className="relative z-10 w-full max-w-md bg-slate-800/50 border-amber-500/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-amber-200 font-serif">
            🗡️ Sistema Isekai
          </CardTitle>
          <CardDescription className="text-amber-300/80 font-serif">
            Faça login para acessar sua biblioteca de mangás e habilidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-amber-200 font-serif">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="bg-slate-700 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-amber-200 font-serif">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
                className="bg-slate-700 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-serif hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30"
            >
              <Mail className="w-5 h-5 mr-2" />
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center text-amber-300/60 font-serif text-sm">
              Não tem uma conta?{" "}
              <Link href="/auth/signup" className="text-amber-400 hover:text-amber-300 underline">
                Cadastre-se
              </Link>
            </div>

            {isLoading && (
              <div className="text-center text-amber-300/80 font-serif text-sm">
                Carregando...
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
