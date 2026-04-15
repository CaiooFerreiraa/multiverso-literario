"use client";

import React, { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  createChallengeAction,
  deleteChallengeAction,
  grantManualPointsAction,
  readAllChallengesAction as listChallengesAction,
  readUsersForManualPointsAction,
} from "@/actions/challenges";
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
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Plus, Trophy, Trash2, Clock, Gamepad2, UserCheck, Award } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminChallengesForm() {
  const [isPending, startTransition] = useTransition();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    points: 0,
    challenge_type: "daily",
    is_premium: false,
  });
  const [manualPoints, setManualPoints] = useState({
    id_user: "",
    title: "Desafio presencial",
    description: "",
    points: 0,
  });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const [challengesRes, usersRes] = await Promise.all([
      listChallengesAction(),
      readUsersForManualPointsAction(),
    ]);

    if (challengesRes.success) setChallenges(challengesRes.data as any[]);
    if (usersRes.success) setUsers(usersRes.data as any[]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChallenge.title || newChallenge.points <= 0) {
      toast.error("Preencha o título e uma pontuação válida");
      return;
    }

    startTransition(async () => {
      const res = await createChallengeAction(newChallenge);
      if (res.success) {
        toast.success("Desafio criado!");
        setNewChallenge({ title: "", description: "", points: 0, challenge_type: "daily", is_premium: false });
        loadData();
      } else {
        toast.error("Erro: " + res.error);
      }
    });
  };

  const handleManualPointsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPoints.id_user || manualPoints.points <= 0 || !manualPoints.title.trim()) {
      toast.error("Selecione o usuário, o motivo e a pontuação");
      return;
    }

    startTransition(async () => {
      const res = await grantManualPointsAction({
        id_user: Number(manualPoints.id_user),
        title: manualPoints.title,
        description: manualPoints.description,
        points: manualPoints.points,
      });

      if (res.success) {
        toast.success("Pontuação lançada!");
        setManualPoints({ id_user: "", title: "Desafio presencial", description: "", points: 0 });
        loadData();
      } else {
        toast.error("Erro: " + res.error);
      }
    });
  };

  const handleDelete = async (id: number) => {
    const res = await deleteChallengeAction(id);
    if (res.success) {
      toast.success("Desafio removido");
      loadData();
    }
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="bg-white/[0.025] border border-white/8 rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                <Gamepad2 className="w-3 h-3 text-primary" /> Nome do Desafio
              </label>
              <Input
                value={newChallenge.title}
                onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })}
                placeholder="Ex: Leitor Ávido"
                className="focus:border-primary/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                  <Zap className="w-3 h-3 text-amber-500" /> Pontos
                </label>
                <Input
                  type="number"
                  value={newChallenge.points || ""}
                  onChange={e => setNewChallenge({ ...newChallenge, points: Number(e.target.value) })}
                  placeholder="50"
                  className="focus:border-amber-500/40 cursor-text"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Tipo</label>
                <Select
                  value={newChallenge.challenge_type}
                  onValueChange={(val) => setNewChallenge({ ...newChallenge, challenge_type: val })}
                >
                  <SelectTrigger className="focus:border-primary/40 cursor-pointer">
                    <SelectValue placeholder="Selecionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="interpretation">Interpretação</SelectItem>
                    <SelectItem value="escrita">Escrita com PDF</SelectItem>
                    <SelectItem value="time">Time com PDF</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Instruções (opcional)</label>
            <textarea
              value={newChallenge.description}
              onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })}
              placeholder="Descreva o que o usuário deve fazer..."
              rows={3}
              className="resize-none cursor-text"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm uppercase tracking-wider gap-2 cursor-pointer transition-all shadow-lg shadow-primary/20"
          >
            {isPending ? <Clock className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Criar Desafio
          </Button>
        </form>
      </div>

      <div className="bg-white/[0.025] border border-emerald-500/10 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Pontuação Manual</h3>
            <p className="text-xs text-white/30">Use para desafios extras presenciais e atividades fora da plataforma.</p>
          </div>
        </div>

        <form onSubmit={handleManualPointsSubmit} className="flex flex-col gap-6">
          <div className="grid md:grid-cols-[1.4fr_1fr_0.7fr] gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                <UserCheck className="w-3 h-3 text-emerald-400" /> Usuário
              </label>
              <Select
                value={manualPoints.id_user}
                onValueChange={(value: string) => setManualPoints({ ...manualPoints, id_user: value })}
              >
                <SelectTrigger className="focus:border-emerald-500/40 cursor-pointer">
                  <SelectValue placeholder="Selecionar usuário" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user: any) => (
                    <SelectItem key={user.id_user} value={String(user.id_user)}>
                      {user.name || user.email || `Usuário #${user.id_user}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Motivo</label>
              <Input
                value={manualPoints.title}
                onChange={(e) => setManualPoints({ ...manualPoints, title: e.target.value })}
                placeholder="Ex: Encontro presencial"
                className="focus:border-emerald-500/40 cursor-text"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Pontos</label>
              <Input
                type="number"
                min={1}
                value={manualPoints.points || ""}
                onChange={(e) => setManualPoints({ ...manualPoints, points: Number(e.target.value) })}
                placeholder="50"
                className="focus:border-emerald-500/40 cursor-text"
              />
            </div>
          </div>

          <textarea
            value={manualPoints.description}
            onChange={(e) => setManualPoints({ ...manualPoints, description: e.target.value })}
            placeholder="Observação opcional sobre a atividade presencial..."
            rows={2}
            className="resize-none cursor-text"
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider gap-2 cursor-pointer disabled:cursor-wait transition-all shadow-lg shadow-emerald-500/10"
          >
            {isPending ? <Clock className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Lançar Pontuação
          </Button>
        </form>
      </div>

      {/* List */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.25em]">Desafios Criados</p>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {challenges.map((ch: any) => (
              <motion.div
                key={ch.id_challenge}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-white/[0.025] hover:border-white/15 transition-all"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-primary/10">
                  <Zap className="w-4 h-4 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white truncate">{ch.title}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">
                    {ch.challenge_type === "manual" ? "Pontuação Manual" : ch.challenge_type} · {ch.points} pontos
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 text-amber-500 px-2 py-1 rounded-lg">
                    <Trophy className="w-3 h-3" />
                    <span className="text-[10px] font-black">{ch.points}</span>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 text-white/15 hover:text-red-400 hover:bg-red-400/10 rounded-lg cursor-pointer transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#0d0f2b] border-white/10 text-white rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir desafio?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/40">
                          Isso removerá "{ch.title}" permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-none hover:bg-white/10 cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(ch.id_challenge)} className="bg-red-500/10 hover:bg-red-500 text-red-100 hover:text-white border border-red-500/20 cursor-pointer">
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {challenges.length === 0 && (
            <div className="py-16 text-center border border-dashed border-white/8 rounded-2xl">
              <Zap className="w-7 h-7 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/20 font-medium">Nenhum desafio criado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
