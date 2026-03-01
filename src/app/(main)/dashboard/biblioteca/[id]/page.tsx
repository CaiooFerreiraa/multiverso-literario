import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { readLibraryBookAction, readUserPlanStatusAction } from "@/actions/dashboard";
import ReaderClient from "./reader-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReaderPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const bookId = parseInt(id);
  if (isNaN(bookId)) notFound();

  const userId = Number((session.user as any).id);

  const [bookRes, planRes] = await Promise.all([
    readLibraryBookAction(bookId),
    readUserPlanStatusAction(userId)
  ]);

  if (!bookRes.success || !bookRes.data) {
    notFound();
  }

  const book = bookRes.data;
  const isPremium = !!(planRes.success && planRes.data);

  // Check plan restriction
  if (book.id_plan === 2 && !isPremium) {
    redirect("/dashboard/biblioteca");
  }

  return (
    <ReaderClient
      book={book}
    />
  );
}
