"use client";

import { useTransition } from "react";

import { logOut } from "@/actions/actions";

import { Button } from "./ui/button";

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={async () => {
        startTransition(async () => await logOut());
      }}
    >
      Sign out
    </Button>
  );
}
