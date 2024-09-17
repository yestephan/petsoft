import bcrypt from "bcryptjs";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import prisma from "./db";

const config = {
  // Custom pages such as sign in, sign out, etc.
  // Creating a user account is handled by the sign in page and not by the authentication provider.
  pages: {
    signIn: "/login",
  },
  // Add providers here such as Google, Facebook, etc.
  providers: [
    Credentials({
      async authorize(credentials) {
        // Runs on Log in
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (!user) {
          console.log("User not found");
          return null;
        }
        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );
        ``;
        if (!passwordMatch) {
          console.log("Password does not match");
          return null;
        }
        return user;
      },
    }),
  ],
  // Add callbacks here such as redirecting to a specific page after sign in
  callbacks: {
    authorized: ({ auth, request }) => {
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");
      // If the user is not logged in and is trying to access the app, deny access
      if (!isLoggedIn && isTryingToAccessApp) {
        return false;
      }
      // If the user is logged in and is trying to access the app, allow access
      if (isLoggedIn && isTryingToAccessApp) {
        return true;
      }
      // If the user is not logged in and is not trying to access the app, allow access
      if (!isTryingToAccessApp) {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn } = NextAuth(config);
