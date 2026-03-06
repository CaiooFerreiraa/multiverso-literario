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
      {/* Static atmosphere — Simplificado no mobile para performance */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#0d0f2b] md:bg-transparent" style={{
        background: `
          radial-gradient(circle at 0% 30%, rgba(139,92,246,0.15) 0%, transparent 45%),
          radial-gradient(circle at 100% 10%, rgba(59,130,246,0.10) 0%, transparent 40%),
          linear-gradient(180deg, #0a0c24 0%, #0d0f2b 100%)
        `,
        willChange: 'auto',
        transform: 'translateZ(0)',
      }} />

      {/* Soft ambient glows — Ocultos no mobile */}
      <div className="hidden md:block fixed top-[-8%] left-[-4%] w-[38%] h-[38%] bg-primary/15 blur-[130px] rounded-full pointer-events-none z-0" style={{ transform: 'translateZ(0)' }} />
      <div className="hidden md:block fixed bottom-[-8%] right-[-4%] w-[38%] h-[38%] bg-blue-500/8 blur-[130px] rounded-full pointer-events-none z-0" style={{ transform: 'translateZ(0)' }} />

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
