import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { readQuizAction, checkQuizCompletionAction } from "@/actions/dashboard";
import QuizClient from "./quiz-client";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

const Trophy = LucideIcons.Trophy as any;

interface PageProps {
  params: {
    id: string;
  };
}

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const quizId = parseInt(id);
  if (isNaN(quizId)) notFound();

  const userId = Number((session.user as any).id);

  const [quizRes, statusRes] = await Promise.all([
    readQuizAction(quizId),
    checkQuizCompletionAction(userId, quizId)
  ]);

  if (!quizRes.success || !quizRes.data) {
    notFound();
  }

  // If already completed, show finished view
  if (statusRes.success && statusRes.completed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <GlassCard className="p-12 text-center rounded-3xl border-white/5 bg-white/[0.02] max-w-md w-full">
          <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/30">
            <Trophy className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Desafio Concluído!</h2>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            Você já respondeu a este quiz e garantiu seus pontos no Multiverso Literário. <br />
            Continue lendo para novos desafios!
          </p>
          <Link href="/dashboard/quizzes">
            <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold cursor-pointer">
              Ver Outros Quizzes
            </Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <QuizClient
      quiz={quizRes.data}
      user={{
        id: userId,
        name: session.user.name || "Leitor"
      }}
    />
  );
}
