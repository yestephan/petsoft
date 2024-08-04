// prisma/deleteid.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DELETE_ID="your_id_here" npm run prisma:deleteid
const deleteId = process.env.DELETE_ID;

if (!deleteId) {
  throw new Error("Please provide a DELETE_ID environment variable");
}

async function main(id: string) {
  try {
    const deletedRecord = await prisma.pet.delete({
      where: {
        id: id,
      },
    });
    console.log(`Deleted instance with id: ${id}`);
  } catch (error) {
    console.error(`Error deleting instance with id: ${id}`, error);
  } finally {
    await prisma.$disconnect();
  }
}

main(deleteId);
