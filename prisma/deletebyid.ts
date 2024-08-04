import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let deleteId = "clzfoyxqa0009k154lkwu2z7o";

async function deleteById(id: string) {
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

deleteById(deleteId)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
