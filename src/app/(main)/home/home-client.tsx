"use client";

import React, { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  Trophy,
  Star,
  Quote,
  Sparkles,
  Send,
  ChevronRight,
  Flame,
  Shield,
  Rocket,
  Search as SearchIcon,
  Crown,
  Zap,
  MessageCircle,
  Video,
  Ticket,
  LogOut,
  Target,
  Award,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { createPhraseAction } from "@/actions/phrases";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { hasFeature } from "@/lib/plan-utils";
import { Lock } from "lucide-react";

interface HomeProps {
  user: { id: number; name: string; email: string; isAdmin: boolean; image?: string };
  viewType: 'student' | 'adult' | 'free';
  currentTimeline: any;
  userPlan: any;
  seals: any[];
  userPoints: any;
  ranking: any[];
  phrases: any[];
  activeAward?: any;
}

const sealIcons: Record<string, any> = {
  "Explorador": SearchIcon,
  "Viajante": Rocket,
  "Guardião": Shield,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function HomeClient({
  user,
  viewType,
  currentTimeline,
  userPlan,
  seals,
  userPoints,
  ranking,
  phrases: initialPhrases,
  activeAward
}: HomeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [phrases] = useState(initialPhrases || []);
  const [isPending, startTransition] = useTransition();
  const isVipRanking = hasFeature(userPlan, 'RANKING_VIP', user.isAdmin);
  const canSeeRanking = hasFeature(userPlan, 'RANKING_GENERAL', user.isAdmin) || isVipRanking;
  const canSeeTimeline = hasFeature(userPlan, 'CRON_LIVRO', user.isAdmin);
  const canSeePhrases = hasFeature(userPlan, 'COMMUNITY_PHRASES', user.isAdmin);
  
  const canDoExclu = hasFeature(userPlan, 'CHALLENGE_EXCLU', user.isAdmin);
  const canDoUnlimited = hasFeature(userPlan, 'CHALLENGE_UNLIMITED', user.isAdmin);
  const hasChallenges = hasFeature(userPlan, 'CHALLENGE_2', user.isAdmin) || canDoExclu || canDoUnlimited;

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculando progresso do cronograma atual para a premiaçao
  // Usamos useEffect ou estado montado para evitar hydration mismatch (data muda entre server e client)
  const now = isMounted ? new Date() : new Date(0); // No server usamos data zero ou fixa
  const start = currentTimeline ? new Date(currentTimeline.date_start) : now;
  const end = currentTimeline ? new Date(currentTimeline.date_end) : now;
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  const progressPercent = isMounted && total > 0 ? Math.min(100, Math.max(0, (elapsed / total) * 100)) : 0;
  const daysRemaining = isMounted ? Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;

  const awardDaysRemaining = isMounted && activeAward && activeAward.deadline
    ? Math.max(0, Math.ceil((new Date(activeAward.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : daysRemaining;



  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-6 lg:px-12 py-4 pb-32 max-w-6xl w-full mx-auto space-y-10"
    >
      {/* HERO - Simplificado no mobile */}
      <motion.section variants={item}>
        <GlassCard className="p-6 md:p-10 rounded-2xl md:rounded-3xl relative overflow-hidden bg-black/40">
          <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-2">
              Olá, <span className="text-primary">{user.name.split(" ")[0]}</span>! ✨
            </h2>
            <p className="text-white/40 text-[11px] md:text-sm max-w-lg leading-relaxed mx-auto md:ml-0">
              Sua jornada literária continua. Explore novos mundos hoje.
            </p>
          </div>
        </GlassCard>
      </motion.section>

      {/* CRONOGRAMA + LIVRO DO MÊS */}
      <motion.section variants={item} id="cronograma">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Livro do Mês
          {!canSeeTimeline && <Lock className="w-3 h-3 ml-1 text-white/20" />}
        </h3>
        {!canSeeTimeline ? (
          <GlassCard className="p-10 rounded-3xl text-center border-amber-500/10 bg-amber-500/5">
            <Lock className="w-12 h-12 text-amber-500/20 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-amber-500/60 mb-2">Cronograma Bloqueado</h4>
            <p className="text-white/30 text-sm mb-6 max-w-md mx-auto">
              Seu plano atual não inclui acesso ao cronograma e livro do mês. 
              Faça um upgrade para acompanhar as leituras coletivas!
            </p>
            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl cursor-pointer">
              <Link href="/home/planos">
                <Crown className="w-4 h-4 mr-2" />
                Ver Planos Disponíveis
              </Link>
            </Button>
          </GlassCard>
        ) : currentTimeline ? (
          <GlassCard className="p-8 rounded-3xl">
            <div className="grid md:grid-cols-[auto_1fr] gap-8">
              <div className="w-full md:w-48 h-64 rounded-2xl bg-gradient-to-br from-primary/30 to-indigo-600/20 border border-white/10 flex flex-col items-center justify-center gap-3">
                <BookOpen className="w-12 h-12 text-primary/60" />
                <span className="text-[10px] text-white/30 uppercase tracking-widest">Leitura Atual</span>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] mb-4">
                    Em andamento
                  </Badge>
                  <h4 className="text-2xl font-bold mb-2">{currentTimeline.name}</h4>
                  <p className="text-white/50 text-sm mb-4">por {currentTimeline.author}</p>

                  <div className="flex items-center gap-6 text-xs text-white/40">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {isMounted ? new Date(currentTimeline.date_start).toLocaleDateString("pt-BR") : "Loading..."}
                    </span>
                    <span className="text-white/20">→</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {isMounted ? new Date(currentTimeline.date_end).toLocaleDateString("pt-BR") : "Loading..."}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 flex-wrap">
                  <Button className="bg-primary hover:bg-primary/80 rounded-xl gap-2 h-10 px-5 cursor-pointer" asChild>
                    <Link href={`/home/livro/${currentTimeline.id_timeline_book}`}>
                      <MessageCircle className="w-4 h-4" /> Contribuir
                    </Link>
                  </Button>
                  <Button variant="outline" className="rounded-xl border-white/10 h-10 px-5 cursor-pointer" asChild>
                    <Link href={`/home/quizzes`}>
                      <Zap className="w-4 h-4 mr-1" /> Quiz
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-10 rounded-3xl text-center">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-white/60 mb-2">Nenhum livro ativo no momento</h4>
            <p className="text-white/30 text-sm">
              O próximo cronograma será anunciado em breve. Fique ligado!
            </p>
          </GlassCard>
        )}
      </motion.section>

      {/* DESAFIOS & PONTOS */}
      <motion.section variants={item} id="desafios">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Target className="w-4 h-4" /> Desafios de Leitura
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <GlassCard className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-600/5 border-amber-500/10">
            <Flame className="w-8 h-8 text-amber-400 mb-3" />
            <p className="text-3xl font-bold text-amber-300">{userPoints.total_points}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Pontos Acumulados</p>
          </GlassCard>

          <GlassCard className="p-6 rounded-2xl">
            <Trophy className="w-8 h-8 text-primary mb-3" />
            <p className="text-3xl font-bold">{userPoints.challenges_completed}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Desafios Completados</p>
          </GlassCard>

          <Link href="/home/desafios">
            <GlassCard className="p-6 rounded-2xl h-full flex flex-col justify-between hover:bg-white/5 transition-all group cursor-pointer">
              <Sparkles className="w-8 h-8 text-purple-400 mb-3" />
              <div>
                <p className="text-sm font-bold mb-1 group-hover:text-primary transition-colors">
                  Ver Desafios
                </p>
                <p className="text-[10px] text-white/40">
                  {canDoUnlimited || canDoExclu ? "Acesso total a todos os desafios" : hasChallenges ? "2 desafios gratuitos disponíveis" : "Upgrade para liberar desafios"}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 self-end mt-4 group-hover:text-primary transition-colors group-hover:translate-x-1" />
            </GlassCard>
          </Link>
        </div>
      </motion.section>

      {/* SELOS LITERÁRIOS - Ocultos no mobile para dashboard mais limpo */}
      <motion.section variants={item} className="hidden md:block">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Award className="w-4 h-4" /> Selos Literários
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {seals.map((seal: any) => {
            const SealIcon = sealIcons[seal.name] || Star;
            const isAwarded = !!seal.awarded_at;

            return (
              <GlassCard
                key={seal.id_seal}
                className={`p-6 rounded-2xl text-center transition-all ${isAwarded
                  ? "bg-gradient-to-br from-primary/20 to-indigo-500/10 border-primary/20"
                  : "opacity-50"
                  }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center ${isAwarded ? "bg-primary/20" : "bg-white/5"
                    }`}
                >
                  <SealIcon
                    className={`w-7 h-7 ${isAwarded ? "text-primary" : "text-white/30"}`}
                  />
                </div>
                <h4 className={`text-sm font-bold mb-1 ${isAwarded ? "text-white" : "text-white/40"}`}>
                  {seal.name}
                </h4>
                <p className="text-[10px] text-white/30">
                  {seal.months_required} meses
                </p>
                {isAwarded && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[8px] mt-2">
                    Conquistado
                  </Badge>
                )}
              </GlassCard>
            );
          })}
        </div>
      </motion.section>

      {/* RANKING GLOBAL */}
      <motion.section variants={item} id="ranking" className="mb-12">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" /> Ranking Global
          {!canSeeRanking && <Lock className="w-3 h-3 ml-1 text-white/20" />}
        </h3>

          {!canSeeRanking ? (
            <div className="col-span-full">
              <GlassCard className="p-12 text-center border-dashed border-white/10">
                <Trophy className="w-12 h-12 text-white/5 mx-auto mb-4" />
                <p className="text-white/30 text-sm">O ranking está disponível apenas para planos selecionados.</p>
                <Button variant="link" asChild className="text-primary font-bold mt-2 cursor-pointer">
                  <Link href="/home/planos">Conhecer Planos →</Link>
                </Button>
              </GlassCard>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {ranking?.slice(0, 5).map((player, i) => (
                  <div
                    key={player.id_user}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${player.id_user === user.id
                      ? "bg-primary/10 border-primary/20 ring-1 ring-primary/30"
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 font-black text-[10px] uppercase tracking-widest text-white/20">
                        {i === 0 ? <span className="text-2xl">🥇</span> :
                          i === 1 ? <span className="text-2xl">🥈</span> :
                            i === 2 ? <span className="text-2xl">🥉</span> :
                              `#${i + 1}`}
                      </div>
                      <Avatar className="w-10 h-10 border border-white/10 shrink-0">
                        <AvatarImage src={player.image || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                          {player.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${player.id_user === user.id ? "text-primary" : "text-white/80"}`}>
                          {player.name}
                          {player.id_user === user.id && <span className="ml-2 text-[10px] text-primary/60 font-medium">(Você)</span>}
                        </span>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest">
                          {isVipRanking ? "Membro VIP" : "Membro Prime"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <Zap className="w-3.5 h-3.5" />
                        <span className="text-sm">{player.total_points}</span>
                      </div>
                      <span className="text-[9px] text-white/20 uppercase tracking-tighter">pontos totais</span>
                    </div>
                  </div>
                ))}

                {(!ranking || ranking.length === 0) && (
                  <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <p className="text-sm text-white/40">O ranking começará em breve. Participe dos desafios!</p>
                  </div>
                )}
              </div>

              <GlassCard className="hidden md:flex p-6 rounded-2xl bg-amber-500/5 border-amber-500/10 flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
                  <Award className="w-8 h-8 text-amber-500" />
                </div>
                <h4 className="text-lg font-bold text-amber-400 mb-2">{activeAward ? activeAward.name : "Premiação do Mês"}</h4>
                <div className="text-sm text-white/60 mb-6 px-4">
                  {activeAward ? activeAward.description : (
                    <p>Nenhuma premiação ativa no momento. Participe e aguarde as próximas novidades!</p>
                  )}
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold font-mono" />
              </GlassCard>
            </>
          )}
      </motion.section>

      {/* FRASES DO MULTIVERSO - CTA */}
      <motion.section variants={item} id="frases">
        <Link href={canSeePhrases ? "/home/frases" : "/home/planos"}>
          <GlassCard className={`p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 to-indigo-500/5 group hover:from-primary/20 hover:to-indigo-500/10 transition-all border-primary/20 cursor-pointer overflow-hidden relative ${!canSeePhrases ? 'opacity-80 grayscale-[0.5]' : ''}`}>
            {!canSeePhrases && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center flex-col gap-3">
                <Lock className="w-8 h-8 text-white/50" />
                <p className="text-white font-bold text-sm tracking-widest uppercase">Conteúdo Bloqueado</p>
              </div>
            )}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-primary/30" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Quote className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase leading-none">
                  Frases do <span className="text-primary text-glow-primary">Multiverso</span>
                </h3>
                <p className="text-white/40 text-xs font-medium max-w-md leading-relaxed">
                  Compartilhe e interaja com os trechos que mais marcaram sua leitura hoje. Participe da comunidade literária!
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="flex -space-x-3">
                  {phrases.slice(0, 3).map((p: any, i: number) => (
                    <Avatar key={i} className="w-10 h-10 border-2 border-black ring-4 ring-white/5">
                      <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                        {p.fullname?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="w-10 h-10 border-2 border-black bg-white/5 rounded-full flex items-center justify-center text-[10px] font-bold text-white/40 backdrop-blur-sm">
                    +{Math.max(0, phrases.length - 3)}
                  </div>
                </div>
                <Button className="bg-white text-black hover:bg-white/90 rounded-xl font-bold px-6 h-11 flex items-center gap-2 group-hover:translate-y-[-2px] transition-all">
                  {canSeePhrases ? "VER TODAS AS FRASES" : "LIBERAR RECURSO"}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </GlassCard>
        </Link>
      </motion.section>

    </motion.div>
  );
}
