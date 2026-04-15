"use client";

import React, { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  createScheduledRoomAction,
  listScheduledRoomsAction as readAllRoomsAction,
  deleteScheduledRoomAction as deleteRoomAction,
  closeRoomAction as toggleRoomStatusAction,
} from "@/actions/rooms";
import {
  Video,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Users,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AdminRoomsForm() {
  const [isPending, startTransition] = useTransition();
  const [rooms, setRooms] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    scheduledAt: "",
    meetingUrl: "",
  });

  useEffect(() => { loadRooms(); }, []);

  async function loadRooms() {
    const res = await readAllRoomsAction();
    if (res.success) setRooms(res.data as any[]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.scheduledAt || !form.meetingUrl) {
      toast.error("Preencha o título, a data e o link do Meet");
      return;
    }

    startTransition(async () => {
      const res = await createScheduledRoomAction({
        title: form.title,
        category: "Meet",
        meetingUrl: form.meetingUrl,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });

      if (res.success) {
        toast.success("Sala agendada!");
        setForm({
          title: "",
          scheduledAt: "",
          meetingUrl: "",
        });
        loadRooms();
      } else {
        toast.error("Erro: " + res.error);
      }
    });
  };

  const handleDelete = async (id: number) => {
    const res = await deleteRoomAction(id);
    if (res.success) {
      toast.success("Sala removida");
      loadRooms();
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    // Para salas agendadas, toggleStatus geralmente significa desativar (fechar)
    const res = await toggleRoomStatusAction(id);
    if (res.success) {
      toast.success("Status atualizado!");
      loadRooms();
    } else {
      toast.error(res.error || "Erro ao atualizar status");
    }
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="bg-white/[0.025] border border-white/8 rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                <Video className="w-3 h-3 text-primary" /> Título do Encontro
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Debate: Dom Casmurro - Cap 1 a 10"
                className="focus:border-primary/40 cursor-text"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                <Calendar className="w-3 h-3 text-emerald-400" /> Data e hora
              </label>
              <Input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                className="[color-scheme:dark] focus:border-emerald-500/40 cursor-text"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
              <LinkIcon className="w-3 h-3 text-sky-400" /> Link do Meet
            </label>
            <Input
              value={form.meetingUrl}
              onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })}
              placeholder="https://meet.google.com/..."
              className="focus:border-sky-500/40 cursor-text"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm uppercase tracking-wider gap-2 cursor-pointer transition-all shadow-lg shadow-primary/20"
          >
            {isPending ? <Clock className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Agendar Encontro
          </Button>
        </form>
      </div>

      {/* List */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.25em]">Encontros Agendados</p>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {rooms.map((room: any) => (
              <motion.div
                key={room.id_room}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${!room.is_active ? 'opacity-40 grayscale bg-white/[0.01] border-white/5' : 'bg-white/[0.025] border-white/8 hover:border-white/15'
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${room.is_active ? 'bg-primary/10' : 'bg-white/5'}`}>
                  <Video className={`w-5 h-5 ${room.is_active ? 'text-primary' : 'text-white/20'}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white truncate">{room.title}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">
                    {new Date(room.scheduled_at).toLocaleString('pt-BR')} · Google Meet
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {room.meeting_url && (
                    <a
                      href={room.meeting_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 inline-flex items-center gap-1.5"
                    >
                      Abrir Meet
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {room.is_active && (
                    <button
                      onClick={() => handleToggle(room.id_room, room.is_active)}
                      className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer text-white/40 hover:text-white"
                    >
                      Encerrar
                    </button>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2.5 text-white/10 hover:text-red-400 hover:bg-red-400/10 rounded-xl cursor-pointer transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#0d0f2b] border-white/10 text-white rounded-3xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black uppercase tracking-tighter">Remover sala?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/40 font-medium">
                          O agendamento "{room.title}" será permanentemente removido.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-none h-11 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(room.id_room)} className="bg-red-500/10 hover:bg-red-500 text-red-100 h-11 rounded-xl border border-red-500/20 text-xs font-bold uppercase tracking-widest cursor-pointer">
                          Confirmar Exclusão
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {rooms.length === 0 && (
            <div className="py-20 text-center border border-dashed border-white/8 rounded-3xl">
              <Users className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="text-xs text-white/20 font-black uppercase tracking-widest">Nenhuma sala ativa</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
