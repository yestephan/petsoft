import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const deletedRecords = await prisma.pet.deleteMany();
    console.log(`Deleted ${deletedRecords.count} instances`);
  } catch (error) {
    console.error(`Error deleting instances`, error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
