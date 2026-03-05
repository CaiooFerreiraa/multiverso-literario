import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Calendar, BookOpen, Clock, ArrowRight } from "lucide-react";
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
import { deleteTimelineAction } from "@/actions/admin";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface TimelineListProps {
  timelines: any[];
  onEdit?: (timeline: any) => void;
}

export function AdminTimelineList({ timelines, onEdit }: TimelineListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: number) => {
    startTransition(async () => {
      const res = await deleteTimelineAction(id);
      if (res.success) {
        toast.success("Cronograma removido!");
      } else {
        toast.error("Erro ao remover: " + res.error);
      }
    });
  };

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {timelines.map((t: any) => (
          <motion.div
            key={t.id_timeline}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-white/[0.025] hover:border-white/15 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-violet-400" />
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-sm text-white truncate">{t.name_book}</h5>
              <p className="text-[10px] text-white/30 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3 h-3" /> {t.author_book}
              </p>
            </div>

            <div className="hidden md:block text-right px-4 shrink-0 border-x border-white/5 mx-4">
              <p className="text-[9px] text-white/20 uppercase font-bold tracking-widest mb-1">Período de Leitura</p>
              <div className="flex items-center gap-2 text-[10px] font-medium text-white/50">
                <span>{new Date(t.date_start).toLocaleDateString()}</span>
                <ArrowRight className="w-2.5 h-2.5 text-white/10" />
                <span>{new Date(t.date_end).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit?.(t)}
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
                    <AlertDialogTitle>Remover cronograma?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/40">
                      Isso removerá "{t.name_book}" e todos os registros vinculados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/5 border-none hover:bg-white/10 cursor-pointer">Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(t.id_timeline)}
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

      {timelines.length === 0 && (
        <div className="py-16 text-center border border-dashed border-white/8 rounded-2xl">
          <Calendar className="w-8 h-8 text-white/10 mx-auto mb-3" />
          <p className="text-sm text-white/20 font-medium">Nenhum cronograma cadastrado</p>
        </div>
      )}
    </div>
  );
}
