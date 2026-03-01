import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readAllTimelinesAction, readAllQuizzesAction } from "@/actions/admin";
import { readGlobalRankingAction } from "@/actions/dashboard";
import * as LucideIcons from "lucide-react";
import { AdminClient } from "./admin-client";

const ShieldAlert = LucideIcons.ShieldAlert as any;

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const isAdmin = session.user.email === process.env.ADMIN_EMAIL;
  if (!isAdmin) redirect("/home");

  const [timelinesRes, rankingRes, quizzesRes] = await Promise.all([
    readAllTimelinesAction(),
    readGlobalRankingAction(),
    readAllQuizzesAction()
  ]);

  const timelines = (timelinesRes.success ? timelinesRes.data : []) as any[];
  const quizzes = (quizzesRes.success ? quizzesRes.data : []) as any[];
  const ranking = (rankingRes.success ? rankingRes.data : []) as any[];

  return (
    <div className="min-h-screen px-6 lg:px-12 py-10">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Painel Administrativo</span>
          </div>
          <h1 className="text-3xl font-bold">Gestão Multiverso</h1>
          <p className="text-white/40 text-sm">Adicione e gerencie conteúdos do sistema</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto">
        <AdminClient
          timelines={timelines}
          quizzes={quizzes}
          ranking={ranking}
        />
      </div>
    </div>
  );
}
