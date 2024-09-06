"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { act, useState } from "react";

import PetForm from "./pet-form";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type PetButtonProps = {
  actionType: "add" | "edit" | "checkout";
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export default function PetButton({
  actionType,
  children,
  disabled,
  onClick,
}: PetButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (actionType === "checkout") {
    return (
      <Button variant={"secondary"} disabled={disabled} onClick={onClick}>
        {children}
      </Button>
    );
  }
  if (actionType === "add" || actionType === "edit") {
    return (
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
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
          <PetForm
            actionType={actionType}
            onFormSubmission={() => {
              setIsFormOpen(false);
            }}
          ></PetForm>
        </DialogContent>
      </Dialog>
    );
  }

  return <Button>Edit</Button>;
}
