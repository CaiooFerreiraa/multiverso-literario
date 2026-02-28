"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateQuizSchema, CreateQuizDTO } from "@/application/quiz/dtos/CreateQuizDTO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTransition } from "react";
import { createQuizAction } from "@/actions/admin";
import { toast } from "sonner";
import { Plus, Trash2, Check, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface AdminQuizFormProps {
  timelines: any[];
}

export function AdminQuizForm({ timelines }: AdminQuizFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateQuizDTO>({
    resolver: zodResolver(CreateQuizSchema) as any,
    defaultValues: {
      tittle: "",
      id_timeline_book: timelines[0]?.id_timeline || 0,
      statement: "ativo",
      questions: [
        {
          question_tittle: "",
          alternatives: [
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
    // Validate that each question has at least one correct alternative
    const invalidQuestion = data.questions.find(q => !q.alternatives.some(a => a.is_correct));
    if (invalidQuestion) {
      toast.error("Cada questão deve ter pelo menos uma alternativa correta.");
      return;
    }

    startTransition(async () => {
      const result = await createQuizAction(data);
      if (result.success) {
        toast.success("Quiz criado com sucesso!");
        form.reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
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
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="" className="bg-zinc-900">Selecione um cronograma...</option>
                    {timelines.map(t => (
                      <option key={t.id_timeline} value={t.id_timeline} className="bg-zinc-900">
                        {t.name_book} ({new Date(t.date_start).toLocaleDateString()})
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
              onClick={() => appendQuestion({ question_tittle: "", alternatives: [{ alternative: "", is_correct: false }, { alternative: "", is_correct: false }] })}
              className="gap-2 cursor-pointer border-primary/30 text-primary hover:bg-primary/10"
            >
              <Plus className="w-4 h-4" /> Add Questão
            </Button>
          </div>

          {questionFields.map((qField, qIndex) => (
            <div key={qField.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative group">
              {questionFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(qIndex)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}

              <FormField
                control={form.control}
                name={`questions.${qIndex}.question_tittle` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pergunta {qIndex + 1}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Digite o enunciado da pergunta" className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Alternativas</p>
                <div className="grid gap-2">
                  {/* Alternatives mapping is slightly more complex with useFieldArray nested, 
                        but for simplicity in admin form we can iterate fixed or use nested arrays if needed.
                        For a robust approach, we'd use another useFieldArray here.
                    */}
                  {[0, 1, 2, 3].map((altIndex) => (
                    <div key={altIndex} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`questions.${qIndex}.alternatives.${altIndex}.alternative` as any}
                        render={({ field }) => (
                          <Input {...field} placeholder={`Alt ${altIndex + 1}`} className="bg-white/5 border-white/10" />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`questions.${qIndex}.alternatives.${altIndex}.is_correct` as any}
                        render={({ field }) => (
                          <div className="flex items-center justify-center p-2 rounded-md bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10">
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
            </div>
          ))}
        </div>

        <Button type="submit" disabled={isPending} className="w-full bg-gradient-to-r from-primary to-indigo-600 h-12 rounded-xl font-bold shadow-lg">
          {isPending ? "Criando Quiz..." : "Salvar Quiz Completo"}
        </Button>
      </form>
    </Form>
  );
}
