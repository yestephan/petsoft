"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useTransition } from "react";

import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const router = useRouter();

  return (
    <main className="flex flex-col gap-10 items-center">
      <H1>Petsoft access requires payment</H1>
      {searchParams.cancelled && (
        <p className="text-sm text-red-700">
          Your payment was canceled. You can try again by clicking the button
          below.
        </p>
      )}

      {searchParams.success && (
        <Button
          onClick={async () => {
            await update(true);
            router.push("/app/dashboard");
          }}
        >
          Access Petsoft
        </Button>
      )}

      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => {
              await createCheckoutSession();
            });
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
