import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" }, // Certificar-se explícito
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/rooms");
      const isOnAuth = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redireciona para o login
      } else if (isOnAuth) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/rooms", nextUrl));
        }
        return true;
      }
      return true;
    },
  },
  providers: [], // Configurado no auth.ts
} satisfies NextAuthConfig;
