"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateUserSchema, UpdateUserDTO } from "@/application/users/dtos/UpdateUserDTO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GlassCard } from "@/components/glass-card";
import React, { useTransition } from "react";
import { updateUserAction } from "@/actions/users/profile";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Link as LinkIcon } from "lucide-react";

interface ProfileFormProps {
  user: {
    id: number;
    fullname: string;
    email: string;
    birthday: string;
    city: string;
    phoneNumber: string;
    image?: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<UpdateUserDTO>({
    resolver: zodResolver(UpdateUserSchema) as any,
    defaultValues: {
      id_user: user.id || (user as any).id_user,
      fullname: user.fullname,
      email: user.email,
      birthday: user.birthday ? new Date(user.birthday) : new Date(),
      city: user.city || "",
      phoneNumber: user.phoneNumber || "",
      password: "",
      image: user.image || "",
    } as any,
  } as any);

  const imageUrl = form.watch("image");

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("A imagem deve ser menor que 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: any) {
    startTransition(async () => {
      const result = await updateUserAction(data);
      if (result.success) {
        toast.success("Perfil atualizado com sucesso!");
      } else {
        toast.error(result.error || "Erro ao atualizar perfil");
      }
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-6">
        <div className="relative group cursor-pointer" onClick={handleImageClick}>
          <Avatar className="w-32 h-32 border-4 border-primary/20 bg-white/5 ring-4 ring-black/20 group-hover:border-primary/50 transition-all duration-300 transform group-hover:scale-105">
            <AvatarImage src={imageUrl} />
            <AvatarFallback className="bg-primary/10 text-primary text-4xl font-bold">
              {user.fullname?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">{user.fullname}</h2>
          <p className="text-white/40 text-sm">{user.email}</p>
        </div>
      </div>

      <GlassCard className="p-8 rounded-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone" {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Sua cidade" {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Deixe em branco para não alterar" {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/80 h-12 rounded-xl font-bold cursor-pointer transition-all active:scale-[0.98]">
              {isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </Form>
      </GlassCard>
    </div>
  );
}
