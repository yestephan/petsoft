import bcrypt from "bcryptjs";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getUserByEmail } from "./server-utils";
import { authSchema } from "./validations";

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
        // This function runs when a user tries to log in
        // Check if the FormDataObject is valid
        const validatedFormData = authSchema.safeParse(credentials);
        if (!validatedFormData.success) {
          return null;
        }

        // Runs on Log in
        const { email, password } = validatedFormData.data;

        const user = await getUserByEmail(email);

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
        // you have to explicitly pass the user id
        return user;
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");
      // If the user is not logged in and is trying to access the app, deny access
      if (!isLoggedIn && isTryingToAccessApp) {
        return false;
      }
      // If the user is logged in and is trying to access the app, but not paid, deny access
      if (isLoggedIn && isTryingToAccessApp && !auth?.user.hasAccess) {
        return Response.redirect(new URL("/payment", request.nextUrl));
      }
      // If the user is logged in and is trying to access the app, allow access && auth?.user.hasAccess
      if (isLoggedIn && isTryingToAccessApp && auth?.user.hasAccess) {
        return true;
      }

      // If the user is not logged in and is not trying to access the app, allow access
      if (isLoggedIn && !isTryingToAccessApp) {
        if (
          (request.nextUrl.pathname.includes("/login") ||
            request.nextUrl.pathname.includes("/signup")) &&
          !auth?.user.hasAccess
        ) {
          return Response.redirect(new URL("/payment", request.nextUrl).href);
        }
        return true;
      }

      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }
      return false;
    },
    // jwt is a JSON Web Token coming from the provider by default
    // the provider is the object returned by the authorize function
    jwt: ({ token, user }) => {
      if (user) {
        // on sign in
        token.userId = user.id;
        token.hasAccess = user.hasAccess;
      }
      return token;
    },
    // session is the object that will be returned to the client
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.userId;
        session.user.hasAccess = token.hasAccess;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
