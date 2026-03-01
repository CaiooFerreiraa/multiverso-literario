"use client";

import React, { useTransition } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  BookOpen,
  Crown,
  CreditCard,
  QrCode,
  Loader2,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { subscribeToPlanAction } from "@/actions/plans";
import { toast } from "sonner";
import Link from "next/link";

interface Props {
  user: { id: number; name: string; email: string };
  userPlan: any;
  availablePlans: any[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PlansClient({ user, userPlan, availablePlans }: Props) {
  const [isSubscribing, startSubscribeTransition] = useTransition();
  const [selectedPlan, setSelectedPlan] = React.useState<any>(availablePlans[0] || null);
  const isPremium = !!userPlan;

  const handleSubscribe = () => {
    if (isPremium || !selectedPlan) return;

    startSubscribeTransition(async () => {
      const result = await subscribeToPlanAction(user.id, selectedPlan.id_plan, Number(selectedPlan.value));
      if (result.success) {
        toast.success("Plano assinado com sucesso! Bem-vindo ao Multiverso Expandido.");
      } else {
        toast.error("Erro ao assinar plano: " + result.error);
      }
    });
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-12">
      <header className="sticky top-0 z-30 px-6 lg:px-12 py-6 bg-background/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="rounded-xl cursor-pointer lg:hidden">
              <Link href="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">Nossos Planos</h1>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Escolha sua jornada literária</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-16"
        >
          {/* COMPARATIVO DE PLANOS */}
          <motion.section variants={item}>
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary text-[10px] px-4">EXPANDA SEUS HORIZONTES</Badge>
              <h2 className="text-4xl font-black mb-4 tracking-tight">O Mundo Todo em uma Assinatura</h2>
              <p className="text-white/40 max-w-2xl mx-auto text-sm">
                Seja um leitor essencial ou expanda sua experiência com conteúdos exclusivos, salas VIP e certificações.
              </p>
            </div>

            <div className={`grid gap-8 max-w-6xl mx-auto ${availablePlans.length > 1 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
              {/* Essencial */}
              <GlassCard className={`p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden flex flex-col ${!isPremium ? "ring-2 ring-primary/30 bg-primary/5" : ""}`}>
                {!isPremium && (
                  <div className="absolute top-6 right-6">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                )}

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-white/60">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">Essencial</h4>
                    <p className="text-white/30 font-bold uppercase tracking-tighter text-sm">Gratuito para sempre</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-10">
                  <p className="text-xs font-bold text-white/20 uppercase tracking-widest">O que está incluso:</p>
                  {[
                    "Cronograma e livro do mês",
                    "Acesso às frases da comunidade",
                    "Quiz básico por livro",
                    "2 Desafios Literários mensais",
                    "Contribuições ilimitadas",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-white/60">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-white/20" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 text-white/40 cursor-default" disabled>
                  {isPremium ? "Plano Base" : "Seu Plano Atual"}
                </Button>
              </GlassCard>

              {/* Dinâmicos (Expandidos) */}
              {availablePlans.map((plan) => {
                const isActive = selectedPlan?.id_plan === plan.id_plan;
                const userHasThisPlan = userPlan?.id_plan === plan.id_plan;

                return (
                  <GlassCard
                    key={plan.id_plan}
                    onClick={() => !isPremium && setSelectedPlan(plan)}
                    className={`p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden flex flex-col group transition-all cursor-pointer ${userHasThisPlan ? "ring-2 ring-amber-500/30 bg-amber-500/5" :
                        isActive && !isPremium ? "ring-2 ring-amber-500/60 bg-amber-500/10" : "bg-gradient-to-b from-white/[0.02] to-transparent"
                      }`}
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-amber-500/10 transition-all duration-700" />

                    {(userHasThisPlan || isActive) && (
                      <div className="absolute top-6 right-6">
                        <CheckCircle2 className="w-5 h-5 text-amber-500" />
                      </div>
                    )}

                    <div className="flex items-center gap-4 mb-8 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                        <Crown className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold">{plan.title}</h4>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-amber-400">R$ {Number(plan.value).toFixed(2)}</span>
                          <span className="text-xs text-white/30 lowercase tracking-normal">/ {plan.duraction}d</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4 mb-10 relative z-10">
                      <p className="text-xs font-bold text-amber-500/40 uppercase tracking-widest">Recursos Premium:</p>
                      {plan.benefits && plan.benefits.map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 text-white/80">
                          <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-amber-500" />
                          </div>
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {userHasThisPlan ? (
                      <Button className="w-full h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 cursor-default" disabled>
                        Plano Ativo
                      </Button>
                    ) : (
                      <Button className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-black transition-all active:scale-[0.98] shadow-[0_10px_30px_rgba(245,158,11,0.2)] cursor-pointer" asChild>
                        <Link href="/dashboard/planos#checkout">Selecionar Plano</Link>
                      </Button>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          </motion.section>

          {/* CHECKOUT SECTION */}
          {!isPremium && selectedPlan && (
            <motion.section variants={item} id="checkout" className="scroll-mt-32">
              <div className="text-center mb-8">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" /> Checkout Seguro via Pix
                </h3>
              </div>

              <GlassCard className="max-w-4xl mx-auto p-8 md:p-12 rounded-[3rem] border-white/5 relative overflow-hidden group bg-emerald-500/[0.02]">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-2xl font-bold">Resumo da Assinatura</h4>
                      <p className="text-sm text-white/40">O acesso será liberado instantaneamente após a confirmação do pagamento.</p>
                    </div>

                    <div className="space-y-3 p-6 rounded-3xl bg-white/5 border border-white/5">
                      <div className="flex justify-between items-center pb-3 border-b border-white/5">
                        <span className="text-sm text-white/60">Plano {selectedPlan.title}</span>
                        <span className="text-sm font-bold text-white">R$ {Number(selectedPlan.value).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-black text-white">Total Hoje</span>
                        <span className="text-2xl font-black text-emerald-400">R$ {Number(selectedPlan.value).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-white/20 uppercase tracking-widest font-bold">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Pagamento 100% Criptografado
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center space-y-6">
                      <div className="w-48 h-48 bg-white p-4 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
                        <QrCode className="w-full h-full text-black" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-white/40 mb-3">Clique no código abaixo para copiar</p>
                        <Badge
                          variant="outline"
                          className="text-primary border-primary/20 bg-primary/5 uppercase tracking-[0.1em] font-mono py-2.5 px-6 rounded-xl cursor-copy hover:bg-primary/10 transition-colors text-[10px]"
                          onClick={() => {
                            navigator.clipboard.writeText("MULTIVERSO-PIX-PAYMENT-MOCK");
                            toast.info("Código Pix copiado!");
                          }}
                        >
                          MULTIVERSO-PIX-PAYMENT-MOCK
                        </Badge>
                      </div>
                    </div>

                    <Button
                      onClick={handleSubscribe}
                      disabled={isSubscribing}
                      className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-black rounded-2xl h-14 font-black transition-all active:scale-[0.98] shadow-[0_10px_40px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubscribing ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" /> Processando...
                        </div>
                      ) : (
                        "Já paguei, confirmar!"
                      )}
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.section>
          )}
        </motion.div>
      </main>
    </div>
  );
}
