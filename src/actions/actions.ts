"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";

export async function addPet(formData: FormData) {
  await sleep(2000);

  try {
    await prisma.pet.create({
      data: {
        name: formData.get("name") as string,
        ownerName: formData.get("ownerName") as string,
        imageUrl:
          (formData.get("imageUrl") as string) ||
          "https://plus.unsplash.com/premium_photo-1676390051589-bead49b416a6?q=80&w=3086&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        age: parseInt(formData.get("age") as string),
        notes: formData.get("notes") as string,
      },
    });
  } catch (error) {
    return { message: "error" };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(formData: FormData, petId: string) {
  await sleep(2000);

  try {
    const updatedPet = await prisma.pet.update({
      where: {
        id: petId,
      },
      data: {
        name: formData.get("name") as string,
        ownerName: formData.get("ownerName") as string,
        imageUrl:
          (formData.get("imageUrl") as string) ||
          "https://plus.unsplash.com/premium_photo-1676390051589-bead49b416a6?q=80&w=3086&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        age: parseInt(formData.get("age") as string),
        notes: formData.get("notes") as string,
      },
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
