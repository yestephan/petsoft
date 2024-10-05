"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { checkAuth, getPetByPetId } from "@/lib/server-utils";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdeaSchema } from "@/lib/validations";

// --- user actions ---
export async function logIn(formData: FormData) {
  const authData = Object.fromEntries(formData.entries());
  // console.log(authData, "authdata");

  await signIn("credentials", authData);
  // Validate the data
  // If the data is invalid, return an error message
  // If the data is valid, log the user in
}

export async function logOut() {
  // Log the user out using the signOut function from the auth library
  await signOut({ redirectTo: "/" });
}

export async function signUp(formData: FormData) {
  const authData = Object.fromEntries(formData.entries());
  // console.log(authData, "authdata");

  const hashedPassword = await bcrypt.hash(authData.password as string, 10);

  await prisma.user.create({
    data: {
      email: authData.email as string,
      hashedPassword: hashedPassword,
    },
  });

  // Log the user using the signIn function from the auth library which is imported from the auth
  await signIn("credentials", formData);
}

// --- pet actions ---
export async function addPet(newPetData: unknown) {
  await sleep(1000);

  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(newPetData);
  if (!validatedPet.success) {
    return { message: "Invalid data" };
  }
  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.email,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);

    return { message: "Could not add pet" };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, updatedPetData: unknown) {
  await sleep(1000);

  // authentification check
  const session = await checkAuth();

  // validation check
  const validatedPet = petFormSchema.safeParse(updatedPetData);
  if (!validatedPet.success) {
    return { message: "Invalid data" };
  }

  const validatedPetId = petIdeaSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return { message: "Invalid data" };
  }

  // authorization check
  const pet = await getPetByPetId(validatedPetId.data);

  if (!pet) {
    return { message: "Pet not found" };
  }
  if (pet.userId !== session?.user?.id) {
    return { message: "Unauthorized" };
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

  const session = await checkAuth();

  const validatedPetId = petIdeaSchema.safeParse(petId);

  if (!validatedPetId.success) {
    return { message: "Invalid data" };
  }

  // authorization check
  const pet = await getPetByPetId(validatedPetId.data);

  if (!pet) {
    return { message: "Pet not found" };
  }

  if (pet.userId !== session?.user?.id) {
    return { message: "Unauthorized" };
  }

  // database mutation
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
