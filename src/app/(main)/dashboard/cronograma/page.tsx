import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readCurrentTimelineAction, readAllTimelinesAction } from "@/actions/dashboard";
import { GlassCard } from "@/components/glass-card";
import { Calendar, BookOpen, User, Clock } from "lucide-react";

export default async function CronogramaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [currentRes, allRes] = await Promise.all([
    readCurrentTimelineAction(),
    readAllTimelinesAction(),
  ]);

  const currentTimeline = (currentRes as any).success ? (currentRes as any).data : null;
  const allTimelines = (allRes as any).success ? (allRes as any).data : [];

  return (
    <div className="min-h-screen px-6 lg:px-12 py-10">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-primary mb-1">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Leitura Mensal</span>
        </div>
        <h1 className="text-3xl font-bold">Cronograma de Leitura</h1>
        <p className="text-white/40 text-sm">Acompanhe o ritmo de leitura e discussões do Multiverso</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Cronograma Atual */}
          <GlassCard className="p-8 rounded-3xl border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32 transition-colors group-hover:bg-primary/20" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-48 aspect-[3/4] bg-white/5 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center relative">
                  <BookOpen className="w-12 h-12 text-white/20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="flex-1 space-y-6">
                  {currentTimeline ? (
                    <>
                      <div>
                        <h2 className="text-3xl font-bold">{currentTimeline.name}</h2>
                        <p className="text-white/50 flex items-center gap-2 mt-1">
                          <User className="w-4 h-4" /> {currentTimeline.author}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Início</p>
                          <p className="font-bold">{new Date(currentTimeline.date_start).toLocaleDateString()}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Término</p>
                          <p className="font-bold">{new Date(currentTimeline.date_end).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/40">Progresso Esperado</span>
                          <span className="text-primary font-bold">45%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[45%]" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-white/30 italic">Nenhum cronograma ativo no momento.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Calendário Simplificado de Eventos */}
          <div className="space-y-4 text-center">
            <p className="text-white/30 text-xs py-10">Interface de calendário detalhado em desenvolvimento para a Fase 2.</p>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-sm font-bold text-white/30 uppercase tracking-widest px-2">Histórico</h4>
          <div className="grid gap-4">
            {allTimelines.map((t: any) => (
              <GlassCard key={t.id_timeline} className="p-4 rounded-2xl border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-primary group-hover:border-primary/50 transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className="text-[10px] text-white/40">{new Date(t.date_start).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Clock className="w-4 h-4 text-white/20" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
