import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GlassCard } from "@/components/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimelineForm } from "./timeline-form";
import { AdminQuizForm } from "./quiz-form";
import { readAllTimelinesAction } from "@/actions/admin";
import * as LucideIcons from "lucide-react";
const ShieldAlert = LucideIcons.ShieldAlert as any;
const LayoutDashboard = LucideIcons.LayoutDashboard as any;
const Ticket = LucideIcons.Ticket as any;
const MessageSquare = LucideIcons.MessageSquare as any;

export default async function AdminDashboardPage() {
  const session = await auth();

  // Basic security check (should ideally check role in DB, but for now checking if logged in)
  if (!session?.user) redirect("/login");

  // In a real scenario, we'd check if user.role === 'ADMIN'
  // const userData = await readUserAction(session.user.email!);
  // if (userData.data.role !== 'ADMIN') redirect("/dashboard");

  const timelinesRes = await readAllTimelinesAction();
  const timelines = (timelinesRes.success ? timelinesRes.data : []) as any[];

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
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1 h-14 rounded-2xl w-full md:w-auto">
            <TabsTrigger value="timeline" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Cronogramas
            </TabsTrigger>
            <TabsTrigger value="quiz" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer">
              <Ticket className="w-4 h-4 mr-2" /> Quizzes
            </TabsTrigger>
            <TabsTrigger value="content" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer">
              <MessageSquare className="w-4 h-4 mr-2" /> Conteúdo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <GlassCard className="p-8 rounded-3xl border-white/5">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-1">Novo Cronograma do Mês</h3>
                <p className="text-sm text-white/40">Defina o livro atual e as datas de leitura para os membros</p>
              </div>
              <TimelineForm />
            </GlassCard>

            <div className="mt-8">
              <h4 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Cronogramas Recentes</h4>
              <div className="grid gap-3">
                {(timelines || []).map((t: any) => (
                  <GlassCard key={t.id_timeline} className="p-4 rounded-xl flex items-center justify-between border-white/5 hover:bg-white/5 transition-colors">
                    <div>
                      <p className="font-bold">{t.name_book}</p>
                      <p className="text-xs text-white/40">por {t.author_book}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/30 uppercase">Período</p>
                      <p className="text-xs">{new Date(t.date_start).toLocaleDateString()} - {new Date(t.date_end).toLocaleDateString()}</p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quiz">
            <GlassCard className="p-8 rounded-3xl border-white/5">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-1">Criar Quiz Interativo</h3>
                <p className="text-sm text-white/40">Adicione perguntas e alternativas sobre um livro específico</p>
              </div>
              <AdminQuizForm timelines={timelines} />
            </GlassCard>
          </TabsContent>

          <TabsContent value="content">
            <GlassCard className="p-20 rounded-3xl text-center">
              <p className="text-white/30">Módulo de gestão de conteúdos (Biblioteca, Encontros) em desenvolvimento na Fase 2.</p>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
