"use client"

import React, { useState, useEffect, useRef, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  MessageCircle,
  User,
  Sparkles,
  Search,
  ArrowLeft,
  Headset,
  PhoneCall,
  Clock
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { sendChatMessageAction, readChatMessagesAction } from "@/actions/chat"

interface Message {
  id: number
  id_user: number
  id_sender: number
  message: string
  created_at: string
  sender_name?: string
}

interface UserSummary {
  id_user: number
  fullname: string
  image: string | null
}

interface SuporteClientProps {
  initialMessages: Message[] | null
  adminUsers: UserSummary[] | null
  user: {
    id: number
    name: string
    image: string | null
    isAdmin: boolean
  }
}

export default function SuporteClient({ initialMessages, adminUsers, user }: SuporteClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || [])
  const [activeChatUser, setActiveChatUser] = useState<UserSummary | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Polling for new messages (simple real-time for now)
  useEffect(() => {
    const fetchId = activeChatUser ? activeChatUser.id_user : user.id
    if (user.isAdmin && !activeChatUser) return

    const interval = setInterval(async () => {
      const res = await readChatMessagesAction(fetchId)
      if (res.success && res.data) setMessages(res.data as Message[])
    }, 3000)

    return () => clearInterval(interval)
  }, [activeChatUser, user.id, user.isAdmin])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    const targetUserId = user.isAdmin && activeChatUser ? activeChatUser.id_user : user.id
    const senderId = user.id

    startTransition(async () => {
      const res = await sendChatMessageAction({
        id_user: targetUserId,
        id_sender: senderId,
        message: newMessage
      })

      if (res.success) {
        setNewMessage("")
        // Fetch new messages
        const updatedRes = await readChatMessagesAction(targetUserId)
        if (updatedRes.success && updatedRes.data) setMessages(updatedRes.data as Message[])
      } else {
        toast.error("Erro ao enviar mensagem")
      }
    })
  }

  const handleSelectUser = async (u: UserSummary) => {
    setActiveChatUser(u)
    const res = await readChatMessagesAction(u.id_user)
    if (res.success && res.data) setMessages(res.data as Message[])
  }

  const filteredUsers = adminUsers?.filter(u =>
    u.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
            <Headset className="w-10 h-10 text-primary" />
            <span>Centro de <span className="text-primary">Suporte</span></span>
          </h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] mt-2">
            {user.isAdmin ? "Área de Gerenciamento de Atendimento" : "Fale diretamente com nossa equipe Literária."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[70vh]">
        {/* User List Sidebar (Admin Only) */}
        {user.isAdmin && !activeChatUser && (
          <GlassCard className="lg:col-span-4 p-6 rounded-[2rem] flex flex-col gap-6 overflow-hidden border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                Conversas Ativas
              </h2>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  placeholder="Buscar usuário..."
                  className="pl-10 h-10 bg-white/5 border-white/10 rounded-xl focus:ring-primary focus:border-primary text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar">
              {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                <button
                  key={u.id_user}
                  onClick={() => handleSelectUser(u)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary/10 hover:border-primary/20 transition-all group text-left cursor-pointer"
                >
                  <Avatar className="w-12 h-12 border-2 border-white/10 group-hover:border-primary/30 shadow-xl">
                    <AvatarImage src={u.image || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{u.fullname[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-bold text-white truncate">{u.fullname}</span>
                    <span className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Ver Mensagens</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-primary transition-colors pr-2" />
                </button>
              )) : (
                <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                  <MessageCircle className="w-12 h-12" />
                  <p className="font-bold uppercase tracking-widest text-xs">Nenhuma conversa encontrada</p>
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {/* Chat Window */}
        {(!user.isAdmin || activeChatUser) && (
          <GlassCard className="lg:col-span-4 rounded-[2rem] flex flex-col overflow-hidden border-white/5 h-full relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32 pointer-events-none" />

            {/* Chat Top Info */}
            <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between z-10 relative">
              <div className="flex items-center gap-4">
                {user.isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setActiveChatUser(null); setMessages([]); }}
                    className="hover:bg-white/10 rounded-full cursor-pointer pr-3"
                  >
                    <ArrowLeft className="w-5 h-5 text-white/50" />
                  </Button>
                )}
                <Avatar className="w-10 h-10 border-2 border-primary/20 shadow-xl">
                  <AvatarImage src={(user.isAdmin ? activeChatUser?.image : null) || "/multiverso-logo.png"} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.isAdmin ? activeChatUser?.fullname[0] : "S"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">
                    {user.isAdmin ? activeChatUser?.fullname : "Atendimento Multiverso"}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em]">{user.isAdmin ? "Online" : "Tempo médio: 2 min"}</span>
                  </div>
                </div>
              </div>

              {!user.isAdmin && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-white/20 uppercase font-bold">Respostas rápidos</span>
                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Suporte literário</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30">
                    <Headset className="w-5 h-5 text-primary" />
                  </div>
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth relative z-10 bg-black/10"
            >
              <AnimatePresence>
                {messages.length > 0 ? messages.map((m, i) => {
                  const isMe = m.id_sender === user.id
                  return (
                    <motion.div
                      key={m.id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        <div className={`p-4 rounded-2xl shadow-xl border relative ${isMe
                          ? "bg-primary text-white border-primary/40 rounded-tr-none"
                          : "bg-white/[0.05] text-white/90 border-white/5 rounded-tl-none"
                          }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
                        </div>
                        <span className="text-[8px] text-white/20 font-black tracking-widest mt-1.5 uppercase bg-white/[0.02] px-2 py-0.5 rounded-full">
                          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  )
                }) : (
                  <div className="h-full flex flex-col items-center justify-center gap-6 opacity-20">
                    <div className="p-8 rounded-full bg-white/5 border border-white/5 scale-110">
                      <MessageCircle className="w-16 h-16" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="font-black uppercase tracking-[0.4em] text-sm">Pronto para conversar</p>
                      <p className="text-xs font-bold uppercase tracking-widest leading-none">Envie uma mensagem para iniciar o atendimento</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Bar */}
            <div className="p-5 bg-white/[0.02] border-t border-white/5 z-10 relative">
              <div className="relative flex items-center gap-3">
                <Input
                  placeholder="Escreva sua mensagem aqui..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage() }}
                  className="flex-1 h-14 bg-white/5 border-white/10 focus:ring-primary focus:border-primary rounded-2xl px-6 text-sm placeholder:text-white/20 placeholder:uppercase placeholder:font-bold placeholder:tracking-widest"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isPending || !newMessage.trim()}
                  className="h-14 w-14 rounded-2xl bg-primary hover:bg-primary/80 text-white shadow-xl shadow-primary/20 cursor-pointer active:scale-90 transition-all shrink-0"
                >
                  {isPending ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-6 h-6" />}
                </Button>
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Footer / Stats Cards (Optional for UI) */}
      {!user.isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <GlassCard className="p-5 flex items-center gap-4 bg-primary/5 hover:bg-primary/10 transition-all rounded-3xl border-primary/20 cursor-default group">
            <div className="p-3 rounded-2xl bg-primary/20 group-hover:bg-primary/30 transition-all">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-white/30 uppercase leading-none mb-1">Resposta rápida</p>
              <p className="text-xs font-bold text-white uppercase tracking-tight">Até 2 horas úteis</p>
            </div>
          </GlassCard>
          <GlassCard className="p-5 flex items-center gap-4 bg-blue-500/5 hover:bg-blue-500/10 transition-all rounded-3xl border-blue-500/20 cursor-default group">
            <div className="p-3 rounded-2xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-all">
              <Send className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-white/30 uppercase leading-none mb-1">Comunidade</p>
              <p className="text-xs font-bold text-white uppercase tracking-tight">Suporte 24/7</p>
            </div>
          </GlassCard>
          <GlassCard className="p-5 flex items-center gap-4 bg-purple-500/5 hover:bg-purple-500/10 transition-all rounded-3xl border-purple-500/20 cursor-default group">
            <div className="p-3 rounded-2xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-all">
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-white/30 uppercase leading-none mb-1">Exclusivo</p>
              <p className="text-xs font-bold text-white uppercase tracking-tight">Atendimento VIP</p>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}

function ChevronRight({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
