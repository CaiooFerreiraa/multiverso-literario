"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as LucideIcons from "lucide-react";
import { createBookAction } from "@/actions/admin";
import { toast } from "sonner";
import Image from "next/image";

const Save = LucideIcons.Save as any;
const X = LucideIcons.X as any;
const BookType = LucideIcons.BookType as any;
const ImageLucide = LucideIcons.Image as any;
const Search = LucideIcons.Search as any;
const Trash2 = LucideIcons.Trash2 as any;
const LinkIcon = LucideIcons.Link as any;

interface BookFormProps {
  onCancel: () => void;
}

export function AdminBookForm({ onCancel }: BookFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    pdf_url: "",
    cover_url: "",
    id_plan: "1" // Default free/basic
  });
  const [isSearchingImage, setIsSearchingImage] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Transform Drive view link to direct download link
  const transformPdfUrl = (url: string) => {
    if (url.includes("drive.google.com/file/d/")) {
      const match = url.match(/file\/d\/([^/]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    return url;
  };

  // Auto-search cover when name changes (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!formData.name || formData.name.length < 3) return;

    debounceRef.current = setTimeout(() => {
      handleSearchCover();
    }, 1000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [formData.name]);

  const handleSearchCover = async () => {
    if (!formData.name) {
      toast.error("Digite o nome do livro primeiro");
      return;
    }
    setIsSearchingImage(true);
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(formData.name)}&maxResults=1`);
      const data = await res.json();
      if (data.items && data.items.length > 0 && data.items[0].volumeInfo.imageLinks) {
        let imageUrl = data.items[0].volumeInfo.imageLinks.thumbnail || data.items[0].volumeInfo.imageLinks.smallThumbnail;
        if (imageUrl) {
          // Replace http with https
          imageUrl = imageUrl.replace(/^http:\/\//i, 'https://');
          setFormData(prev => ({ ...prev, cover_url: imageUrl }));
          toast.success("Capa encontrada!");
        } else {
          toast.error("Capa não encontrada para este livro");
        }
      } else {
        toast.error("Livro não encontrado na base de dados");
      }
    } catch (error) {
      toast.error("Erro ao buscar capa");
    } finally {
      setIsSearchingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("O nome do livro é obrigatório.");
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
        toast.success("Livro adicionado com sucesso!");
        onCancel();
      } else {
        toast.error(res.error || "Erro ao adicionar livro");
      }
    });
  };

  return (
    <GlassCard className="p-8 rounded-2xl border-white/5 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookType className="w-5 h-5 text-primary" />
            Adicionar Livro
          </h2>
          <p className="text-xs text-white/40 mt-1">
            Insira o nome, busque a capa automaticamente e adicione o link do PDF.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-xl">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider px-1">Título do Livro</label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ex: Essencialismo"
                value={formData.name}
                onChange={(e) => setFormData(x => ({ ...x, name: e.target.value }))}
                className="bg-white/5 border-white/10"
                required
              />
              <Button
                type="button"
                onClick={handleSearchCover}
                disabled={isSearchingImage}
                className="bg-primary/20 hover:bg-primary/40 text-primary border-none whitespace-nowrap"
              >
                {isSearchingImage ? <LucideIcons.Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                Buscar Capa
              </Button>
            </div>
          </div>

          {formData.cover_url && (
            <div className="flex flex-col items-start gap-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider px-1">Capa Visualizada</label>
              <div className="relative w-32 h-48 rounded-xl border border-white/10 overflow-hidden bg-black/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.cover_url}
                  alt="Capa"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider px-1">URL da Imagem da Capa (Manual)</label>
            <Input
              placeholder="https://exemplo.com/capa.jpg"
              value={formData.cover_url}
              onChange={(e) => setFormData(x => ({ ...x, cover_url: e.target.value }))}
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider px-1">Link do PDF</label>
            <Input
              placeholder="Link do Google Drive (ex: https://drive.google.com/file/d/.../view)"
              value={formData.pdf_url}
              onChange={(e) => setFormData(x => ({ ...x, pdf_url: e.target.value }))}
              className="bg-white/5 border-white/10"
            />
            <p className="text-[10px] text-primary/80 mt-1">Links do Google Drive serão convertidos automaticamente para download direto ao salvar.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider px-1">Plano Necessário</label>
            <Select
              value={formData.id_plan}
              onValueChange={(val: string) => setFormData(x => ({ ...x, id_plan: val }))}
            >
              <SelectTrigger className="bg-white/5 border-white/10 cursor-pointer">
                <SelectValue placeholder="Selecione o plano" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/10 text-white">
                <SelectItem value="1" className="cursor-pointer">Livre / Essencial (Adultos)</SelectItem>
                <SelectItem value="2" className="cursor-pointer">Exclusivo / Premium (Adultos)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-white/40 mt-1">Livros Adultos só ficam visíveis para quem não é plano Student.</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onCancel} className="hover:bg-white/5">
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90">
            {isPending ? <LucideIcons.Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar Livro
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
