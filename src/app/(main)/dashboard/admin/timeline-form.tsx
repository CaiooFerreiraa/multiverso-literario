"use client";
// @ts-nocheck

import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTimelineSchema, CreateTimelineDTO } from "@/application/timeline/dtos/CreateTimelineDTO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTransition } from "react";
import { createTimelineAction } from "@/actions/admin";
import { toast } from "sonner";

export function TimelineForm() {
  const [isPending, startTransition] = useTransition();

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const form = useForm<CreateTimelineDTO>({
    resolver: zodResolver(CreateTimelineSchema) as any,
    defaultValues: {
      nameBook: "",
      authorBook: "",
      dateStart: firstDay,
      dateEnd: lastDay,
    } as any,
  } as any);

  async function onSubmit(data: CreateTimelineDTO) {
    startTransition(async () => {
      const result = await createTimelineAction(data);
      if (result.success) {
        toast.success("Cronograma criado com sucesso!");
        form.reset();
      } else {
        toast.error(result.error || "Erro ao criar cronograma");
      }
    });
  }

  return (
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
                  <Input {...field} placeholder="Ex: Dom Casmurro" className="bg-white/5 border-white/10" />
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
                  <Input {...field} placeholder="Ex: Machado de Assis" className="bg-white/5 border-white/10" />
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
                    className="bg-white/5 border-white/10"
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
                    className="bg-white/5 border-white/10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending} className="w-full bg-primary font-bold">
          {isPending ? "Criando..." : "Criar Cronograma"}
        </Button>
      </form>
    </Form>
  );
}
