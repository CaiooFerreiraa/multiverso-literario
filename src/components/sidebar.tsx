"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import {
  Menu,
  X,
  LogOut,
  User,
  ShieldAlert,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  user: {
    id: number;
    name: string;
    email: string;
    image?: string | null;
    isAdmin?: boolean;
    points?: number;
    challengesCompleted?: number;
  };
  viewType: 'student' | 'adult' | 'free';
}

export function Sidebar({ user, viewType }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isStudent = viewType === 'student';

  const menuItems = [
    { label: "Home", icon: LucideIcons.LayoutDashboard, href: "/dashboard" },
    { label: "Salas", icon: LucideIcons.Video, href: "/dashboard/salas" },
    ...(!isStudent ? [{ label: "Plano", icon: LucideIcons.Star, href: "/dashboard/planos" }] : []),
    { label: "Desafios", icon: LucideIcons.Gamepad2, href: "/dashboard/desafios" },
    { label: "Quizzes", icon: LucideIcons.Ticket, href: "/dashboard/quizzes" },
    { label: "Frases", icon: LucideIcons.Quote, href: "/dashboard/frases" },
    { label: "Biblioteca", icon: LucideIcons.Library, href: "/dashboard/biblioteca" },
    { label: "Ranking", icon: LucideIcons.Trophy, href: "/dashboard/ranking" },
    { label: "Suporte", icon: LucideIcons.MessageCircle, href: "/dashboard/suporte" },
    ...(user.isAdmin && !isStudent ? [{ label: "Admin", icon: ShieldAlert, href: "/dashboard/admin" }] : []),
  ];

  const handleSignOut = () => signOut({ callbackUrl: "/login" });

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <div className={`${mobile ? "block" : "hidden lg:block"} mb-12 uppercase`}>
        <h1 className="text-2xl font-black tracking-tighter text-white">
          MULTIVERSO
        </h1>
        <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-medium leading-none mt-1">Literário</p>
      </div>

      {/* User Info (Mobile only at top) */}
      {mobile && (
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
          <Avatar className="w-12 h-12 border border-white/10">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white truncate">{user.name}</span>
            <span className="text-[10px] text-white/30 uppercase tracking-widest">{viewType} Member</span>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-4 mb-3">Menu</p>
          {menuItems.map((navItem, i) => {
            const realActive = navItem.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(navItem.href);

            return (
              <Link key={i} href={navItem.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-4 h-12 rounded-xl px-4 transition-all duration-300 cursor-pointer group active:scale-95 mb-1 ${realActive
                    ? "bg-primary/20 text-white font-bold shadow-[0_0_20px_rgba(109,40,217,0.3)] ring-1 ring-primary/30"
                    : "text-white/40 hover:text-white hover:bg-white/5 hover:translate-x-1"
                    }`}
                >
                  <navItem.icon className={`w-5 h-5 transition-all ${realActive ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(109,40,217,0.8)]" : "group-hover:scale-110"}`} />
                  <span className="flex-1 text-left tracking-wide">{navItem.label}</span>
                  {realActive && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_#6d28d9,0_0_20px_#6d28d9]" />}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="pt-8 border-t border-white/5 space-y-6">
        <div className="flex flex-col gap-3">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] px-4">Seu Perfil</p>
          <Link href="/dashboard/perfil">
            <div className="flex items-center gap-3 mx-4 p-2.5 bg-white/[0.03] rounded-xl border border-white/5 group hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden group/profile shadow-lg shadow-black/20">
              <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 blur-xl rounded-full" />
              <Avatar className="w-9 h-9 border-2 border-primary/20 shrink-0">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 z-10">
                <span className="text-xs font-bold text-white truncate leading-tight">{user.name}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[7px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded uppercase font-black tracking-tighter shrink-0">EXPLORADOR</span>
                  <span className="text-[8px] text-white/20 uppercase tracking-widest font-bold group-hover/profile:text-white transition-colors truncate">EDITAR PERFIL</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Points Section */}
        <div className="px-4">
          <div className="group relative p-3.5 bg-gradient-to-br from-primary/10 to-transparent rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden cursor-default shadow-lg shadow-black/20">
            <div className="absolute top-0 right-0 w-10 h-10 bg-primary/20 blur-xl rounded-full translate-x-2 -translate-y-2 group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-end gap-1.5 mb-1.5">
                <LucideIcons.Zap className="w-4 h-4 text-amber-400 fill-amber-400 group-hover:animate-pulse mb-0.5" />
                <span className="text-xl font-black text-amber-400 tracking-tighter leading-none">
                  {user.points || 0}
                </span>
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-0.5">pts</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="text-[9px] text-white/40 uppercase tracking-[0.1em] font-bold">
                  {user.challengesCompleted || 0} Desafios Completados
                </p>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((user.points || 0) / 10, 100)}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-primary shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-between gap-4 px-4 py-3 text-white/40 hover:text-red-400 transition-all group cursor-pointer uppercase font-black italic tracking-widest text-[11px]"
        >
          <div className="flex items-center gap-3">
            <LucideIcons.ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>SAIR</span>
          </div>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* MOBILE HEADER (Hamburguer) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
          Multiverso
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/70 cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-72 flex-col p-8 border-r border-white/5 bg-[#0f1235]/40 backdrop-blur-3xl z-40 h-screen overflow-y-auto scrollbar-hide shadow-[10px_0_40px_rgba(0,0,0,0.3)]">
        <div className="absolute top-0 left-0 w-full h-32 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
        <SidebarContent />
      </aside>

      {/* MOBILE SIDEBAR (Animated) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />
            {/* Menu Panel */}
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 flex flex-col p-8 border-r border-white/10 bg-[#0f1235]/90 backdrop-blur-3xl z-[70] h-screen overflow-y-auto scrollbar-hide shadow-2xl"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
