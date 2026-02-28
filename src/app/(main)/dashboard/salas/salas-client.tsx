"use client";
// Triggering IDE feedback

import React, { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/glass-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as LucideIcons from "lucide-react";

// Casting icons to any to resolve React 19 / JSX element type incompatibilities
const MessageSquare = LucideIcons.MessageSquare as any;
const Hash = LucideIcons.Hash as any;
const Settings = LucideIcons.Settings as any;
const Plus = LucideIcons.Plus as any;
const Send = LucideIcons.Send as any;
const Smile = LucideIcons.Smile as any;
const Users = LucideIcons.Users as any;
const Search = LucideIcons.Search as any;
const Volume2 = LucideIcons.Volume2 as any;
const Mic = LucideIcons.Mic as any;
const Headphones = LucideIcons.Headphones as any;
const ShieldCheck = LucideIcons.ShieldCheck as any;
const Crown = LucideIcons.Crown as any;
const Flame = LucideIcons.Flame as any;
const Zap = LucideIcons.Zap as any;
const Award = LucideIcons.Award as any;

export default function SalasClient({ user }: { user: any }) {
  const [activeRoom, setActiveRoom] = useState("geral");
  const [activeServer, setActiveServer] = useState("multiverso");
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Caio",
      text: "E aí pessoal! Já começaram a leitura deste mês? Dom Casmurro é um clássico que sempre gera debates épicos.",
      time: "18:42",
      avatar: "https://github.com/shadcn.png",
      isPremium: true,
      role: "admin"
    },
    {
      id: 2,
      user: "Ana Clara",
      text: "Eu comecei hoje! O Bentinho é muito ciumento, me dá uma agonia kkkkk",
      time: "18:45",
      avatar: null
    },
    {
      id: 3,
      user: "Roberto Magno",
      text: "A questão não é o ciúme, é se a Capitu traiu ou não. Eu tenho uma teoria sobre o Escobar...",
      time: "18:50",
      avatar: null,
      isPremium: true,
      role: "senior"
    },
    {
      id: 4,
      user: "Juliana Silva",
      text: "Gente, alguém viu a nova insígnia de 'Leitor Voraz'? Ficou linda demais!",
      time: "19:02",
      avatar: null
    },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      id: messages.length + 1,
      user: user.name || "Você",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: user.image || null,
      isPremium: false,
      role: "membro"
    }]);
    setNewMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-140px)] rounded-[32px] overflow-hidden glass-border bg-black/40 backdrop-blur-3xl m-6 border border-white/10 shadow-2xl relative">

      {/* 1. Server Sidebar (Far Left) - Discord Style */}
      <aside className="w-[72px] bg-black/20 flex flex-col items-center py-4 gap-3 border-r border-white/5 scrollbar-hide overflow-y-auto">
        <div
          onClick={() => setActiveServer("multiverso")}
          className={`w-12 h-12 rounded-[16px] flex items-center justify-center transition-all cursor-pointer group relative ${activeServer === "multiverso" ? "bg-primary rounded-xl" : "bg-white/5 hover:bg-primary-hover hover:rounded-xl"}`}
        >
          <Crown className={`w-6 h-6 ${activeServer === "multiverso" ? "text-white" : "text-white/40 group-hover:text-white"}`} />
          {activeServer === "multiverso" && <div className="absolute -left-1 w-1 h-8 bg-white rounded-r-lg" />}
        </div>

        <div className="w-8 h-[2px] bg-white/5 rounded-full" />

        {["C", "D", "P"].map((server) => (
          <div
            key={server}
            className="w-12 h-12 rounded-[24px] bg-white/5 flex items-center justify-center transition-all cursor-pointer hover:bg-primary hover:rounded-xl group"
          >
            <span className="text-white/40 group-hover:text-white font-bold">{server}</span>
          </div>
        ))}

        <div className="w-12 h-12 rounded-[24px] bg-white/5 flex items-center justify-center border border-dashed border-white/20 text-white/20 hover:text-green-400 hover:border-green-400/50 hover:bg-green-400/5 transition-all cursor-pointer group">
          <Plus className="w-6 h-6" />
        </div>
      </aside>

      {/* 2. Channel Sidebar (Left) */}
      <aside className="w-60 flex flex-col bg-white/3 border-r border-white/5">
        <header className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-white/2 backdrop-blur-md">
          <h2 className="font-bold text-sm tracking-tight truncate">Multiverso Literário</h2>
          <Plus className="w-4 h-4 text-white/30 cursor-pointer hover:text-white transition-colors" />
        </header>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <p className="px-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1 select-none">Canais de Texto</p>
            <div className="space-y-0.5">
              {[
                { id: "geral", label: "Geral", type: "text" },
                { id: "leitura", label: "Leitura Mensal", type: "text" },
                { id: "teorias", label: "Teorias e Plots", type: "text" },
                { id: "ajuda", label: "Suporte", type: "text" },
              ].map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => setActiveRoom(channel.id)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all group ${activeRoom === channel.id ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white/80"}`}
                >
                  <Hash className={`w-4 h-4 ${activeRoom === channel.id ? "text-primary" : "text-white/20 group-hover:text-white/40"}`} />
                  <span className="text-sm font-medium">{channel.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="px-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1 select-none">Canais de Voz</p>
            <div className="space-y-0.5">
              {[
                { id: "v-main", label: "Cantinho do Café", type: "voice" },
                { id: "v-debate", label: "Debate Semanal", type: "voice" },
              ].map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer text-white/40 hover:bg-white/5 hover:text-white/80 transition-all group"
                >
                  <Volume2 className="w-4 h-4 text-white/20 group-hover:text-white/40" />
                  <span className="text-sm font-medium">{channel.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Status Bar */}
        <div className="p-3 bg-black/40 border-t border-white/5 flex items-center gap-2">
          <div className="relative">
            <Avatar className="w-8 h-8 border border-white/10">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-[10px] bg-primary/20 text-primary font-bold">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate leading-none">{user.name}</p>
            <p className="text-[9px] text-white/30 truncate mt-1">#disponível</p>
          </div>
          <div className="flex items-center gap-0.5">
            <div className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors text-white/40 hover:text-white">
              <Mic className="w-3.5 h-3.5" />
            </div>
            <div className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors text-white/40 hover:text-white">
              <Headphones className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </aside>

      {/* 3. Chat Main Content */}
      <main className="flex-1 flex flex-col bg-white/2">
        <header className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-white/1 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-white/30" />
            <h2 className="font-bold text-sm tracking-tight">{activeRoom.toUpperCase()}</h2>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            <span className="text-xs text-white/30 font-medium">Bem-vindo à sala #{activeRoom}!</span>
          </div>
          <div className="flex items-center gap-4 text-white/30">
            <Users className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
            <div className="flex items-center bg-black/40 rounded-lg px-2 h-7 border border-white/5 group-focus-within:border-primary/50">
              <Search className="w-3.5 h-3.5 mr-2" />
              <input type="text" placeholder="Buscar" className="bg-transparent border-none text-[10px] w-24 focus:ring-0 placeholder:text-white/20" />
            </div>
            <Settings className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
          </div>
        </header>

        {/* Messages List */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="pb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Hash className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Bem-vindo(a) ao #{activeRoom}!</h1>
            <p className="text-white/40 text-sm">Este é o início do canal #{activeRoom}.</p>
            <div className="h-[1px] w-full bg-divider-gradient mt-6" />
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-4 group hover:bg-white/3 -mx-2 px-2 py-1.5 rounded-xl transition-colors relative">
              <Avatar className="w-10 h-10 mt-1 cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg ring-2 ring-white/5">
                <AvatarImage src={msg.avatar || ""} />
                <AvatarFallback className={`bg-white/5 text-xs font-bold ${msg.isPremium ? 'text-amber-400 border border-amber-500/30' : 'text-primary/60'}`}>
                  {msg.user.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className={`text-sm font-bold cursor-pointer hover:underline ${msg.isPremium ? 'text-amber-400' : 'text-white'}`}>
                    {msg.user}
                  </span>
                  {msg.role === 'admin' && (
                    <span className="bg-primary/20 text-primary text-[8px] font-bold px-1.5 rounded flex items-center gap-0.5 h-4">
                      <ShieldCheck className="w-2 h-2" /> ADMIN
                    </span>
                  )}
                  <span className="text-[10px] text-white/20 font-medium">{msg.time}</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed break-words">{msg.text}</p>
              </div>

              <div className="absolute right-4 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 border border-white/10 rounded-lg p-1 flex gap-1 shadow-2xl backdrop-blur-md">
                <div className="p-1 hover:bg-white/10 rounded cursor-pointer"><Smile className="w-3.5 h-3.5 text-white/40" /></div>
                <div className="p-1 hover:bg-white/10 rounded cursor-pointer"><Plus className="w-3.5 h-3.5 text-white/40" /></div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="px-6 pb-6 pt-2">
          <div className="relative group">
            <div className="absolute inset-x-0 bottom-full h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            <div className="relative bg-white/5 border border-white/10 rounded-2xl flex flex-col shadow-2xl focus-within:border-primary/50 transition-all duration-300 backdrop-blur-2xl">

              {/* Toolbar */}
              <div className="flex items-center gap-1 p-1 border-b border-white/5">
                <div className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors text-white/30 hover:text-primary">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors text-white/30 hover:text-white">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center gap-3 p-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Conversar em #${activeRoom}...`}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm h-10 p-0 shadow-none text-white placeholder:text-white/20"
                />

                <div className="flex items-center gap-2">
                  <div className="p-2 hover:bg-white/10 rounded-xl cursor-pointer transition-colors text-white/30 hover:text-amber-400">
                    <Smile className="w-5 h-5" />
                  </div>
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`w-10 h-10 rounded-xl transition-all duration-300 ${newMessage.trim() ? 'bg-primary scale-100 shadow-lg shadow-primary/30' : 'bg-white/5 scale-95 opacity-50 cursor-not-allowed'}`}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. User List Sidebar (Right) */}
      <aside className="w-60 bg-white/3 border-l border-white/5 hidden xl:flex flex-col">
        <header className="h-12 border-b border-white/5 flex items-center px-4 bg-white/1 backdrop-blur-md">
          <h3 className="font-bold text-[10px] tracking-widest uppercase text-white/30">Membros — 12</h3>
        </header>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <p className="px-2 text-[9px] font-bold text-white/20 uppercase tracking-widest mb-2">Administração — 1</p>
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group">
              <div className="relative">
                <Avatar className="w-8 h-8 border border-primary/30 ring-2 ring-primary/10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">CA</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1a1a1a]" />
              </div>
              <span className="text-sm font-bold text-primary truncate group-hover:text-primary-hover">Caio</span>
              <Crown className="w-3 h-3 text-amber-500 ml-auto" />
            </div>
          </div>

          <div>
            <p className="px-2 text-[9px] font-bold text-white/20 uppercase tracking-widest mb-2">Sênior — 2</p>
            {[
              { name: "Roberto Magno", icon: <Flame className="w-3 h-3 text-orange-500" /> },
              { name: "Mariana Santos", icon: <Zap className="w-3 h-3 text-blue-400" /> },
            ].map((user) => (
              <div key={user.name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group">
                <div className="relative">
                  <Avatar className="w-8 h-8 border border-amber-500/20">
                    <AvatarFallback className="bg-white/5 text-[10px] text-amber-500 font-bold">{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1a1a1a]" />
                </div>
                <span className="text-sm font-bold text-white/70 truncate group-hover:text-white transition-colors">{user.name}</span>
                <span className="ml-auto">{user.icon}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="px-2 text-[9px] font-bold text-white/20 uppercase tracking-widest mb-2">Exploradores — 9</p>
            {["Ana Clara", "Juliana", "Pedro", "Lucas", "Bia"].map((name) => (
              <div key={name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group opacity-60 hover:opacity-100 transition-opacity">
                <Avatar className="w-8 h-8 border border-white/5">
                  <AvatarFallback className="bg-white/5 text-[10px] text-white/30 font-bold">{name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-white/50 truncate group-hover:text-white/80 transition-colors">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <style jsx global>{`
        .bg-divider-gradient {
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.05) 50%, transparent);
        }
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
