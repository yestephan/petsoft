"use client";

import { log } from "console";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";

import { cn } from "@/lib/utils";

import Logo from "./logo";

const routes = [
  { label: "Dashboard", path: "/app/dashboard" },
  { label: "Account", path: "/app/account" },
];

export default function AppHeader() {
  const activePathname = usePathname();
  console.log("activePathname", activePathname);
  return (
    <header className="flex justify-between  border-b border-white/10 py-2">
      <Logo />
      <nav>
        <ul className="flex gap-2 text-xs items-center">
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className={cn(
                  "text-white/70rounded-sm px-2 py-1 hover:text-white focuus:text-white transition",
                  {
                    " bg-black/10 text-white": activePathname === route.path,
                  }
                )}
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
