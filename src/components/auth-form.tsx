"use client";

import { useFormState } from "react-dom";

import { logIn, signUp } from "@/actions/actions";

import AuthFormBtn from "./auth-form-btn";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type AuthFormProps = {
  type: "login" | "signup";
};

export default function AuthForm({ type }: AuthFormProps) {
  const [signUpError, dispatchSignUp] = useFormState(signUp, undefined);
  const [logInError, dispatchLogIn] = useFormState(logIn, undefined);

  return (
    <form action={type === "login" ? dispatchLogIn : dispatchSignUp}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input name="email" id="email" type="email" required maxLength={100} />
      </div>
      <div
        className="mt-2 space-y-2 mb-4
      "
      >
        <Label htmlFor="password">Password</Label>
        <Input
          name="password"
          id="password"
          type="password"
          required
          maxLength={100}
        />
      </div>
      <AuthFormBtn type={type} />
      {signUpError && (
        <p className="text-red-500 text-sm mt-4">{signUpError.message}</p>
      )}
      {logInError && (
        <p className="text-red-500 text-sm mt-4">{logInError.message}</p>
      )}
    </form>
  );
}
