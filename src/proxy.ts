import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Aplica o middleware em todas as rotas exceto estáticos e api
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
