"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Download, Upload } from "lucide-react"

export default function Home() {
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [importData, setImportData] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Verificar se já existe um usuário salvo
    const savedUser = localStorage.getItem("isekai-user-name")
    if (savedUser) {
      router.push("/dashboard")
    }
  }, [router])

  const handleEnter = () => {
    if (!userName.trim()) return

    setIsLoading(true)
    
    // Salvar nome do usuário
    const trimmedUserName = userName.trim()
    localStorage.setItem("isekai-user-name", trimmedUserName)
    
    // Se há dados JSON para importar, fazer isso
    if (importData.trim()) {
      try {
        const data = JSON.parse(importData)
        const userKey = `isekai-data-${trimmedUserName}`
        
        // Garantir que o nome no perfil seja o mesmo do usuário atual
        if (data.profile) {
          data.profile.name = trimmedUserName
        }
        
        localStorage.setItem(userKey, JSON.stringify(data))
        console.log("Dados importados com sucesso para:", trimmedUserName)
      } catch (error) {
        console.error("Erro ao importar dados:", error)
        alert("Erro ao importar dados. Verifique se o arquivo está correto.")
        setIsLoading(false)
        return
      }
    }
    
    // Redirecionar para o dashboard
    router.push("/dashboard")
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setImportData(content)
    }
    reader.readAsText(file)
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
            Digite seu nome para começar sua aventura!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-amber-200 font-serif">
                Nome do Aventureiro
              </Label>
              <Input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Digite seu nome"
                required
                className="bg-slate-700 border-amber-500/30 text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20"
                onKeyPress={(e) => e.key === "Enter" && handleEnter()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="importFile" className="text-amber-200 font-serif">
                Importar Progresso (Opcional)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="importFile"
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="bg-slate-700 border-amber-500/30 text-amber-100 focus:border-amber-400 focus:ring-amber-400/20"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => document.getElementById("importFile")?.click()}
                  className="border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                  title="Selecionar arquivo"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-amber-300/60 font-serif">
                Selecione um arquivo JSON exportado anteriormente
              </p>
              <p className="text-xs text-amber-300/40 font-serif mt-2">
                💡 Dica: Após entrar, use a área de código no dashboard para importar/exportar códigos de 8 dígitos!
              </p>
            </div>

            <Button
              onClick={handleEnter}
              disabled={isLoading || !userName.trim()}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-serif hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30"
            >
              <User className="w-5 h-5 mr-2" />
              {isLoading ? "Entrando..." : "Iniciar Aventura"}
            </Button>

            {isLoading && (
              <div className="text-center text-amber-300/80 font-serif text-sm">
                Preparando sua jornada...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}