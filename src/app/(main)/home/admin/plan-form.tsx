"use client";

import React, { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { readAllPlansAction, updatePlanAction, createPlanAction, deletePlanAction } from "@/actions/plans";
import {
  CreditCard,
  Trash2,
  Plus,
  X,
  CheckCircle2,
  Edit2,
  PlusCircle,
  MinusCircle,
  Zap,
  GraduationCap,
  UserCircle,
  ChevronDown
} from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";

import { SYSTEM_FEATURES, FEATURE_LABELS } from "@/lib/plan-utils";

export function AdminPlanForm() {
  const [isPending, startTransition] = useTransition();
  const [plans, setPlans] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    id_plan: null as number | null,
    title: "",
    value: "",
    duraction: "30",
    benefits: [""] as string[],
    view_type: "adult" as "student" | "adult",
    features: [] as string[],
  });

  useEffect(() => { loadPlans(); }, []);

  async function loadPlans() {
    const res = await readAllPlansAction();
    if (res.success) setPlans(res.data as any[]);
  }

  const resetForm = () => {
    setForm({
      id_plan: null,
      title: "",
      value: "",
      duraction: "30",
      benefits: [""],
      view_type: "adult",
      features: [],
    });
    setIsEditing(false);
  };

  const handleEdit = (plan: any) => {
    setForm({
      id_plan: plan.id_plan,
      title: plan.title || "",
      value: plan.value.toString(),
      duraction: plan.duraction.toString(),
      benefits: plan.benefits && plan.benefits.length > 0 ? plan.benefits : [""],
      view_type: plan.view_type || "adult",
      features: plan.features || [],
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddBenefit = () => setForm({ ...form, benefits: [...form.benefits, ""] });
  const handleBenefitChange = (index: number, val: string) => {
    const newBenefits = [...form.benefits];
    newBenefits[index] = val;
    setForm({ ...form, benefits: newBenefits });
  };
  const handleRemoveBenefit = (index: number) => {
    const newBenefits = form.benefits.filter((_, i) => i !== index);
    setForm({ ...form, benefits: newBenefits.length > 0 ? newBenefits : [""] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.value) {
      toast.error("Título e valor são obrigatórios");
      return;
    }

    startTransition(async () => {
      const data = {
        title: form.title,
        value: Number(form.value),
        duraction: Number(form.duraction),
        benefits: form.benefits.filter(b => b.trim() !== ""),
        view_type: form.view_type,
        features: form.features,
      };

      const res = form.id_plan
        ? await updatePlanAction(form.id_plan, data)
        : await createPlanAction(data);

      if (res.success) {
        toast.success(form.id_plan ? "Plano atualizado!" : "Plano criado!");
        resetForm();
        loadPlans();
      } else {
        toast.error("Erro ao salvar: " + res.error);
      }
    });
  };

  const handleDelete = async (id: number) => {
    startTransition(async () => {
      const res = await deletePlanAction(id);
      if (res.success) {
        toast.success("Plano removido");
        loadPlans();
      } else {
        toast.error("Erro ao remover: " + res.error);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className={`bg-white/[0.025] border rounded-2xl p-5 md:p-6 transition-all ${isEditing ? 'border-primary/40 bg-primary/5' : 'border-white/8'}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1.5 col-span-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Título do Plano</label>
              <Input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Plano Trimestral"
                className="bg-white/5 border-white/8 h-11 rounded-xl focus:border-primary/35 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Preço (R$)</label>
              <Input
                type="number"
                step="0.01"
                value={form.value}
                onChange={e => setForm({ ...form, value: e.target.value })}
                placeholder="29.90"
                className="bg-white/5 border-white/8 h-11 rounded-xl text-emerald-400 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Duração (dias)</label>
              <Input
                type="number"
                value={form.duraction}
                onChange={e => setForm({ ...form, duraction: e.target.value })}
                placeholder="30"
                className="bg-white/5 border-white/8 h-11 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-4 col-span-full pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Recursos Ativos (Bloqueio Dinâmico)</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, features: SYSTEM_FEATURES.map(f => f.key) })}
                  className="text-[9px] font-bold text-primary hover:underline uppercase tracking-tighter cursor-pointer"
                >
                  Selecionar todos
                </button>
                <span className="text-white/10 text-[9px]">|</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, features: [] })}
                  className="text-[9px] font-bold text-white/40 hover:text-white hover:underline uppercase tracking-tighter cursor-pointer"
                >
                  Limpar
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {SYSTEM_FEATURES.map((feat) => (
                <button
                  key={feat.key}
                  type="button"
                  onClick={() => {
                    const exists = form.features.includes(feat.key);
                    setForm({
                      ...form,
                      features: exists
                        ? form.features.filter(f => f !== feat.key)
                        : [...form.features, feat.key]
                    });
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-[60px] ${form.features.includes(feat.key)
                      ? "bg-primary/10 border-primary/30 text-primary shadow-[0_0_15px_-5px_rgba(99,102,241,0.2)]"
                      : "bg-white/5 border-white/8 text-white/30 hover:bg-white/8 hover:border-white/15"
                    }`}
                >
                  <p className={`text-[9px] font-bold uppercase leading-tight ${form.features.includes(feat.key) ? 'text-primary' : 'text-white/40'}`}>{feat.label}</p>
                  <div className="flex justify-end">
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${form.features.includes(feat.key) ? 'bg-primary border-primary' : 'border-white/10'}`}>
                      {form.features.includes(feat.key) && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Tipo de Público</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, view_type: "student" })}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${form.view_type === "student" ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-white/5 border-white/8 text-white/30 hover:bg-white/8"}`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Estudante</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, view_type: "adult" })}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${form.view_type === "adult" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/5 border-white/8 text-white/30 hover:bg-white/8"}`}
                >
                  <UserCircle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Adulto</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Benefícios</label>
                <button type="button" onClick={handleAddBenefit} className="text-[9px] font-bold text-primary hover:underline uppercase tracking-tighter">
                  + Adicionar novo
                </button>
              </div>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                {form.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={benefit}
                      onChange={e => handleBenefitChange(idx, e.target.value)}
                      placeholder="Ex: Acesso Premium"
                      className="bg-white/5 border-white/8 h-10 rounded-lg text-xs"
                    />
                    <button type="button" onClick={() => handleRemoveBenefit(idx)} className="p-2 text-white/10 hover:text-red-400 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/5">
            {isEditing && (
              <Button type="button" variant="ghost" onClick={resetForm} className="h-11 rounded-xl px-6 text-white/40 hover:text-white hover:bg-white/5 uppercase text-[10px] font-bold tracking-widest cursor-pointer">
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs gap-2 cursor-pointer"
            >
              {isPending ? <Zap className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isEditing ? "Salvar Alterações" : "Criar Plano de Acesso"}
            </Button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 mb-1">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.25em]">Planos Cadastrados · {plans.length}</p>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {plans.map((plan) => (
              <motion.div
                key={plan.id_plan}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative group ${isEditing && form.id_plan === plan.id_plan ? 'border-primary/40 bg-primary/5' : 'border-white/8 bg-white/[0.025] hover:border-white/15'}`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${plan.view_type === 'adult' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                      {plan.view_type === 'adult' ? <UserCircle className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleEdit(plan)} className="p-2 text-white/20 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="p-2 text-white/20 hover:text-red-400 rounded-lg hover:bg-white/5 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#0d0f2b] border-white/10 text-white rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover Plano?</AlertDialogTitle>
                            <AlertDialogDescription className="text-white/40">
                              O plano "{plan.title}" será desativado e não aceitará novos membros.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/5 border-none hover:bg-white/10 cursor-pointer">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(plan.id_plan)} className="bg-red-500/10 hover:bg-red-500 text-red-500 border border-red-500/20 cursor-pointer">
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-lg text-white mb-0.5">{plan.title || "Sem título"}</h5>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-emerald-400">R$ {Number(plan.value).toFixed(2)}</span>
                      <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">/ {plan.duraction} dias</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 space-y-1.5 min-h-[80px]">
                    {(() => {
                      const allBenefits = [
                        ...(plan.features || []).map((f: any) => (FEATURE_LABELS as any)[f]).filter(Boolean),
                        ...(plan.benefits || [])
                      ];
                      
                      if (allBenefits.length === 0) {
                        return <p className="text-[10px] text-white/10 italic">Sem benefícios listados</p>;
                      }
                      
                      return allBenefits.slice(0, 4).map((b: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] text-white/40 font-medium">
                          <Zap className="w-2.5 h-2.5 text-primary/30 shrink-0" />
                          <span className="truncate">{b}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {plans.length === 0 && (
            <div className="py-20 text-center border border-dashed border-white/8 rounded-2xl col-span-full">
              <CreditCard className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/20 font-medium">Nenhum plano cadastrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
