import "../styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

// Initialize the Inter font with specific subsets
const inter = Inter({ subsets: ["latin"] });

// Metadata for your app (SEO purposes)
export const metadata: Metadata = {
  title: "Petsoft",
  description: "Petsoft - take care of pets responsibly",
};

// RootLayout component for layout structure
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} text-sm text-zinc-900 bg-defaultgrey min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
