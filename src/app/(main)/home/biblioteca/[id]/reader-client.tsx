"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

const ArrowLeft = LucideIcons.ArrowLeft as any;
const BookOpen = LucideIcons.BookOpen as any;
const Bookmark = LucideIcons.Bookmark as any;

interface Book {
  id_book: number;
  name: string;
  text?: string;
  pdf_url?: string;
  cover_url?: string;
}

interface ReaderClientProps {
  book: Book;
}

export default function ReaderClient({ book }: ReaderClientProps) {
  return (
    <div className="min-h-screen transition-all duration-700 relative overflow-hidden cosmic-bg text-white/90">
      {/* Decorative Cosmic Elements */}
      <div className="stars-overlay opacity-40 translate-z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,_oklch(0.55_0.25_280_/_15%),_transparent_50%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_70%,_oklch(0.45_0.2_220_/_10%),_transparent_50%)] pointer-events-none z-0" />

      {/* Top Bar Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b transition-all duration-500 bg-black/40 backdrop-blur-2xl border-white/5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
            <Link href="/home/biblioteca">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="hidden sm:block">
            <h1 className="text-sm font-black uppercase tracking-widest truncate max-w-[200px] md:max-w-md drop-shadow-sm">{book.name}</h1>
            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-primary animate-pulse">Biblioteca Multiverso</p>
          </div>
        </div>
      </header>

      {/* Book Content */}
      <main className="max-w-4xl mx-auto pt-40 pb-48 px-6 relative z-10 min-h-[90vh] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl mx-auto"
        >
          <GlassCard className="p-10 md:p-16 rounded-[3rem] border-white/10 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            {book.cover_url ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative w-48 h-72 md:w-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 mb-10 border border-white/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={book.cover_url} alt={book.name} className="w-full h-full object-cover" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto transition-all bg-primary/10 border border-primary/20 shadow-[0_0_30px_rgba(109,40,217,0.2)] mb-10"
              >
                <Bookmark className="w-12 h-12 text-primary" />
              </motion.div>
            )}

            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 mb-6 drop-shadow-2xl">
              {book.name}
            </h2>

            <p className="text-white/50 text-base md:text-lg max-w-lg mx-auto mb-12">
              Esta obra faz parte do acervo estendido do Multiverso Literário e seu conteúdo completo está disponível para download.
            </p>

            {book.pdf_url ? (
              <Button asChild size="lg" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-black rounded-2xl h-14 px-10 font-black text-lg cursor-pointer shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all hover:scale-105 active:scale-95">
                <a href={book.pdf_url} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="w-5 h-5 mr-3" />
                  Baixar Arquivo PDF
                </a>
              </Button>
            ) : (
              <Button disabled size="lg" className="w-full sm:w-auto bg-white/5 text-white/30 rounded-2xl h-14 px-10 font-bold text-lg cursor-not-allowed">
                Indisponível no momento
              </Button>
            )}
          </GlassCard>

          <footer className="pt-24 text-center border-t border-white/5 opacity-50 block w-full mt-24">
            <div className="flex items-center justify-center gap-5 font-black uppercase tracking-[0.5em] text-[11px] text-white">
              <span>Multiverso</span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(109,40,217,0.8)]" />
              <span>Literário</span>
            </div>
          </footer>
        </motion.div>
      </main>
    </div>
  );
}
