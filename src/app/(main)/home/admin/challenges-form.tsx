"use client";

import React, { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  createChallengeAction,
  readAllChallengesAction,
  deleteChallengeAction,
} from "@/actions/challenges";
import * as LucideIcons from "lucide-react";

const Trophy = LucideIcons.Trophy as any;
const Zap = LucideIcons.Zap as any;
const Trash2 = LucideIcons.Trash2 as any;
const Plus = LucideIcons.Plus as any;
const Star = LucideIcons.Star as any;
const LayoutList = LucideIcons.LayoutList as any;

export function AdminChallengesForm() {
  const [isPending, startTransition] = useTransition();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    points: 100,
    challenge_type: "manual",
    is_premium: false,
  });

  useEffect(() => {
    loadChallenges();
  }, []);

  async function loadChallenges() {
    const res = await readAllChallengesAction();
    if (res.success) setChallenges(res.data as any[]);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || form.points < 1) {
      toast.error("Preencha o título e os pontos corretamente");
      return;
    }

    startTransition(async () => {
      const res = await createChallengeAction(form);
      if (res.success) {
        toast.success("Desafios criado com sucesso!");
        setForm({ title: "", description: "", points: 100, challenge_type: "manual", is_premium: false });
        loadChallenges();
      } else {
        toast.error("Erro: " + res.error);
      }
    });
  };

  const handleDelete = async (id: number) => {
    const res = await deleteChallengeAction(id);
    if (res.success) {
      toast.success("Desafio excluído!");
      loadChallenges();
    }
  };

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
              Título do Desafio *
            </label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Ler o livro do mês em 15 dias"
              className="bg-white/5 border-white/10 h-11 cursor-text"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
              Tipo do Desafio
            </label>
            <select
              value={form.challenge_type}
              onChange={(e) => setForm({ ...form, challenge_type: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl h-11 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer text-white"
            >
              <option value="manual" className="bg-[#1a1a2e]">Manual / Comunitário</option>
              <option value="reading" className="bg-[#1a1a2e]">Leitura</option>
              <option value="event" className="bg-[#1a1a2e]">Evento Especial</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
            Descrição (Regras para completar)
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descreva o que o usuário deve fazer para ganhar os pontos..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/20 resize-none cursor-text"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Pontos de Recompensa *
            </label>
            <Input
              type="number"
              min={1}
              value={form.points}
              onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
              className="bg-white/5 border-white/10 h-11 font-bold text-amber-300 text-center w-32 cursor-text"
            />
          </div>

          <div className="space-y-2 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_premium"
                checked={form.is_premium}
                onChange={(e) => setForm({ ...form, is_premium: e.target.checked })}
                className="w-5 h-5 rounded border-white/10 bg-white/5 text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="is_premium" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                <Star className={`w-4 h-4 ${form.is_premium ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
                Desafio Premium (Exclusivo assinantes)
              </label>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending || !form.title.trim()}
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(109,40,217,0.3)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {isPending ? "Criando..." : "Cadastrar Novo Desafio"}
        </Button>
      </form>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
          <LayoutList className="w-4 h-4" /> Desafios Cadastrados
        </h4>

        <div className="grid gap-3">
          {challenges.map((challenge: any) => (
            <GlassCard
              key={challenge.id_challenge}
              className="p-5 rounded-2xl border-white/5 hover:bg-white/5 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${challenge.is_premium
                      ? "bg-amber-500/10 border-amber-500/20"
                      : "bg-white/5 border-white/10"
                    }`}>
                    <Trophy className={`w-6 h-6 ${challenge.is_premium ? "text-amber-400" : "text-white/20"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-bold">{challenge.title}</h5>
                      {challenge.is_premium && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-none px-1.5 h-4 text-[9px] font-bold">PREMIUM</Badge>
                      )}
                    </div>
                    {challenge.description && (
                      <p className="text-xs text-white/40 mb-2 line-clamp-1">{challenge.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5 text-amber-300">
                        <Zap className="w-3 h-3" />
                        {challenge.points} pontos
                      </span>
                      <span className="bg-white/5 px-2 py-0.5 rounded-full lowercase">{challenge.challenge_type}</span>
                    </div>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-400/10 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#0A0D28] border-white/5 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir desafio?</AlertDialogTitle>
                      <AlertDialogDescription className="text-white/50">
                        Essa ação removerá o desafio permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-white/5 border-none hover:bg-white/10 hover:text-white cursor-pointer">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(challenge.id_challenge)}
                        className="bg-red-500 hover:bg-red-600 cursor-pointer"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </GlassCard>
          ))}

          {challenges.length === 0 && (
            <div className="p-12 text-center border border-dashed border-white/5 rounded-3xl">
              <p className="text-white/20 text-sm italic">Nenhum desafio manual cadastrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
