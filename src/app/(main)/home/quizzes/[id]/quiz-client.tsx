"use client";

import React, { useState, useTransition, useEffect, useCallback, useRef } from "react";
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
const Zap = LucideIcons.Zap as any;
const HelpCircle = LucideIcons.HelpCircle as any;
const Timer = LucideIcons.Timer as any;
const AlertTriangle = LucideIcons.AlertTriangle as any;

interface Alternative {
  id_alternative: number;
  alternative: string;
  is_correct: boolean;
}

interface Question {
  id_question: number;
  question_tittle: string;
  points: number;
  type?: string;
  alternatives: Alternative[];
}

interface Quiz {
  id_quiz: number;
  tittle: string;
  time_per_question?: number;
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
  const [openAnswer, setOpenAnswer] = useState("");
  const [answers, setAnswers] = useState<Record<number, { altId?: number; text?: string }>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPossiblePoints, setTotalPossiblePoints] = useState(0);

  // Timer
  const timeLimit = quiz.time_per_question || 0; // 0 means no timer
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceRef = useRef(false);

  const currentQuestion = quiz.questions[currentIndex];
  const isOpenQuestion = currentQuestion?.type === "open";
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

  // Timer countdown
  useEffect(() => {
    if (timeLimit <= 0 || isFinished) return;

    setTimeLeft(timeLimit);
    autoAdvanceRef.current = false;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          autoAdvanceRef.current = true;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, timeLimit, isFinished]);

  // Auto-advance when timer reaches 0
  useEffect(() => {
    if (autoAdvanceRef.current && timeLeft === 0 && timeLimit > 0) {
      autoAdvanceRef.current = false;
      toast.warning("Tempo esgotado! Avançando...");
      handleAutoNext();
    }
  }, [timeLeft]);

  const handleSelect = (id: number) => {
    if (isPending) return;
    setSelectedAlternative(id);
  };

  const handleAutoNext = useCallback(() => {
    // Auto-advance without answer
    processNext(null, "");
  }, [currentIndex]);

  const processNext = (altId: number | null, answerText: string) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id_question]: { altId: altId ?? undefined, text: answerText || undefined }
    };
    setAnswers(newAnswers);

    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAlternative(null);
      setOpenAnswer("");
    } else {
      // Final question — submit all
      let localScore = 0;
      let localTotal = 0;

      startTransition(async () => {
        try {
          for (const q of quiz.questions) {
            const ans = newAnswers[q.id_question];
            const altId = ans?.altId;
            const responseText = ans?.text || "";

            localTotal += q.points;

            if (q.type === "open") {
              // Open questions always submit
              await responseQuizAction({
                id_user: Number(user.id),
                id_quiz: quiz.id_quiz,
                id_question: q.id_question,
                response_text: responseText
              });
              // Award points for open questions (admin reviews later)
              if (responseText.trim().length > 0) {
                localScore += q.points;
              }
            } else {
              const alt = q.alternatives.find(a => a.id_alternative === altId);
              if (alt?.is_correct) {
                localScore += q.points;
              }
              if (altId) {
                await responseQuizAction({
                  id_user: Number(user.id),
                  id_quiz: quiz.id_quiz,
                  id_question: q.id_question,
                  id_alternative: altId,
                  response_text: alt?.alternative || ""
                });
              }
            }
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

  const handleNext = () => {
    if (isOpenQuestion) {
      if (!openAnswer.trim()) {
        toast.error("Por favor, escreva sua resposta antes de avançar.");
        return;
      }
      processNext(null, openAnswer);
    } else {
      if (selectedAlternative === null) return;
      processNext(selectedAlternative, "");
    }
  };

  // Timer visual
  const timerPercent = timeLimit > 0 ? (timeLeft / timeLimit) * 100 : 100;
  const timerColor = timerPercent > 50 ? "text-emerald-400" : timerPercent > 20 ? "text-amber-400" : "text-red-400";
  const timerBg = timerPercent > 50 ? "bg-emerald-500" : timerPercent > 20 ? "bg-amber-500" : "bg-red-500";

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
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              Parabéns, {user.name}!
            </h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
              Você concluiu o desafio literário.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-2">Sua Pontuação</p>
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
                <span className="text-5xl font-black text-white">{score}</span>
                <span className="text-white/20 text-lg self-end mb-1">/ {totalPossiblePoints}</span>
              </div>
            </div>

            <Button
              onClick={() => router.push("/home")}
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
            <div className="text-right flex items-center gap-4">
              {/* Timer */}
              {timeLimit > 0 && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${timerPercent > 50 ? "border-emerald-500/20 bg-emerald-500/10" : timerPercent > 20 ? "border-amber-500/20 bg-amber-500/10" : "border-red-500/20 bg-red-500/10 animate-pulse"}`}>
                  <Timer className={`w-4 h-4 ${timerColor}`} />
                  <span className={`text-sm font-black tabular-nums ${timerColor}`}>
                    {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:{(timeLeft % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              )}
              <div>
                <p className="text-[11px] font-bold text-white/40 mb-1">Passo {currentIndex + 1} de {quiz.questions.length}</p>
                <div className="flex items-center gap-2 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span className="text-[9px] font-bold text-amber-500 uppercase">{currentQuestion.points} pts</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-1 bg-white/5" />
            {timeLimit > 0 && (
              <div className="mt-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${timerBg} transition-all duration-1000`}
                  style={{ width: `${timerPercent}%` }}
                />
              </div>
            )}
          </div>
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

              {isOpenQuestion ? (
                /* Open Question: Textarea */
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
                      <LucideIcons.PenTool className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Questão Aberta</span>
                    </div>
                  </div>
                  <textarea
                    value={openAnswer}
                    onChange={(e) => setOpenAnswer(e.target.value)}
                    placeholder="Escreva sua resposta aqui..."
                    rows={6}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-base placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 resize-none transition-all cursor-text"
                  />
                  <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
                    {openAnswer.length} caracteres
                  </p>
                </div>
              ) : (
                /* Multiple Choice */
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
              )}
            </GlassCard>
          </motion.div>
        </AnimatePresence>

        {/* Navigation - NO "Previous" button */}
        <div className="flex items-center justify-between gap-4">
          {/* Info: cannot go back */}
          <div className="flex items-center gap-2 text-white/15 text-[10px] uppercase tracking-widest font-bold">
            <AlertTriangle className="w-3 h-3" />
            <span>Não é possível voltar</span>
          </div>

          <Button
            onClick={handleNext}
            disabled={(isOpenQuestion ? !openAnswer.trim() : selectedAlternative === null) || isPending}
            className={`rounded-xl h-12 px-10 font-bold gap-2 transition-all ${(isOpenQuestion ? openAnswer.trim() : selectedAlternative !== null) && !isPending
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
