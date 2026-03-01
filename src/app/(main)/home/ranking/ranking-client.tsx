"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

const Trophy = LucideIcons.Trophy as any;
const Zap = LucideIcons.Zap as any;
const Crown = LucideIcons.Crown as any;
const ArrowLeft = LucideIcons.ArrowLeft as any;
const Flame = LucideIcons.Flame as any;
const Sparkles = LucideIcons.Sparkles as any;
const Star = LucideIcons.Star as any;
const Medal = LucideIcons.Medal as any;

interface RankingPlayer {
  id_user: number;
  name: string;
  image: string | null;
  total_points: number;
}

interface RankingClientProps {
  ranking: RankingPlayer[];
  currentUser: { id: number; name: string };
}

export default function RankingClient({ ranking, currentUser }: RankingClientProps) {
  const top3 = ranking.slice(0, 3);
  const others = ranking.slice(3);

  // Reorder top3 for visual: [2, 1, 3] or standard [1, 2, 3]
  // Let's do a "Podium" view: 2nd (left), 1st (center), 3rd (right)
  const podiumOrder = [
    top3[1], // 2nd
    top3[0], // 1st
    top3[2], // 3rd
  ].filter(Boolean);

  return (
    <div className="min-h-screen py-10 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" asChild className="rounded-xl cursor-pointer">
              <Link href="/home">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                Ranking <span className="text-primary">Global</span>
              </h1>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold mt-1">A elite do multiverso literário</p>
            </div>
          </div>
          <GlassCard className="hidden md:flex items-center gap-3 px-5 py-2.5 rounded-full border-primary/20 bg-primary/5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold">Prêmio do Mês: Box de Luxo</span>
          </GlassCard>
        </header>

        {/* Podium - Top 3 */}
        {top3.length > 0 && (
          <div className="flex flex-col md:flex-row items-end justify-center gap-6 pt-20 pb-10">
            {podiumOrder.map((player, idx) => {
              const isFirst = player.id_user === top3[0].id_user;
              const isSecond = top3[1] && player.id_user === top3[1].id_user;
              const isThird = top3[2] && player.id_user === top3[2].id_user;

              const rank = isFirst ? 1 : isSecond ? 2 : 3;
              const height = isFirst ? "h-64" : isSecond ? "h-56" : "h-48";
              const color = isFirst ? "text-amber-400" : isSecond ? "text-slate-300" : "text-orange-400";
              const borderColor = isFirst ? "border-amber-400/30" : isSecond ? "border-slate-300/30" : "border-orange-400/30";

              return (
                <motion.div
                  key={player.id_user}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                      {isFirst && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                          >
                            <Crown className="w-10 h-10 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                          </motion.div>
                        </div>
                      )}
                      <Avatar className={`w-24 h-24 border-4 ${player.id_user === currentUser.id ? "border-primary" : borderColor} shadow-2xl`}>
                        <AvatarImage src={player.image || ""} />
                        <AvatarFallback className="bg-white/5 text-2xl font-black">{player.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black border ${borderColor} flex items-center justify-center font-black text-sm ${color}`}>
                        {rank}
                      </div>
                    </div>
                    <h3 className={`text-lg font-black truncate max-w-[150px] ${player.id_user === currentUser.id ? "text-primary" : "text-white"}`}>
                      {player.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      <Zap className={`w-3 h-3 ${color}`} />
                      <span className="text-xs font-bold text-white/60">{player.total_points} pts</span>
                    </div>
                  </div>

                  {/* The Podium Base */}
                  <GlassCard className={`w-40 ${height} hidden md:flex flex-col items-center justify-center rounded-t-3xl border-b-0 ${isFirst ? "bg-amber-400/5" : "bg-white/[0.02]"}`}>
                    <div className={`text-8xl font-black opacity-[0.03] select-none ${color}`}>{rank}</div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* List of others */}
        <div className="grid md:grid-cols-2 gap-4 pb-20">
          {others.map((player, i) => (
            <motion.div
              key={player.id_user}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all hover:bg-white/5 ${player.id_user === currentUser.id
                  ? "bg-primary/10 border-primary/20 ring-1 ring-primary/30"
                  : "bg-white/[0.01] border-white/5"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-black text-[10px] text-white/20 uppercase tracking-widest leading-none">
                    #{i + 4}
                  </div>
                  <Avatar className="w-10 h-10 border border-white/5">
                    <AvatarImage src={player.image || ""} />
                    <AvatarFallback className="bg-white/5 text-xs font-bold">{player.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${player.id_user === currentUser.id ? "text-primary" : "text-white/80"}`}>
                      {player.name}
                    </span>
                    <span className="text-[10px] text-white/30 truncate max-w-[120px]">
                      Membro Especialista
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-sm font-black text-white">{player.total_points}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {ranking.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <Trophy className="w-16 h-16 text-white/10 mx-auto" />
            <h3 className="text-xl font-bold text-white/40">O ranking começará em breve</h3>
            <p className="text-white/20 text-sm">Responda aos quizzes e complete os desafios para sua pontuação aparecer aqui!</p>
          </div>
        )}
      </div>
    </div>
  );
}
