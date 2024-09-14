import { Button } from "./ui/button";

type PetFormBtnProps = {
  actionType: "edit" | "add";
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  return (
    <Button className="mt-5 self-end" type="submit">
      {actionType === "edit" ? "Edit pet" : "Add new pet"}
    </Button>
  );
}
