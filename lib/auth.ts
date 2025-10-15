import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
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
          // Simulação de verificação de usuário
          // Em produção, você consultaria o banco de dados
          const mockUsers = [
            { email: 'admin@test.com', password: '123456', name: 'Admin' },
            { email: 'user@test.com', password: '123456', name: 'Usuário' }
          ]
          
          const user = mockUsers.find(u => 
            u.email === credentials.email && u.password === credentials.password
          )
          
          if (user) {
            return {
              id: user.email,
              email: user.email,
              name: user.name,
            }
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
