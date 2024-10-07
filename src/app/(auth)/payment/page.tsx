"use client";

import { log } from "console";
import React from "react";

import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";

export default function Page({ searchParams }) {
  console.log(searchParams);
  return (
    <main className="flex flex-col gap-10 items-center">
      <H1>Petsoft access requires payment</H1>

      {!searchParams.success && (
        <Button
          onClick={async () => {
            await createCheckoutSession();
          }}
        >
          Buy lifetime access for 299€
        </Button>
      )}

      {searchParams.success && (
        <p className="text-sm text-green-700">
          Thank you for your payment! You now have lifetime access to Petsoft.
        </p>
      )}
    </main>
  );
}
