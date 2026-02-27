"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, FileText, MicOff, MoreHorizontal, Plus, Hand } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const SPEAKERS = [
  { name: "Andrey", img: "https://i.pravatar.cc/150?u=1", muted: false, status: "✨" },
  { name: "Sumaiya", img: "https://i.pravatar.cc/150?u=2", muted: true, status: "✳️" },
  { name: "Noa", img: "https://i.pravatar.cc/150?u=3", muted: false },
  { name: "Amar", img: "https://i.pravatar.cc/150?u=4", muted: true, status: "✳️" },
  { name: "Richard", img: "https://i.pravatar.cc/150?u=5", muted: true },
  { name: "Teagan", img: "https://i.pravatar.cc/150?u=6", muted: true },
  { name: "Ellisha", img: "https://i.pravatar.cc/150?u=7", muted: true, status: "✳️" },
  { name: "Autumn", img: "https://i.pravatar.cc/150?u=8", muted: true },
  { name: "Ivy", img: "https://i.pravatar.cc/150?u=9", muted: true, status: "✳️" },
  { name: "Imani", img: "https://i.pravatar.cc/150?u=10", muted: true },
  { name: "Kiana", img: "https://i.pravatar.cc/150?u=11", muted: true },
  { name: "Danika", img: "https://i.pravatar.cc/150?u=12", muted: true },
];

export default function RoomActivePage() {
  const { id } = useParams();

  return (
    <div className="flex flex-col min-h-screen max-w-[1600px] mx-auto">
      {/* Top Header */}
      <header className="px-10 pt-10 pb-6 flex items-center justify-between">
        <Link href="/rooms" className="flex items-center gap-2 text-white/60 hover:text-white font-bold transition-all group">
          <ChevronDown className="w-6 h-6 rotate-90 group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-widest text-xs">Voltar para o Multiverso</span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-white/50 uppercase tracking-tighter">Gravação em progresso</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full text-white/80 hover:bg-white/10">
            <FileText className="w-5 h-5" />
          </Button>
          <Avatar className="w-10 h-10 border border-white/20">
            <AvatarImage src="https://github.com/shadcn.png" />
          </Avatar>
        </div>
      </header>

      {/* Room Content */}
      <main className="flex-1 px-6 lg:px-10 py-2">
        <GlassCard className="max-w-none h-full rounded-[60px] p-12 flex flex-col gap-12 bg-black/40 border-white/5">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/20 text-primary border-primary/20 hover:bg-primary/30">Design & UI</Badge>
                <span className="text-xs font-bold text-white/20 uppercase tracking-[0.2em]">Sala de Áudio</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight max-w-3xl bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
                Talking how to design ClubHouse in your Figma
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40">
                <Plus className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40">
                <MoreHorizontal className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Speakers Grid - Desktop optimized */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-y-12 gap-x-8 flex-1">
            {SPEAKERS.map((speaker, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col items-center gap-4 group cursor-pointer"
              >
                <div className="relative cursor-pointer">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Avatar className="w-24 h-24 lg:w-32 lg:h-32 border-4 border-transparent ring-2 ring-white/5 shadow-2xl transition-transform group-hover:scale-105 duration-300">
                    <AvatarImage src={speaker.img} />
                    <AvatarFallback className="bg-white/10">{speaker.name[0]}</AvatarFallback>
                  </Avatar>

                  {speaker.status && (
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center text-lg shadow-xl border-4 border-[#1E1B4B]">
                      {speaker.status}
                    </div>
                  )}

                  {speaker.muted && (
                    <div className="absolute bottom-6 md:bottom-8 -right-1 w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#1E1B4B]">
                      <MicOff className="w-4 h-4 text-red-500 fill-red-500" />
                    </div>
                  )}

                  {!speaker.muted && !speaker.status && (
                    <div className="absolute -inset-1 border-2 border-primary rounded-full animate-ping opacity-20" />
                  )}
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {speaker.name}
                  </span>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Speaker</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </main>

      {/* Bottom Controls Desktop */}
      <footer className="px-10 py-10 flex items-center justify-between">
        <Button
          variant="outline"
          asChild
          className="rounded-full px-8 h-14 border-none bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/10"
        >
          <Link href="/rooms">✌️ Leave quietly</Link>
        </Button>

        <div className="flex items-center gap-4">
          <Button className="h-14 w-14 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 text-white transition-all hover:scale-110">
            <Plus className="w-6 h-6" />
          </Button>
          <Button className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-[0_0_30px_rgba(109,40,217,0.3)]">
            <Hand className="w-6 h-6" />
            <span>Pedir para falar</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 text-white transition-all hover:scale-110">
            <MoreHorizontal className="w-6 h-6" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
