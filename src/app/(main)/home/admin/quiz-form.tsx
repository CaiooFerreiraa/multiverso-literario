"use client";
// @ts-nocheck

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateQuizSchema, CreateQuizDTO } from "@/application/quiz/dtos/CreateQuizDTO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTransition, useEffect } from "react";
import { createQuizAction, updateQuizAction } from "@/actions/admin";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const Plus = LucideIcons.Plus as any;
const Trash2 = LucideIcons.Trash2 as any;
const Zap = LucideIcons.Zap as any;
const X = LucideIcons.X as any;

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
      id_timeline_book: initialData?.id_timeline_book || timelines[0]?.id_timeline || 0,
      statement: initialData?.statement || "ativo",
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
      q.type === 'choice' && !q.alternatives.some(a => a.is_correct)
    );
    if (invalidQuestion) {
      toast.error("Cada questão de múltipla escolha deve ter pelo menos uma alternativa correta.");
      return;
    }

    startTransition(async () => {
      const result = initialData
        ? await updateQuizAction({ ...data, id_quiz: initialData.id_quiz })
        : await createQuizAction(data);

      if (result.success) {
        toast.success(initialData ? "Quiz atualizado com sucesso!" : "Quiz criado com sucesso!");
        if (!initialData) form.reset();
        if (onCancel) onCancel();
      } else {
        toast.error(result.error || "Erro ao salvar quiz");
      }
    });
  }

  return (
    <div className="relative">
      {initialData && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="absolute -top-12 -right-4 text-white/20 hover:text-white"
        >
          <X className="w-5 h-5" />
        </Button>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <FormField
              control={form.control}
              name="tittle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Quiz</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Quiz - Dom Casmurro Caps 1-5" className="bg-white/5 border-white/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id_timeline_book"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relacionar ao Livro</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value}
                      className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer text-white"
                    >
                      <option value="" className="bg-zinc-900">Selecione um cronograma...</option>
                      {timelines.map(t => (
                        <option key={t.id_timeline} value={t.id_timeline} className="bg-zinc-900">
                          {t.name_book}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white/40">Questões</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
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
                className="gap-2 cursor-pointer border-primary/30 text-primary hover:bg-primary/10"
              >
                <Plus className="w-4 h-4" /> Add Questão
              </Button>
            </div>

            {questionFields.map((qField, qIndex) => (
              <div key={qField.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative group">
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name={`questions.${qIndex}.type` as any}
                    render={({ field }) => (
                      <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 w-fit">
                        <button
                          type="button"
                          onClick={() => field.onChange("choice")}
                          className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${field.value === 'choice' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                          Múltipla Escolha
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange("open")}
                          className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${field.value === 'open' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                          Aberta
                        </button>
                      </div>
                    )}
                  />

                  {questionFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-400 hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-[1fr_auto] gap-4">
                  <FormField
                    control={form.control}
                    name={`questions.${qIndex}.question_tittle` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/40">Enunciado da Pergunta</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Digite o enunciado da pergunta" className="bg-white/5 border-white/10 h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`questions.${qIndex}.points` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-xs text-white/40">
                          <Zap className="w-3 h-3 text-amber-400" /> Pontos
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={1}
                            placeholder="10"
                            className="bg-amber-500/5 border-amber-500/20 w-24 text-amber-300 font-bold text-center h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch(`questions.${qIndex}.type` as any) === "choice" ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                      <LucideIcons.CheckSquare className="w-3 h-3" /> Alternativas e Correção
                    </p>
                    <div className="grid gap-2">
                      {[0, 1, 2, 3].map((altIndex) => (
                        <div key={altIndex} className="flex gap-2">
                          <FormField
                            control={form.control}
                            name={`questions.${qIndex}.alternatives.${altIndex}.alternative` as any}
                            render={({ field }) => (
                              <Input {...field} placeholder={`Opção ${altIndex + 1}`} className="bg-white/5 border-white/10" />
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`questions.${qIndex}.alternatives.${altIndex}.is_correct` as any}
                            render={({ field }) => (
                              <div className="flex items-center justify-center px-4 rounded-md bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="border-primary data-[state=checked]:bg-primary"
                                />
                              </div>
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-xs text-indigo-300 font-medium">
                      Questão Aberta: O usuário terá um campo de texto para responder livremente.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button type="submit" disabled={isPending} className="w-full bg-gradient-to-r from-primary to-indigo-600 h-14 rounded-2xl font-bold shadow-xl hover:shadow-primary/20 transition-all active:scale-[0.99]">
            {isPending ? "Processando..." : initialData ? "Atualizar Quiz" : "Criar Quiz"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
