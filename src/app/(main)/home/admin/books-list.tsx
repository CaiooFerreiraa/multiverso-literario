"use client";

import React, { useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteBookAction } from "@/actions/admin";
import { toast } from "sonner";
import {
  Trash2,
  Book,
  Link as LinkIcon,
  CreditCard,
  Crown,
  ChevronRight,
  ExternalLink
} from "lucide-react";
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

interface AdminBookListProps {
  books: any[];
}

export function AdminBookList({ books }: AdminBookListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id_book: number) => {
    startTransition(async () => {
      const res = await deleteBookAction(id_book);
      if (res.success) {
        toast.success("Livro removido!");
      } else {
        toast.error(res.error || "Erro ao remover");
      }
    });
  };

  if (books.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-white/8 rounded-2xl">
        <Book className="w-8 h-8 text-white/10 mx-auto mb-3" />
        <p className="text-sm text-white/20 font-medium">Nenhum livro no acervo</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <AnimatePresence mode="popLayout">
        {books.map((book) => (
          <motion.div
            key={book.id_book}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex gap-4 p-4 rounded-xl border border-white/8 bg-white/[0.025] hover:border-white/15 transition-all group relative overflow-hidden"
          >
            {/* Mini Cover */}
            <div className="w-[70px] aspect-[2/3] rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0 relative">
              {book.cover_url ? (
                <img src={book.cover_url} alt={book.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Book className="w-4 h-4 text-white/10" />
                </div>
              )}
              {book.id_plan === 2 && (
                <div className="absolute top-1 right-1">
                  <Crown className="w-3 h-3 text-amber-400 fill-amber-400/20 shadow-sm" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <h4 className="font-bold text-sm text-white truncate pr-6">{book.name}</h4>
                <div className="flex gap-2 mt-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                    <CreditCard className="w-3 h-3 text-primary/40" />
                    {book.id_plan === 2 ? "Premium" : "Gratuito"}
                  </div>
                  {book.pdf_url && (
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest">
                      <LinkIcon className="w-3 h-3" />
                      PDF Ativo
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <a
                  href={book.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                >
                  Ver PDF <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={isPending}
                    className="p-1.5 text-white/15 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#0d0f2b] border-white/10 text-white rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover livro?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/40">
                      O livro "{book.name}" será removido do acervo permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/5 border-none hover:bg-white/10 cursor-pointer">Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(book.id_book)}
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
    </div>
  );
}
