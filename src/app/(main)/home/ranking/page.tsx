import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readGlobalRankingAction } from "@/actions/dashboard";
import RankingClient from "@/app/(main)/home/ranking/ranking-client";

export default async function RankingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const rankingRes = await readGlobalRankingAction();
  const ranking = (rankingRes.success ? rankingRes.data : []) as any[];

  return (
    <RankingClient
      ranking={ranking}
      currentUser={{
        id: Number((session.user as any).id),
        name: session.user.name || ""
      }}
    />
  );
}
