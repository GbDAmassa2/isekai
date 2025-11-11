# 🔐 Área Secreta - Gerenciamento de Recompensas

Este guia explica como usar a área secreta para gerenciar recompensas de mangás. Esta é uma área secreta acessível apenas por quem conhece a URL.

## 🎯 Como Usar a Área Secreta

### Acessar a Área

A área secreta está disponível em: `http://localhost:3000/admin`

**Nota:** Esta é uma área secreta - qualquer pessoa que souber a URL pode acessá-la. Não há verificação de permissões.

## 📝 Gerenciar Recompensas

#### Criar Nova Recompensa

1. Clique no botão "Nova Recompensa"
2. Preencha os campos obrigatórios:
   - **Manga ID**: ID único do mangá (ex: `eleceed`, `lookism`)
   - **Título do Mangá**: Nome do mangá (ex: `Eleceed`, `Lookism`)
   - **Episódio**: Número do episódio (deve ser maior que 0)
3. **✨ Facilidade:** Os campos JSON (Abilities, Items, Titles, Attributes) já vêm pré-preenchidos com templates! Basta editar os valores que você precisa alterar (nomes, descrições, valores, etc.)
4. Preencha os campos opcionais (em formato JSON):
   - **Experiência (XP)**: Quantidade de XP a ser concedida
   - **Abilities**: Array de habilidades (formato JSON) - **já vem com template pré-preenchido**
   - **Items**: Array de itens (formato JSON) - **já vem com template pré-preenchido**
   - **Titles**: Array de títulos (formato JSON) - **já vem com template pré-preenchido**
   - **Attributes**: Objeto com atributos (formato JSON) - **já vem com template pré-preenchido**
   - **Aliases / Nomes Alternativos**: Array de strings com nomes alternativos que podem ser usados para referenciar esta obra (ex: `["Solo Leveling", "나 혼자만 레벨업", "Solo Leveling Arise"]`)

#### Editar Recompensa

1. Na tabela de recompensas, clique no ícone de edição (lápis)
2. Modifique os campos desejados
3. Clique em "Atualizar"

#### Deletar Recompensa

1. Na tabela de recompensas, clique no ícone de lixeira
2. Confirme a exclusão no diálogo

## 📝 Exemplos de Formato JSON

### Abilities (Habilidades)

```json
[
  {
    "name": "Electric Control",
    "description": "Controle básico sobre eletricidade",
    "type": "active",
    "level": 1,
    "category": "attack",
    "power": 4,
    "manaCost": 15,
    "cooldown": 45
  }
]
```

### Items (Itens)

```json
[
  {
    "name": "Sword of Light",
    "description": "Uma espada brilhante",
    "type": "weapon",
    "rarity": "rare",
    "effects": {
      "strength": 5,
      "agility": 2
    }
  }
]
```

### Titles (Títulos)

```json
[
  {
    "name": "Hero",
    "description": "Um verdadeiro herói",
    "effects": {
      "strength": 2,
      "intelligence": 3
    }
  }
]
```

### Attributes (Atributos)

```json
{
  "strength": 2,
  "intelligence": 3,
  "agility": 1,
  "vitality": 1,
  "luck": 1
}
```

### Aliases / Nomes Alternativos

```json
[
  "Nome Alternativo 1",
  "Nome Alternativo 2",
  "Outro Nome",
  "Nome em Outro Idioma"
]
```

**Exemplo prático:**
```json
[
  "Solo Leveling",
  "나 혼자만 레벨업",
  "Solo Leveling Arise",
  "Only I Level Up"
]
```

Este campo permite definir vários nomes que a obra pode ter, facilitando a busca e referência da obra mesmo quando ela é conhecida por nomes diferentes.

## 🔒 Segurança

- Esta é uma área secreta acessível apenas por quem conhece a URL
- Não há verificação de permissões ou autenticação especial
- Mantenha a URL em segredo se quiser restringir o acesso

## 🐛 Troubleshooting

### Erro ao criar recompensa

- Verifique se o formato JSON está correto
- Certifique-se de que não existe outra recompensa para o mesmo mangá e episódio
- Verifique os logs do servidor para mais detalhes

## 📚 API Endpoints

A área secreta usa as seguintes rotas de API:

- `GET /api/rewards` - Listar todas as recompensas
- `POST /api/rewards` - Criar nova recompensa
- `PUT /api/rewards` - Atualizar recompensa existente
- `DELETE /api/rewards?id=<id>` - Deletar recompensa

Todas as rotas são acessíveis sem verificação de permissões especiais.

