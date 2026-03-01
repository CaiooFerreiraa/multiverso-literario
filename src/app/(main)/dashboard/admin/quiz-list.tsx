"use client";

import React, { useTransition } from "react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { deleteQuizAction, toggleQuizStatusAction } from "@/actions/admin";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trash2, Ticket, BookOpen, Edit2 } from "lucide-react";

interface QuizListProps {
  quizzes: any[];
  onEdit?: (quiz: any) => void;
}

export function AdminQuizList({ quizzes, onEdit }: QuizListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este quiz?")) return;

    startTransition(async () => {
      const res = await deleteQuizAction(id);
      if (res.success) {
        toast.success("Quiz excluído!");
      } else {
        toast.error("Erro ao excluir: " + res.error);
      }
    });
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
    startTransition(async () => {
      const res = await toggleQuizStatusAction(id, newStatus);
      if (res.success) {
        toast.success(`Quiz ${newStatus === 'ativo' ? 'ativado' : 'desativado'}!`);
      } else {
        toast.error("Erro ao alterar status: " + res.error);
      }
    });
  };

  return (
    <div className="grid gap-3">
      {quizzes.map((q: any) => (
        <GlassCard key={q.id_quiz} className="p-4 rounded-xl flex items-center justify-between border-white/5 hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">{q.tittle || q.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <BookOpen className="w-3 h-3 text-white/40" />
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{q.name_book}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={q.statement === 'ativo' ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/30"}>
              {q.statement === 'ativo' ? "ATIVO" : "INATIVO"}
            </Badge>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(q)}
                title="Editar Quiz"
                className="text-white/20 hover:text-primary cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToggleStatus(q.id_quiz, q.statement)}
                disabled={isPending}
                title={q.statement === 'ativo' ? "Finalizar/Desativar" : "Ativar Quiz"}
                className={`cursor-pointer ${q.statement === 'ativo' ? 'text-white/20 hover:text-amber-400' : 'text-primary'}`}
              >
                {q.statement === 'ativo' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(q.id_quiz)}
                disabled={isPending}
                className="text-white/20 hover:text-red-400 hover:bg-red-400/10 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      ))}

      {quizzes.length === 0 && (
        <div className="py-10 text-center opacity-40 italic text-sm">Nenhum quiz registrado.</div>
      )}
    </div>
  );
}
