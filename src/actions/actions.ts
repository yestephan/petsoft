"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/db";
import { Pet } from "@/lib/types";
import { sleep } from "@/lib/utils";

export async function addPet(petData: Omit<Pet, "id">) {
  await sleep(2000);

  try {
    await prisma.pet.create({
      data: petData,
    });
  } catch (error) {
    return { message: "error" };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: string, newPetData: Omit<Pet, "id">) {
  await sleep(2000);

  try {
    const updatedPet = await prisma.pet.update({
      where: {
        id: petId,
      },
      data: newPetData,
    });
  } catch (error) {
    return { message: "Could not edit" };
  }
  revalidatePath("/app", "layout");
}

export async function deletePet(petId: string) {
  await sleep(2000);

  try {
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch (error) {
    return { message: "Could not delete" };
  }
  revalidatePath("/app", "layout");
}
