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
import { createAwardAction, readAwardsAction, toggleAwardStatusAction, deleteAwardAction } from "@/actions/admin/awards";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Gift,
  Calendar,
  Camera,
  Trash2,
  Plus,
  Zap,
  Clock,
  Target,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AwardsFormProps {
  timelines: any[];
}

export function AdminAwardsForm({ timelines }: AwardsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [awards, setAwards] = useState<any[]>([]);
  const [newAward, setNewAward] = useState({
    id_timeline_book: "none",
    name: "",
    description: "",
    image_url: "",
    target_rank: 1,
    deadline: "",
  });

  useEffect(() => { loadAwards(); }, []);

  async function loadAwards() {
    const res = await readAwardsAction();
    if (res.success) setAwards(res.data as any[]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAward.id_timeline_book === "none" || !newAward.name || !newAward.deadline) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    startTransition(async () => {
      const res = await createAwardAction({
        ...newAward,
        id_timeline_book: Number(newAward.id_timeline_book),
      });

      if (res.success) {
        toast.success("Prêmio criado!");
        setNewAward({
          id_timeline_book: "none",
          name: "",
          description: "",
          image_url: "",
          target_rank: 1,
          deadline: "",
        });
        loadAwards();
      } else {
        toast.error("Erro: " + res.error);
      }
    });
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    const res = await toggleAwardStatusAction(id, !currentStatus);
    if (res.success) {
      toast.success("Status atualizado!");
      loadAwards();
    }
  };

  const handleDeleteAward = async (id: number) => {
    const res = await deleteAwardAction(id);
    if (res.success) {
      toast.success("Prêmio excluído!");
      loadAwards();
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
                <Trophy className="w-3 h-3 text-amber-500" /> Título do Prêmio
              </label>
              <Input
                value={newAward.name}
                onChange={e => setNewAward({ ...newAward, name: e.target.value })}
                placeholder="Ex: Box de Livros"
                className="focus:border-amber-500/35"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                <Calendar className="w-3 h-3 text-primary" /> Cronograma vinculado
              </label>
              <Select
                value={newAward.id_timeline_book}
                onValueChange={(val) => setNewAward({ ...newAward, id_timeline_book: val })}
              >
                <SelectTrigger className="focus:border-primary/35">
                  <SelectValue placeholder="Vincular..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Vincular...</SelectItem>
                  {timelines.map(t => (
                    <SelectItem key={t.id_timeline} value={String(t.id_timeline)}>{t.name_book}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
              <Target className="w-3 h-3 text-emerald-400" /> Regras para ganhar
            </label>
            <Input
              value={newAward.description}
              onChange={e => setNewAward({ ...newAward, description: e.target.value })}
              placeholder="Ex: Reservado para o 1º colocado no ranking"
              className="focus:border-emerald-500/40"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                <Camera className="w-3 h-3 text-purple-400" /> URL da Imagem
              </label>
              <Input
                value={newAward.image_url}
                onChange={e => setNewAward({ ...newAward, image_url: e.target.value })}
                placeholder="https://..."
                className="text-xs font-mono focus:border-purple-500/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                <Clock className="w-3 h-3 text-rose-400" /> Data de Expiração
              </label>
              <Input
                type="datetime-local"
                value={newAward.deadline}
                onChange={e => setNewAward({ ...newAward, deadline: e.target.value })}
                className="[color-scheme:dark] focus:border-rose-500/40"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] gap-2 cursor-pointer transition-all shadow-lg shadow-primary/20"
          >
            {isPending ? <Zap className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Criar Prêmio
          </Button>
        </form>
      </div>

      {/* History */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.25em]">Histórico de Prêmios</p>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {awards.map((award: any) => (
              <motion.div
                key={award.id_award}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${!award.is_active ? 'opacity-35 grayscale bg-white/[0.01] border-white/5' : 'bg-white/[0.025] border-white/8 hover:border-white/15'
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${award.is_active ? 'bg-amber-500/15' : 'bg-white/5'}`}>
                  <Gift className={`w-5 h-5 ${award.is_active ? 'text-amber-500' : 'text-white/25'}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white truncate">{award.name}</p>
                  <p className="text-[10px] text-white/30 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis uppercase tracking-wider font-medium">
                    {award.book_name || "Geral"} · Vence em {new Date(award.deadline).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(award.id_award, award.is_active)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${award.is_active ? "text-white/40 hover:text-white" : "text-amber-400 bg-amber-500/10"
                      }`}
                  >
                    {award.is_active ? "Inativar" : "Reativar"}
                  </button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2.5 text-white/10 hover:text-red-400 hover:bg-red-400/10 rounded-xl cursor-pointer transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#0d0f2b] border-white/10 text-white rounded-3xl shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black uppercase tracking-tighter">Excluir prêmio?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/40 font-medium">
                          O prêmio "{award.name}" será removido permanentemente do sistema.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-none h-11 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteAward(award.id_award)} className="bg-red-500/10 hover:bg-red-500 text-red-100 h-11 rounded-xl border border-red-500/20 text-xs font-bold uppercase tracking-widest cursor-pointer">
                          Confirmar Exclusão
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {awards.length === 0 && (
            <div className="py-20 text-center border border-dashed border-white/8 rounded-3xl">
              <Trophy className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="text-xs text-white/20 font-black uppercase tracking-widest">Nenhum prêmio disponível</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
