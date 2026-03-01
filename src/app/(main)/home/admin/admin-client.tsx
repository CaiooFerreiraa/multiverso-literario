"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/glass-card";
import { TimelineForm } from "./timeline-form";
import { AdminQuizForm } from "./quiz-form";
import { AdminAwardsForm } from "./awards-form";
import { AdminRoomsForm } from "./rooms-form";
import { AdminTimelineList } from "./timeline-list";
import { AdminQuizList } from "./quiz-list";
import { AdminPlanForm } from "./plan-form";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as LucideIcons from "lucide-react";

const LayoutDashboard = LucideIcons.LayoutDashboard as any;
const Ticket = LucideIcons.Ticket as any;
const Video = LucideIcons.Video as any;
const Trophy = LucideIcons.Trophy as any;
const Zap = LucideIcons.Zap as any;

interface AdminClientProps {
  timelines: any[];
  quizzes: any[];
  ranking: any[];
}

export function AdminClient({ timelines, quizzes, ranking }: AdminClientProps) {
  const [editingTimeline, setEditingTimeline] = useState<any>(null);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);

  return (
    <Tabs defaultValue="timeline" className="space-y-6">
      <TabsList className="bg-white/5 border border-white/10 p-1 h-14 rounded-2xl w-full md:w-auto flex flex-wrap">
        <TabsTrigger value="timeline" className="rounded-xl px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer">
          <LayoutDashboard className="w-4 h-4 mr-2" /> Cronogramas
        </TabsTrigger>
        <TabsTrigger value="quiz" className="rounded-xl px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer">
          <Ticket className="w-4 h-4 mr-2" /> Quizzes
        </TabsTrigger>
        <TabsTrigger value="rooms" className="rounded-xl px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer">
          <Video className="w-4 h-4 mr-2" /> Salas
        </TabsTrigger>
        <TabsTrigger value="ranking" className="rounded-xl px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer">
          <Trophy className="w-4 h-4 mr-2" /> Ranking
        </TabsTrigger>
        <TabsTrigger value="awards" className="rounded-xl px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer text-xs">
          <LucideIcons.Gift className="w-4 h-4 mr-2" /> Premiações
        </TabsTrigger>
        <TabsTrigger value="plans" className="rounded-xl px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer text-xs">
          <LucideIcons.CreditCard className="w-4 h-4 mr-2" /> Planos
        </TabsTrigger>
      </TabsList>

      <TabsContent value="timeline">
        <GlassCard className="p-8 rounded-3xl border-white/5 relative">
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-1">
              {editingTimeline ? "Editar Cronograma" : "Novo Cronograma do Mês"}
            </h3>
            <p className="text-sm text-white/40">Defina o livro atual e as datas de leitura para os membros</p>
          </div>
          <TimelineForm
            key={editingTimeline?.id_timeline || 'new'}
            initialData={editingTimeline}
            onCancel={() => setEditingTimeline(null)}
          />
        </GlassCard>

        <div className="mt-8">
          <h4 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Cronogramas Recentes</h4>
          <AdminTimelineList timelines={timelines} onEdit={(t) => {
            setEditingTimeline(t);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        </div>
      </TabsContent>

      <TabsContent value="quiz">
        <GlassCard className="p-8 rounded-3xl border-white/5">
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-1">
              {editingQuiz ? "Editar Quiz" : "Criar Quiz Interativo"}
            </h3>
            <p className="text-sm text-white/40">Adicione perguntas e alternativas sobre um livro específico</p>
          </div>
          <AdminQuizForm
            key={editingQuiz?.id_quiz || 'new-quiz'}
            timelines={timelines}
            initialData={editingQuiz}
            onCancel={() => setEditingQuiz(null)}
          />
        </GlassCard>

        <div className="mt-8">
          <h4 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Quizzes Existentes</h4>
          <AdminQuizList quizzes={quizzes} onEdit={(q) => {
            setEditingQuiz(q);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        </div>
      </TabsContent>

      <TabsContent value="rooms">
        <GlassCard className="p-8 rounded-3xl border-white/5">
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-1">Agendar Sala de Conversa</h3>
            <p className="text-sm text-white/40">
              Crie salas vinculadas ao livro do mês. A sala ficará disponível para os membros somente quando chegar a data e hora definida.
            </p>
          </div>
          <AdminRoomsForm />
        </GlassCard>
      </TabsContent>

      <TabsContent value="ranking">
        <GlassCard className="p-8 rounded-3xl border-white/5 h-full">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">Ranking de Pontuação</h3>
              <p className="text-sm text-white/40">Acompanhe os leitores com maior pontuação para premiar o vencedor</p>
            </div>
            <div className="text-right">
              <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 font-bold px-3 py-1">
                TOTAL: {ranking.length} LEITORES
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            {ranking.map((user, i) => (
              <div
                key={user.id_user}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 flex items-center justify-center font-black text-[10px] uppercase tracking-widest text-white/20">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </div>
                  <Avatar className="w-12 h-12 border border-white/10 shadow-lg">
                    <AvatarImage src={user.image} />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {user.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-white group-hover:text-primary transition-colors">{user.name}</p>
                    <p className="text-xs text-white/30 truncate max-w-[200px]">ID: {user.id_user}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full border border-amber-500/20">
                    <Zap className="w-4 h-4" />
                    <span className="font-bold text-lg">{user.total_points}</span>
                  </div>
                  <p className="text-[10px] text-white/30 mt-1 uppercase tracking-widest font-bold">pontos acumulados</p>
                </div>
              </div>
            ))}

            {ranking.length === 0 && (
              <div className="py-20 text-center text-white/10 font-bold uppercase tracking-[0.2em] text-[10px]">
                Nenhum ponto registrado no sistema até o momento.
              </div>
            )}
          </div>
        </GlassCard>
      </TabsContent>

      <TabsContent value="awards">
        <GlassCard className="p-8 rounded-3xl border-white/5">
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-1">Gerenciar Prêmios do Mês</h3>
            <p className="text-sm text-white/40">Defina prêmios físicos ou digitais para os melhores leitores do ranking</p>
          </div>
          <AdminAwardsForm timelines={timelines} />
        </GlassCard>
      </TabsContent>

      <TabsContent value="plans">
        <GlassCard className="p-8 rounded-3xl border-white/5">
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-1">Configurações de Assinatura</h3>
            <p className="text-sm text-white/40">Ajuste os valores e durações dos planos premium do sistema</p>
          </div>
          <AdminPlanForm />
        </GlassCard>
      </TabsContent>
    </Tabs>
  );
}
