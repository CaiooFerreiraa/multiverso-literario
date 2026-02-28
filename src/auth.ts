import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { UserNeonDatabase } from "@/infrastructure/users/User.databaseNeon";
import { neonClient } from "@/infrastructure/database/neon";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const repo = new UserNeonDatabase(neonClient);
        const userArray = await repo.read(credentials.email as string);
        const user = userArray && userArray.length > 0 ? userArray[0] : null;

        // Suporte para login via master admin (definido no .env)
        if (credentials.email === process.env.ADMIN_EMAIL && credentials.password === process.env.ADMIN_PASSWORD) {
          return {
            id: user?.id_user || 9999, // Virtual admin ID if not in DB
            name: user?.fullname || "Administrador",
            email: credentials.email as string,
            image: user?.image || null,
          };
        }

        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (isPasswordCorrect || credentials.password === user.password) {
          return {
            id: user.id_user,
            name: user.fullname,
            email: user.email,
            image: user.image || null,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
      }
      if (trigger === "update" && session?.image) {
        token.image = session.image;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
});
