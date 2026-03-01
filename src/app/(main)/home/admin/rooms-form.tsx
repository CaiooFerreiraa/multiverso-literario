"use client";
// @ts-nocheck

import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/glass-card";
import { toast } from "sonner";
import {
  createScheduledRoomAction,
  listScheduledRoomsAction,
  deleteScheduledRoomAction,
  listTimelinesForSelectAction,
} from "@/actions/rooms";
import * as LucideIcons from "lucide-react";

const Video = LucideIcons.Video as any;
const Trash2 = LucideIcons.Trash2 as any;
const BookOpen = LucideIcons.BookOpen as any;
const Clock = LucideIcons.Clock as any;
const Calendar = LucideIcons.Calendar as any;
const Radio = LucideIcons.Radio as any;
const Users = LucideIcons.Users as any;

const ROOM_CATEGORIES = [
  "Literatura Brasileira",
  "Ficção Científica",
  "Clássicos",
  "Fantasia",
  "Filosofia",
  "Poesia",
  "Romance",
  "Suspense",
  "Não-ficção",
  "Clube do Livro",
];

interface Timeline {
  id_timeline_book: number;
  name: string;
  author: string;
  date_start: string;
  date_end: string;
}

interface ScheduledRoom {
  id_room: number;
  title: string;
  description: string | null;
  category: string;
  slug: string;
  scheduled_at: string;
  is_active: boolean;
  book_name?: string;
  book_author?: string;
  creator_name?: string;
}

export function AdminRoomsForm() {
  const [isPending, startTransition] = useTransition();
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [rooms, setRooms] = useState<ScheduledRoom[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Clube do Livro",
    scheduledAt: "",
    idTimelineBook: "" as string,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [timelinesRes, roomsRes] = await Promise.all([
      listTimelinesForSelectAction(),
      listScheduledRoomsAction(),
    ]);
    if (timelinesRes.success) setTimelines(timelinesRes.data as Timeline[]);
    if (roomsRes.success) setRooms(roomsRes.data as ScheduledRoom[]);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.scheduledAt) {
      toast.error("Preencha o título e a data/hora");
      return;
    }

    startTransition(async () => {
      const result = await createScheduledRoomAction({
        title: form.title,
        description: form.description,
        category: form.category,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        idTimelineBook: form.idTimelineBook ? Number(form.idTimelineBook) : null,
      });

      if (result.success) {
        toast.success("Sala agendada com sucesso!");
        setForm({ title: "", description: "", category: "Clube do Livro", scheduledAt: "", idTimelineBook: "" });
        loadData();
      } else {
        toast.error(result.error || "Erro ao agendar sala");
      }
    });
  }

  async function handleDelete(roomId: number) {
    if (!confirm("Deseja realmente remover esta sala agendada?")) return;

    startTransition(async () => {
      const result = await deleteScheduledRoomAction(roomId);
      if (result.success) {
        toast.success("Sala removida");
        loadData();
      } else {
        toast.error(result.error || "Erro ao remover");
      }
    });
  }

  const now = new Date();

  return (
    <div className="space-y-8">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
              Título da Sala *
            </label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Debate — Dom Casmurro, Capítulos 1-5"
              className="bg-white/5 border-white/10 rounded-xl h-11 cursor-text"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
              Categoria
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl h-11 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer text-white"
            >
              {ROOM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#1a1a2e] text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
            Descrição
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descreva o tema da discussão..."
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/20 resize-none cursor-text"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Data e Hora de Início *
            </label>
            <Input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              className="bg-white/5 border-white/10 rounded-xl h-11 cursor-text"
            />
            <p className="text-[10px] text-white/20">A sala ficará visível somente quando chegar esta data/hora.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              Vincular ao Livro do Mês
            </label>
            <select
              value={form.idTimelineBook}
              onChange={(e) => setForm({ ...form, idTimelineBook: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl h-11 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer text-white"
            >
              <option value="" className="bg-[#1a1a2e] text-white">Nenhum (sala livre)</option>
              {timelines.map((t) => (
                <option key={t.id_timeline_book} value={t.id_timeline_book} className="bg-[#1a1a2e] text-white">
                  {t.name} — {t.author}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-white/20">Vincule a um cronograma de leitura existente.</p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending || !form.title.trim() || !form.scheduledAt}
          className={`w-full h-12 rounded-xl font-bold gap-2 transition-all ${form.title.trim() && form.scheduledAt
              ? "bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(109,40,217,0.3)]"
              : "bg-white/5 text-white/30 cursor-not-allowed"
            }`}
        >
          <Video className="w-4 h-4" />
          {isPending ? "Agendando..." : "Agendar Sala"}
        </Button>
      </form>

      {/* Salas agendadas */}
      <div>
        <h4 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">
          Salas Agendadas ({rooms.length})
        </h4>

        {loading ? (
          <div className="text-center text-white/20 py-10 text-sm">Carregando...</div>
        ) : rooms.length === 0 ? (
          <div className="text-center text-white/20 py-10 text-sm">Nenhuma sala agendada ainda.</div>
        ) : (
          <div className="grid gap-3">
            {rooms.map((room) => {
              const scheduledDate = new Date(room.scheduled_at);
              const isAvailable = scheduledDate <= now;
              const isPast = scheduledDate < new Date(now.getTime() - 24 * 60 * 60 * 1000);

              return (
                <GlassCard
                  key={room.id_room}
                  className={`p-4 rounded-xl flex items-center justify-between border-white/5 transition-colors ${isPast ? "opacity-40" : "hover:bg-white/5"
                    }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {isAvailable ? (
                        <span className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">
                          <Radio className="w-2.5 h-2.5 animate-pulse" /> Disponível
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">
                          <Clock className="w-2.5 h-2.5" /> Agendada
                        </span>
                      )}
                      {room.book_name && (
                        <span className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[9px] font-bold">
                          <BookOpen className="w-2.5 h-2.5" /> {room.book_name}
                        </span>
                      )}
                      <span className="text-[9px] text-white/20 bg-white/5 px-2 py-0.5 rounded-full">{room.category}</span>
                    </div>
                    <p className="font-bold text-sm truncate">{room.title}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">
                      {scheduledDate.toLocaleDateString("pt-BR")} às {scheduledDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      {room.creator_name && ` • por ${room.creator_name}`}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(room.id_room)}
                    disabled={isPending}
                    className="text-red-400/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl shrink-0 ml-3 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
