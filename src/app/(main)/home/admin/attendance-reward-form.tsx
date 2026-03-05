"use client";

import React, { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Award, Target, Zap, Trash2, Plus, Clock, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AdminAttendanceRewardForm() {
  const [isPending, startTransition] = useTransition();
  const [rewards, setRewards] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    required_meetings: 3,
    bonus_points: 50,
  });

  useEffect(() => { loadRewards(); }, []);

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
        toast.success("Recompensa criada!");
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
    <div className="space-y-8">
      {/* Form */}
      <div className="bg-white/[0.025] border border-white/8 rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                <Award className="w-3 h-3 text-emerald-400" /> Nome da Recompensa
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Assíduo do Mês"
                className="focus:border-emerald-500/35"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Descrição Curta</label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Ex: Ganhe bônus ao participar de encontros"
                className="focus:border-emerald-500/35"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                <Users className="w-3 h-3 text-amber-500" /> Mínimo de Encontros
              </label>
              <Input
                type="number"
                min={1}
                value={form.required_meetings}
                onChange={(e) => setForm({ ...form, required_meetings: Number(e.target.value) })}
                className="focus:border-amber-500/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                <Zap className="w-3 h-3 text-emerald-400" /> Bônus em Pontos
              </label>
              <Input
                type="number"
                min={0}
                value={form.bonus_points}
                onChange={(e) => setForm({ ...form, bonus_points: Number(e.target.value) })}
                className="focus:border-emerald-500/40"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending || !form.name.trim()}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] gap-2 cursor-pointer transition-all shadow-lg shadow-primary/20"
          >
            {isPending ? <Clock className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {isPending ? "Criando..." : "Criar Recompensa"}
          </Button>
        </form>
      </div>

      {/* List */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.25em]">Regras de Presença Atuais</p>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {rewards.map((reward: any) => (
              <motion.div
                key={reward.id_reward}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${!reward.is_active ? 'opacity-35 grayscale bg-white/[0.01] border-white/5' : 'bg-white/[0.025] border-white/8 hover:border-white/15'
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${reward.is_active ? 'bg-emerald-500/15' : 'bg-white/5'}`}>
                  <Award className={`w-5 h-5 ${reward.is_active ? 'text-emerald-400' : 'text-white/25'}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-white truncate">{reward.name}</p>
                    {!reward.is_active && <span className="text-[8px] bg-white/5 text-white/40 px-1.5 py-0.5 rounded-full uppercase font-black tracking-widest">Inativo</span>}
                  </div>
                  <p className="text-[10px] text-white/30 mt-0.5 uppercase tracking-wider font-medium">
                    {reward.required_meetings} encontros · +{reward.bonus_points} pts
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(reward.id_reward, reward.is_active)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${reward.is_active ? "text-white/40 hover:text-white" : "text-emerald-400 bg-emerald-500/10"
                      }`}
                  >
                    {reward.is_active ? "Desativar" : "Ativar"}
                  </button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2.5 text-white/10 hover:text-red-400 hover:bg-red-400/10 rounded-xl cursor-pointer transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#0d0f2b] border-white/10 text-white rounded-3xl shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black uppercase tracking-tighter">Excluir regra?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/40 font-medium">
                          A regra "{reward.name}" será removida permanentemente do sistema.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-none h-11 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(reward.id_reward)} className="bg-red-500/10 hover:bg-red-500 text-red-100 h-11 rounded-xl border border-red-500/20 text-xs font-bold uppercase tracking-widest cursor-pointer">
                          Confirmar Exclusão
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {rewards.length === 0 && (
            <div className="py-20 text-center border border-dashed border-white/8 rounded-3xl">
              <Target className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="text-xs text-white/20 font-black uppercase tracking-widest">Nenhuma regra de presença</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
