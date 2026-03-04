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
          let adminUser: any = null;
          try {
            const result = await neonClient.query(
              `SELECT id_user, fullname, email, image FROM users WHERE email = $1`,
              [credentials.email]
            );
            adminUser = result && result.length > 0 ? result[0] : null;

            // Se for master admin mas não está no banco, criar agora para ter ID real
            if (!adminUser) {
              try {
                const [inserted] = await neonClient.query(
                  `INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3) RETURNING id_user, fullname, email, image`,
                  ["Administrador", credentials.email as string, credentials.password as string]
                );
                adminUser = inserted;
                await neonClient.query(`INSERT INTO member (id_user, city) VALUES ($1, 'Admin City') ON CONFLICT DO NOTHING`, [adminUser.id_user]);
                await neonClient.query(`INSERT INTO admin (id_user) VALUES ($1) ON CONFLICT DO NOTHING`, [adminUser.id_user]);
              } catch (e) {
                console.error("Erro ao criar admin fallback:", e);
                return null;
              }
            }

            return {
              id: String(adminUser.id_user),
              name: adminUser.fullname || "Administrador",
              email: credentials.email as string,
              image: adminUser.image || null,
            };
          } catch (e) {
            console.error("Erro na busca de admin:", e);
            return null;
          }
        }

        try {
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
              id: String(user.id_user),
              name: user.fullname,
              email: user.email,
              image: user.image || null,
            };
          }
        } catch (error) {
          console.error("Erro no authorize:", error);
          return null;
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
        token.image = (user as any).image;
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
