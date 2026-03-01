import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readUserChallengesAction, readUserPointsAction } from "@/actions/challenges";
import { readUserPlanStatusAction } from "@/actions/dashboard";
import DesafiosClient from "./desafios-client";

export default async function DesafiosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;

  const [challengesRes, pointsRes, planRes] = await Promise.all([
    readUserChallengesAction(userId),
    readUserPointsAction(userId),
    readUserPlanStatusAction(userId),
  ]);

  return (
    <DesafiosClient
      userId={userId}
      challenges={(challengesRes as any).success ? (challengesRes as any).data : []}
      userPoints={(pointsRes as any).success ? (pointsRes as any).data : { total_points: 0, challenges_completed: 0 }}
      isPremium={!!(planRes as any).data}
    />
  );
}
