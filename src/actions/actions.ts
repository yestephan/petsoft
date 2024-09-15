"use server";

import { Pet } from "@prisma/client";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/db";
import { PetEssentials } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdeaSchema } from "@/lib/validations";

export async function addPet(newPetData: unknown) {
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

export async function editPet(petId: unknown, updatedPetData: unknown) {
  await sleep(1000);

  const validatedPet = petFormSchema.safeParse(updatedPetData);
  if (!validatedPet.success) {
    return { message: "Invalid data" };
  }

  const validatedPetId = petIdeaSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return { message: "Invalid data" };
  }

  try {
    const updatedPet = await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch (error) {
    return { message: "Could not edit pet" };
  }
  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  await sleep(1000);

  const validatedPetId = petIdeaSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return { message: "Invalid data" };
  }

  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    return { message: "Could not delete" };
  }
  revalidatePath("/app", "layout");
}
