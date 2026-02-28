"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Trophy, Flame, Lock, CheckCircle2,
  Sparkles, Crown, Target, Zap,
} from "lucide-react";
import Link from "next/link";
import { completeChallengeAction } from "@/actions/challenges";

interface Props {
  userId: number;
  challenges: any[];
  userPoints: { total_points: number; challenges_completed: number };
  isPremium: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DesafiosClient({ userId, challenges: initialChallenges, userPoints, isPremium }: Props) {
  const [challenges, setChallenges] = useState(initialChallenges || []);
  const [isPending, startTransition] = useTransition();

  const freeChallenges = challenges.filter((c: any) => !c.is_premium);
  const premiumChallenges = challenges.filter((c: any) => c.is_premium);

  const completedFreeCount = freeChallenges.filter((c: any) => c.completed_at).length;
  const freeLimit = 2;

  const handleComplete = (challenge: any) => {
    if (!isPremium && challenge.is_premium) return;
    if (!isPremium && completedFreeCount >= freeLimit && !challenge.completed_at) return;
    if (challenge.completed_at) return;

    startTransition(async () => {
      const result = await completeChallengeAction(userId, challenge.id_challenge, challenge.points);
      if (result.success) {
        setChallenges(
          challenges.map((c: any) =>
            c.id_challenge === challenge.id_challenge
              ? { ...c, completed_at: new Date().toISOString(), points_earned: challenge.points }
              : c
          )
        );
      }
    });
  };

  const renderChallengeCard = (challenge: any, index: number, locked: boolean) => {
    const isCompleted = !!challenge.completed_at;
    const isLocked = locked && !isCompleted;

    return (
      <motion.div key={challenge.id_challenge || index} variants={item}>
        <GlassCard
          className={`p-6 rounded-2xl transition-all ${isCompleted
              ? "bg-green-500/5 border-green-500/10"
              : isLocked
                ? "opacity-40"
                : "hover:bg-white/5"
            }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                ) : isLocked ? (
                  <Lock className="w-5 h-5 text-white/20 shrink-0" />
                ) : (
                  <Target className="w-5 h-5 text-primary shrink-0" />
                )}
                <h4 className={`text-sm font-bold ${isCompleted ? "text-green-300" : ""}`}>
                  {challenge.title}
                </h4>
              </div>
              <p className="text-xs text-white/40 leading-relaxed ml-7">
                {challenge.description || "Complete este desafio para ganhar pontos"}
              </p>

              <div className="flex items-center gap-3 mt-3 ml-7">
                <Badge
                  variant="outline"
                  className="text-[9px] border-white/10 px-2 py-0.5  gap-1"
                >
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  {challenge.points} pts
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[9px] border-white/10 px-2 py-0.5"
                >
                  {challenge.challenge_type === "daily"
                    ? "Diário"
                    : challenge.challenge_type === "weekly"
                      ? "Semanal"
                      : "Interpretação"}
                </Badge>
                {challenge.is_premium && (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[9px] px-2 py-0.5 gap-1">
                    <Crown className="w-2.5 h-2.5" /> Premium
                  </Badge>
                )}
              </div>
            </div>

            {!isCompleted && !isLocked && (
              <Button
                onClick={() => handleComplete(challenge)}
                disabled={isPending}
                size="sm"
                className="bg-primary/20 hover:bg-primary/30 text-primary rounded-xl text-xs cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                Completar
              </Button>
            )}
            {isCompleted && (
              <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider shrink-0">
                +{challenge.points_earned || challenge.points} pts
              </span>
            )}
          </div>
        </GlassCard>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 px-6 lg:px-12 py-6 bg-background/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl cursor-pointer">
            <Link href="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Desafios de Leitura</h1>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">
              Acumule pontos e conquiste selos
            </p>
          </div>
          <div className="flex items-center gap-2 bg-amber-500/10 rounded-full px-4 py-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-300">{userPoints.total_points}</span>
          </div>
        </div>
      </header>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto px-6 lg:px-12 py-8 space-y-8"
      >
        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-3 gap-4">
          <GlassCard className="p-5 rounded-2xl text-center">
            <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{userPoints.challenges_completed}</p>
            <p className="text-[9px] text-white/30 uppercase tracking-widest">Completados</p>
          </GlassCard>
          <GlassCard className="p-5 rounded-2xl text-center bg-amber-500/5">
            <Flame className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-300">{userPoints.total_points}</p>
            <p className="text-[9px] text-white/30 uppercase tracking-widest">Pontos</p>
          </GlassCard>
          <GlassCard className="p-5 rounded-2xl text-center">
            <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{challenges.length}</p>
            <p className="text-[9px] text-white/30 uppercase tracking-widest">Total</p>
          </GlassCard>
        </motion.div>

        {/* Free Challenges */}
        <motion.section variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">
              Desafios Gratuitos
            </h3>
            {!isPremium && (
              <Badge variant="outline" className="text-[9px] border-white/10">
                {completedFreeCount}/{freeLimit} usados
              </Badge>
            )}
          </div>
          <div className="space-y-3">
            {freeChallenges.map((challenge: any, i: number) => {
              const locked = !isPremium && completedFreeCount >= freeLimit && !challenge.completed_at;
              return renderChallengeCard(challenge, i, locked);
            })}
            {freeChallenges.length === 0 && (
              <GlassCard className="p-8 rounded-2xl text-center">
                <Target className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">Nenhum desafio gratuito disponível no momento</p>
              </GlassCard>
            )}
          </div>
        </motion.section>

        {/* Premium Challenges */}
        <motion.section variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" /> Desafios Expandidos
            </h3>
          </div>

          {!isPremium && (
            <GlassCard className="p-6 rounded-2xl mb-4 bg-gradient-to-r from-amber-500/10 to-orange-600/5 border-amber-500/10">
              <div className="flex items-center gap-4">
                <Lock className="w-8 h-8 text-amber-400/50" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-amber-300">Desbloqueie desafios ilimitados</p>
                  <p className="text-[10px] text-white/30">
                    Assine o Multiverso Expandido para acessar todos os desafios
                  </p>
                </div>
                <Button className="bg-amber-500 hover:bg-amber-600 text-black rounded-xl h-9 px-4 text-xs font-bold cursor-pointer">
                  Assinar
                </Button>
              </div>
            </GlassCard>
          )}

          <div className="space-y-3">
            {premiumChallenges.map((challenge: any, i: number) =>
              renderChallengeCard(challenge, i, !isPremium)
            )}
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
