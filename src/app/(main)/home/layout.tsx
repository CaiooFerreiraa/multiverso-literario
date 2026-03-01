import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readUserPlanStatusAction, readUserTotalPointsAction } from "@/actions/dashboard";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const [planRes, pointsRes] = await Promise.all([
    readUserPlanStatusAction(userId),
    readUserTotalPointsAction(userId)
  ]);

  const userPlan = (planRes as any).success ? (planRes as any).data : null;
  const userStats = (pointsRes as any).success ? (pointsRes as any).data : { total_points: 0, challenges_completed: 0 };

  const viewType: 'student' | 'adult' | 'free' = userPlan?.view_type === 'student' ? 'student' : userPlan ? 'adult' : 'free';

  return (
    <div className="flex min-h-screen bg-[#0d0f2b] text-white selection:bg-primary/40 selection:text-white overflow-x-hidden relative">
      {/* Crisp Universe Atmosphere - Much more vibrant and light-filled */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0f1235] via-[#0d0f2b] to-[#12143d] pointer-events-none z-0" />

      {/* Dynamic Nebulas - Brighter spot lights */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_0%_30%,rgba(139,92,246,0.35),transparent_60%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_100%_10%,rgba(59,130,246,0.25),transparent_50%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(236,72,153,0.15),transparent_50%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_40%_100%,rgba(79,70,229,0.2),transparent_70%)] pointer-events-none z-0" />

      {/* High Intensity Glows */}
      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse" />

      {/* Shimmering Stars - High Contrast */}
      <div className="fixed top-20 left-[15%] w-1.5 h-1.5 bg-white rounded-full opacity-90 z-0 shadow-[0_0_15px_rgba(255,255,255,1)]" />
      <div className="fixed top-60 left-[45%] w-1 h-1 bg-white rounded-full opacity-60 z-0 shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
      <div className="fixed bottom-40 left-[10%] w-2 h-2 bg-primary/40 rounded-full blur-[2px] opacity-70 z-0 animate-pulse" />

      <div className="relative z-10 flex w-full">
        <Sidebar
          user={{
            id: userId,
            name: session.user.name || "Explorador",
            email: session.user.email || "",
            image: (session.user as any).image || null,
            isAdmin: session.user.email === process.env.ADMIN_EMAIL,
            points: Number(userStats.total_points || 0),
            challengesCompleted: Number(userStats.challenges_completed || 0),
          }}
          viewType={viewType}
        />
        <main className="flex-1 lg:ml-72 transition-all duration-300 pt-16 lg:pt-0 min-h-screen relative overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
