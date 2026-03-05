"use client";

import React, { useTransition } from "react";
import { deleteQuizAction, toggleQuizStatusAction } from "@/actions/admin";
import { toast } from "sonner";
import { CheckCircle, XCircle, Trash2, Ticket, BookOpen, Edit2 } from "lucide-react";
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

interface QuizListProps {
  quizzes: any[];
  onEdit?: (quiz: any) => void;
}

export function AdminQuizList({ quizzes, onEdit }: QuizListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: number) => {
    startTransition(async () => {
      const res = await deleteQuizAction(id);
      if (res.success) {
        toast.success("Quiz removido!");
      } else {
        toast.error("Erro ao remover: " + res.error);
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
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {quizzes.map((q: any) => (
          <motion.div
            key={q.id_quiz}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${q.statement !== 'ativo' ? 'opacity-40 grayscale bg-white/[0.01] border-white/5' : 'bg-white/[0.025] border-white/8 hover:border-white/15'
              }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${q.statement === 'ativo' ? 'bg-indigo-500/10' : 'bg-white/5'}`}>
              <Ticket className={`w-5 h-5 ${q.statement === 'ativo' ? 'text-indigo-400' : 'text-white/20'}`} />
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-sm text-white truncate">{q.tittle || q.title}</h5>
              <div className="flex items-center gap-2 mt-0.5">
                <BookOpen className="w-3 h-3 text-white/20" />
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest truncate">{q.name_book || "Geral"}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleToggleStatus(q.id_quiz, q.statement)}
                disabled={isPending}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${q.statement === 'ativo' ? "text-white/40 hover:text-white" : "text-emerald-400 bg-emerald-500/10"
                  }`}
              >
                {q.statement === 'ativo' ? "Inativar" : "Ativar"}
              </button>

              <button
                onClick={() => onEdit?.(q)}
                className="p-2 text-white/20 hover:text-white rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={isPending}
                    className="p-2 text-white/15 hover:text-red-400 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#0d0f2b] border-white/10 text-white rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover quiz?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/40">
                      Isso removerá "{q.tittle || q.title}" e todas as perguntas vinculadas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/5 border-none hover:bg-white/10 cursor-pointer">Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(q.id_quiz)}
                      className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 cursor-pointer"
                    >
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {quizzes.length === 0 && (
        <div className="py-16 text-center border border-dashed border-white/8 rounded-2xl">
          <Ticket className="w-8 h-8 text-white/10 mx-auto mb-3" />
          <p className="text-sm text-white/20 font-medium">Nenhum quiz cadastrado</p>
        </div>
      )}
    </div>
  );
}
