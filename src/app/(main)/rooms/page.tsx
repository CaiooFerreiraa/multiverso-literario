"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import * as LucideIcons from "lucide-react";

// Casting icons to any to resolve React 19 / JSX element type incompatibilities
const Search = LucideIcons.Search as any;
const Mail = LucideIcons.Mail as any;
const Calendar = LucideIcons.Calendar as any;
const Bell = LucideIcons.Bell as any;
const Plus = LucideIcons.Plus as any;
const Users = LucideIcons.Users as any;
const MessageSquare = LucideIcons.MessageSquare as any;
const LogOut = LucideIcons.LogOut as any;
import Link from "next/link";

const UPCOMING_EVENTS = [
  { time: "17:30", group: "LINGO LOUNGE", title: "#13 ENGLISH_JAPANESE with my friend" },
  { time: "17:30", group: "LINGO LOUNGE", title: "I read The History of Venice 🇮🇹" },
  { time: "18:00", group: "LINGO LOUNGE", title: "The French cafe" },
];

const ACTIVE_ROOMS = [
  {
    id: "1",
    title: "Talking how to design ClubHouse in your Figma",
    participants: ["Andrey Anashkin", "Jakob Povey", "Petr Kalyanov", "Thomas Mendoza", "Shabaz Garrison"],
    viewerCount: 126,
    speakerCount: 26,
    active: true,
  },
  {
    id: "2",
    title: "Design Dark Theme to Clubhouse. Is it real or not? Why?",
    participants: ["Raife Flores", "Ameen Camacho", "Noa Clegg", "Axl Hartley"],
    viewerCount: 84,
    speakerCount: 4,
    active: false,
  },
];

export default function RoomsPage() {
  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 p-8 border-r border-white/5 bg-black/20 backdrop-blur-md z-20">
        <div className="mb-12">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
            Multiverso
          </h1>
        </div>

        <nav className="flex-1 space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-4">Menu</p>
            {[
              { icon: Search, label: "Explorar" },
              { icon: Calendar, label: "Eventos" },
              { icon: Users, label: "Amigos" },
              { icon: Bell, label: "Notificações" },
            ].map((item, i) => (
              <Button key={i} variant="ghost" className="w-full justify-start gap-4 h-12 rounded-xl hover:bg-white/5 text-white/70 hover:text-white px-4">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Button>
            ))}
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-4">Seu Perfil</p>
            <div className="flex items-center gap-3 px-4">
              <Avatar className="w-10 h-10 border border-white/20">
                <AvatarImage src="https://github.com/shadcn.png" />
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-bold">Universo Alpha</span>
                <span className="text-[10px] text-white/40">online</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="mt-auto space-y-4">
          <GlassCard className="p-4 rounded-2xl bg-primary/20 border-primary/20">
            <p className="text-xs font-medium text-white/90 mb-3 italic">
              &quot;A leitura traz para nós amigos desconhecidos.&quot;
            </p>
            <p className="text-[10px] text-white/40">— Honoré de Balzac</p>
          </GlassCard>

          <Button
            variant="ghost"
            asChild
            className="w-full justify-start gap-4 h-12 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors px-4"
          >
            <Link href="/login">
              <LogOut className="w-5 h-5" />
              <span className="font-bold uppercase tracking-wider text-xs">Sair do Sistema</span>
            </Link>
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Top bar Desktop */}
        <header className="hidden lg:flex items-center justify-between px-12 py-6 sticky top-0 z-10 bg-background/50 backdrop-blur-md">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="Buscar salas, temas ou autores..."
              className="pl-12 bg-white/5 border-none h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button className="rounded-xl bg-primary hover:bg-primary/90 font-bold gap-2 h-11 px-6 shadow-[0_0_20px_rgba(109,40,217,0.3)]">
              <Plus className="w-5 h-6" />
              Criar Sala
            </Button>
          </div>
        </header>

        {/* Mobile Header (Hidden on LG) */}
        <header className="lg:hidden flex items-center justify-between px-6 py-8">
          <h1 className="text-xl font-bold">Multiverso</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="text-red-400">
              <Link href="/login"><LogOut className="w-5 h-5" /></Link>
            </Button>
            <Avatar className="w-10 h-10 border border-white/20">
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
          </div>
        </header>

        <div className="px-6 lg:px-12 py-4 pb-32 max-w-6xl w-full mx-auto">
          {/* Upcoming Events - Horizontal on Desktop */}
          <section className="mb-12">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">Próximos Eventos</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {UPCOMING_EVENTS.map((event, i) => (
                <GlassCard key={i} className="p-5 bg-black/40 hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-primary">{event.time}</span>
                    <Badge variant="outline" className="text-[9px] border-white/10 uppercase tracking-tighter">Hoje</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase">{event.group} 🏠</p>
                    <p className="text-sm font-semibold leading-relaxed line-clamp-2">{event.title}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Active Rooms - 2 columns on Desktop */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Salas Ativas</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs text-white/50">Recentes</Button>
                <Button variant="ghost" size="sm" className="text-xs text-primary font-bold">Populares</Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {ACTIVE_ROOMS.map((room) => (
                <Link key={room.id} href={`/rooms/${room.id}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-full"
                  >
                    <GlassCard className="h-full p-8 flex flex-col gap-6 hover:bg-white/10 transition-colors">
                      <h2 className="text-xl font-bold leading-tight line-clamp-2 min-h-[3.5rem]">
                        {room.title}
                      </h2>

                      <div className="flex gap-6 mt-auto">
                        <div className="relative w-16 h-16 shrink-0">
                          <Avatar className="absolute top-0 left-0 w-11 h-11 border-2 border-[#1E1B4B]">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${room.id}1`} />
                          </Avatar>
                          <Avatar className="absolute bottom-0 right-0 w-11 h-11 border-2 border-[#1E1B4B]">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${room.id}2`} />
                          </Avatar>
                        </div>

                        <div className="flex flex-col justify-center gap-1 overflow-hidden">
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
                            {room.participants.slice(0, 3).map((name) => (
                              <div key={name} className="flex items-center gap-1.5 shrink-0">
                                <span className="text-sm font-semibold text-white/70 line-clamp-1 truncate max-w-[120px]">{name}</span>
                                <MessageSquare className="w-3 h-3 text-white/20" />
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5">
                              {room.viewerCount} <Users className="w-3 h-3" />
                            </span>
                            <span className="flex items-center gap-1.5">
                              {room.speakerCount} <MessageSquare className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Global Floating Actions */}
        <div className="lg:hidden fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
          <Button className="h-14 px-8 rounded-full bg-primary font-bold shadow-2xl">
            <Plus className="w-6 h-6 mr-2" /> Start a room
          </Button>
        </div>
      </main>
    </div>
  );
}
