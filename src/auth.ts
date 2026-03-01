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

        // Suporte para login via master admin (definido no .env)
        if (credentials.email === process.env.ADMIN_EMAIL && credentials.password === process.env.ADMIN_PASSWORD) {
          // Buscar admin na tabela users SEM exigir member
          let adminUser: any = null;
          try {
            const result = await neonClient.query(
              `SELECT id_user, fullname, email, image FROM users WHERE email = $1`,
              [credentials.email]
            );
            adminUser = result && result.length > 0 ? result[0] : null;
          } catch (e) {
            // Se não encontrar na tabela, usa ID virtual
          }

          return {
            id: adminUser?.id_user || 9999,
            name: adminUser?.fullname || "Administrador",
            email: credentials.email as string,
            image: adminUser?.image || null,
          };
        }

        const repo = new UserNeonDatabase(neonClient);
        const userArray = await repo.read(credentials.email as string);
        const user = userArray && userArray.length > 0 ? userArray[0] : null;

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
