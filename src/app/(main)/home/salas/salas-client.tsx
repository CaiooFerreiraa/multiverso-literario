"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Plus = LucideIcons.Plus as any;
const Search = LucideIcons.Search as any;
const Users = LucideIcons.Users as any;
const Video = LucideIcons.Video as any;
const ArrowLeft = LucideIcons.ArrowLeft as any;
const Clock = LucideIcons.Clock as any;
const BookOpen = LucideIcons.BookOpen as any;
const Sparkles = LucideIcons.Sparkles as any;
const Radio = LucideIcons.Radio as any;
const X = LucideIcons.X as any;

interface SalasClientProps {
  user: {
    id: string | number;
    name: string;
    email: string;
    image: string | null;
  };
  viewType: 'student' | 'adult' | 'free';
  adminEmail: string;
  scheduledRooms: any[];
}

interface Room {
  id: string;
  title: string;
  description: string;
  category: string;
  host: {
    name: string;
    avatar: string | null;
  };
  participants: {
    name: string;
    avatar: string | null;
  }[];
  isLive: boolean;
  isUpcoming: boolean;
  startedAt: string;
}

const CATEGORIES = ["Todas", "Literatura Brasileira", "Ficção Científica", "Clássicos", "Fantasia", "Filosofia", "Poesia"];
export default function SalasClient({ user, viewType, adminEmail, scheduledRooms: dbRooms }: SalasClientProps) {
  const router = useRouter();
  const isStudent = viewType === 'student';

  const [isMounted, setIsMounted] = useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filtro: Estudantes só vêem salas do Admin. Adultos vêm tudo.
  const filteredDbRooms = isStudent
    ? dbRooms.filter((dr: any) => dr.creator_email === adminEmail)
    : dbRooms;

  // Combine Global Chat + Database Rooms
  const allRoomsFormatted: Room[] = [
    // GLOBAL_CHAT_ROOM removido conforme solicitado
    ...filteredDbRooms.map((dr: any) => {
      const scheduledAt = new Date(dr.scheduled_at);
      const now = isMounted ? new Date() : new Date(0);

      // Lógica de "vale para o dia todo" se a hora for 00:00
      const isMidnight = scheduledAt.getHours() === 0 && scheduledAt.getMinutes() === 0;
      const isSameDay = scheduledAt.toDateString() === now.toDateString();
      const isPast = scheduledAt <= now;

      const isLive = isSameDay ? (isMidnight || isPast) : false;
      const isUpcoming = !isPast && !isSameDay;

      return {
        id: dr.slug || String(dr.id_room),
        title: dr.title,
        description: dr.description,
        category: dr.category,
        host: { name: dr.creator_name || "Admin", avatar: null },
        participants: [],
        isLive,
        isUpcoming,
        startedAt: isMounted ? scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "...",
      };
    })
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoom, setNewRoom] = useState({ title: "", description: "", category: "Literatura Brasileira" });

  const filteredRooms = allRoomsFormatted.filter((room) => {
    const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todas" || room.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const liveRooms = filteredRooms.filter((r) => r.isLive);
  const upcomingRooms = filteredRooms.filter((r) => r.isUpcoming);

  const handleCreateRoom = () => {
    if (!newRoom.title.trim()) return;
    const slug = newRoom.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setShowCreateModal(false);
    setNewRoom({ title: "", description: "", category: "Literatura Brasileira" });
    router.push(`/dashboard/salas/${slug}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 lg:px-12 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-xl bg-black/20 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/50 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
              <Video className="text-primary w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Salas</h1>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Multiverso Community</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-white/5 rounded-xl px-4 h-10 border border-white/5 focus-within:border-primary/30 transition-colors w-72">
            <Search className="w-4 h-4 text-white/30 mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Buscar salas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-sm w-full focus:outline-none placeholder:text-white/20 cursor-text"
            />
          </div>

          {!isStudent && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="rounded-xl bg-primary hover:bg-primary/90 font-bold gap-2 h-10 px-5 shadow-[0_0_20px_rgba(109,40,217,0.3)] transition-all hover:shadow-[0_0_30px_rgba(109,40,217,0.5)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Criar Sala</span>
            </Button>
          )}
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden px-6 pt-4">
        <div className="flex items-center bg-white/5 rounded-xl px-4 h-10 border border-white/5 focus-within:border-primary/30 transition-colors">
          <Search className="w-4 h-4 text-white/30 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Buscar salas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-sm w-full focus:outline-none placeholder:text-white/20 cursor-text"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 lg:px-12 py-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${selectedCategory === cat
                ? "bg-primary text-white shadow-[0_0_15px_rgba(109,40,217,0.3)]"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 border border-white/5"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 lg:px-12 pb-12">
        {/* Ao Vivo Section */}
        {liveRooms.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest">Ao Vivo</h2>
              </div>
              <Badge variant="outline" className="text-[9px] border-red-500/30 text-red-400 bg-red-500/10">
                {liveRooms.length} {liveRooms.length === 1 ? "sala" : "salas"}
              </Badge>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveRooms.map((room, idx) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                >
                  <Link href={`/dashboard/salas/${room.id}`}>
                    <GlassCard className="p-0 overflow-hidden group hover:border-primary/30 hover:shadow-[0_0_40px_rgba(109,40,217,0.1)] transition-all duration-500 cursor-pointer">
                      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-red-500/20 text-red-400 px-2.5 py-1 rounded-full">
                            <Radio className="w-3 h-3 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Ao Vivo</span>
                          </div>
                          <Badge variant="outline" className="text-[9px] border-white/10 text-white/40 bg-white/5">
                            {room.category}
                          </Badge>
                        </div>
                        <span className="text-[10px] text-white/20 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Desde {room.startedAt}
                        </span>
                      </div>

                      <div className="px-5 pb-3">
                        <h3 className="text-base font-bold leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
                          {room.title}
                        </h3>
                        <p className="text-xs text-white/30 line-clamp-2 leading-relaxed">
                          {room.description}
                        </p>
                      </div>

                      <div className="px-5 pb-4 pt-2 flex items-center justify-between border-t border-white/5 mt-1">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6 border border-primary/30">
                              <AvatarImage src={room.host.avatar || ""} />
                              <AvatarFallback className="bg-primary/20 text-primary text-[8px] font-bold">
                                {room.host.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-white/60 font-medium">{room.host.name}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-white/30 font-medium flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {room.participants.length + 1}
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Scheduled / Upcoming */}
        {upcomingRooms.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest">Agendadas</h2>
              <Badge variant="outline" className="text-[9px] border-white/10 text-white/40">
                {upcomingRooms.length} {upcomingRooms.length === 1 ? "sala" : "salas"}
              </Badge>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingRooms.map((room, idx) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 + 0.2, duration: 0.4 }}
                >
                  <Link href={`/dashboard/salas/${room.id}`}>
                    <GlassCard className="p-0 overflow-hidden group hover:border-white/20 transition-all duration-500 opacity-70 hover:opacity-100 cursor-pointer">
                      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-white/5 text-white/40 px-2.5 py-1 rounded-full border border-white/5">
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Começa às {room.startedAt}</span>
                          </div>
                          <Badge variant="outline" className="text-[9px] border-white/10 text-white/40 bg-white/5">
                            {room.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="px-5 pb-3">
                        <h3 className="text-base font-bold leading-snug line-clamp-2 mb-2 group-hover:text-white transition-colors duration-300">
                          {room.title}
                        </h3>
                        <p className="text-xs text-white/30 line-clamp-2 leading-relaxed">
                          {room.description}
                        </p>
                      </div>

                      <div className="px-5 pb-4 pt-2 flex items-center justify-between border-t border-white/5 mt-1">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 border border-white/10">
                            <AvatarImage src={room.host.avatar || ""} />
                            <AvatarFallback className="bg-white/5 text-white/40 text-[8px] font-bold">
                              {room.host.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-white/40 font-medium">{room.host.name}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            import("sonner").then(({ toast }) => {
                              toast.success("Lembrete ativado!", {
                                description: `Você receberá uma notificação quando a sala "${room.title}" começar.`
                              });
                            });
                          }}
                          className="h-7 text-[10px] rounded-lg border-white/10 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          Lembrar-me
                        </Button>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {filteredRooms.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
              <BookOpen className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-lg font-bold text-white/60 mb-2">Nenhuma sala encontrada</h3>
            <p className="text-sm text-white/30 mb-6 text-center max-w-xs">
              {isStudent ? "Aguarde o administrador criar novas salas." : "Que tal criar uma sala e iniciar uma conversa literária?"}
            </p>
            {!isStudent && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="rounded-xl bg-primary hover:bg-primary/90 font-bold gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Criar Sala
              </Button>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <GlassCard className="p-0 overflow-hidden border-white/10">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Video className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-base font-bold">Criar Nova Sala</h2>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
                      Nome da Sala
                    </label>
                    <Input
                      value={newRoom.title}
                      onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
                      placeholder="Ex: Dom Casmurro — Debate Livre"
                      className="bg-white/5 border-white/10 rounded-xl h-11 text-sm focus-visible:ring-primary/50 placeholder:text-white/20 cursor-text"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
                      Descrição
                    </label>
                    <textarea
                      value={newRoom.description}
                      onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                      placeholder="Descreva o tema da discussão..."
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/20 resize-none cursor-text"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
                      Categoria
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.filter((c) => c !== "Todas").map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setNewRoom({ ...newRoom, category: cat })}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${newRoom.category === cat
                            ? "bg-primary text-white"
                            : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 border border-white/5"
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 h-11 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateRoom}
                    disabled={!newRoom.title.trim()}
                    className={`flex-1 h-11 rounded-xl font-bold gap-2 transition-all cursor-pointer ${newRoom.title.trim()
                      ? "bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(109,40,217,0.3)]"
                      : "bg-white/5 text-white/30 cursor-not-allowed"
                      }`}
                  >
                    <Video className="w-4 h-4 transition-all" />
                    Criar e Entrar
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isStudent && (
        <div className="lg:hidden fixed bottom-8 right-6 z-40">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="w-14 h-14 rounded-2xl bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(109,40,217,0.4)] p-0 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
