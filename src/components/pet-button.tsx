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
  if (actionType === "checkout") {
    return (
      <Button variant={"secondary"} onClick={onClick}>
        {children}
      </Button>
    );
  }
  if (actionType === "add" || actionType === "edit") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {actionType === "add" ? (
            <Button size="icon">
              <PlusIcon height={24} width={24} />
            </Button>
          ) : (
            <Button variant={"secondary"}>{children}</Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "edit" ? "Edit pet" : "Add a new pet"}
            </DialogTitle>
          </DialogHeader>
          <PetForm></PetForm>
        </DialogContent>
      </Dialog>
    );
  }

  return <Button>Edit</Button>;
}
