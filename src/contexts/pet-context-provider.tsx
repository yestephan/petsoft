"use client";

import { createContext, startTransition, useOptimistic, useState } from "react";
import { toast } from "sonner";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { Pet } from "@/lib/types";

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleAddPet: (pet: Omit<Pet, "id">) => void;
  handleEditPet: (newPetData: Omit<Pet, "id">, petId: string) => void;
  handleCheckoutPet: (id: string) => void;
  handleChangeSelectedPetId: (id: string) => void;
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
  const handleAddPet = async (newPet: Omit<Pet, "id">) => {
    setOptimisticPets({ action: "add", payload: newPet });
    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleEditPet = async (newPetData: Omit<Pet, "id">, petId: string) => {
    setOptimisticPets({ action: "edit", payload: { id: petId, newPetData } });

    const error = selectedPet && (await editPet(petId, newPetData));
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleCheckoutPet = async (petId: string) => {
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
