import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
type PetFormBtnProps = {
  actionType: "edit" | "add";
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  const { pending } = useFormStatus();
  return (
    <Button className="mt-5 self-end" type="submit" disabled={pending}>
      {actionType === "edit" ? "Edit pet" : "Add new pet"}
    </Button>
  );
}
