"use client";

import { logOut } from "@/actions/actions";

import { Button } from "./ui/button";

export default function SignOutButton() {
  return <Button onClick={async () => await logOut()}>Sign out</Button>;
}
