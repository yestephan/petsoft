"use server";

import { Pet } from "@prisma/client";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/db";
import { PetEssentials } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { petFormSchema } from "@/lib/validations";

export async function addPet(newPetData: PetEssentials) {
  await sleep(1000);

  const validatedPet = petFormSchema.safeParse(newPetData);
  if (!validatedPet.success) {
    return { message: "Invalid data" };
  }
  try {
    await prisma.pet.create({
      data: validatedPet.data,
    });
  } catch (error) {
    console.log(error);

    return { message: "error" };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: Pet["id"], updatedPetData: PetEssentials) {
  await sleep(1000);

  try {
    const updatedPet = await prisma.pet.update({
      where: {
        id: petId,
      },
      data: updatedPetData,
    });
  } catch (error) {
    return { message: "Could not edit pet" };
  }
  revalidatePath("/app", "layout");
}

export async function deletePet(petId: Pet["id"]) {
  await sleep(1000);

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
