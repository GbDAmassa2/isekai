# 🗡️ Sistema Isekai

Uma interface medieval fantasia inspirada em sistemas de jogos de anime/mangá do gênero isekai, com animações dinâmicas e feedback visual imediato.

## ✨ Características

### 🎮 Sistema de RPG Completo
- **Perfil de Personagem**: Nível, experiência e atributos dinâmicos
- **Biblioteca de Mangás**: Organize mangás, manhwas e manhuas lidos
- **Sistema de Habilidades**: Adicione habilidades com efeitos em atributos
- **Inventário**: Gerencie itens com diferentes raridades e efeitos
- **Sistema de Títulos**: Conquiste títulos com bônus especiais

### 🎨 Interface Medieval Fantasia
- **Tema Medieval**: Design inspirado em RPGs medievais com elementos dourados
- **Animações Fluidas**: Transições suaves e efeitos visuais dinâmicos
- **Background Animado**: Partículas flutuantes e efeitos de energia cósmica
- **Feedback Tátil**: Cada interação tem resposta visual imediata

### 🚀 Funcionalidades Avançadas
- **Sistema de XP**: Ganhe experiência lendo capítulos ou completando leituras
- **Sistema de Habilidades**: Cada habilidade é única e individual
- **Atributos Customizáveis**: Adicione novos atributos personalizados
- **Links Diretos**: Acesse sites de mangás diretamente dos cards
- **Exportar/Importar**: Backup completo dos dados
- **Notificações Animadas**: Sistema de notificações com efeitos visuais

## 🛠️ Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Lucide React** - Ícones modernos
- **LocalStorage** - Persistência de dados
- **Context API** - Gerenciamento de estado

## 🎯 Como Usar

### Instalação
```bash
npm install
# ou
pnpm install
# ou
yarn install
```

### Sistema de Usuário Simples
O sistema agora usa apenas um nome de usuário:
1. **Primeira vez**: Digite seu nome na tela inicial
2. **Progresso**: Seus dados são salvos localmente no navegador
3. **Exportar/Importar**: Use os botões no dashboard para backup
4. **Arquivo JSON**: O progresso é exportado como arquivo para compartilhar

### Desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 📱 Funcionalidades Principais

### 1. **Sistema de Experiência**
- Ganhe XP lendo capítulos (+10 XP) ou completando leituras (+1000 XP)
- Sistema de níveis com progressão automática
- Barra de experiência com animações de energia

### 2. **Gerenciamento de Conteúdo**
- Adicione mangás com capas e links diretos
- Crie habilidades com efeitos em atributos
- Gerencie inventário com itens de diferentes raridades
- Conquiste títulos com bônus especiais

### 3. **Sistema de Atributos**
- Atributos base: Força, Agilidade, Inteligência, Vitalidade, Sorte
- Atributos customizáveis adicionáveis pelo usuário
- Cálculo automático baseado em habilidades, itens e títulos
- Edição manual de valores com reset automático

### 4. **Interface Animada**
- Modais com efeitos de desdobramento
- Transições de abas com deslizamento
- Notificações com animações de entrada/saída
- Background com partículas e efeitos de energia

## 🎨 Temas e Estilos

O projeto utiliza um tema medieval fantasia com:
- **Cores**: Dourado (amber), Roxo (purple), Azul índigo (indigo)
- **Tipografia**: Fontes serifadas para aspecto medieval
- **Efeitos**: Sombras, brilhos e gradientes
- **Animações**: Transições suaves e efeitos de hover

## 📊 Estrutura do Projeto

```
├── app/                    # App Router do Next.js
├── components/             # Componentes React
│   ├── ui/                # Componentes de UI base
│   └── *.tsx              # Componentes específicos
├── lib/                   # Utilitários e tipos
├── hooks/                 # Hooks customizados
├── public/                # Arquivos estáticos
└── styles/                # Estilos globais
```

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env.local` se necessário:
```env
# Adicione variáveis de ambiente aqui
```

### Personalização
- Modifique `lib/isekai-types.ts` para alterar tipos
- Ajuste `components/isekai-provider.tsx` para lógica de negócio
- Customize `app/globals.css` para estilos globais

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Outras Plataformas
O projeto é compatível com qualquer plataforma que suporte Next.js.

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através do GitHub.

---

**Desenvolvido com ❤️ para a comunidade de fãs de isekai e RPGs medievais!**
