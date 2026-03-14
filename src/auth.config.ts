import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" }, // Certificar-se explícito
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtected = nextUrl.pathname.startsWith("/home") || nextUrl.pathname.startsWith("/rooms");
      const isOnAuth = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

      // Proteção de rotas: apenas exige login.
      // A verificação de admin (tabela do banco) é feita nos Server Components,
      // pois o Edge Middleware não tem acesso ao banco de dados.
      if (isOnProtected) {
        if (isLoggedIn) return true;
        return false; // Redireciona para o login
      } else if (isOnAuth) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/home", nextUrl));
        }
        return true;
      }
      return true;
    },
  },
  providers: [], // Configurado no auth.ts
} satisfies NextAuthConfig;
