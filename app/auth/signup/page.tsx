"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Mail, Lock, User } from "lucide-react"
import Link from "next/link"

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simular cadastro - em produção você salvaria no banco de dados
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (response.ok) {
        // Redirecionar para login após cadastro
        router.push('/auth/signin?message=Cadastro realizado com sucesso!')
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao cadastrar')
      }
    } catch (error) {
      setError('Erro ao cadastrar. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background animado */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <Card className="relative z-10 w-full max-w-md bg-slate-800/50 border-amber-500/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-amber-200 font-serif">
            🗡️ Sistema Isekai
          </CardTitle>
          <CardDescription className="text-amber-300/80 font-serif">
            Crie sua conta para acessar sua biblioteca de mangás e habilidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-amber-200 font-serif">
                Nome Completo
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Seu nome completo"
                required
                className="bg-slate-700 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-amber-200 font-serif">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Mínimo 6 caracteres"
                required
                className="bg-slate-700 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-amber-200 font-serif">
                Confirmar Senha
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Digite a senha novamente"
                required
                className="bg-slate-700 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center font-serif">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-serif hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              {isLoading ? "Cadastrando..." : "Criar Conta"}
            </Button>

            <div className="text-center text-amber-300/60 font-serif text-sm">
              Já tem uma conta?{" "}
              <Link href="/auth/signin" className="text-amber-400 hover:text-amber-300 underline">
                Faça login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
