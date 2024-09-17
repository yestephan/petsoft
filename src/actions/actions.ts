"use server";

import { revalidatePath } from "next/cache";

import { signIn } from "@/lib/auth";
import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdeaSchema } from "@/lib/validations";

// --- user actions ---
export async function logIn(formData: FormData) {
  const authData = Object.fromEntries(formData.entries());
  console.log(authData, "authdata");

  await signIn("credentials", authData);
  // Validate the data
  // If the data is invalid, return an error message
  // If the data is valid, log the user in
}

// --- pet actions ---
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
