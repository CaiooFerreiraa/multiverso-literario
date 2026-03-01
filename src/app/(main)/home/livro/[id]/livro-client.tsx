"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, MessageCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import { createContributionAction } from "@/actions/contributions";

interface Props {
  user: { id: number; name: string };
  bookId: number;
  contributions: any[];
}

export default function LivroClient({ user, bookId, contributions: initialContribs }: Props) {
  const [contributions, setContributions] = useState(initialContribs || []);
  const [newContrib, setNewContrib] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!newContrib.trim()) return;
    startTransition(async () => {
      const result = await createContributionAction({
        content: newContrib,
        id_user: user.id,
        id_timeline_book: bookId,
      });
      if (result.success) {
        setContributions([
          {
            id_contribution: result.data.id_contribution,
            content: newContrib,
            fullname: user.name,
            created_at: new Date().toISOString(),
          },
          ...contributions,
        ]);
        setNewContrib("");
      }
    });
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 px-6 lg:px-12 py-6 bg-background/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl cursor-pointer">
            <Link href="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-bold">Contribuições</h1>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">Compartilhe suas reflexões</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8 space-y-6">
        {/* Form */}
        <GlassCard className="p-6 rounded-2xl">
          <div className="flex items-start gap-4">
            <Avatar className="w-10 h-10 border border-white/10 shrink-0 mt-1">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <textarea
                value={newContrib}
                onChange={(e) => setNewContrib(e.target.value)}
                placeholder="O que você achou desse trecho? Compartilhe sua interpretação, análise ou conexão pessoal..."
                rows={3}
                className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/20 cursor-text"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={isPending || !newContrib.trim()}
                  className="bg-primary hover:bg-primary/80 rounded-xl h-10 px-6 gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isPending ? "Enviando..." : "Contribuir"}
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Contributions List */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
            <MessageCircle className="w-3.5 h-3.5" />
            {contributions.length} contribuições
          </p>

          <AnimatePresence>
            {contributions.map((contrib: any, i: number) => (
              <motion.div
                key={contrib.id_contribution || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.03 }}
              >
                <GlassCard className="p-6 rounded-2xl hover:bg-white/5 transition-colors">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 border border-white/10 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                        {(contrib.fullname || "A").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold">{contrib.fullname || "Anônimo"}</span>
                        <span className="text-[10px] text-white/20">
                          {contrib.created_at
                            ? new Date(contrib.created_at).toLocaleDateString("pt-BR")
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">{contrib.content}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>

          {contributions.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/30 text-sm">
                Nenhuma contribuição ainda. Seja o primeiro a compartilhar!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
