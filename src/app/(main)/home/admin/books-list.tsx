"use client";

import React, { useTransition } from "react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { deleteBookAction } from "@/actions/admin";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";
import Image from "next/image";

const Trash2 = LucideIcons.Trash2 as any;
const CheckCircle2 = LucideIcons.CheckCircle2 as any;

interface AdminBookListProps {
  books: any[];
}

export function AdminBookList({ books }: AdminBookListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id_book: number, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar o livro "${name}"? Essa ação não pode ser desfeita.`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteBookAction(id_book);
      if (res.success) {
        toast.success("Livro deletado com sucesso!");
      } else {
        toast.error(res.error || "Erro ao deletar livro");
      }
    });
  };

  if (books.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center bg-white/5 rounded-2xl border border-white/5">
        <LucideIcons.BookX className="w-12 h-12 text-white/20 mb-3" />
        <p className="text-white/40 text-sm">Nenhum livro cadastrado na biblioteca.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {books.map((book) => (
        <GlassCard key={book.id_book} className="p-4 rounded-2xl border-white/5 flex gap-4 relative overflow-hidden group">
          <div className="w-20 h-28 shrink-0 rounded-lg overflow-hidden relative bg-black/40 border border-white/10 hidden sm:block">
            {book.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={book.cover_url} alt={book.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 flex-col gap-2">
                <LucideIcons.Book className="w-6 h-6" />
                <span className="text-[8px] uppercase font-bold tracking-widest text-center px-2">Sem<br />Capa</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <h4 className="font-bold text-lg mb-1 truncate text-white group-hover:text-primary transition-colors">{book.name}</h4>

            <div className="space-y-2 mt-auto">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <LucideIcons.Link className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{book.pdf_url ? "Tem PDF" : "Sem PDF vinculado"}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/50">
                <LucideIcons.CreditCard className="w-3 h-3" />
                <span>Plano ID: {book.id_plan}</span>
              </div>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all">
              <Button
                variant="destructive"
                size="icon"
                className="w-8 h-8 rounded-full shadow-lg"
                onClick={() => handleDelete(book.id_book, book.name)}
                disabled={isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
