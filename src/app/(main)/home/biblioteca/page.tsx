import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readLibraryBooksAction, readUserPlanStatusAction } from "@/actions/dashboard";
import BibliotecaClient from "./biblioteca-client";
import { isAdmin as checkAdmin } from "@/lib/is-admin";

export default async function BibliotecaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = Number((session.user as any).id);

  const [booksRes, planRes, isAdmin] = await Promise.all([
    readLibraryBooksAction(),
    readUserPlanStatusAction(userId),
    checkAdmin({ userId })
  ]);

  const books = booksRes.success ? ((booksRes.data as any[]) || []) : [];
  const userPlan = (planRes.success && planRes.data) ? planRes.data : null;

  return (
    <BibliotecaClient
      books={books}
      userPlan={userPlan}
      isAdmin={isAdmin}
    />
  );
}

