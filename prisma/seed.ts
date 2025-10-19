// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
// Quando você tiver mais mangás, importe-os aqui:
// import { seedSoloLeveling } from './seeds/solo-leveling';
// import { seedOnePiece } from './seeds/one-piece';

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o processo de seed principal...");

  try {
    // Import dinâmico padrão do TS (sem extensão)
    const { migrateExistingRewards } = await import('./seeds/migrate-existing');
    const { seedEleceed } = await import('./seeds/eleceed');

    // Migrar dados existentes do arquivo estático para o banco
    await migrateExistingRewards(prisma);

    // Chame a função para cada mangá que você quer popular (opcional - os dados já foram migrados acima)
    await seedEleceed(prisma);
    // await seedSoloLeveling(prisma);
    // await seedOnePiece(prisma);

    console.log("Processo de seed principal concluído.");
  } catch (error) {
    console.error("Erro durante o seed:", error);
    throw error;
  }
}

// Boilerplate para executar a função main e lidar com erros
main()
  .catch((e) => {
    console.error("Ocorreu um erro durante o processo de seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Sempre feche a conexão com o banco de dados
    await prisma.$disconnect();
  });
