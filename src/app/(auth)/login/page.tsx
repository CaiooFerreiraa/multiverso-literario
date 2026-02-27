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

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-14 rounded-2xl text-lg font-semibold bg-primary hover:bg-primary/80 transition-all duration-300 shadow-[0_0_20px_rgba(109,40,217,0.3)] hover:shadow-[0_0_30px_rgba(109,40,217,0.5)] disabled:opacity-50"
    >
      {pending ? "Conectando..." : "Logar"}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden glass-card rounded-[40px]"
      >
        {/* Lado Esquerdo: Visual/Intro */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/20 to-transparent relative overflow-hidden border-r border-white/5">
          <div className="z-10">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40 mb-4">
              Explore o Multiverso.
            </h2>
            <p className="text-white/50 text-lg leading-relaxed max-w-xs">
              Onde as vozes literárias se encontram entre as estrelas. Conecte-se e compartilhe sua paixão.
            </p>
          </div>

          <div className="z-10 mt-auto">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1E1B4B] overflow-hidden bg-white/10">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#1E1B4B] bg-primary flex items-center justify-center text-[10px] font-bold">
                +1.2k
              </div>
            </div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold">
              Junte-se à comunidade literária
            </p>
          </div>

          {/* Decorativo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_oklch(0.55_0.25_280_/_10%),_transparent_70%)] blur-3xl pointer-events-none" />
        </div>

        {/* Lado Direito: Formulário */}
        <div className="p-10 md:p-14 flex flex-col justify-center">
          <div className="mb-10 lg:hidden">
            <h2 className="text-3xl font-bold text-white mb-2">Multiverso Literário</h2>
            <p className="text-white/50">Entre na sua conta</p>
          </div>

          <form action={formAction} className="flex flex-col gap-8">
            {state?.error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs text-center">
                {state.error}
              </div>
            )}
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Email</label>
                <div className="relative group">
                  <Input
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    className="bg-white/5 border-none border-b border-white/10 rounded-none h-12 px-2 focus-visible:ring-0 focus-visible:border-primary transition-all text-white placeholder:text-white/20"
                  />
                  <div className="absolute bottom-0 left-0 h-[1px] w-full bg-white/20 group-focus-within:bg-primary transition-all duration-300" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Senha</label>
                <div className="relative group">
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="bg-white/5 border-none border-b border-white/10 rounded-none h-12 px-2 focus-visible:ring-0 focus-visible:border-primary transition-all text-white placeholder:text-white/20"
                  />
                  <div className="absolute bottom-0 left-0 h-[1px] w-full bg-white/20 group-focus-within:bg-primary transition-all duration-300" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/60 px-1">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                <label htmlFor="remember" className="cursor-pointer">Lembre-me</label>
              </div>
              <Link href="#" className="hover:text-primary transition-colors">
                Esqueceu a senha?
              </Link>
            </div>

            <LoginButton />
          </form>

          <p className="text-center text-sm text-white/50 mt-10">
            Não tem conta?{" "}
            <Link href="/register" className="text-white hover:text-primary transition-colors font-medium">
              Registre-se
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
