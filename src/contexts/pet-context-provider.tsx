"use client";

import { addPet } from "@/actions/actions";
import { Pet } from "@/lib/types";
import { useState, createContext } from "react";

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
  handleEditPet: (petId: string, newPetData: Omit<Pet, "id">) => void;
  handleChangeSelectedPetId: (id: string) => void;
  handleCheckoutPet: (id: string) => void;
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  // state
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // event handlers / actions
  const handleAddPet = async (newPet: Omit<Pet, "id">) => {
    // setPets((prev) => [...prev, { ...newPet, id: Date.now().toString() }]);

    await addPet(newPet);
  };

  const handleEditPet = (petId: string, newPetData: Omit<Pet, "id">) => {
    const newPet = { ...newPetData, id: petId };
    setPets((prev) => prev.map((pet) => (pet.id === petId ? newPet : pet)));
    console.log("newPet", newPet);
  };

  const handleCheckoutPet = (id: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id));
    setSelectedPetId(null);
  };

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  return (
    <PetContext.Provider
      value={{
        pets,
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
