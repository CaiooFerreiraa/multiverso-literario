import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readAllTimelinesAction, readAllQuizzesAction, readUsersAction } from "@/actions/admin";
import { readGlobalRankingAction, readLibraryBooksAction } from "@/actions/dashboard";
import { AdminClient } from "./admin-client";
import { isAdmin } from "@/lib/is-admin";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;
  const adminCheck = await isAdmin({ userId });
  if (!adminCheck) redirect("/home");

  const [timelinesRes, rankingRes, quizzesRes, booksRes, usersRes] = await Promise.all([
    readAllTimelinesAction(),
    readGlobalRankingAction(),
    readAllQuizzesAction(),
    readLibraryBooksAction(),
    readUsersAction(1, 10)
  ]);

  const timelines = (timelinesRes.success ? timelinesRes.data : []) as any[];
  const quizzes = (quizzesRes.success ? quizzesRes.data : []) as any[];
  const ranking = (rankingRes.success ? rankingRes.data : []) as any[];
  const books = (booksRes.success ? booksRes.data : []) as any[];
  const usersData = usersRes.success ? { 
    data: usersRes.data as any[], 
    total: usersRes.total, 
    page: usersRes.page, 
    limit: usersRes.limit 
  } : { data: [], total: 0, page: 1, limit: 10 };

  return (
    <AdminClient
      timelines={timelines}
      quizzes={quizzes}
      ranking={ranking}
      books={books}
      usersData={usersData}
    />
  );
}
