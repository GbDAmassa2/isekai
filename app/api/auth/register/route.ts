import { NextRequest, NextResponse } from 'next/server'

// Simulação de banco de dados em memória
// Em produção, você usaria um banco de dados real
const users: Array<{ id: string; email: string; name: string; password: string }> = []

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validações básicas
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar se o email já existe
    const existingUser = users.find(user => user.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 400 }
      )
    }

    // Criar novo usuário
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // Em produção, você faria hash da senha
    }

    users.push(newUser)

    return NextResponse.json(
      { message: 'Usuário cadastrado com sucesso', userId: newUser.id },
      { status: 201 }
    )

  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
