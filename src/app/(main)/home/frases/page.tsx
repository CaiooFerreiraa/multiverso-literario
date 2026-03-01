import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readAllPhrasesAction } from "@/actions/phrases";
import FrasesClient from "./frases-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frases do Multiverso | Multiverso Literário",
  description: "Compartilhe e interaja com as frases mais marcantes dos seus livros favoritos.",
};

export default async function FrasesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;
  const phrasesRes = await readAllPhrasesAction({ currentUserId: userId, page: 1, limit: 12, onlyMine: false });

  const phrases = phrasesRes.success ? (phrasesRes.data as any[]) : [];
  const pagination = phrasesRes.success ? (phrasesRes as any).pagination : null;

  return (
    <div className="container px-4 py-8">
      <FrasesClient
        user={{
          id: userId,
          name: session.user.name || "Explorador",
          image: (session.user as any).image || null,
        }}
        initialPhrases={phrases}
        initialPagination={pagination}
      />
    </div>
  );
}
