"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

const BookOpen = LucideIcons.BookOpen as any;
const Bookmark = LucideIcons.Bookmark as any;
const Search = LucideIcons.Search as any;
const Crown = LucideIcons.Crown as any;
const ArrowRight = LucideIcons.ArrowRight as any;
const Lock = LucideIcons.Lock as any;
const Library = LucideIcons.Library as any;
const ArrowLeft = LucideIcons.ArrowLeft as any;

interface Book {
  id_book: number;
  name: string;
  id_plan: number | null;
}

interface BibliotecaClientProps {
  books: Book[];
  isPremium: boolean;
}

export default function BibliotecaClient({ books, isPremium }: BibliotecaClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" asChild className="rounded-xl cursor-pointer">
              <Link href="/home">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 leading-none">Biblioteca Virtual</h1>
              <div className="flex items-center gap-2 mt-1">
                <Library className="w-3.5 h-3.5 text-primary" />
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Obras completas ao seu alcance</p>
              </div>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <Input
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-white/5 border-white/5 rounded-xl h-11 focus-visible:ring-primary/50"
            />
          </div>
        </header>

        {/* Featured Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <GlassCard className="p-8 md:p-12 rounded-[2.5rem] overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <Badge className="bg-primary/20 text-primary border-primary/30 mb-4 px-3 py-1">Novidade</Badge>
              <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Multiverso Expandido</h2>
              <p className="text-white/50 text-sm mb-8 leading-relaxed">
                Acesse PDFs exclusivos, planners de leitura e obras completas dos seus autores favoritos.
                Expanda seus horizontes no Multiverso Literário.
              </p>
              {!isPremium && (
                <Button className="bg-amber-500 hover:bg-amber-600 rounded-xl h-12 px-8 font-bold gap-2 cursor-pointer shadow-lg shadow-amber-500/20" asChild>
                  <Link href="/home/planos">
                    <Crown className="w-4 h-4" />
                    Assinar para Acesso Total
                  </Link>
                </Button>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Categories/Tabs (Optional mock) */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["Todos", "Ficção", "Clássicos", "Poesia", "Ensaios"].map((cat) => (
            <Button key={cat} variant="ghost" className="rounded-full px-6 h-9 text-xs font-bold border border-white/5 hover:bg-white/5 whitespace-nowrap cursor-pointer">
              {cat}
            </Button>
          ))}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
          <AnimatePresence mode="popLayout">
            {filteredBooks.map((book, i) => {
              const isLocked = book.id_plan === 2 && !isPremium;
              return (
                <motion.div
                  key={book.id_book}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link href={isLocked ? "#" : `/home/biblioteca/${book.id_book}`}>
                    <GlassCard className="group flex flex-col h-full rounded-2xl p-4 transition-all hover:bg-white/5 hover:-translate-y-1 cursor-pointer border-white/5 hover:border-white/15 overflow-hidden">
                      <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/5 mb-4 flex items-center justify-center relative overflow-hidden">
                        <BookOpen className="w-10 h-10 text-white/10 group-hover:text-primary/30 transition-colors" />
                        {isLocked && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                              <Lock className="w-4 h-4 text-amber-500" />
                            </div>
                          </div>
                        )}
                        {book.id_plan === 2 && !isLocked && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[8px] p-1 rounded-full">
                              <Crown className="w-3 h-3" />
                            </Badge>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {book.name}
                      </h3>
                      <div className="mt-auto pt-4 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-white/20">
                        <span>Leitura Digital</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredBooks.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <Bookmark className="w-12 h-12 text-white/5 mx-auto" />
              <p className="text-white/20 text-sm">Nenhum livro encontrado para sua busca.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
