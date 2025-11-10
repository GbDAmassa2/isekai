import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { 
          label: "Email", 
          type: "email", 
          placeholder: "seu@email.com" 
        },
        password: { 
          label: "Senha", 
          type: "password" 
        },
        name: { 
          label: "Nome", 
          type: "text", 
          placeholder: "Seu Nome" 
        }
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          try {
            // Buscar usuário no banco de dados
            const user = await prisma.user.findUnique({
              where: { email: credentials.email as string }
            })

            if (!user) {
              return null
            }

            // Verificar senha
            const passwordMatch = await bcrypt.compare(
              credentials.password as string,
              user.password
            )

            if (!passwordMatch) {
              return null
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
            }
          } catch (error: any) {
            console.error("Erro ao autenticar usuário:", error)
            // Log mais detalhado em desenvolvimento
            if (process.env.NODE_ENV === 'development') {
              console.error("Detalhes do erro:", {
                message: error?.message,
                code: error?.code,
                stack: error?.stack
              })
            }
            return null
          }
        }
        return null
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
})
