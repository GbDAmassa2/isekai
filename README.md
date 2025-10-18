# 🎮 Isekai - RPG Baseado em Mangás

Uma aplicação web que transforma sua leitura de mangás/manhwas/manhuas em uma experiência de RPG, onde você ganha XP, sobe de nível e desenvolve habilidades baseadas no conteúdo que consome.

![Isekai Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)

## ✨ Funcionalidades Principais

### 🎯 Sistema de Progressão
- **Sistema de Níveis**: Ganhe XP baseado nos capítulos lidos
- **Atributos**: Força, Agilidade, Inteligência, Vitalidade, Sorte
- **Regressão Inteligente**: Perde XP e níveis ao excluir mangás

### 📚 Biblioteca de Mangás
- **Tipos Suportados**: Mangás, Manhwas, Manhuas
- **Busca Inteligente**: Filtre por nome em tempo real
- **Filtros por Tipo**: Botões para organizar por categoria
- **Validação de Duplicatas**: Impede obras repetidas
- **Controle de Episódios**: Gerencie seu progresso de leitura

### ⚡ Sistema de Habilidades
- **Habilidades Baseadas em Mangás**: Cada habilidade tem fonte específica
- **CRUD Completo**: Adicionar, editar e excluir habilidades
- **Categorização**: Organize por fonte de origem

### 🎒 Inventário e Itens
- **Categorias**: Armas, Armaduras, Acessórios, Consumíveis
- **Sistema de Equipamento**: Equipe/desequipe itens
- **Gerenciamento Completo**: Adicionar, editar e excluir

### 🏆 Títulos Honoríficos
- **Conquistas**: Títulos baseados em seu progresso
- **Fonte Específica**: Títulos podem vir de mangás específicos

## 🚀 Tecnologias

- **Frontend**: Next.js 15.2.4 + React
- **Styling**: Tailwind CSS + shadcn/ui
- **Autenticação**: NextAuth.js
- **Linguagem**: TypeScript
- **Estado**: React Context API

## 📱 Interface

- **Design Responsivo**: Mobile-first approach
- **Tema Escuro**: Cores âmbar/ouro com fundo slate
- **Animações Suaves**: Transições e efeitos visuais
- **Feedback Visual**: Notificações e animações de XP

## 🛠️ Instalação

```bash
# Clone o repositório
git clone https://github.com/GbDAmassa2/isekai.git

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp env.example .env.local

# Execute o servidor de desenvolvimento
npm run dev
```

## 🔧 Configuração

Crie um arquivo `.env.local` com:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

## 📊 Como Funciona

1. **Adicione Mangás**: Registre as obras que você leu
2. **Ganhe XP**: Cada capítulo lido = 10 XP
3. **Suba de Nível**: XP necessário = Nível × 100
4. **Desenvolva Habilidades**: Crie habilidades baseadas nos mangás
5. **Equipe Itens**: Gerencie seu inventário
6. **Conquiste Títulos**: Ganhe reconhecimento por seu progresso

## 🎨 Screenshots

### Dashboard Principal
- Interface central com personagem e estatísticas
- Sistema de tabs para diferentes seções
- Animações de XP e level up

### Biblioteca de Mangás
- Grid responsivo com cards informativos
- Busca e filtros em tempo real
- Ações rápidas (editar, excluir, ir ao site)

### Sistema de Habilidades
- Criação de habilidades personalizadas
- Vinculação com mangás específicos
- Gerenciamento completo

## 🔐 Autenticação

- **Login/Registro**: Sistema completo com NextAuth.js
- **Proteção de Rotas**: Dashboard protegido por autenticação
- **Sessões Seguras**: Gerenciamento robusto de sessões

## 📈 Roadmap

### Próximas Funcionalidades
- [ ] Sistema de conquistas/achievements
- [ ] Estatísticas avançadas de leitura
- [ ] Sistema de recomendações
- [ ] Exportação/importação de dados
- [ ] Modo offline com PWA
- [ ] Sistema de amigos/ranking

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvedor

**Gabriel** - [@GbDAmassa2](https://github.com/GbDAmassa2)

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/GbDAmassa2/isekai/issues)
- **Documentação**: Veja `DOCUMENTATION.md` para detalhes completos

---

⭐ **Se este projeto te ajudou, considere dar uma estrela!**