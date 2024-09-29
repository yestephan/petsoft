import { redirect } from "next/navigation";

import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return (
    <main>
      <H1 className="my-8 text-white">Your Account</H1>
      <ContentBlock className="h-[500px]">
        <p>{session?.user?.email}</p>
      </ContentBlock>
    </main>
  );
}
