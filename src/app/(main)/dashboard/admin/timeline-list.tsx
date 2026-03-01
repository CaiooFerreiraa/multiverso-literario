"use client";

import React, { useTransition } from "react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Calendar } from "lucide-react";
import { deleteTimelineAction } from "@/actions/admin";
import { toast } from "sonner";

interface TimelineListProps {
  timelines: any[];
  onEdit?: (timeline: any) => void;
}

export function AdminTimelineList({ timelines, onEdit }: TimelineListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este cronograma? Isso pode afetar dados relacionados.")) return;

    startTransition(async () => {
      const res = await deleteTimelineAction(id);
      if (res.success) {
        toast.success("Cronograma excluído!");
      } else {
        toast.error("Erro ao excluir: " + res.error);
      }
    });
  };

  return (
    <div className="grid gap-3">
      {timelines.map((t: any) => (
        <GlassCard key={t.id_timeline} className="p-4 rounded-xl flex items-center justify-between border-white/5 hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">{t.name_book}</p>
              <p className="text-xs text-white/40">por {t.author_book}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Período</p>
              <p className="text-xs">{new Date(t.date_start).toLocaleDateString()} - {new Date(t.date_end).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(t)}
                className="text-white/20 hover:text-primary hover:bg-primary/10 cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(t.id_timeline)}
                disabled={isPending}
                className="text-white/20 hover:text-red-400 hover:bg-red-400/10 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      ))}

      {timelines.length === 0 && (
        <div className="py-10 text-center opacity-40 italic text-sm">Nenhum cronograma registrado.</div>
      )}
    </div>
  );
}
