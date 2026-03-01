"use client";

import React, { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { readAllPlansAction, updatePlanAction, createPlanAction, deletePlanAction } from "@/actions/plans";
import { GlassCard } from "@/components/glass-card";
import {
  CreditCard,
  Trash2,
  Plus,
  X,
  ListCheck,
  Edit2,
  PlusCircle,
  MinusCircle,
  Zap,
  GraduationCap,
  UserCircle
} from "lucide-react";

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
  });

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    const res = await readAllPlansAction();
    if (res.success) {
      setPlans(res.data as any[]);
    }
  }

  const resetForm = () => {
    setForm({
      id_plan: null,
      title: "",
      value: "",
      duraction: "30",
      benefits: [""],
      view_type: "adult",
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
    });
    setIsEditing(true);
    // Scroll to form
    const formElement = document.getElementById('admin-plan-form-top');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAddBenefit = () => {
    setForm({ ...form, benefits: [...form.benefits, ""] });
  };

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
      };

      try {
        const res = form.id_plan
          ? await updatePlanAction(form.id_plan, data)
          : await createPlanAction(data);

        if (res.success) {
          toast.success(form.id_plan ? "Plano atualizado com sucesso!" : "Plano criado com sucesso!");
          resetForm();
          await loadPlans();
        } else {
          toast.error("Erro ao salvar: " + res.error);
        }
      } catch (err: any) {
        toast.error("Erro crítico: " + err.message);
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente desativar este plano?")) return;
    startTransition(async () => {
      const res = await deletePlanAction(id);
      if (res.success) {
        toast.success("Plano desativado");
        await loadPlans();
      } else {
        toast.error("Erro ao excluir: " + res.error);
      }
    });
  };

  // Melhoria nos inputs numéricos
  const adjustNumber = (field: 'value' | 'duraction', delta: number) => {
    const val = Number(form[field]) || 0;
    const newVal = Math.max(0, val + delta);
    setForm({ ...form, [field]: field === 'value' ? newVal.toFixed(2) : Math.round(newVal).toString() });
  };

  return (
    <div className="space-y-10" id="admin-plan-form-top">
      <style jsx global>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* FORMULÁRIO */}
      <GlassCard className={`p-8 rounded-3xl border-primary/10 transition-all duration-500 ${isEditing ? 'bg-primary/10 shadow-[0_0_50px_rgba(109,40,217,0.15)] ring-1 ring-primary/30' : 'bg-white/5'}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEditing ? 'bg-primary text-white' : 'bg-white/10 text-white/40'}`}>
              {isEditing ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {isEditing ? "Editar Plano de Assinatura" : "Novo Plano de Assinatura"}
              </h3>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                {isEditing ? `Editando ID #${form.id_plan}` : "Configure os detalhes do plano"}
              </p>
            </div>
          </div>
          {isEditing && (
            <Button variant="ghost" size="sm" onClick={resetForm} className="text-white/40 gap-2 hover:bg-white/5 rounded-xl">
              <X className="w-4 h-4" /> Cancelar Edição
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Título do Plano</label>
              <Input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Expandido, Anual, VIP"
                className="bg-white/5 border-white/10 h-14 font-bold rounded-2xl focus:ring-primary/50 cursor-text"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Valor Mensal (R$)</label>
              <div className="relative group/input">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold group-focus-within/input:text-emerald-400 transition-colors">R$</span>
                <Input
                  type="number"
                  step="0.01"
                  value={form.value}
                  onChange={e => setForm({ ...form, value: e.target.value })}
                  placeholder="14.99"
                  className="bg-white/5 border-white/10 h-14 pl-12 pr-20 font-black text-xl text-emerald-400 rounded-2xl cursor-text"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button type="button" size="icon" variant="ghost" className="h-10 w-8 rounded-lg hover:bg-white/10 text-white/20 hover:text-white" onClick={() => adjustNumber('value', -1)}>
                    <MinusCircle className="w-4 h-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" className="h-10 w-8 rounded-lg hover:bg-white/10 text-white/20 hover:text-white" onClick={() => adjustNumber('value', 1)}>
                    <PlusCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Duração (Dias)</label>
              <div className="relative">
                <Input
                  type="number"
                  value={form.duraction}
                  onChange={e => setForm({ ...form, duraction: e.target.value })}
                  placeholder="30"
                  className="bg-white/5 border-white/10 h-14 pr-20 font-bold rounded-2xl cursor-text"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button type="button" size="icon" variant="ghost" className="h-10 w-8 rounded-lg hover:bg-white/10 text-white/20 hover:text-white" onClick={() => adjustNumber('duraction', -1)}>
                    <MinusCircle className="w-4 h-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" className="h-10 w-8 rounded-lg hover:bg-white/10 text-white/20 hover:text-white" onClick={() => adjustNumber('duraction', 1)}>
                    <PlusCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* TIPO DE VISÃO */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" /> Tipo de Visão do Plano
            </label>
            <p className="text-[10px] text-white/20">Define o que o usuário pode ver/fazer na plataforma</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, view_type: "student" })}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 cursor-pointer ${form.view_type === "student"
                  ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                  : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/10 hover:bg-white/5"
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.view_type === "student" ? "bg-blue-500/20" : "bg-white/5"}`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Estudante</p>
                  <p className="text-[10px] opacity-60">Restrito (sem criar sala, sem upgrade)</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, view_type: "adult" })}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 cursor-pointer ${form.view_type === "adult"
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                  : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/10 hover:bg-white/5"
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.view_type === "adult" ? "bg-emerald-500/20" : "bg-white/5"}`}>
                  <UserCircle className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Adulto</p>
                  <p className="text-[10px] opacity-60">Acesso completo a tudo</p>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/40 uppercase flex items-center gap-2 tracking-widest">
                <ListCheck className="w-4 h-4 text-primary" /> Benefícios do Plano
              </label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddBenefit} className="h-9 px-4 text-[10px] font-black border-primary/20 text-primary hover:bg-primary/10 rounded-xl uppercase">
                + Novo Benefício
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {form.benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-2 group/benefit animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="relative flex-1">
                    <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/30 group-hover/benefit:text-primary transition-colors" />
                    <Input
                      value={benefit}
                      onChange={e => handleBenefitChange(idx, e.target.value)}
                      placeholder="Ex: Biblioteca Digital com PDFs"
                      className="bg-white/5 border-white/10 h-11 pl-10 text-sm rounded-xl focus:border-primary/40 cursor-text"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveBenefit(idx)}
                    className="text-white/10 hover:text-red-400 h-11 w-11 shrink-0 rounded-xl hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 font-black shadow-xl shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            {isPending ? "Processando Solicitação..." : isEditing ? "Salvar Alterações no Plano" : "Publicar Plano de Assinatura"}
          </Button>
        </form>
      </GlassCard>

      {/* LISTA DE PLANOS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Planos no Ar ({plans.length})
          </h4>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <GlassCard key={plan.id_plan} className={`p-6 rounded-[2rem] border-white/5 hover:bg-white/[0.04] transition-all relative overflow-hidden group ${isEditing && form.id_plan === plan.id_plan ? 'ring-2 ring-primary/50 bg-primary/5' : ''}`}>
              {isEditing && form.id_plan === plan.id_plan && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                  Editando Agora
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(plan)} className="text-white/10 hover:text-primary h-10 w-10 rounded-xl hover:bg-primary/10 cursor-pointer">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(plan.id_plan)} className="text-white/10 hover:text-red-400 h-10 w-10 rounded-xl hover:bg-red-500/10 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-xl mb-1 truncate">{plan.title || "Plano s/ título"}</h5>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-2xl font-black text-emerald-400">R$ {Number(plan.value).toFixed(2)}</span>
                    <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">/ {plan.duraction}d</span>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${plan.view_type === 'student'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                    {plan.view_type === 'student' ? <GraduationCap className="w-3 h-3" /> : <UserCircle className="w-3 h-3" />}
                    {plan.view_type === 'student' ? 'Estudante' : 'Adulto'}
                  </div>
                </div>

                {plan.benefits && plan.benefits.length > 0 ? (
                  <div className="space-y-2 mt-2 pt-4 border-t border-white/5">
                    {plan.benefits.slice(0, 4).map((b: string, i: number) => (
                      <p key={i} className="text-[10px] text-white/40 flex items-center gap-2 truncate">
                        <div className="w-1 h-1 rounded-full bg-primary/40 shrink-0" /> {b}
                      </p>
                    ))}
                    {plan.benefits.length > 4 && (
                      <p className="text-[9px] text-primary/60 font-black uppercase tracking-widest ml-3">
                        + {plan.benefits.length - 4} vantagens exclusivas
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] text-white/10 italic mt-4">Sem detalhes configurados.</p>
                )}
              </div>
            </GlassCard>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="py-20 text-center border border-dashed border-white/5 rounded-[2rem] bg-white/[0.02]">
            <p className="text-white/20 font-medium italic">Nenhum plano configurado para exibição.</p>
          </div>
        )}
      </div>
    </div>
  );
}
