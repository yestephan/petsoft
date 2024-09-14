"use client";

import { Pet } from "@prisma/client";
import { createContext, startTransition, useOptimistic, useState } from "react";
import { toast } from "sonner";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetEssentials } from "@/lib/types";

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: Pet["id"] | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleAddPet: (newPetData: PetEssentials) => void;
  handleEditPet: (updatedPetData: PetEssentials, petId: Pet["id"]) => void;
  handleCheckoutPet: (id: Pet["id"]) => void;
  handleChangeSelectedPetId: (id: Pet["id"]) => void;
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data || [],
    (prev, { action, payload }) => {
      switch (action) {
        case "add":
          return [...prev, { ...payload, id: Math.random().toString() }];
        case "edit":
          return prev.map((pet) => {
            if (pet.id === payload.id) {
              return { ...pet, ...payload.newPetData };
            } else {
              return pet;
            }
          });
        case "delete":
          return prev.filter((pet) => pet.id !== payload);
        default:
          return prev;
      }
    }
  );

  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  // event handlers / actions
  const handleAddPet = async (newPetData: PetEssentials) => {
    setOptimisticPets({ action: "add", payload: newPetData });
    const error = await addPet(newPetData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleEditPet = async (
    updatedPetData: PetEssentials,
    petId: Pet["id"]
  ) => {
    setOptimisticPets({
      action: "edit",
      payload: { id: petId, updatedPetData },
    });

    const error = selectedPet && (await editPet(petId, updatedPetData));
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleCheckoutPet = async (petId: Pet["id"]) => {
    setOptimisticPets({ action: "delete", payload: petId });
    const error = await deletePet(petId);
    if (error) {
      toast.warning(error.message);
      return;
    }
    setSelectedPetId(null);
  };

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        selectedPetId,
        handleAddPet,
        handleEditPet,
        handleCheckoutPet,
        handleChangeSelectedPetId,
        selectedPet,
        numberOfPets,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
