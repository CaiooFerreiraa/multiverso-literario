"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

const ArrowLeft = LucideIcons.ArrowLeft as any;
const Maximize2 = LucideIcons.Maximize2 as any;
const Minimize2 = LucideIcons.Minimize2 as any;
const Settings = LucideIcons.Settings as any;
const Type = LucideIcons.Type as any;
const Moon = LucideIcons.Moon as any;
const Sun = LucideIcons.Sun as any;
const Bookmark = LucideIcons.Bookmark as any;
const Share2 = LucideIcons.Share2 as any;
const BookOpen = LucideIcons.BookOpen as any;

interface Book {
  id_book: number;
  name: string;
  text: string;
}

interface ReaderClientProps {
  book: Book;
}

export default function ReaderClient({ book }: ReaderClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-black text-white/90" : "bg-[#fdfcf8] text-neutral-800"}`}>
      {/* Top Bar Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b transition-all ${isDarkMode ? "bg-black/80 backdrop-blur-xl border-white/5" : "bg-white/80 backdrop-blur-xl border-neutral-200"}`}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl cursor-pointer">
            <Link href="/dashboard/biblioteca">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-sm font-bold truncate max-w-[200px] md:max-w-md">{book.name}</h1>
            <p className="text-[9px] uppercase tracking-[0.2em] font-black opacity-40">Biblioteca Multiverso</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-xl cursor-pointer opacity-60 hover:opacity-100"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFontSize(prev => Math.min(prev + 2, 32))}
            className="rounded-xl cursor-pointer opacity-60 hover:opacity-100"
          >
            <Type className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="rounded-xl cursor-pointer hidden md:flex opacity-60 hover:opacity-100"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl cursor-pointer opacity-60 hover:opacity-100 pr-0"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="fixed top-[72px] left-0 right-0 z-50">
        <div className="h-1 bg-white/5">
          <motion.div
            className="h-full bg-primary shadow-[0_0_10px_rgba(109,40,217,0.5)]"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* Book Content */}
      <main className="max-w-3xl mx-auto pt-32 pb-40 px-6 prose prose-invert">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-12"
        >
          <header className="text-center pb-20 border-b border-white/5 space-y-4">
            <Bookmark className="w-8 h-8 text-primary/40 mx-auto" />
            <h2 className={`text-4xl md:text-5xl font-black italic tracking-tighter ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
              {book.name}
            </h2>
            <p className="text-[10px] uppercase tracking-[0.4em] font-black italic opacity-40">Capítulo i</p>
          </header>

          <div
            style={{ fontSize: `${fontSize}px`, lineHeight: "1.8" }}
            className={`font-serif selection:bg-primary/30 selection:text-white whitespace-pre-wrap ${isDarkMode ? "text-white/80" : "text-neutral-700"}`}
          >
            {book.text || "Conteúdo indisponível no momento."}
          </div>

          <footer className="pt-20 text-center border-t border-white/5 opacity-20">
            <div className="flex items-center justify-center gap-2 font-black italic text-sm">
              <span>Multiverso</span>
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Literário</span>
            </div>
          </footer>
        </motion.div>
      </main>

      {/* Bottom Controls / Stats (Floating on scroll) */}
      <motion.div
        animate={{ opacity: scrollProgress > 5 ? 1 : 0, y: scrollProgress > 5 ? 0 : 20 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden md:block"
      >
        <GlassCard className="px-6 py-3 rounded-full flex items-center gap-6 border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{Math.round(scrollProgress)}% lido</span>
          </div>
          <div className="w-[1px] h-4 bg-white/10" />
          <p className="text-[10px] font-bold text-white/60">Tempo estimado: 15 min</p>
        </GlassCard>
      </motion.div>

      {/* Floating Action Button (Mobile) */}
      <Button className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary border-4 border-black shadow-[0_0_20px_rgba(109,40,217,0.4)] flex items-center justify-center cursor-pointer z-50">
        <Bookmark className="w-6 h-6" />
      </Button>
    </div>
  );
}
