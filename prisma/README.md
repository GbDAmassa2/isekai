# 🔧 Sistema de Seed do Prisma

Este diretório contém a configuração e scripts de seed para popular o banco de dados com dados iniciais dos mangás.

## 📁 Estrutura

```
prisma/
├── seed.ts              # Script principal de seed
├── seeds/               # Pasta com seeds específicos por mangá
│   └── eleceed.ts       # Seed para o mangá Eleceed
└── README.md           # Este arquivo
```

## 🚀 Como usar

### 1. Configuração

O sistema já está configurado no `package.json` com:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts"
  }
}
```

### 2. Executar o seed

Para popular o banco de dados com os dados dos mangás:

```bash
npx prisma db seed
```

### 3. Adicionar novos mangás

1. Crie um novo arquivo em `prisma/seeds/` (ex: `solo-leveling.ts`)
2. Implemente a função de seed seguindo o padrão do `eleceed.ts`
3. Importe e chame a função no `prisma/seed.ts`

## 📋 Pré-requisitos

- Prisma configurado com o modelo `MangaReward`
- `ts-node` instalado como dependência de desenvolvimento
- Banco de dados configurado e migrado

## ⚠️ Nota Importante

Este sistema assume que você já configurou o Prisma com um modelo `MangaReward` que possui os campos:
- `mangaId` (string)
- `mangaTitle` (string) 
- `episode` (number)
- `abilities` (JSON)
- `items` (JSON)
- `attributes` (JSON)
- `titles` (JSON)

Com uma constraint única `@@unique([mangaId, episode])` para evitar duplicatas.
