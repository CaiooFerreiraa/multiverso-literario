"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Shield, Rocket, Search, Medal, Lock, CheckCircle2, Sparkles } from "lucide-react";

interface Achievement {
  id_seal: number;
  name: string;
  description: string;
  months_required: number;
  icon: string;
  awarded_at?: string;
}

interface AchievementsClientProps {
  achievements: Achievement[];
}

const iconMap: Record<string, any> = {
  "🔭": Search,
  "🚀": Rocket,
  "🛡️": Shield,
};

export function AchievementsClient({ achievements }: AchievementsClientProps) {
  return (
    <div className="space-y-8 mt-12">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Suas Conquistas
          </h3>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Selos de honra e tempo de casa</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
          <Medal className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-white/70">
            {achievements.filter(a => a.awarded_at).length} / {achievements.length} Coletados
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {achievements.map((achievement, idx) => {
          const Icon = iconMap[achievement.icon] || Star;
          const isAwarded = !!achievement.awarded_at;

          return (
            <motion.div
              key={achievement.id_seal}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard
                className={`relative group overflow-hidden p-6 rounded-[2rem] border-white/5 transition-all duration-500 ${isAwarded
                    ? "bg-gradient-to-br from-primary/20 to-indigo-500/5 border-primary/20 ring-1 ring-primary/20 scale-[1.02]"
                    : "opacity-40 grayscale hover:grayscale-0 hover:opacity-70"
                  }`}
              >
                {isAwarded && (
                  <div className="absolute top-0 right-0 p-4">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 ${isAwarded ? "bg-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]" : "bg-white/5"
                    }`}>
                    {isAwarded ? (
                      <Icon className="w-10 h-10 text-primary" />
                    ) : (
                      <Lock className="w-8 h-8 text-white/20" />
                    )}
                  </div>

                  <h4 className={`font-black uppercase tracking-tighter text-lg mb-1 ${isAwarded ? "text-white" : "text-white/40"}`}>
                    {achievement.name}
                  </h4>
                  <p className="text-xs text-white/40 leading-relaxed min-h-[40px] px-2 mb-4">
                    {achievement.description}
                  </p>

                  <div className="w-full pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <span className="text-[8px] text-white/30 uppercase font-bold tracking-widest">Requisito</span>
                      <span className="text-[10px] font-bold text-white/60">{achievement.months_required} Meses</span>
                    </div>
                    {isAwarded ? (
                      <div className="flex items-center gap-1 text-[9px] font-black text-primary uppercase bg-primary/10 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Resgatado
                      </div>
                    ) : (
                      <div className="text-[9px] font-black text-white/20 uppercase">Bloqueado</div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <GlassCard className="p-8 rounded-[2.5rem] bg-amber-500/5 border-amber-500/10 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-amber-500/20 transition-all duration-700" />
        <h4 className="text-lg font-bold text-amber-400 mb-2 flex items-center justify-center gap-2">
          Próximo Nível: Lendário 🐉
        </h4>
        <p className="text-sm text-white/50 max-w-md mx-auto">
          Mantenha sua jornada ativa no Multiverso. Novos selos e recompensas exclusivas são liberados conforme você evolui sua leitura.
        </p>
      </GlassCard>
    </div>
  );
}
