"use client";

import React, { useState } from "react";
import { TimelineForm } from "./timeline-form";
import { AdminQuizForm } from "./quiz-form";
import { AdminAwardsForm } from "./awards-form";
import { AdminRoomsForm } from "./rooms-form";
import { AdminBookForm } from "./books-form";
import { AdminBookList } from "./books-list";
import { AdminTimelineList } from "./timeline-list";
import { AdminQuizList } from "./quiz-list";
import { AdminPlanForm } from "./plan-form";
import { AdminAttendanceRewardForm } from "./attendance-reward-form";
import { AdminChallengesForm } from "./challenges-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Ticket, Video, Trophy, Zap,
  LibraryBig, Award, Gift, CreditCard, ShieldAlert,
  Plus, Crown, Target,
} from "lucide-react";

interface AdminClientProps {
  timelines: any[];
  quizzes: any[];
  ranking: any[];
  books: any[];
}

const NAV_ITEMS = [
  { id: "timeline", label: "Cronogramas", icon: LayoutDashboard },
  { id: "quiz", label: "Quizzes", icon: Ticket },
  { id: "rooms", label: "Salas", icon: Video },
  { id: "challenges", label: "Desafios", icon: Zap },
  { id: "books", label: "Biblioteca", icon: LibraryBig },
  { id: "ranking", label: "Ranking", icon: Trophy },
  { id: "awards", label: "Premiações", icon: Gift },
  { id: "plans", label: "Planos", icon: CreditCard },
  { id: "attendance", label: "Presença", icon: Award },
] as const;

type TabId = typeof NAV_ITEMS[number]["id"];

function SectionHeader({ icon: Icon, title, description }: {
  icon: any; title: string; description: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">{title}</h2>
        <p className="text-xs text-white/30 font-medium tracking-wide">{description}</p>
      </div>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-12">
      <div className="h-px flex-1 bg-white/5" />
      <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">{label}</span>
      <div className="h-px flex-1 bg-white/5" />
    </div>
  );
}

export function AdminClient({ timelines, quizzes, ranking, books }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("timeline");
  const [editingTimeline, setEditingTimeline] = useState<any>(null);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);

  return (
    <div className="flex min-h-screen bg-transparent">

      {/* ── Sidebar (Desktop) ── */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/5 bg-black/20 backdrop-blur-md">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-black text-white uppercase tracking-tighter">Gestão</h1>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black">Multiverso</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] px-4 mb-4">Administrativo</p>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-300 cursor-pointer group relative overflow-hidden ${isActive
                  ? "bg-primary/20 text-white font-bold shadow-[0_4px_20px_rgba(109,40,217,0.2)]"
                  : "text-white/40 hover:text-white hover:bg-white/5 font-semibold"
                  }`}
              >
                <item.icon className={`w-5 h-5 transition-all duration-500 ${isActive ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(109,40,217,0.8)]" : "group-hover:scale-110 opacity-40 group-hover:opacity-100"}`} />
                <span className="flex-1 text-[13px] tracking-wide">{item.label}</span>
              </button>

            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Painel Online</span>
          </div>
        </div>
      </aside>

      {/* ── Content Area ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >

              {/* CRONOGRAMAS */}
              {activeTab === "timeline" && (
                <div>
                  <SectionHeader icon={LayoutDashboard} title="Cronogramas" description="Configure o livro principal e datas do mês vigente" />
                  <TimelineForm initialData={editingTimeline} onCancel={() => setEditingTimeline(null)} />
                  <Divider label="Histórico de Leitura" />
                  <AdminTimelineList timelines={timelines} onEdit={(t) => { setEditingTimeline(t); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
                </div>
              )}

              {/* QUIZZES */}
              {activeTab === "quiz" && (
                <div>
                  <SectionHeader icon={Ticket} title="Quizzes" description="Crie avaliações gamificadas sobre as leituras" />
                  <AdminQuizForm timelines={timelines} initialData={editingQuiz} onCancel={() => setEditingQuiz(null)} />
                  <Divider label="Quizzes Publicados" />
                  <AdminQuizList quizzes={quizzes} onEdit={(q) => { setEditingQuiz(q); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
                </div>
              )}

              {/* SALAS */}
              {activeTab === "rooms" && (
                <div>
                  <SectionHeader icon={Video} title="Encontros Meet" description="Agende vídeochamadas para debates ao vivo" />
                  <AdminRoomsForm />
                </div>
              )}

              {/* DESAFIOS */}
              {activeTab === "challenges" && (
                <div>
                  <SectionHeader icon={Zap} title="Missões Extras" description="Lançar desafios para engajamento da comunidade" />
                  <AdminChallengesForm />
                </div>
              )}

              {/* BIBLIOTECA */}
              {activeTab === "books" && (
                <div>
                  <SectionHeader icon={LibraryBig} title="Acervo Digital" description="Gerenciar livros, capas e links de PDF" />
                  <AdminBookForm onCancel={() => window.scrollTo(0, 0)} />
                  <Divider label="Títulos Cadastrados" />
                  <AdminBookList books={books} />
                </div>
              )}

              {/* RANKING */}
              {activeTab === "ranking" && (
                <div>
                  <div className="flex items-end justify-between mb-12">
                    <SectionHeader icon={Trophy} title="Elite Literária" description="Membros que mais acumularam conhecimento (pontos)" />
                    <div className="text-right pb-10">
                      <p className="text-3xl font-black text-amber-400 font-mono tracking-tighter">{ranking.length}</p>
                      <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Leitores Ativos</p>
                    </div>
                  </div>

                  {ranking.length > 0 ? (
                    <div className="space-y-16 py-10">
                      {/* PODIUM [3, 1, 0, 2, 4] -> 0 (1st) is in the middle */}
                      <div className="flex items-end justify-center gap-2 md:gap-4 lg:gap-8 min-h-[360px] relative">
                        {/* Background glow for 1st place */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

                        {[3, 1, 0, 2, 4].map((rankIndex) => {
                          const user = ranking[rankIndex];
                          if (!user) return <div key={rankIndex} className="flex-1 max-w-[120px]" />;

                          // Configs based on the RANK (0=1st, 1=2nd, etc)
                          const isFirst = rankIndex === 0;
                          const isSecond = rankIndex === 1;
                          const isThird = rankIndex === 2;

                          // The visual index in the [3, 1, 0, 2, 4] array for heights/colors
                          // 0 (rankIndex 3) = 4th place
                          // 1 (rankIndex 1) = 2nd place
                          // 2 (rankIndex 0) = 1st place
                          // 3 (rankIndex 2) = 3rd place
                          // 4 (rankIndex 4) = 5th place

                          const podiumConfigs: Record<number, { height: string; color: string; border: string; glow?: string }> = {
                            0: { height: "h-[300px]", color: "bg-gradient-to-t from-amber-500/20 to-amber-500/5", border: "border-amber-500/40", glow: "shadow-[0_0_40px_rgba(245,158,11,0.2)]" },
                            1: { height: "h-[240px]", color: "bg-slate-400/10", border: "border-slate-400/20" },
                            2: { height: "h-[200px]", color: "bg-orange-600/10", border: "border-orange-600/20" },
                            3: { height: "h-[160px]", color: "bg-white/[0.03]", border: "border-white/5" },
                            4: { height: "h-[140px]", color: "bg-white/[0.02]", border: "border-white/5" },
                          };

                          const config = podiumConfigs[rankIndex];

                          return (
                            <motion.div
                              key={user.id_user}
                              initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: [0.3, 0.1, 0, 0.2, 0.4][[3, 1, 0, 2, 4].indexOf(rankIndex)],
                                type: "spring", stiffness: 100
                              }}
                              className="flex-1 max-w-[160px] flex flex-col items-center gap-4 relative z-10"
                            >
                              {/* Rank Visual */}
                              <div className="relative group">
                                {isFirst && (
                                  <motion.div
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-10 left-1/2 -translate-x-1/2 z-20"
                                  >
                                    <Crown className="w-10 h-10 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] fill-amber-400/30" />
                                  </motion.div>
                                )}

                                <Avatar className={`w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 border-2 transition-transform duration-700 group-hover:scale-110 ${config.border} ${isFirst ? "ring-4 ring-amber-500/10" : ""}`}>
                                  <AvatarImage src={user.image} className="object-cover" />
                                  <AvatarFallback className="bg-primary/20 text-primary font-black text-xl">{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>

                                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-sm bg-[#060818] ${isFirst ? "text-amber-400 border-amber-500" : isSecond ? "text-slate-400 border-slate-500" : isThird ? "text-orange-500 border-orange-600" : "text-white/30 border-white/10"}`}>
                                  {rankIndex + 1}
                                </div>
                              </div>

                              {/* Info */}
                              <div className="text-center group">
                                <p className="font-black text-xs md:text-sm text-white truncate max-w-[140px] tracking-tight group-hover:text-primary transition-colors cursor-default">
                                  {user.name?.split(' ')[0]}
                                </p>
                                <div className={`mt-1 flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/5 border border-white/5 ${isFirst ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-white/40"}`}>
                                  <Zap className={`w-3 h-3 ${isFirst ? "fill-amber-400" : ""}`} />
                                  {user.total_points}
                                </div>
                              </div>

                              {/* Podium Column */}
                              <div className={`w-full rounded-t-3xl border-t border-x transition-all duration-1000 ${config.color} ${config.border} ${config.height} ${config.glow} relative`}>
                                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                                {isFirst && (
                                  <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-20">
                                    <Target className="w-8 h-8 text-amber-400" />
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* REST OF LIST */}
                      {ranking.length > 5 && (
                        <div className="mt-20">
                          <Divider label="Ascensão Literária" />
                          <div className="grid md:grid-cols-2 gap-3 pb-20">
                            {ranking.slice(5).map((user, i) => (
                              <motion.div
                                key={user.id_user}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                              >
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 bg-white/5 text-white/20 border border-white/5 group-hover:text-primary transition-colors">
                                  {i + 6}
                                </div>
                                <Avatar className="w-10 h-10 border border-white/10 shrink-0 shadow-lg shadow-black/40">
                                  <AvatarImage src={user.image} className="object-cover" />
                                  <AvatarFallback className="bg-primary/20 text-primary font-black text-xs">{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm text-white truncate">{user.name}</p>
                                  <p className="text-[10px] text-white/20 font-mono tracking-tighter">ID: {String(user.id_user).padStart(4, '0')}</p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-primary bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5">
                                  <Zap className="w-3.5 h-3.5 fill-current" />
                                  {user.total_points}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-24 text-center border border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.01]">
                      <Trophy className="w-10 h-10 text-white/10 mx-auto mb-4" />
                      <p className="text-sm font-bold text-white/20 uppercase tracking-[0.3em]">Nenhum registro no ranking</p>
                    </div>
                  )}
                </div>
              )}

              {/* PREMIAÇÕES */}
              {activeTab === "awards" && (
                <div>
                  <SectionHeader icon={Gift} title="Arsenal de Recompensas" description="Cadastrar e distribuir prêmios para os melhores leitores" />
                  <AdminAwardsForm timelines={timelines} />
                </div>
              )}

              {/* PLANOS */}
              {activeTab === "plans" && (
                <div>
                  <SectionHeader icon={CreditCard} title="Arquitetura de Planos" description="Definir valores, durações e permissões de acesso" />
                  <AdminPlanForm />
                </div>
              )}

              {/* PRESENÇA */}
              {activeTab === "attendance" && (
                <div>
                  <SectionHeader icon={Award} title="Honorários de Presença" description="Configurar bonificações por tempo em sala de aula" />
                  <AdminAttendanceRewardForm />
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
