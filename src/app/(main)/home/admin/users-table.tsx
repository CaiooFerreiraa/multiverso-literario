"use client";

import React, { useState, useTransition } from "react";
import { readUsersAction } from "@/actions/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChevronLeft, ChevronRight, Loader2, BookOpen, GraduationCap } from "lucide-react";

interface User {
  id_user: number;
  name: string;
  email: string;
  image: string | null;
  created_at: string | null;
  plan_name: string | null;
  view_type: string | null;
}

interface AdminUsersTableProps {
  initialUsers: User[];
  initialTotal: number;
  initialPage: number;
  limit: number;
}

function PlanBadge({ planName, viewType }: { planName: string | null; viewType: string | null }) {
  if (!planName) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-white/5 text-white/25 border border-white/5">
        Free
      </span>
    );
  }

  const isStudent = viewType === "student";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${
        isStudent
          ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
          : "bg-violet-500/10 text-violet-400 border-violet-500/20"
      }`}
    >
      {isStudent ? <GraduationCap className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
      {planName}
    </span>
  );
}

export function AdminUsersTable({
  initialUsers,
  initialTotal,
  initialPage,
  limit,
}: AdminUsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [total, setTotal] = useState<number>(initialTotal);
  const [page, setPage] = useState<number>(initialPage);
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.max(1, Math.ceil(total / limit));

  function goToPage(newPage: number): void {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    startTransition(async () => {
      const res = await readUsersAction(newPage, limit);
      if (res.success) {
        setUsers(res.data as User[]);
        setTotal(res.total);
        setPage(res.page);
      }
    });
  }

  function formatDate(raw: string | null): string {
    if (!raw) return "—";
    return new Date(raw).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-white/40">
          <Users className="w-4 h-4" />
          <span className="text-sm font-semibold">
            <span className="text-white font-black">{total}</span> usuários cadastrados
          </span>
        </div>
        <span className="text-xs font-bold text-white/20 uppercase tracking-widest">
          Página {page} / {totalPages}
        </span>
      </div>

      {/* Table wrapper */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        {/* Loading overlay */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl"
            >
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-[10px] font-black text-white/25 uppercase tracking-[0.25em]">#</th>
                <th className="text-left px-6 py-4 text-[10px] font-black text-white/25 uppercase tracking-[0.25em]">Usuário</th>
                <th className="text-left px-6 py-4 text-[10px] font-black text-white/25 uppercase tracking-[0.25em] hidden md:table-cell">E-mail</th>
                <th className="text-left px-6 py-4 text-[10px] font-black text-white/25 uppercase tracking-[0.25em]">Plano</th>
                <th className="text-left px-6 py-4 text-[10px] font-black text-white/25 uppercase tracking-[0.25em] hidden lg:table-cell">Cadastro</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="py-16 text-center">
                        <Users className="w-8 h-8 text-white/10 mx-auto mb-3" />
                        <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Nenhum usuário encontrado</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user, i) => (
                    <motion.tr
                      key={user.id_user}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.03] transition-colors duration-200 group"
                    >
                      {/* ID */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-white/20 group-hover:text-white/40 transition-colors">
                          {String(user.id_user).padStart(4, "0")}
                        </span>
                      </td>

                      {/* Avatar + Nome */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 border border-white/10 shrink-0">
                            <AvatarImage src={user.image ?? undefined} className="object-cover" />
                            <AvatarFallback className="bg-primary/20 text-primary font-black text-xs">
                              {user.name?.[0]?.toUpperCase() ?? "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-white/80 text-sm truncate max-w-[140px] group-hover:text-white transition-colors">
                            {user.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-white/35 text-xs font-mono truncate max-w-[200px] block">
                          {user.email}
                        </span>
                      </td>

                      {/* Plano */}
                      <td className="px-6 py-4">
                        <PlanBadge planName={user.plan_name} viewType={user.view_type} />
                      </td>

                      {/* Cadastro */}
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-white/25 text-xs">{formatDate(user.created_at)}</span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1 || isPending}
            className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              disabled={isPending}
              className={`w-9 h-9 rounded-xl border text-xs font-black transition-all duration-200 cursor-pointer disabled:cursor-wait ${
                p === page
                  ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_20px_rgba(109,40,217,0.2)]"
                  : "border-white/10 text-white/30 hover:text-white hover:border-white/20 hover:bg-white/5"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages || isPending}
            className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
