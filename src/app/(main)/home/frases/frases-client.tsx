"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  Send,
  Heart,
  Share2,
  Trash2,
  Sparkles,
  UserCheck2,
  User,
  Loader2
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createPhraseAction, toggleLikePhraseAction, deletePhraseAction, readAllPhrasesAction } from "@/actions/phrases";

interface Phrase {
  id_phrases: number;
  description: string;
  fullname: string;
  user_image: string | null;
  likes_count: number;
  is_liked: boolean;
  created_at: string;
  id_user: number;
  is_autoral: boolean;
}

interface FrasesClientProps {
  initialPhrases: Phrase[];
  initialPagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  } | null;
  user: {
    id: number;
    name: string;
    image: string | null;
  };
}

export default function FrasesClient({ initialPhrases, initialPagination, user }: FrasesClientProps) {
  const [phrases, setPhrases] = useState<Phrase[]>(initialPhrases);
  const [pagination, setPagination] = useState(initialPagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [newPhrase, setNewPhrase] = useState("");
  const [isAutoral, setIsAutoral] = useState(false);
  const [showOnlyMyPhrases, setShowOnlyMyPhrases] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialPagination && initialPagination.currentPage < initialPagination.totalPages);

  const observerTarget = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; phraseId: number | null }>({
    isOpen: false,
    phraseId: null
  });

  const fetchPhrases = async (page: number, onlyMine: boolean, append = false) => {
    if (isLoadingData) return;
    setIsLoadingData(true);

    try {
      const res = await readAllPhrasesAction({
        currentUserId: user.id,
        page,
        limit: 12,
        onlyMine
      });

      if (res.success && res.data) {
        const newData = res.data as Phrase[];
        setPhrases(prev => append ? [...prev, ...newData] : newData);

        const pag = (res as any).pagination;
        setPagination(pag);
        setHasMore(pag.currentPage < pag.totalPages);
      }
    } catch (error) {
      console.error("Error fetching phrases:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoadingData) {
          setCurrentPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingData]);

  // Combined effect for filter and page changes
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      // If we already have initialPhrases and it's the first mount, don't refetch
      // unless we want to ensure freshness. For now, let's keep it consistent.
      return;
    }
    fetchPhrases(currentPage, showOnlyMyPhrases, currentPage > 1);
  }, [currentPage, showOnlyMyPhrases]);

  const handleFilterChange = (onlyMine: boolean) => {
    if (showOnlyMyPhrases === onlyMine) return;
    setShowOnlyMyPhrases(onlyMine);
    setCurrentPage(1);
    // The useEffect above will handle the fetchPhrases call
  };

  const handleAddPhrase = async () => {
    if (!newPhrase.trim()) return;

    startTransition(async () => {
      const result = await createPhraseAction({
        description: newPhrase,
        id_user: user.id,
        is_autoral: isAutoral,
      });

      if (result.success) {
        toast.success("Frase compartilhada!");
        const phraseData = result.data as any;
        const completePhrase: Phrase = {
          ...phraseData,
          fullname: user.name,
          user_image: user.image,
          likes_count: 0,
          is_liked: false,
          created_at: phraseData.created_at || new Date().toISOString(),
        };
        setPhrases(prev => [completePhrase, ...prev]);
        setNewPhrase("");
        setIsAutoral(false);
        const textarea = document.querySelector('textarea');
        if (textarea) textarea.style.height = 'auto';
      } else {
        toast.error("Erro ao compartilhar frase");
      }
    });
  };

  const handleToggleLike = async (id_phrase: number) => {
    setPhrases(prev => prev.map(p => {
      if (p.id_phrases === id_phrase) {
        return {
          ...p,
          is_liked: !p.is_liked,
          likes_count: p.is_liked ? Math.max(0, Number(p.likes_count) - 1) : Number(p.likes_count) + 1
        };
      }
      return p;
    }));

    const result = await toggleLikePhraseAction(id_phrase, user.id);
    if (!result.success) {
      toast.error("Erro ao registrar interação");
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteDialog({ isOpen: true, phraseId: id });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.phraseId) return;

    const id = deleteDialog.phraseId;
    setDeleteDialog({ isOpen: false, phraseId: null });

    startTransition(async () => {
      const result = await deletePhraseAction(id);
      if (result.success) {
        setPhrases(prev => prev.filter(p => p.id_phrases !== id));
        toast.success("Frase removida");
      } else {
        toast.error("Erro ao remover frase");
      }
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8">
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40 flex items-center justify-center md:justify-start gap-4">
            <Quote className="w-12 h-12 text-primary" />
            <span>Frases do <span className="text-primary">Multiverso</span></span>
          </h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] mt-3">Compartilhe suas reflexões e citações favoritas.</p>
        </div>
      </div>

      {/* Input Section */}
      <GlassCard className="p-1 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-primary/20 shadow-2xl relative overflow-hidden group">
        <div className="relative p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative flex-1">
              <textarea
                value={newPhrase}
                onChange={(e) => {
                  setNewPhrase(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                placeholder="Qual trecho te marcou hoje?"
                rows={1}
                className="w-full bg-transparent border-none rounded-2xl p-0 min-h-[40px] text-lg font-medium transition-all focus:ring-0 outline-none resize-none placeholder:text-white/20"
              />
            </div>
            <Button
              onClick={handleAddPhrase}
              disabled={isPending || !newPhrase.trim()}
              className="bg-primary hover:bg-primary/80 text-white rounded-2xl h-14 sm:w-48 font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span>PUBLICAR</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
            <Checkbox
              id="autoral"
              checked={isAutoral}
              onCheckedChange={(checked) => setIsAutoral(checked as boolean)}
              className="border-primary/50 text-white data-[state=checked]:bg-primary"
            />
            <Label htmlFor="autoral" className="text-[10px] font-black uppercase tracking-widest text-white/40 cursor-pointer flex items-center gap-2">
              <UserCheck2 className={`w-3.5 h-3.5 ${isAutoral ? "text-primary" : "text-white/10"}`} />
              Esta frase é de minha autoria
            </Label>
          </div>
        </div>
      </GlassCard>

      {/* Filter and Stats */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4">
        <div className="flex items-center gap-1 p-1 bg-white/[0.03] rounded-2xl border border-white/5 w-full md:w-[450px] h-14">
          <button
            onClick={() => handleFilterChange(false)}
            className={`flex-1 h-full rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${!showOnlyMyPhrases ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/30 hover:text-white"}`}
          >
            Explorar Tudo
          </button>
          <button
            onClick={() => handleFilterChange(true)}
            className={`flex-1 h-full rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${showOnlyMyPhrases ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/30 hover:text-white"}`}
          >
            Minhas Publicações
          </button>
        </div>

        <div className="flex items-center gap-4 px-6 h-14 rounded-2xl bg-white/[0.01] border border-white/5">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
            <span className="text-white">{phrases.length}</span> DE <span className="text-white">{pagination?.totalItems || 0}</span> REFLEXÕES
          </span>
        </div>
      </div>

      {/* Grid of Phrases */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap items-stretch gap-6 w-full"
      >
        {phrases.map((phrase) => {
          const isLong = phrase.description.length > 100;
          const isMedium = phrase.description.length > 50;

          return (
            <motion.div
              key={phrase.id_phrases}
              variants={item}
              initial="hidden"
              animate="show"
              layout
              className={`flex-grow shrink-0 min-w-[320px] ${isLong ? "basis-full" : isMedium ? "basis-1/2" : "basis-1/3"
                }`}
            >
              <GlassCard className="h-full p-8 rounded-[2rem] group hover:bg-white/[0.04] transition-all border-white/10 flex flex-col relative overflow-hidden min-h-[260px]">
                {/* Card Background Decoration */}
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/5 blur-[50px] pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 border border-white/10">
                      <AvatarImage src={phrase.user_image || ""} />
                      <AvatarFallback className="bg-primary/20 text-primary text-[8px] font-black">
                        {phrase.fullname?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-black text-[9px] uppercase tracking-widest text-white/40 group-hover:text-primary transition-colors truncate max-w-[120px]">
                      {phrase.fullname || 'Explorador'}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {phrase.is_autoral && (
                      <div className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest flex items-center gap-1">
                        <UserCheck2 className="w-2.5 h-2.5" />
                        Autoral
                      </div>
                    )}
                    {Number(phrase.id_user) === Number(user.id) && (
                      <button
                        onClick={() => handleDeleteClick(phrase.id_phrases)}
                        className="text-white/10 hover:text-red-400 hover:bg-red-400/10 rounded-full h-8 w-8 flex items-center justify-center cursor-pointer transition-all border border-transparent hover:border-red-400/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 relative mb-6">
                  {!phrase.is_autoral && <Quote className="absolute -left-4 -top-3 w-8 h-8 text-primary/10" />}
                  <p className={`text-lg font-bold leading-relaxed tracking-tight ${!phrase.is_autoral ? "italic text-white" : "text-white/80"}`}>
                    {!phrase.is_autoral ? `"${phrase.description}"` : phrase.description}
                  </p>
                </div>

                {/* Footer Stats & Actions */}
                <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
                  <button
                    onClick={() => handleToggleLike(phrase.id_phrases)}
                    className={`flex items-center gap-2 group/like transition-all ${phrase.is_liked ? "text-pink-500" : "text-white/30 hover:text-pink-400"} cursor-pointer font-black text-xs`}
                  >
                    <Heart className={`w-4 h-4 transition-transform group-hover/like:scale-125 ${phrase.is_liked ? "fill-current" : ""}`} />
                    <span>{phrase.likes_count}</span>
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(phrase.description);
                        toast.success("Copiado!");
                      } catch (err) {
                        const textArea = document.createElement("textarea");
                        textArea.value = phrase.description;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        textArea.remove();
                        toast.success("Copiado!");
                      }
                    }}
                    className="text-white/20 hover:text-primary transition-all cursor-pointer p-2 rounded-xl hover:bg-primary/10"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty States */}
      {
        phrases.length === 0 && !isLoadingData && (
          <div className="text-center py-32 bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-white/5">
            <Quote className="w-16 h-16 text-white/5 mx-auto mb-6" />
            <h3 className="text-lg font-bold text-white/30 uppercase tracking-widest">Aguardando inspiração</h3>
            <p className="text-white/10 text-[10px] mt-2 uppercase tracking-widest font-bold font-black">Seja o primeiro a publicar!</p>
          </div>
        )
      }

      {/* Sentinel for Scroll */}
      <div ref={observerTarget} className="h-20 w-full flex items-center justify-center mt-12">
        {hasMore && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Acessando novas reflexões...</p>
          </div>
        )}
        {!hasMore && phrases.length > 0 && (
          <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] py-10">Você chegou ao fim do multiverso</p>
        )}
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteDialog.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteDialog({ isOpen: false, phraseId: null })}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-[#12121e] border border-white/5 rounded-[2.5rem] p-10 overflow-hidden"
            >
              <div className="relative z-10 space-y-8 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto">
                  <Trash2 className="w-10 h-10 text-red-500" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black uppercase text-white tracking-tighter">REMOVER FRASE?</h3>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-loose">
                    Esta ação é permanente e não poderá ser desfeita.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={() => setDeleteDialog({ isOpen: false, phraseId: null })}
                    className="flex-1 bg-white/5 text-white/40 h-14 rounded-2xl font-black uppercase tracking-widest cursor-pointer"
                  >
                    CANCELAR
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-500 text-white h-14 rounded-2xl font-black uppercase tracking-widest cursor-pointer"
                  >
                    APAGAR
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
