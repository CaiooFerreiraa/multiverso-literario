"use client";

import React, { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createAwardAction, readAwardsAction, toggleAwardStatusAction, deleteAwardAction } from "@/actions/admin/awards";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Gift, Calendar, Camera, Trash2, CheckCircle2 } from "lucide-react";

interface AwardsFormProps {
  timelines: any[];
}

export function AdminAwardsForm({ timelines }: AwardsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [awards, setAwards] = useState<any[]>([]);
  const [newAward, setNewAward] = useState({
    id_timeline_book: "",
    name: "",
    description: "",
    image_url: "",
    target_rank: 1,
    deadline: "",
  });

  useEffect(() => {
    loadAwards();
  }, []);

  async function loadAwards() {
    const res = await readAwardsAction();
    if (res.success) setAwards(res.data as any[]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAward.id_timeline_book || !newAward.name || !newAward.deadline) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    startTransition(async () => {
      const res = await createAwardAction({
        ...newAward,
        id_timeline_book: Number(newAward.id_timeline_book),
      });

      if (res.success) {
        toast.success("Prêmio criado com sucesso!");
        setNewAward({
          id_timeline_book: "",
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
    if (!confirm("Excluir este prêmio permanentemente?")) return;
    const res = await deleteAwardAction(id);
    if (res.success) {
      toast.success("Prêmio excluído!");
      loadAwards();
    }
  };

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2 text-sm text-white/40 uppercase tracking-widest font-bold">Configuração básica</div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nome do Prêmio</label>
          <Input
            value={newAward.name}
            onChange={e => setNewAward({ ...newAward, name: e.target.value })}
            placeholder="Ex: Box de Livros Luxo"
            className="bg-white/5 border-white/10 h-12"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Livro Relacionado</label>
          <select
            value={newAward.id_timeline_book}
            onChange={e => setNewAward({ ...newAward, id_timeline_book: e.target.value })}
            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none text-white"
          >
            <option value="" className="bg-zinc-900">Selecione um cronograma...</option>
            {timelines.map(t => (
              <option key={t.id_timeline} value={t.id_timeline} className="bg-zinc-900">{t.name_book}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Descrição / Regras</label>
          <Input
            value={newAward.description}
            onChange={e => setNewAward({ ...newAward, description: e.target.value })}
            placeholder="Ex: Válido para o 1º lugar no ranking global"
            className="bg-white/5 border-white/10 h-12"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">URL da Imagem (Opcional)</label>
          <Input
            value={newAward.image_url}
            onChange={e => setNewAward({ ...newAward, image_url: e.target.value })}
            placeholder="Link da foto do prêmio"
            className="bg-white/5 border-white/10 h-12"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Data Final (Deadline)</label>
          <Input
            type="datetime-local"
            value={newAward.deadline}
            onChange={e => setNewAward({ ...newAward, deadline: e.target.value })}
            className="bg-white/5 border-white/10 h-12 text-white"
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="md:col-span-2 bg-primary hover:bg-primary/80 h-12 rounded-xl font-bold cursor-pointer transition-all active:scale-[0.98]"
        >
          {isPending ? "Criando..." : "Lançar Novo Prêmio"}
        </Button>
      </form>

      <div className="space-y-6">
        <h4 className="text-sm font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
          <Gift className="w-4 h-4" /> Prêmios Ativos e Histórico
        </h4>

        <div className="grid gap-4">
          {awards.map((award: any) => (
            <GlassCard key={award.id_award} className={`p-6 rounded-3xl border-white/5 transition-all ${!award.is_active ? 'opacity-50' : ''}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${award.is_active ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/10'}`}>
                    <Trophy className={`w-7 h-7 ${award.is_active ? 'text-amber-500' : 'text-white/20'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h5 className="font-bold text-lg">{award.name}</h5>
                      <Badge className={award.is_active ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/40"}>
                        {award.is_active ? "ATIVO" : "FINALIZADO"}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/50">{award.book_name}</p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> FIM: {new Date(award.deadline).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> POSIÇÃO: #{award.target_rank}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleToggleStatus(award.id_award, award.is_active)}
                    className={`rounded-xl border-white/10 hover:bg-white/5 cursor-pointer h-11 px-4 ${award.is_active ? 'text-white/60' : 'text-primary font-bold'}`}
                  >
                    {award.is_active ? "Encerrar" : "Ativar"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAward(award.id_award)}
                    className="h-11 w-11 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-400/10 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}

          {awards.length === 0 && (
            <div className="p-12 text-center border border-dashed border-white/5 rounded-3xl">
              <p className="text-white/20 italic">Nenhum prêmio configurado ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
