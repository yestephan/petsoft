import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { act } from "react";

type PetButtonProps = {
  actionType: "add" | "edit" | "checkout";
  children?: React.ReactNode;
  onClick?: () => void;
};

export default function PetButton({
  actionType,
  children,
  onClick,
}: PetButtonProps) {
  if (actionType === "add") {
    return (
      <Button size="icon">
        <PlusIcon height={24} width={24} />
      </Button>
    );
  }

  if (actionType === "edit") {
    return <Button variant={"secondary"}>{children}</Button>;
  }
  if (actionType === "checkout") {
    return (
      <Button variant={"secondary"} onClick={onClick}>
        {children}
      </Button>
    );
  }
  return <Button>Edit</Button>;
}
