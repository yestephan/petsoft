"use server";

import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { checkAuth, getPetByPetId } from "@/lib/server-utils";
import { sleep } from "@/lib/utils";
import { authSchema, petFormSchema, petIdeaSchema } from "@/lib/validations";

// instantiate stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// --- user actions ---
export async function logIn(prevState: unknown, formData: unknown) {
  await sleep(1000);

  if (!(formData instanceof FormData)) {
    return { message: "Invalid data" };
  }
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { message: "Invalid credentials" };
        }
        default: {
          return { message: "Error. Could not sign in" };
        }
      }
    }
    throw error; // nextjs redirects throws error, so we need to rethrow it
  }
}

export async function logOut() {
  await sleep(1000);

  // Log the user out using the signOut function from the auth library
  await signOut({ redirectTo: "/" });
}

export async function signUp(prevState: unknown, formData: unknown) {
  await sleep(1000);

  // Check if the data is a FormData object
  if (!(formData instanceof FormData)) {
    return { message: "Invalid data" };
  }

  // Convert the FormData object to a JSON object
  const formDataEntries = Object.fromEntries(formData.entries());

  // Validate the JSON object
  const validatedFormData = authSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) {
    return { message: "Invalid data" };
  }
  // Hash the password
  const { email, password } = validatedFormData.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user in the database
  try {
    await prisma.user.create({
      data: {
        email: email,
        hashedPassword: hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { message: "Email already exists" };
      }
    }

    return { message: "Could not create user" };
  }

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

// --- payment actions ---
export async function createCheckoutSession() {
  // authentification check
  const session = await checkAuth();

  // create a checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [
      {
        price: "price_1Q7KPoATGUK4Wnux0gRhH7ps",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
    cancel_url: `${process.env.CANONICAL_URL}/payment?cancelled=true`,
  });

  // redirect to payment page
  redirect(checkoutSession.url);
}
