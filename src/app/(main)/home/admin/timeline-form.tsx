"use client";
// @ts-nocheck

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTimelineSchema, CreateTimelineDTO } from "@/application/timeline/dtos/CreateTimelineDTO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createTimelineAction, updateTimelineAction } from "@/actions/admin";
import { toast } from "sonner";
import { X } from "lucide-react";

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nameBook"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Título do Livro</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Dom Casmurro" className="bg-white/5 border-white/10 h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authorBook"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Autor</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Machado de Assis" className="bg-white/5 border-white/10 h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateStart"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Data de Início</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : (field.value || '')}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(new Date(e.target.value))}
                      className="bg-white/5 border-white/10 h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateEnd"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Data de Término</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : (field.value || '')}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(new Date(e.target.value))}
                      className="bg-white/5 border-white/10 h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full bg-primary font-bold h-12 rounded-xl">
            {isPending ? "Salvando..." : initialData ? "Atualizar Cronograma" : "Criar Cronograma"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
