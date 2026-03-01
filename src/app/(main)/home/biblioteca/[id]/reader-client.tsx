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
    <div className={`min-h-screen transition-all duration-700 relative overflow-hidden ${isDarkMode ? "cosmic-bg text-white/90" : "bg-[#fdfcf8] text-neutral-800"}`}>
      {/* Decorative Cosmic Elements (Only in Dark Mode) */}
      {isDarkMode && (
        <>
          <div className="stars-overlay opacity-40 translate-z-0" />
          <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,_oklch(0.55_0.25_280_/_15%),_transparent_50%)] pointer-events-none z-0" />
          <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_70%,_oklch(0.45_0.2_220_/_10%),_transparent_50%)] pointer-events-none z-0" />
          <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none z-0 animate-pulse" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none z-0 animate-pulse" />
        </>
      )}

      {/* Top Bar Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b transition-all duration-500 ${isDarkMode ? "bg-black/40 backdrop-blur-2xl border-white/5" : "bg-white/80 backdrop-blur-xl border-neutral-200 shadow-sm"}`}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
            <Link href="/dashboard/biblioteca">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="hidden sm:block">
            <h1 className="text-sm font-black uppercase tracking-widest truncate max-w-[200px] md:max-w-md drop-shadow-sm">{book.name}</h1>
            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-primary animate-pulse">Biblioteca Multiverso</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 p-1 rounded-2xl ${isDarkMode ? "bg-white/5 border border-white/5" : "bg-neutral-100 border border-neutral-200"}`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`rounded-xl h-10 w-10 cursor-pointer transition-all ${isDarkMode ? "text-amber-400 hover:bg-white/10" : "text-neutral-500 hover:bg-white"}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFontSize(prev => Math.min(prev + 2, 32))}
              className={`rounded-xl h-10 w-10 cursor-pointer transition-all ${isDarkMode ? "hover:bg-white/10" : "hover:bg-white"}`}
            >
              <Type className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className={`rounded-xl h-10 w-10 cursor-pointer hidden md:flex transition-all ${isDarkMode ? "hover:bg-white/10" : "hover:bg-white"}`}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={`rounded-xl h-12 w-12 cursor-pointer transition-all ${isDarkMode ? "bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 shadow-[0_0_20px_rgba(109,40,217,0.4)]" : "bg-neutral-100 text-neutral-600 border border-neutral-200"}`}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="fixed top-[72px] left-0 right-0 z-50">
        <div className={`h-[2px] ${isDarkMode ? "bg-white/5" : "bg-neutral-100"}`}>
          <motion.div
            className="h-full bg-primary shadow-[0_0_15px_rgba(109,40,217,1)]"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* Book Content */}
      <main className="max-w-4xl mx-auto pt-40 pb-48 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`space-y-16 max-w-2xl mx-auto`}
        >
          <header className={`text-center pb-24 border-b space-y-8 ${isDarkMode ? "border-white/5" : "border-neutral-100"}`}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto transition-all ${isDarkMode ? "bg-primary/10 border border-primary/20 shadow-[0_0_30px_rgba(109,40,217,0.2)]" : "bg-neutral-50 border border-neutral-200"}`}
            >
              <Bookmark className="w-10 h-10 text-primary" />
            </motion.div>
            <div className="space-y-4">
              <h2 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 leading-[0.95] drop-shadow-2xl`}>
                {book.name}
              </h2>
              <div className="flex items-center justify-center gap-6 pt-4">
                <div className={`h-[1px] w-12 ${isDarkMode ? "bg-white/10" : "bg-neutral-200"}`} />
                <p className="text-[12px] uppercase tracking-[0.6em] font-black text-primary tracking-widest drop-shadow-[0_0_10px_rgba(109,40,217,0.5)]">Capítulo i</p>
                <div className={`h-[1px] w-12 ${isDarkMode ? "bg-white/10" : "bg-neutral-200"}`} />
              </div>
            </div>
          </header>

          <div
            style={{ fontSize: `${fontSize}px`, lineHeight: "2" }}
            className={`font-serif selection:bg-primary/50 selection:text-white whitespace-pre-wrap transition-all duration-300 ${isDarkMode
                ? "text-white/80 first-letter:text-6xl first-letter:text-primary first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:leading-none drop-shadow-xl"
                : "text-neutral-800 first-letter:text-6xl first-letter:text-primary first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:leading-none text-justify"
              }`}
          >
            {book.text || "Conteúdo indisponível no momento."}
          </div>

          <footer className={`pt-24 text-center border-t transition-all ${isDarkMode ? "border-white/5 opacity-50" : "border-neutral-100 opacity-60"}`}>
            <div className="flex items-center justify-center gap-5 font-black uppercase tracking-[0.5em] text-[11px]">
              <span className={isDarkMode ? "text-white" : "text-neutral-900"}>Multiverso</span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(109,40,217,0.8)]" />
              <span className={isDarkMode ? "text-white" : "text-neutral-900"}>Literário</span>
            </div>
          </footer>
        </motion.div>
      </main>

      {/* Bottom Controls / Stats (Floating on scroll) */}
      <motion.div
        animate={{ opacity: scrollProgress > 5 ? 1 : 0, y: scrollProgress > 5 ? 0 : 20 }}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 hidden md:block"
      >
        <GlassCard className="px-10 py-5 rounded-[2.5rem] flex items-center gap-10 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] bg-black/40 backdrop-blur-3xl">
          <div className="flex items-center gap-4 text-[12px] font-black uppercase tracking-[0.2em] text-white/60">
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>{Math.round(scrollProgress)}% concluído</span>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex items-center gap-4 text-[12px] font-black uppercase tracking-[0.2em] text-white/60">
            <div className="p-2 rounded-xl bg-white/5 text-white/40">
              <LucideIcons.Clock className="w-5 h-5" />
            </div>
            <p className="text-white/40">Estimativa: 15 min</p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Floating Action Button (Mobile) */}
      <Button className="md:hidden fixed bottom-8 right-8 w-16 h-16 rounded-[2rem] bg-primary border-none shadow-[0_0_40px_rgba(109,40,217,0.7)] flex items-center justify-center cursor-pointer z-50 active:scale-90 transition-all">
        <Bookmark className="w-8 h-8 text-white" />
      </Button>
    </div>
  );
}
