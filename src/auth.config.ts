import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" }, // Certificar-se explícito
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/home/admin");
      const isOnProtected = nextUrl.pathname.startsWith("/home") || nextUrl.pathname.startsWith("/rooms");
      const isOnAuth = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

      if (isOnAdmin) {
        if (isLoggedIn && auth?.user?.email === process.env.ADMIN_EMAIL) return true;
        return Response.redirect(new URL("/home", nextUrl));
      }

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
