"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background animado */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <Card className="relative z-10 w-full max-w-md bg-slate-800/50 border-red-500/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-200 font-serif">
            Erro de Autenticação
          </CardTitle>
          <CardDescription className="text-red-300/80 font-serif">
            Ocorreu um erro ao tentar fazer login. Tente novamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/auth/signin">
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-serif hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar ao Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
