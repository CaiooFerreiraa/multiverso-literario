import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readLibraryBooksAction, readUserPlanStatusAction } from "@/actions/dashboard";
import BibliotecaClient from "./biblioteca-client";

export default async function BibliotecaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = Number((session.user as any).id);

  const [booksRes, planRes] = await Promise.all([
    readLibraryBooksAction(),
    readUserPlanStatusAction(userId)
  ]);

  const books = booksRes.success ? booksRes.data : [];
  const isPremium = !!(planRes.success && planRes.data);

  return (
    <BibliotecaClient
      books={books}
      isPremium={isPremium}
    />
  );
}
