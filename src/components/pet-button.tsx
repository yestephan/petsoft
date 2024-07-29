import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { act } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import PetForm from "./pet-form";

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
      <Dialog>
        <DialogTrigger>
          <Button size="icon">
            <PlusIcon height={24} width={24} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new pet</DialogTitle>
          </DialogHeader>
          <PetForm></PetForm>
        </DialogContent>
      </Dialog>
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
