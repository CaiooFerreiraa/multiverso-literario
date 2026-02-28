import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import * as LucideIcons from "lucide-react";
const MessageSquare = LucideIcons.MessageSquare as any;
import SalasClient from "./salas-client";

export default async function SalasPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="px-6 lg:px-12 py-6 border-b border-white/5 flex items-center justify-between backdrop-blur-3xl bg-black/20 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
            <MessageSquare className="text-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Salas de Conversa</h1>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Multiverso Community</p>
          </div>
        </div>
        <a href="/dashboard" className="text-sm text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
          &larr; Voltar ao Dashboard
        </a>
      </header>

      <div className="flex-1 overflow-hidden relative">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[150px] rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[150px] rounded-full -ml-48 -mb-48 pointer-events-none" />

        <SalasClient
          user={{
            id: (session.user as any).id,
            name: session.user.name || "Explorador",
            email: session.user.email || "",
            image: (session.user as any).image || null
          }}
        />
      </div>
    </div>
  );
}
