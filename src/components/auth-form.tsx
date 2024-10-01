import { logIn, signUp } from "@/actions/actions";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type AuthFormProps = {
  type: "login" | "signup";
};

export default function AuthForm({ type }: AuthFormProps) {
  return (
    <form action={type === "login" ? logIn : signUp}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input name="email" id="email" type="email" />
      </div>
      <div
        className="mt-2 space-y-2 mb-4
      "
      >
        <Label htmlFor="password">Password</Label>
        <Input name="password" id="password" type="password" />
      </div>
      <Button className="">{type === "login" ? "Log in" : "Sign up"}</Button>
    </form>
  );
}
