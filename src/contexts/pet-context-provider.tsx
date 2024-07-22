import { useState, createContext } from "react";

export const PetContext = createContext(null);

export default function PetContextProvider({ children }: React.ReactNode) {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  return (
    <PetContext.Provider value={{ pets, selectedPet }}>
      {children}
    </PetContext.Provider>
  );
}
