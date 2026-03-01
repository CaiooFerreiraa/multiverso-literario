"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { responseQuizAction } from "@/actions/dashboard";
import { useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";

const CheckCircle2 = LucideIcons.CheckCircle2 as any;
const XCircle = LucideIcons.XCircle as any;
const Trophy = LucideIcons.Trophy as any;
const ArrowRight = LucideIcons.ArrowRight as any;
const ArrowLeft = LucideIcons.ArrowLeft as any;
const Zap = LucideIcons.Zap as any;
const HelpCircle = LucideIcons.HelpCircle as any;

interface Alternative {
  id_alternative: number;
  alternative: string;
  is_correct: boolean;
}

interface Question {
  id_question: number;
  question_tittle: string;
  points: number;
  alternatives: Alternative[];
}

interface Quiz {
  id_quiz: number;
  tittle: string;
  questions: Question[];
}

interface QuizClientProps {
  quiz: Quiz;
  user: {
    id: string | number;
    name: string;
  };
}

export default function QuizClient({ quiz, user }: QuizClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAlternative, setSelectedAlternative] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPossiblePoints, setTotalPossiblePoints] = useState(0);

  const currentQuestion = quiz.questions[currentIndex];
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

  const handleSelect = (id: number) => {
    if (isPending) return;
    setSelectedAlternative(id);
  };

  const handleNext = async () => {
    if (selectedAlternative === null) return;

    const newAnswers = { ...answers, [currentQuestion.id_question]: selectedAlternative };
    setAnswers(newAnswers);

    // If it's the last question, submit everything or just finish?
    // The current action `responseQuizAction` takes one response at a time.
    // I will submit each one.

    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAlternative(answers[quiz.questions[currentIndex + 1]?.id_question] || null);
    } else {
      // Calculate score locally for immediate feedback
      let localScore = 0;
      let localTotal = 0;

      startTransition(async () => {
        try {
          // Submit all answers (sequential for simplicity here)
          for (const q of quiz.questions) {
            const altId = newAnswers[q.id_question];
            const alt = q.alternatives.find(a => a.id_alternative === altId);

            localTotal += q.points;
            if (alt?.is_correct) {
              localScore += q.points;
            }

            await responseQuizAction({
              id_user: Number(user.id),
              id_quiz: quiz.id_quiz,
              id_question: q.id_question,
              id_alternative: altId,
              response_text: alt?.alternative || ""
            });
          }

          setScore(localScore);
          setTotalPossiblePoints(localTotal);
          setIsFinished(true);
          toast.success("Quiz finalizado com sucesso!");
        } catch (error) {
          toast.error("Erro ao salvar suas respostas.");
        }
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAlternative(answers[quiz.questions[currentIndex - 1].id_question]);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <GlassCard className="p-8 text-center rounded-3xl border-white/10 bg-white/[0.02]">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30 shadow-[0_0_30px_rgba(109,40,217,0.4)]">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-black italic mb-2">Parabéns, {user.name}!</h2>
            <p className="text-white/40 text-sm mb-8 italic">Você concluiu o desafio literário.</p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-2">Sua Pontuação</p>
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
                <span className="text-5xl font-black text-white">{score}</span>
                <span className="text-white/20 text-lg self-end mb-1">/ {totalPossiblePoints}</span>
              </div>
            </div>

            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold gap-2 cursor-pointer shadow-lg transition-all"
            >
              Voltar ao Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header with Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                <HelpCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold">{quiz.tittle}</h1>
                <p className="text-[10px] text-white/30 uppercase tracking-widest leading-none">Desafio Multiverso</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold text-white/40 mb-1">Passo {currentIndex + 1} de {quiz.questions.length}</p>
              <div className="flex items-center gap-2 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <Zap className="w-3 h-3 text-amber-500" />
                <span className="text-[9px] font-bold text-amber-500 uppercase">{currentQuestion.points} pts</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-1 bg-white/5" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-8 md:p-12 rounded-[2.5rem] border-white/5 bg-white/[0.01]">
              <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-snug">
                {currentQuestion.question_tittle}
              </h2>

              <div className="grid gap-3">
                {currentQuestion.alternatives.map((alt) => {
                  const isSelected = selectedAlternative === alt.id_alternative;
                  return (
                    <button
                      key={alt.id_alternative}
                      onClick={() => handleSelect(alt.id_alternative)}
                      className={`w-full p-5 rounded-2xl text-left transition-all relative group flex items-center justify-between border ${isSelected
                        ? "bg-primary/20 border-primary shadow-[0_0_25px_rgba(109,40,217,0.15)]"
                        : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10"
                        } cursor-pointer`}
                    >
                      <span className={`font-medium transition-colors ${isSelected ? "text-white" : "text-white/60 group-hover:text-white"}`}>
                        {alt.alternative}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isPending}
            className="rounded-xl h-12 px-6 hover:bg-white/5 text-white/30 hover:text-white disabled:opacity-20 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <Button
            onClick={handleNext}
            disabled={selectedAlternative === null || isPending}
            className={`rounded-xl h-12 px-10 font-bold gap-2 transition-all ${selectedAlternative !== null && !isPending
              ? "bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(109,40,217,0.3)]"
              : "bg-white/5 text-white/20"
              } cursor-pointer`}
          >
            {isPending ? "Processando..." : currentIndex === quiz.questions.length - 1 ? "Finalizar Challenge" : "Próxima Questão"}
            {!isPending && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
