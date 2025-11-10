import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { AuthProvider } from "@/components/auth-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sistema Isekai - Gerenciamento de Habilidades por Leitura",
  description: "Adicione mangás e manhwas que você lê e ganhe habilidades que evoluem automaticamente",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
            <Toaster />
          </Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
