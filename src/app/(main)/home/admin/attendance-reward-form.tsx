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
  createAttendanceRewardAction,
  listAttendanceRewardsAction,
  deleteAttendanceRewardAction,
  toggleAttendanceRewardAction,
} from "@/actions/attendance";
import * as LucideIcons from "lucide-react";

const Award = LucideIcons.Award as any;
const Users = LucideIcons.Users as any;
const Zap = LucideIcons.Zap as any;
const Trash2 = LucideIcons.Trash2 as any;
const CheckCircle2 = LucideIcons.CheckCircle2 as any;
const Target = LucideIcons.Target as any;
const Plus = LucideIcons.Plus as any;

export function AdminAttendanceRewardForm() {
  const [isPending, startTransition] = useTransition();
  const [rewards, setRewards] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    required_meetings: 3,
    bonus_points: 50,
  });

  useEffect(() => {
    loadRewards();
  }, []);

  async function loadRewards() {
    const res = await listAttendanceRewardsAction();
    if (res.success) setRewards(res.data as any[]);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.required_meetings < 1 || form.bonus_points < 1) {
      toast.error("Preencha todos os campos corretamente");
      return;
    }

    startTransition(async () => {
      const res = await createAttendanceRewardAction(form);
      if (res.success) {
        toast.success("Recompensa de presença criada!");
        setForm({ name: "", description: "", required_meetings: 3, bonus_points: 50 });
        loadRewards();
      } else {
        toast.error("Erro: " + res.error);
      }
    });
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    const res = await toggleAttendanceRewardAction(id, !currentStatus);
    if (res.success) {
      toast.success("Status atualizado!");
      loadRewards();
    }
  };

  const handleDelete = async (id: number) => {
    const res = await deleteAttendanceRewardAction(id);
    if (res.success) {
      toast.success("Recompensa excluída!");
      loadRewards();
    }
  };

  return (
    <div className="space-y-10">
      {/* Info Banner */}
      <GlassCard className="p-6 rounded-2xl border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-300 mb-1">Presença Premiada</h4>
            <p className="text-sm text-white/50 leading-relaxed">
              Configure recompensas automáticas por participação em encontros literários.
              Quando um usuário participar de <strong className="text-emerald-300">X encontros distintos</strong> (mínimo 1 minuto na sala),
              ele recebe automaticamente os pontos de bônus ao acessar o sistema.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
              Nome da Recompensa *
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Leitor Frequente Bronze"
              className="bg-white/5 border-white/10 h-11 cursor-text"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
              Descrição (Opcional)
            </label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ex: Participe de 3 encontros e ganhe bônus!"
              className="bg-white/5 border-white/10 h-11 cursor-text"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              Nº de Encontros Necessários *
            </label>
            <Input
              type="number"
              min={1}
              value={form.required_meetings}
              onChange={(e) => setForm({ ...form, required_meetings: Number(e.target.value) })}
              className="bg-white/5 border-white/10 h-11 font-bold text-amber-300 text-center w-32 cursor-text"
            />
            <p className="text-[10px] text-white/20">Participações distintas em salas (mínimo 1 min)</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Pontos de Bônus *
            </label>
            <Input
              type="number"
              min={1}
              value={form.bonus_points}
              onChange={(e) => setForm({ ...form, bonus_points: Number(e.target.value) })}
              className="bg-white/5 border-white/10 h-11 font-bold text-emerald-300 text-center w-32 cursor-text"
            />
            <p className="text-[10px] text-white/20">Pontos adicionados ao ranking do usuário</p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending || !form.name.trim()}
          className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold gap-2 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {isPending ? "Criando..." : "Criar Recompensa de Presença"}
        </Button>
      </form>

      {/* Rewards List */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
          <Award className="w-4 h-4" /> Recompensas Configuradas
        </h4>

        <div className="grid gap-3">
          {rewards.map((reward: any) => (
            <GlassCard
              key={reward.id_reward}
              className={`p-5 rounded-2xl border-white/5 transition-all ${!reward.is_active ? "opacity-40" : ""}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${reward.is_active
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-white/5 border-white/10"
                    }`}>
                    <Award className={`w-6 h-6 ${reward.is_active ? "text-emerald-400" : "text-white/20"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-bold">{reward.name}</h5>
                      <Badge className={reward.is_active ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/40"}>
                        {reward.is_active ? "ATIVA" : "INATIVA"}
                      </Badge>
                    </div>
                    {reward.description && (
                      <p className="text-xs text-white/40 mb-2">{reward.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <Target className="w-3 h-3 text-amber-400" />
                        {reward.required_meetings} encontros
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-emerald-400" />
                        +{reward.bonus_points} pontos
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3 h-3" />
                        {reward.total_claims || 0} resgates
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleToggle(reward.id_reward, reward.is_active)}
                    className={`rounded-xl border-white/10 hover:bg-white/5 cursor-pointer h-10 px-4 text-xs ${reward.is_active ? "text-white/60" : "text-emerald-400 font-bold"
                      }`}
                  >
                    {reward.is_active ? "Desativar" : "Ativar"}
                  </Button>
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
                        <AlertDialogTitle>Excluir recompensa?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/50">
                          Todos os resgates desta recompensa serão removidos. Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-none hover:bg-white/10 hover:text-white cursor-pointer">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(reward.id_reward)}
                          className="bg-red-500 hover:bg-red-600 cursor-pointer"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </GlassCard>
          ))}

          {rewards.length === 0 && (
            <div className="p-12 text-center border border-dashed border-white/5 rounded-3xl">
              <Award className="w-10 h-10 text-white/5 mx-auto mb-4" />
              <p className="text-white/20 text-sm">Nenhuma recompensa de presença configurada</p>
              <p className="text-white/10 text-xs mt-1">
                Crie recompensas para motivar a participação nos encontros
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
