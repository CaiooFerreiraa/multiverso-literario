"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTimelineSchema, CreateTimelineDTO } from "@/application/timeline/dtos/CreateTimelineDTO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createTimelineAction, updateTimelineAction } from "@/actions/admin";
import { toast } from "sonner";
import { Calendar, Plus, Save, BookOpen, User, Quote, X } from "lucide-react";

interface TimelineFormProps {
  initialData?: any;
  onCancel?: () => void;
}

export function TimelineForm({ initialData, onCancel }: TimelineFormProps) {
  const [isPending, startTransition] = useTransition();

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const form = useForm<CreateTimelineDTO>({
    resolver: zodResolver(CreateTimelineSchema) as any,
    defaultValues: {
      nameBook: initialData?.name_book || "",
      authorBook: initialData?.author_book || "",
      dateStart: initialData ? new Date(initialData.date_start) : firstDay,
      dateEnd: initialData ? new Date(initialData.date_end) : lastDay,
    } as any,
  } as any);

  async function onSubmit(data: CreateTimelineDTO) {
    startTransition(async () => {
      const result = initialData
        ? await updateTimelineAction(initialData.id_timeline, data)
        : await createTimelineAction(data);

      if (result.success) {
        toast.success(initialData ? "Cronograma atualizado!" : "Cronograma criado!");
        if (!initialData) form.reset();
        if (onCancel) onCancel();
      } else {
        toast.error(result.error || "Erro ao salvar cronograma");
      }
    });
  }

  return (
    <div className="bg-white/[0.025] border border-white/8 rounded-2xl p-5 md:p-6 mb-8 relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nameBook"
              render={({ field }: { field: any }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Quote className="w-3 h-3 text-primary" /> Título do Livro
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: Memórias Póstumas de Brás Cubas"
                      className="bg-white/5 border-white/8 h-11 rounded-xl focus:border-primary/40 text-sm cursor-text placeholder:text-white/20"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] text-red-500 font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorBook"
              render={({ field }: { field: any }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <User className="w-3 h-3 text-primary" /> Autor
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: Machado de Assis"
                      className="bg-white/5 border-white/8 h-11 rounded-xl focus:border-primary/40 text-sm cursor-text placeholder:text-white/20"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] text-red-500 font-bold" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dateStart"
              render={({ field }: { field: any }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-emerald-400" /> Data de Início
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value instanceof Date ? field.value.toISOString().split("T")[0] : field.value}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      className="bg-white/5 border-white/8 h-11 rounded-xl focus:border-emerald-500/40 text-sm cursor-text [color-scheme:dark]"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] text-red-500 font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateEnd"
              render={({ field }: { field: any }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-amber-400" /> Data de Fim
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value instanceof Date ? field.value.toISOString().split("T")[0] : field.value}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      className="bg-white/5 border-white/8 h-11 rounded-xl focus:border-amber-500/40 text-sm cursor-text [color-scheme:dark]"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] text-red-500 font-bold" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm uppercase tracking-wider gap-2 cursor-pointer shadow-[0_4px_20px_rgba(109,40,217,0.2)]"
            >
              {isPending ? <Plus className="w-4 h-4 animate-pulse" /> : initialData ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isPending ? "Salvando..." : initialData ? "Salvar Alterações" : "Criar Cronograma"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="h-11 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
