import { z } from "zod";

import { DEFAULT_PET_IMAGE } from "./constants";

export const petIdeaSchema = z.string().cuid();

export const petFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(100),
    ownerName: z
      .string()
      .trim()
      .min(2, { message: "Owner name must be at least 2 characters long" })
      .max(100),
    imageUrl: z.union([
      z.literal(""),
      z.string().trim().url({ message: "Invalid URL" }),
    ]),
    age: z.coerce.number().int().positive().max(999),
    notes: z.union([z.literal(""), z.string().trim().max(500)]),
  })
  .transform((data) => ({
    ...data,
    imageUrl: data.imageUrl || DEFAULT_PET_IMAGE,
    notes: data.notes || "",
  }));

export type TPetForm = z.infer<typeof petFormSchema>;

// This is the type of the data that will be passed to the signUp function
export const authSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().max(100),
});

// This is the type of the data that will be passed to the signUp function
export type TAuthSchema = z.infer<typeof authSchema>;
