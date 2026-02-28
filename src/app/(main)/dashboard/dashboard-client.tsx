"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
const BookOpen = LucideIcons.BookOpen as any;
const Calendar = LucideIcons.Calendar as any;
const Trophy = LucideIcons.Trophy as any;
const Star = LucideIcons.Star as any;
const Quote = LucideIcons.Quote as any;
const Sparkles = LucideIcons.Sparkles as any;
const Send = LucideIcons.Send as any;
const ChevronRight = LucideIcons.ChevronRight as any;
const Flame = LucideIcons.Flame as any;
const Shield = LucideIcons.Shield as any;
const Rocket = LucideIcons.Rocket as any;
const SearchIcon = LucideIcons.Search as any;
const Crown = LucideIcons.Crown as any;
const Zap = LucideIcons.Zap as any;
const MessageCircle = LucideIcons.MessageCircle as any;
const LogOut = LucideIcons.LogOut as any;
const Target = LucideIcons.Target as any;
const Award = LucideIcons.Award as any;
const ShieldAlert = LucideIcons.ShieldAlert as any;
import Link from "next/link";
import { createPhraseAction } from "@/actions/phrases";
import { signOut } from "next-auth/react";

interface DashboardProps {
  user: { id: number; name: string; email: string; isAdmin?: boolean; image?: string };
  currentTimeline: any;
  userPlan: any;
  seals: any[];
  userPoints: { total_points: number; challenges_completed: number };
  phrases: any[];
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

export default function DashboardClient({
  user,
  currentTimeline,
  userPlan,
  seals,
  userPoints,
  phrases: initialPhrases,
}: DashboardProps) {
  const [phrases, setPhrases] = useState(initialPhrases || []);
  const [newPhrase, setNewPhrase] = useState("");
  const [isPending, startTransition] = useTransition();
  const isPremium = !!userPlan;

  const handleAddPhrase = () => {
    if (!newPhrase.trim()) return;
    startTransition(async () => {
      const result = await createPhraseAction({
        description: newPhrase,
        id_user: user.id,
      });
      if (result.success) {
        setPhrases([
          { id_phrases: result.data.id_phrases, description: newPhrase, fullname: user.name },
          ...phrases,
        ]);
        setNewPhrase("");
      }
    });
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 p-8 border-r border-white/5 bg-black/20 backdrop-blur-md z-20">
        <div className="mb-12">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
            Multiverso
          </h1>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Literário</p>
        </div>

        <nav className="flex-1 space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-4 mb-3">Menu</p>
            {[
              { icon: BookOpen, label: "Dashboard", href: "/dashboard", active: true },
              { icon: MessageCircle, label: "Salas (Discord)", href: "/dashboard/salas" },
              { icon: Calendar, label: "Cronograma", href: "#cronograma" },
              { icon: Trophy, label: "Desafios", href: "#desafios" },
              { icon: Quote, label: "Frases", href: "#frases" },
              { icon: Star, label: "Planos", href: "#planos" },
              ...(user.isAdmin ? [{ icon: ShieldAlert, label: "Admin", href: "/dashboard/admin" }] : []),
            ].map((navItem, i) => (
              <Link key={i} href={navItem.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-4 h-11 rounded-xl px-4 transition-all duration-200 cursor-pointer ${navItem.active
                    ? "bg-primary/15 text-primary font-bold"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <navItem.icon className="w-[18px] h-[18px]" />
                  <span className="text-sm">{navItem.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-4">Seu Perfil</p>
            <Link href="/dashboard/perfil">
              <div className="flex items-center gap-3 px-4 hover:bg-white/5 py-2 rounded-xl transition-colors cursor-pointer group">
                <Avatar className="w-10 h-10 border border-white/20 group-hover:border-primary/50 transition-colors">
                  <AvatarImage src={user.image} />
                  <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-bold truncate max-w-[140px] group-hover:text-primary transition-colors">{user.name}</span>
                  <div className="flex items-center gap-1.5">
                    {isPremium ? (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[8px] px-1.5 py-0 h-4">
                        <Crown className="w-2.5 h-2.5 mr-0.5" /> EXPANDIDO
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[8px] border-white/10 px-1.5 py-0 h-4">
                        ESSENCIAL
                      </Badge>
                    )}
                  </div>
                  <span className="text-[9px] text-white/30 font-medium group-hover:text-white/60 transition-colors uppercase tracking-widest mt-1">Editar Perfil</span>
                </div>
              </div>
            </Link>
          </div>
        </nav>

        <div className="mt-auto space-y-4">
          <GlassCard className="p-4 rounded-2xl bg-primary/10 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white/90">
                {userPoints.total_points} pontos
              </span>
            </div>
            <p className="text-[10px] text-white/40">
              {userPoints.challenges_completed} desafios completados
            </p>
          </GlassCard>

          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full justify-start gap-4 h-12 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors px-4 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold uppercase tracking-wider text-xs">Sair</span>
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-6">
          <h1 className="text-xl font-bold">Multiverso</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold">{userPoints.total_points}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-400 cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="px-6 lg:px-12 py-4 pb-32 max-w-6xl w-full mx-auto space-y-10"
        >
          {/* HERO - Boas vindas */}
          <motion.section variants={item}>
            <GlassCard className="p-8 md:p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">
                  Bem-vindo de volta
                </p>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
                  Olá,{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-300">
                    {user.name.split(" ")[0]}
                  </span>
                  ! ✨
                </h2>
                <p className="text-white/50 text-sm max-w-lg">
                  Continue sua jornada pelo multiverso literário. Explore o livro do mês, complete desafios e compartilhe suas reflexões.
                </p>
              </div>
            </GlassCard>
          </motion.section>

          {/* CRONOGRAMA + LIVRO DO MÊS */}
          <motion.section variants={item} id="cronograma">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Livro do Mês
            </h3>
            {currentTimeline ? (
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
                          {new Date(currentTimeline.date_start).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="text-white/20">→</span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(currentTimeline.date_end).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3 flex-wrap">
                      <Button className="bg-primary hover:bg-primary/80 rounded-xl gap-2 h-10 px-5 cursor-pointer" asChild>
                        <Link href={`/dashboard/livro/${currentTimeline.id_timeline_book}`}>
                          <MessageCircle className="w-4 h-4" /> Contribuir
                        </Link>
                      </Button>
                      <Button variant="outline" className="rounded-xl border-white/10 h-10 px-5 cursor-pointer" asChild>
                        <Link href={`/dashboard/quiz`}>
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
              {/* Card de Pontos */}
              <GlassCard className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-600/5 border-amber-500/10">
                <Flame className="w-8 h-8 text-amber-400 mb-3" />
                <p className="text-3xl font-bold text-amber-300">{userPoints.total_points}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Pontos Acumulados</p>
              </GlassCard>

              {/* Card de Desafios */}
              <GlassCard className="p-6 rounded-2xl">
                <Trophy className="w-8 h-8 text-primary mb-3" />
                <p className="text-3xl font-bold">{userPoints.challenges_completed}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Desafios Completados</p>
              </GlassCard>

              {/* Card CTA */}
              <Link href="/dashboard/desafios">
                <GlassCard className="p-6 rounded-2xl h-full flex flex-col justify-between hover:bg-white/5 transition-all group cursor-pointer">
                  <Sparkles className="w-8 h-8 text-purple-400 mb-3" />
                  <div>
                    <p className="text-sm font-bold mb-1 group-hover:text-primary transition-colors">
                      Ver Desafios
                    </p>
                    <p className="text-[10px] text-white/40">
                      {isPremium ? "Acesso total a todos os desafios" : "2 desafios gratuitos disponíveis"}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 self-end mt-4 group-hover:text-primary transition-colors group-hover:translate-x-1" />
                </GlassCard>
              </Link>
            </div>
          </motion.section>

          {/* SELOS LITERÁRIOS */}
          <motion.section variants={item}>
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

          {/* FRASES DO MULTIVERSO */}
          <motion.section variants={item} id="frases">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Quote className="w-4 h-4" /> Frases do Multiverso
            </h3>

            <GlassCard className="p-6 rounded-2xl mb-4">
              <div className="flex gap-3">
                <Input
                  value={newPhrase}
                  onChange={(e) => setNewPhrase(e.target.value)}
                  placeholder="Compartilhe uma frase marcante do livro..."
                  className="bg-white/5 border-white/5 rounded-xl h-11 text-sm focus-visible:ring-primary/50"
                  onKeyDown={(e) => e.key === "Enter" && handleAddPhrase()}
                />
                <Button
                  onClick={handleAddPhrase}
                  disabled={isPending || !newPhrase.trim()}
                  className="bg-primary hover:bg-primary/80 rounded-xl h-11 px-5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </GlassCard>

            <div className="grid md:grid-cols-2 gap-3">
              <AnimatePresence>
                {phrases.slice(0, 6).map((phrase: any, i: number) => (
                  <motion.div
                    key={phrase.id_phrases || i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <GlassCard className="p-5 rounded-2xl hover:bg-white/5 transition-colors">
                      <Quote className="w-4 h-4 text-primary/40 mb-2" />
                      <p className="text-sm text-white/80 italic leading-relaxed mb-3">
                        &ldquo;{phrase.description}&rdquo;
                      </p>
                      <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">
                        — {phrase.fullname || "Anônimo"}
                      </p>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* PLANOS */}
          <motion.section variants={item} id="planos">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Star className="w-4 h-4" /> Planos
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Essencial */}
              <GlassCard className={`p-8 rounded-3xl ${!isPremium ? "ring-2 ring-primary/30" : ""}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white/60" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Essencial</h4>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">Gratuito</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    "Cronograma e livro do mês",
                    "Frases do Multiverso",
                    "Quiz",
                    "2 desafios de interpretação",
                    "Contribuições sobre o livro",
                    "Caixinha de perguntas",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {!isPremium && (
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                    Seu plano atual
                  </Badge>
                )}
              </GlassCard>

              {/* Expandido */}
              <GlassCard
                className={`p-8 rounded-3xl relative overflow-hidden ${isPremium ? "ring-2 ring-amber-500/30" : ""
                  }`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">Expandido</h4>
                      <p className="text-amber-400 font-bold">R$ 14,99<span className="text-[10px] text-white/30">/mês</span></p>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {[
                      "Tudo do plano Essencial",
                      "Desafios ilimitados",
                      "Códigos Literários",
                      "Sala do Autor",
                      "Biblioteca Expandida (PDFs & planners)",
                      "Selos Literários",
                      "Certificação Multiverso",
                      "2 encontros mensais exclusivos",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isPremium ? (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
                      <Crown className="w-3 h-3 mr-1" /> Seu plano atual
                    </Badge>
                  ) : (
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl h-12 font-bold cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                      <Crown className="w-4 h-4 mr-2" /> Assinar Expandido
                    </Button>
                  )}
                </div>
              </GlassCard>
            </div>
          </motion.section>
        </motion.div>

        {/* Mobile Bottom Tabs */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/5 z-50">
          <div className="flex justify-around py-2">
            {[
              { icon: BookOpen, label: "Home", href: "/dashboard" },
              { icon: MessageCircle, label: "Salas", href: "/dashboard/salas" },
              { icon: Trophy, label: "Desafios", href: "/dashboard/desafios" },
              { icon: Star, label: "Planos", href: "#planos" },
            ].map((tab, i) => (
              <Link key={i} href={tab.href}>
                <button className="flex flex-col items-center gap-0.5 px-4 py-2 text-white/40 hover:text-primary transition-colors cursor-pointer">
                  <tab.icon className="w-5 h-5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
                </button>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
