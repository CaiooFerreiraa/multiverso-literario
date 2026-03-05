"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateQuizSchema, CreateQuizDTO } from "@/application/quiz/dtos/CreateQuizDTO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTransition } from "react";
import { createQuizAction, updateQuizAction } from "@/actions/admin";
import { toast } from "sonner";
import { Plus, Trash2, Zap, Save, Timer as TimerIcon, CheckSquare, BookOpen, ChevronDown, X, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminQuizFormProps {
  timelines: any[];
  initialData?: any;
  onCancel?: () => void;
}

export function AdminQuizForm({ timelines, initialData, onCancel }: AdminQuizFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateQuizDTO>({
    resolver: zodResolver(CreateQuizSchema) as any,
    defaultValues: {
      tittle: initialData?.tittle || initialData?.title || "",
      id_timeline_book: initialData?.id_timeline_book || (timelines.length > 0 ? String(timelines[0].id_timeline) : ""),
      statement: initialData?.statement || "ativo",
      time_per_question: initialData?.time_per_question || 0,
      questions: initialData?.questions || [
        {
          question_tittle: "",
          points: 10,
          type: "choice",
          alternatives: [
            { alternative: "", is_correct: false },
            { alternative: "", is_correct: false },
            { alternative: "", is_correct: false },
            { alternative: "", is_correct: false },
          ],
        },
      ],
    } as any,
  } as any);

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control: form.control,
    name: "questions" as any,
  });

  async function onSubmit(data: CreateQuizDTO) {
    const invalidQuestion = data.questions.find(q =>
      q.type === "choice" && !q.alternatives.some(a => a.is_correct)
    );
    if (invalidQuestion) {
      toast.error("Cada questão de múltipla escolha precisa de ao menos uma alternativa correta.");
      return;
    }

    startTransition(async () => {
      // Ensure id_timeline_book is a number
      const payload = {
        ...data,
        id_timeline_book: Number(data.id_timeline_book)
      };

      const result = initialData
        ? await updateQuizAction({ ...payload, id_quiz: initialData.id_quiz } as any)
        : await createQuizAction(payload as any);

      if (result.success) {
        toast.success(initialData ? "Quiz atualizado!" : "Quiz criado!");
        if (!initialData) form.reset();
        if (onCancel) onCancel();
      } else {
        toast.error(result.error || "Erro ao salvar quiz");
      }
    });
  }

  const ALT_LABELS = ["A", "B", "C", "D"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* Info básica */}
        <div className="bg-white/[0.025] border border-white/8 rounded-2xl p-6 md:p-8 flex flex-col gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="tittle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                    <BookOpen className="w-3 h-3 text-primary" /> Título do Quiz
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: Dom Casmurro — Módulo 1"
                      className="focus:border-primary/40 truncate"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] text-red-500 font-bold ml-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="id_timeline_book"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                    <Layers className="w-3 h-3 text-amber-400" /> Cronograma vinculado
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:border-amber-500/35">
                        <SelectValue placeholder="Selecionar livro..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timelines.map(t => (
                        <SelectItem key={t.id_timeline} value={String(t.id_timeline)}>
                          {t.name_book}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px] text-red-500 font-bold ml-1" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="time_per_question"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 max-w-[280px]">
                <FormLabel className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                  <TimerIcon className="w-3 h-3 text-emerald-400" /> Segundos por questão (0=ilimitado)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    className="focus:border-emerald-500/40 font-mono"
                  />
                </FormControl>
                <FormMessage className="text-[10px] text-red-500 font-bold ml-1" />
              </FormItem>
            )}
          />
        </div>

        {/* Questões */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.25em]">
              Questões · {questionFields.length}
            </p>
            <div className="h-px flex-1 bg-white/5" />
            <button
              type="button"
              onClick={() => appendQuestion({
                question_tittle: "",
                points: 10,
                type: "choice",
                alternatives: [
                  { alternative: "", is_correct: false },
                  { alternative: "", is_correct: false },
                  { alternative: "", is_correct: false },
                  { alternative: "", is_correct: false },
                ],
              } as any)}
              className="px-4 py-2 text-[9px] font-black text-primary border border-primary/25 bg-primary/8 rounded-xl hover:bg-primary/10 hover:border-primary/40 cursor-pointer uppercase tracking-widest transition-all"
            >
              + Adicionar questão
            </button>
          </div>

          <AnimatePresence mode="popLayout">
            {questionFields.map((qField, qIndex) => {
              const questionType = form.watch(`questions.${qIndex}.type` as any);
              return (
                <motion.div
                  key={qField.id}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/[0.025] border border-white/8 rounded-2xl p-6 md:p-8 flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm">
                        {qIndex + 1}
                      </div>
                      <FormField
                        control={form.control}
                        name={`questions.${qIndex}.type` as any}
                        render={({ field }) => (
                          <div className="flex bg-white/5 border border-white/8 rounded-xl p-0.5">
                            <button
                              type="button"
                              onClick={() => field.onChange("choice")}
                              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${field.value === "choice" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/20 hover:text-white/40"}`}
                            >
                              Múltipla
                            </button>
                            <button
                              type="button"
                              onClick={() => field.onChange("open")}
                              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${field.value === "open" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-white/20 hover:text-white/40"}`}
                            >
                              Discursiva
                            </button>
                          </div>
                        )}
                      />
                    </div>
                    {questionFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="p-2.5 text-white/10 hover:text-red-400 hover:bg-red-400/10 rounded-xl cursor-pointer transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid lg:grid-cols-[1fr_140px] gap-6">
                    <FormField
                      control={form.control}
                      name={`questions.${qIndex}.question_tittle` as any}
                      render={({ field }) => (
                        <div className="flex flex-col gap-2 flex-1">
                          <label className="text-[10px] font-bold text-white/35 uppercase tracking-[0.23em] ml-1">Enunciado da Questão</label>
                          <textarea
                            {...field}
                            rows={3}
                            className="w-full bg-white/5 border border-white/8 rounded-xl p-4 text-sm focus:outline-none focus:border-primary/40 resize-none transition-all placeholder:text-white/10 cursor-text"
                            placeholder="Digite a pergunta aqui..."
                          />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`questions.${qIndex}.points` as any}
                      render={({ field }) => (
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-white/35 uppercase tracking-[0.23em] ml-1">Pontos</label>
                          <Input
                            {...field}
                            type="number"
                            min={1}
                            className="h-full focus:border-amber-500/40 text-lg font-black text-amber-400 text-center"
                          />
                        </div>
                      )}
                    />
                  </div>

                  {questionType === "choice" ? (
                    <div className="grid sm:grid-cols-2 gap-3 pt-6 border-t border-white/5">
                      {[0, 1, 2, 3].map((altIndex) => (
                        <div key={altIndex} className="flex gap-2">
                          <div className="w-6 flex items-center justify-center">
                            <span className="text-[10px] font-black text-white/15">{ALT_LABELS[altIndex]}</span>
                          </div>
                          <FormField
                            control={form.control}
                            name={`questions.${qIndex}.alternatives.${altIndex}.alternative` as any}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Resposta..."
                                className="flex-1 text-xs placeholder:text-white/5"
                              />
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`questions.${qIndex}.alternatives.${altIndex}.is_correct` as any}
                            render={({ field }) => (
                              <button
                                type="button"
                                onClick={() => field.onChange(!field.value)}
                                className={`w-11 h-11 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${field.value ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" : "bg-white/3 border-white/8 text-white/5 hover:border-white/20"}`}
                              >
                                <CheckSquare className={`w-5 h-5 ${field.value ? "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : ""}`} />
                              </button>
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                      <Zap className="w-4 h-4 text-white/10" />
                      <p className="text-[10px] text-white/20 font-medium uppercase tracking-widest">A resposta será digitada livremente pelo aluno.</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="flex gap-4 pt-8 border-t border-white/5">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="flex-1 h-12 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-[11px] font-black uppercase tracking-widest cursor-pointer"
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            disabled={isPending}
            className="flex-[2] h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-[11px] gap-2 transition-all cursor-pointer shadow-lg shadow-primary/20"
          >
            {isPending ? <Zap className="w-4 h-4 animate-spin" /> : initialData ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isPending ? "Salvando..." : initialData ? "Confirmar Edição" : "Publicar Quiz"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
