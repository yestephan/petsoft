import React from "react";

import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="flex flex-col gap-10 items-center">
      <H1>Petsoft access requires payment</H1>
      <Button>Buy lifetime access for 299€</Button>
    </main>
  );
}
