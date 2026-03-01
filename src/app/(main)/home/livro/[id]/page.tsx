import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readContributionsByBookAction } from "@/actions/contributions";
import LivroClient from "./livro-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LivroPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const bookId = parseInt(id);
  const userId = (session.user as any).id;

  const contributionsRes = await readContributionsByBookAction(bookId);

  return (
    <LivroClient
      user={{ id: userId, name: session.user.name || "" }}
      bookId={bookId}
      contributions={(contributionsRes as any).success ? (contributionsRes as any).data : []}
    />
  );
}
