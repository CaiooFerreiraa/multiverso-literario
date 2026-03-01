import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

const Ticket = LucideIcons.Ticket as any;
const Bookmark = LucideIcons.Bookmark as any;
const HelpCircle = LucideIcons.HelpCircle as any;
const ChevronRight = LucideIcons.ChevronRight as any;

import { readCurrentTimelineAction, readQuizzesAction } from "@/actions/dashboard";

export default async function QuizzesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const timelineRes = await readCurrentTimelineAction();
  const currentTimeline = timelineRes.success ? timelineRes.data : null;

  let quizzes = [];
  if (currentTimeline) {
    const quizzesRes = await readQuizzesAction(currentTimeline.id_timeline_book);
    if (quizzesRes.success) {
      quizzes = quizzesRes.data as any[];
    }
  }

  return (
    <div className="min-h-screen px-6 lg:px-12 py-10">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-primary mb-1">
          <Ticket className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Desafios Literários</span>
        </div>
        <h1 className="text-3xl font-bold">Quizzes do Mês</h1>
        <p className="text-white/40 text-sm">
          {currentTimeline
            ? `Desafios para o livro: ${currentTimeline.name}`
            : "Teste seus conhecimentos e ganhe pontos extras"}
        </p>
      </header>

      {quizzes.length === 0 ? (
        <div className="max-w-2xl mx-auto py-20">
          <GlassCard className="p-12 text-center rounded-3xl border-white/5 bg-white/[0.02]">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5">
              <Ticket className="w-8 h-8 text-white/20" />
            </div>
            <h2 className="text-xl font-bold mb-2">Nenhum quiz encontrado</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              {currentTimeline
                ? `Ainda não há quizzes disponíveis para "${currentTimeline.name}".`
                : "Ainda não há quizzes disponíveis no momento."}
              <br />
              Fique de olho no cronograma para saber quando os desafios serão liberados!
            </p>
            <Link href="/dashboard">
              <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5 gap-2 cursor-pointer">
                Voltar para Home
              </Button>
            </Link>
          </GlassCard>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Link key={quiz.id_quiz} href={`/dashboard/quizzes/${quiz.id_quiz}`}>
              <GlassCard className="p-6 rounded-3xl border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all group overflow-hidden relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                    <HelpCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    <LucideIcons.Zap className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-500 uppercase">{quiz.total_points || 0} pts</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{quiz.tittle}</h3>

                <div className="flex items-center gap-4 text-white/30 text-xs mb-6">
                  <div className="flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{quiz.question_count} Questões</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Começar agora</span>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
