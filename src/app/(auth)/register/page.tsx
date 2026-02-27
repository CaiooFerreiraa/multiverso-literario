"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

import { loginAction } from "@/actions/auth";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerUserAction } from "@/actions/users/register";
// Mantenho o Skeleton original
function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-14 rounded-2xl text-lg font-semibold bg-primary hover:bg-primary/80 transition-all duration-300 shadow-[0_0_20px_rgba(109,40,217,0.3)] disabled:opacity-50"
    >
      {pending ? "Criando conta..." : "Registrar"}
    </Button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUserAction, null);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl grid md:grid-cols-[1fr_1.2fr] overflow-hidden glass-card rounded-[40px] shadow-2xl border border-white/5"
      >
        {/* Lado Esquerdo: Identidade Visual e Ambientação */}
        <div className="relative hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/30 to-background/50 overflow-hidden">
          <div className="z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/30 mb-6 leading-tight">
                Crie sua própria <br /> Odisseia.
              </h2>
              <p className="text-white/60 text-lg leading-relaxed max-w-sm">
                Entre para o multiverso onde leitores e escritores moldam o destino da literatura em tempo real.
              </p>
            </motion.div>
          </div>

          <div className="z-10 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">📖</span>
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">Acesso Total</h4>
                <p className="text-white/40 text-[10px] leading-tight">Participe de fóruns, timelines e quizzes exclusivos da comunidade literária.</p>
              </div>
            </div>

            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold text-center">
              A maior comunidade literária interativa
            </p>
          </div>

          {/* Efeitos de Luz Decorativos */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        </div>

        {/* Lado Direito: O Formulário de Cadastro */}
        <div className="p-8 md:p-14 flex flex-col justify-center bg-white/[0.01]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Comece sua jornada</h1>
            <p className="text-white/40 text-sm">Preencha seus dados para entrar no multiverso.</p>
          </div>

          <form action={formAction} className="space-y-5">
            {state?.error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs flex items-center gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 font-bold">!</span>
                {state.error}
              </motion.div>
            )}

            {state?.success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-xs"
              >
                Convocação aceita! Redirecionando para as salas...
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-white/30 ml-2 uppercase tracking-widest">Nome Completo</label>
                <Input name="fullname" placeholder="Ex: Machado de Assis" required className="modern-input" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/30 ml-2 uppercase tracking-widest">Email</label>
                <Input name="email" type="email" placeholder="seu@email.com" required className="modern-input" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/30 ml-2 uppercase tracking-widest">Nascimento</label>
                <Input name="birthday" type="date" required className="modern-input [color-scheme:dark]" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/30 ml-2 uppercase tracking-widest">Cidade</label>
                <Input name="city" placeholder="Sua cidade" required className="modern-input" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/30 ml-2 uppercase tracking-widest">WhatsApp</label>
                <Input name="phoneNumber" type="tel" placeholder="11999999999" required className="modern-input" />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-white/30 ml-2 uppercase tracking-widest">Defina sua Senha</label>
                <Input name="password" type="password" placeholder="Mínimo 6 caracteres" required className="modern-input" />
              </div>
            </div>

            <div className="flex items-start gap-3 py-2 px-2">
              <Checkbox id="terms" required className="mt-0.5 border-white/20 data-[state=checked]:bg-primary" />
              <label htmlFor="terms" className="text-[10px] text-white/40 leading-snug cursor-pointer group hover:text-white/60 transition-colors">
                Ao clicar em registrar, você aceita nossos <span className="text-white/60 group-hover:text-primary transition-colors">Termos de Uso</span> e a <span className="text-white/60 group-hover:text-primary transition-colors">Privacidade Literária</span>.
              </label>
            </div>

            <div className="pt-2">
              <RegisterButton />
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-white/30">
              Já é um explorador?{" "}
              <Link href="/login" className="text-white hover:text-primary transition-colors font-bold ml-1">
                Acesse sua conta
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .modern-input {
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 14px !important;
          height: 3rem !important;
          padding: 0 1rem !important;
          font-size: 0.85rem !important;
          transition: all 0.3s ease !important;
          color: white !important;
        }
        .modern-input:focus {
          background: rgba(255, 255, 255, 0.04) !important;
          border-color: rgba(109, 40, 217, 0.5) !important;
          box-shadow: 0 0 15px rgba(109, 40, 217, 0.1) !important;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
}
