import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readCurrentTimelineAction, readUserPlanStatusAction, readUserSealsAction } from "@/actions/dashboard";
import { readUserPointsAction } from "@/actions/challenges";
import { readAllPhrasesAction } from "@/actions/phrases";
import DashboardClient from "@/app/(main)/dashboard/dashboard-client";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const [timelineRes, planRes, sealsRes, pointsRes, phrasesRes] = await Promise.all([
    readCurrentTimelineAction(),
    readUserPlanStatusAction(userId),
    readUserSealsAction(userId),
    readUserPointsAction(userId),
    readAllPhrasesAction(),
  ]);

  return (
    <DashboardClient
      user={{
        id: userId,
        name: session.user.name || "Explorador",
        email: session.user.email || "",
        isAdmin: session.user.email === process.env.ADMIN_EMAIL,
      }}
      currentTimeline={(timelineRes as any).success ? (timelineRes as any).data : null}
      userPlan={(planRes as any).success ? (planRes as any).data : null}
      seals={(sealsRes as any).success ? (sealsRes as any).data : []}
      userPoints={(pointsRes as any).success ? (pointsRes as any).data : { total_points: 0, challenges_completed: 0 }}
      phrases={(phrasesRes as any).success ? (phrasesRes as any).data : []}
    />
  );
}
