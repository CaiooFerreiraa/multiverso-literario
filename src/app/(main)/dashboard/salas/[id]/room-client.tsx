"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { useRouter } from "next/navigation";

const Mic = LucideIcons.Mic as any;
const MicOff = LucideIcons.MicOff as any;
const Video = LucideIcons.Video as any;
const VideoOff = LucideIcons.VideoOff as any;
const MonitorUp = LucideIcons.MonitorUp as any;
const Hand = LucideIcons.Hand as any;
const MessageSquare = LucideIcons.MessageSquare as any;
const Users = LucideIcons.Users as any;
const Phone = LucideIcons.Phone as any;
const Send = LucideIcons.Send as any;
const X = LucideIcons.X as any;
const MoreVertical = LucideIcons.MoreVertical as any;
const Smile = LucideIcons.Smile as any;
const Crown = LucideIcons.Crown as any;
const Clock = LucideIcons.Clock as any;
const Copy = LucideIcons.Copy as any;
const Shield = LucideIcons.Shield as any;
const Radio = LucideIcons.Radio as any;
const Info = LucideIcons.Info as any;

interface RoomClientProps {
  roomId: string;
  user: {
    id: string | number;
    name: string;
    email: string;
    image: string | null;
  };
}

interface Participant {
  id: string;
  name: string;
  avatar: string | null;
  isMuted: boolean;
  isCameraOff: boolean;
  isSpeaking: boolean;
  isHost: boolean;
  handRaised: boolean;
}

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  time: string;
  avatar: string | null;
  isSystem?: boolean;
}

const MOCK_PARTICIPANTS: Participant[] = [
  { id: "1", name: "Caio", avatar: "https://github.com/shadcn.png", isMuted: false, isCameraOff: false, isSpeaking: true, isHost: true, handRaised: false },
  { id: "2", name: "Ana Clara", avatar: null, isMuted: true, isCameraOff: false, isSpeaking: false, isHost: false, handRaised: false },
  { id: "3", name: "Roberto Magno", avatar: null, isMuted: false, isCameraOff: true, isSpeaking: false, isHost: false, handRaised: true },
  { id: "4", name: "Juliana Silva", avatar: null, isMuted: true, isCameraOff: false, isSpeaking: false, isHost: false, handRaised: false },
  { id: "5", name: "Pedro Lima", avatar: null, isMuted: true, isCameraOff: true, isSpeaking: false, isHost: false, handRaised: false },
];

const MOCK_MESSAGES: ChatMessage[] = [
  { id: 1, sender: "", text: "Caio iniciou a sala", time: "18:30", avatar: null, isSystem: true },
  { id: 2, sender: "Caio", text: "E aí pessoal! Vamos começar o debate sobre Dom Casmurro?", time: "18:31", avatar: "https://github.com/shadcn.png" },
  { id: 3, sender: "Ana Clara", text: "Bora! Eu estou super empolgada com esse tema 📚", time: "18:32", avatar: null },
  { id: 4, sender: "Roberto Magno", text: "A questão central é: Machado intencionalmente deixou ambíguo ou há provas textuais de traição?", time: "18:33", avatar: null },
  { id: 5, sender: "Juliana Silva", text: "Eu acho que o narrador não confiável é a chave. Bentinho é obsessivo.", time: "18:35", avatar: null },
  { id: 6, sender: "Caio", text: "Exatamente! O ponto de vista do Bentinho contamina tudo. Eles olhos de cigana oblíqua e dissimulada — é ele que projeta isso.", time: "18:36", avatar: "https://github.com/shadcn.png" },
];

export default function RoomClient({ roomId, user }: RoomClientProps) {
  const router = useRouter();
  const chatRef = useRef<HTMLDivElement>(null);

  // Controls
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Panels
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  // Timer
  const [elapsed, setElapsed] = useState(0);

  // Reactions
  const [reactions, setReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  // Jitsi Media
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);

  // Room info
  const roomTitle = roomId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);

    // Load Jitsi Script
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => {
      if (jitsiContainerRef.current) {
        const domain = "meet.ffmuc.net"; // Community server without the 5-min limit / JaaS warning
        const options = {
          roomName: `multiverso-${roomId}`,
          width: "100%",
          height: "100%",
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: user.name,
            email: user.email,
          },
          configOverwrite: {
            startWithAudioMuted: !isMicOn,
            startWithVideoMuted: !isCameraOn,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            disableThirdPartyRequests: true,
            toolbarButtons: [],
            hideConferenceSubject: true,
            hideConferenceTimer: true,
            hideParticipantsStats: true,
            disableReactions: true,
            notifications: [],
            disablePolls: true,
            disableProfile: true,
            hideDisplayName: false,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_POWERED_BY: false,
            JITSI_WATERMARK_LINK: '',
            SHOW_CHROME_EXTENSION_BANNER: false,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            HIDE_INVITE_MORE_HEADER: true,
            DISABLE_FOCUS_INDICATOR: true,
            MOBILE_APP_PROMO: false,
            FILM_STRIP_MAX_HEIGHT: 100,
            VIDEO_LAYOUT_FIT: 'both',
          },
        };
        const api = new (window as any).JitsiMeetExternalAPI(domain, options);
        jitsiApiRef.current = api;

        // Listen for Jitsi Chat Messages
        api.addEventListener('chatMessageReceived', (data: any) => {
          if (data.id !== api._myUserID) { // Avoid duplicates from self
            setMessages(prev => [...prev, {
              id: Date.now(),
              sender: data.nick || "Participante",
              text: data.message,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              avatar: null
            }]);
            if (!showChat) setUnreadCount(c => c + 1);
          }
        });

        // Listen for Custom Events (Reactions) via endpointTextMessageReceived
        api.addEventListener('endpointTextMessageReceived', (data: any) => {
          try {
            const payload = JSON.parse(data.data.text);
            if (payload.type === 'REACTION') {
              const id = Date.now();
              const x = Math.random() * 60 + 20;
              setReactions((prev) => [...prev, { id, emoji: payload.emoji, x }]);
              setTimeout(() => setReactions((prev) => prev.filter((r) => r.id !== id)), 4000);
            }
          } catch (e) {
            // Not a reaction or invalid JSON
          }
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      clearInterval(timer);
      if (jitsiApiRef.current) jitsiApiRef.current.dispose();
      document.body.removeChild(script);
    };
  }, []);

  // Update Jitsi state when local controls change
  useEffect(() => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("toggleAudio", isMicOn);
    }
  }, [isMicOn]);

  useEffect(() => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("toggleVideo", isCameraOn);
    }
  }, [isCameraOn]);

  useEffect(() => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("toggleRaiseHand", isHandRaised);
    }
  }, [isHandRaised]);

  useEffect(() => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("toggleShareScreen", isScreenSharing);
    }
  }, [isScreenSharing]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendReaction = (emoji: string) => {
    // Local display
    const id = Date.now();
    const x = Math.random() * 60 + 20;
    setReactions((prev) => [...prev, { id, emoji, x }]);
    setTimeout(() => setReactions((prev) => prev.filter((r) => r.id !== id)), 4000);

    // Broadcast via Jitsi
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('sendEndpointTextMessage', '', JSON.stringify({
        type: 'REACTION',
        emoji
      }));
    }

    setShowReactionPicker(false);
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Send via Jitsi
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('sendChatMessage', newMessage, '', true);
    }

    // Local display
    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: user.name,
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: user.image,
      },
    ]);
    setNewMessage("");
  };

  const handleLeave = () => {
    router.push("/dashboard/salas");
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    setShowParticipants(false);
    setShowInfo(false);
    if (!showChat) setUnreadCount(0);
  };

  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
    setShowChat(false);
    setShowInfo(false);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
    setShowChat(false);
    setShowParticipants(false);
  };

  const hasSidepanel = showChat || showParticipants || showInfo;

  return (
    <div className="flex flex-col h-screen bg-[#0a0a14] overflow-hidden">
      {/* CSS para esconder TODA a UI nativa do Jitsi */}
      <style jsx global>{`
        /* Esconder toolbar nativa do Jitsi */
        .new-toolbox, .toolbox-content-items,
        #new-toolbox, .subject, .meeting-info-container,
        .subject-info-container, .conference-timer,
        .watermark, .leftwatermark, .rightwatermark,
        .powered-by, .oJlr0 { display: none !important; }
        /* Esconder header da conferência */
        .oJlr0, .oTusO { display: none !important; }
        /* Esconder notificações */
        .oJlr0, .oTusO, .oJlr0 { display: none !important; }
        /* Esconder filmstrip labels e outros overlays */
        .oAVFo, .oW0CQ { display: none !important; }
        /* Container do iframe Jitsi - garantir que só o vídeo apareça */
        iframe[id^="jitsiConference"] {
          border: none !important;
        }
        /* Esconder qualquer borda ou padding do container */
        .oJlr0 { display: none !important; }
      `}</style>

      {/* Top Bar - compacto no mobile */}
      <header className="h-11 sm:h-14 flex items-center justify-between px-3 sm:px-4 lg:px-6 border-b border-white/5 bg-black/40 backdrop-blur-xl z-20 shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 bg-red-500/15 px-2 py-0.5 sm:py-1 rounded-full">
              <Radio className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400 animate-pulse" />
              <span className="text-[8px] sm:text-[10px] font-bold text-red-400 uppercase tracking-wider hidden sm:inline">Ao Vivo</span>
            </div>
            <div className="w-[1px] h-3 sm:h-4 bg-white/10 hidden sm:block" />
            <span className="text-[10px] sm:text-xs font-medium text-white/40 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              {formatTime(elapsed)}
            </span>
          </div>
        </div>

        <h1 className="text-xs sm:text-sm font-bold text-white/70 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[400px] absolute left-1/2 -translate-x-1/2">
          {roomTitle}
        </h1>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={toggleInfo}
            className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer ${showInfo ? "bg-primary/20 text-primary" : "text-white/40 hover:bg-white/5 hover:text-white"}`}
          >
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg px-3 py-1.5 border border-white/5">
            <Users className="w-3.5 h-3.5 text-white/40" />
            <span className="text-xs font-bold text-white/50">Ativa</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area (Jitsi Container) */}
        <div className="flex-1 relative bg-black overflow-hidden">
          <div ref={jitsiContainerRef} className="absolute inset-0 w-full h-full" />

          {/* Reactions Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            <AnimatePresence>
              {reactions.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ y: "100%", opacity: 0, x: `${r.x}%` }}
                  animate={{ y: "-20%", opacity: [0, 1, 1, 0], scale: [1, 1.5, 1.2, 1] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 3, ease: "easeOut" }}
                  className="absolute text-3xl select-none"
                >
                  {r.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Control Bar - responsivo: compacto no mobile */}
          <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center px-3 sm:px-6 py-2 sm:py-3 bg-black/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shrink-0 z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-[calc(100vw-2rem)]">
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all cursor-pointer ${isMicOn ? "bg-white/10 text-white hover:bg-white/15" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}`}
              >
                {isMicOn ? <Mic className="w-4 h-4 sm:w-5 sm:h-5" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all cursor-pointer ${isCameraOn ? "bg-white/10 text-white hover:bg-white/15" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}`}
              >
                {isCameraOn ? <Video className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl items-center justify-center transition-all cursor-pointer hidden md:flex ${isScreenSharing ? "bg-primary/20 text-primary hover:bg-primary/30" : "bg-white/10 text-white hover:bg-white/15"}`}
              >
                <MonitorUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => setIsHandRaised(!isHandRaised)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all cursor-pointer ${isHandRaised ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30" : "bg-white/10 text-white hover:bg-white/15"}`}
              >
                <Hand className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowReactionPicker(!showReactionPicker)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all cursor-pointer hidden sm:flex ${showReactionPicker ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30" : "bg-white/10 text-white hover:bg-white/15"}`}
                >
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <AnimatePresence>
                  {showReactionPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: -60, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 bg-black/80 backdrop-blur-xl border border-white/10 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-2xl z-[100]"
                    >
                      {["💖", "👍", "🎉", "😂", "😮", "😢"].map((emoji) => (
                        <button key={emoji} onClick={() => handleSendReaction(emoji)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl hover:bg-white/10 rounded-lg sm:rounded-xl transition-all hover:scale-125 cursor-pointer">
                          {emoji}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-[1px] h-6 sm:h-8 bg-white/10 mx-0.5 sm:mx-1 hidden sm:block" />

              <button
                onClick={toggleChat}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${showChat ? "bg-primary/20 text-primary hover:bg-primary/30" : "bg-white/10 text-white hover:bg-white/15"}`}
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && !showChat && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-[8px] sm:text-[9px] font-bold text-white">{unreadCount}</span>
                  </div>
                )}
              </button>

              <button
                onClick={toggleParticipants}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl items-center justify-center transition-all cursor-pointer hidden sm:flex ${showParticipants ? "bg-primary/20 text-primary hover:bg-primary/30" : "bg-white/10 text-white hover:bg-white/15"}`}
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="w-[1px] h-6 sm:h-8 bg-white/10 mx-0.5 sm:mx-1 hidden sm:block" />

              <button
                onClick={handleLeave}
                className="h-10 sm:h-12 px-3 sm:px-5 rounded-xl sm:rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center gap-1.5 sm:gap-2 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] cursor-pointer"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 rotate-[135deg]" />
                <span className="hidden sm:inline text-sm">Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Side Panels */}
        <AnimatePresence>
          {hasSidepanel && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: typeof window !== 'undefined' && window.innerWidth < 640 ? window.innerWidth : 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="h-full border-l border-white/5 bg-black/80 sm:bg-black/40 backdrop-blur-xl flex flex-col overflow-hidden shrink-0 absolute sm:relative right-0 z-30 w-full sm:w-auto"
            >
              {showChat && (
                <div className="flex flex-col h-full">
                  <div className="h-14 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
                    <h3 className="text-sm font-bold">Chat da Sala</h3>
                    <button onClick={() => setShowChat(false)} className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                    {messages.map((msg) => (
                      <div key={msg.id}>
                        {msg.isSystem ? (
                          <div className="flex items-center justify-center">
                            <span className="text-[10px] text-white/20 bg-white/5 px-3 py-1 rounded-full font-medium">{msg.text}</span>
                          </div>
                        ) : (
                          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="group">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                                <AvatarImage src={msg.avatar || ""} />
                                <AvatarFallback className="bg-white/5 text-[9px] font-bold text-white/40">{msg.sender.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-0.5">
                                  <span className="text-xs font-bold text-white/80">{msg.sender}</span>
                                  <span className="text-[9px] text-white/20">{msg.time}</span>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed break-words">{msg.text}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-white/5 shrink-0">
                    <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/5 focus-within:border-primary/30 transition-colors">
                      <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} placeholder="Enviar mensagem..." className="flex-1 bg-transparent text-sm border-none outline-none placeholder:text-white/20 cursor-text" />
                      <button onClick={handleSendMessage} disabled={!newMessage.trim()} className={`p-1.5 rounded-lg transition-all cursor-pointer ${newMessage.trim() ? "text-primary hover:bg-primary/20" : "text-white/10 cursor-not-allowed"}`}>
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showParticipants && (
                <div className="flex flex-col h-full">
                  <div className="h-14 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
                    <h3 className="text-sm font-bold">Participantes</h3>
                    <button onClick={() => setShowParticipants(false)} className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    <p className="text-xs text-white/40 p-4 text-center italic">Gerenciados pela sala Jitsi</p>
                  </div>
                </div>
              )}

              {showInfo && (
                <div className="flex flex-col h-full">
                  <div className="h-14 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
                    <h3 className="text-sm font-bold">Sobre a Sala</h3>
                    <button onClick={() => setShowInfo(false)} className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    <div>
                      <h4 className="text-lg font-bold mb-2">{roomTitle}</h4>
                      <p className="text-sm text-white/40 leading-relaxed">Sala segura via 8x8 Jitsi Meet. Aproveite o debate!</p>
                    </div>
                    <div className="space-y-3 font-medium text-white/50 text-sm">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 opacity-50" />
                        <span>Duração: {formatTime(elapsed)}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                      <p className="text-xs text-primary/80">O Link para convidados é o URL da barra de endereços.</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
