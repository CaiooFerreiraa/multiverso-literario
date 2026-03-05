"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book, Image as ImageIcon, Link as LinkIcon, Loader2, Plus, Search, X } from "lucide-react";
import { createBookAction } from "@/actions/admin";
import { toast } from "sonner";

interface BookFormProps {
  onCancel: () => void;
}

export function AdminBookForm({ onCancel }: BookFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    pdf_url: "",
    cover_url: "",
    id_plan: "1"
  });
  const [isSearchingImage, setIsSearchingImage] = useState(false);

  const transformPdfUrl = (url: string) => {
    if (url.includes("drive.google.com/file/d/")) {
      const match = url.match(/file\/d\/([^/]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    return url;
  };

  const handleSearchCover = async () => {
    if (!formData.name) {
      toast.error("Digite o nome do livro primeiro");
      return;
    }
    setIsSearchingImage(true);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(formData.name)}&limit=1`);
      const data = await res.json();

      if (data.docs && data.docs.length > 0 && data.docs[0].cover_i) {
        const coverId = data.docs[0].cover_i;
        const imageUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;

        setFormData(prev => ({ ...prev, cover_url: imageUrl }));
        toast.success("Capa encontrada na Open Library!");
      } else {
        toast.error("Capa não encontrada na Open Library");
      }
    } catch (error) {
      console.error("Erro ao buscar capa", error);
      toast.error("Falha ao pesquisar capa na Open Library");
    } finally {
      setIsSearchingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("O título do livro é obrigatório.");
      return;
    }

    const finalUrl = transformPdfUrl(formData.pdf_url);

    startTransition(async () => {
      const res = await createBookAction({
        name: formData.name,
        pdf_url: finalUrl,
        cover_url: formData.cover_url,
        id_plan: parseInt(formData.id_plan) || 1
      });

      if (res.success) {
        toast.success("Livro adicionado!");
        onCancel();
      } else {
        toast.error(res.error || "Erro ao adicionar");
      }
    });
  };

  return (
    <div className="bg-white/[0.025] border border-white/8 rounded-2xl p-6 md:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid md:grid-cols-[1fr_240px] gap-8">
          <div className="flex flex-col gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                  <Book className="w-3 h-3 text-primary" /> Título do Livro
                </label>
                <div className="relative group">
                  <Input
                    placeholder="Ex: Dom Casmurro"
                    value={formData.name}
                    onChange={(e) => setFormData(x => ({ ...x, name: e.target.value }))}
                    className="pr-20"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSearchCover}
                    disabled={isSearchingImage || !formData.name}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-30 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSearchingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                    <span>Buscar</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                  <LinkIcon className="w-3 h-3 text-emerald-400" /> Link do PDF
                </label>
                <Input
                  placeholder="Google Drive download..."
                  value={formData.pdf_url}
                  onChange={(e) => setFormData(x => ({ ...x, pdf_url: e.target.value }))}
                  className="focus:border-emerald-500/40 font-mono text-emerald-400/80"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                  <ImageIcon className="w-3 h-3 text-amber-500" /> URL da Capa (Manual)
                </label>
                <Input
                  placeholder="https://..."
                  value={formData.cover_url}
                  onChange={(e) => setFormData(x => ({ ...x, cover_url: e.target.value }))}
                  className="focus:border-amber-500/40 text-amber-200/40"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                  <LinkIcon className="w-3 h-3 text-indigo-400" /> Plano de Acesso
                </label>
                <Select
                  value={formData.id_plan}
                  onValueChange={(val) => setFormData(prev => ({ ...prev, id_plan: val }))}
                >
                  <SelectTrigger className="focus:border-indigo-500/35">
                    <SelectValue placeholder="Selecionar plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Gratuito / Essencial</SelectItem>
                    <SelectItem value="2">Exclusivo / Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="w-full aspect-[3/4] rounded-2xl border border-white/8 bg-white/5 overflow-hidden flex items-center justify-center relative group shadow-2xl">
              {formData.cover_url ? (
                <>
                  <img src={formData.cover_url} alt="Cover Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, cover_url: "" }))}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="text-center opacity-10">
                  <Book className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-white">Sem capa</p>
                </div>
              )}
            </div>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Prévia da Capa</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-white/5">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1 h-12 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-[11px] font-black uppercase tracking-widest cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex-[2] h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-[11px] gap-2 transition-all cursor-pointer shadow-lg shadow-primary/20"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {isPending ? "Adicionando..." : "Confirmar Cadastro"}
          </Button>
        </div>
      </form>
    </div>
  );
}
