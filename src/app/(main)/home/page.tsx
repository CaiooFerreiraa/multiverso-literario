import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readCurrentTimelineAction, readUserPlanStatusAction, readUserSealsAction, readGlobalRankingAction, readActiveAwardAction } from "@/actions/dashboard";
import { readUserPointsAction } from "@/actions/challenges";
import { readAllPhrasesAction } from "@/actions/phrases";
import HomeClient from "@/app/(main)/home/home-client";
import { isAdmin } from "@/lib/is-admin";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const [timelineRes, planRes, sealsRes, pointsRes, phrasesRes, rankingRes, awardRes, adminCheck] = await Promise.all([
    readCurrentTimelineAction(),
    readUserPlanStatusAction(userId),
    readUserSealsAction(userId),
    readUserPointsAction(userId),
    readAllPhrasesAction({ currentUserId: userId, limit: 12, page: 1 }),
    readGlobalRankingAction(),
    readActiveAwardAction(),
    isAdmin({ email: session.user.email, userId }),
  ]);

  const userPlan = (planRes as any).success ? (planRes as any).data : null;
  const phrases = (phrasesRes as any).success ? (phrasesRes as any).data : [];
  const viewType: 'student' | 'adult' | 'free' = userPlan?.view_type === 'student' ? 'student' : userPlan ? 'adult' : 'free';

  return (
    <HomeClient
      user={{
        id: userId,
        name: session.user.name || "Explorador",
        email: session.user.email || "",
        isAdmin: adminCheck,
      }}
      viewType={viewType}
      currentTimeline={(timelineRes as any).success ? (timelineRes as any).data : null}
      userPlan={userPlan}
      seals={(sealsRes as any).success ? (sealsRes as any).data : []}
      userPoints={(pointsRes as any).success ? (pointsRes as any).data : { total_points: 0, challenges_completed: 0 }}
      phrases={phrases}
      ranking={(rankingRes as any).success ? (rankingRes as any).data : []}
      activeAward={(awardRes as any).success ? (awardRes as any).data : null}
    />
  );
}
