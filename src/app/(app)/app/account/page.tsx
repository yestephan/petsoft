import { redirect } from "next/navigation";

import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import SignOutButton from "@/components/sign-out-button";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main>
      <H1 className="my-8 text-white">Your Account</H1>
      <ContentBlock className="h-[500px] flex flex-col gap-4 justify-center items-center">
        <p>{session?.user?.email}</p>
        <SignOutButton />
      </ContentBlock>
    </main>
  );
}
