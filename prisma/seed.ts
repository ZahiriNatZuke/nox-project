import process from 'node:process';
import { env } from '@app/env';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  /*--------------------------------------------------------------
    ##  Seeding for prod
  ----------------------------------------------------------------*/

  /*--------------------------------------------------------------
    ##  Seeding for dev
  ----------------------------------------------------------------*/

  if (env.ENVIRONMENT === 'development') {
    // some seeds
  }
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
