import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readAllTimelinesAction, readAllQuizzesAction } from "@/actions/admin";
import { readGlobalRankingAction, readLibraryBooksAction } from "@/actions/dashboard";
import { AdminClient } from "./admin-client";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const isAdmin = session.user.email === process.env.ADMIN_EMAIL;
  if (!isAdmin) redirect("/home");

  const [timelinesRes, rankingRes, quizzesRes, booksRes] = await Promise.all([
    readAllTimelinesAction(),
    readGlobalRankingAction(),
    readAllQuizzesAction(),
    readLibraryBooksAction()
  ]);

  const timelines = (timelinesRes.success ? timelinesRes.data : []) as any[];
  const quizzes = (quizzesRes.success ? quizzesRes.data : []) as any[];
  const ranking = (rankingRes.success ? rankingRes.data : []) as any[];
  const books = (booksRes.success ? booksRes.data : []) as any[];

  return (
    <AdminClient
      timelines={timelines}
      quizzes={quizzes}
      ranking={ranking}
      books={books}
    />
  );
}
