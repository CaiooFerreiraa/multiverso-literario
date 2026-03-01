import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { listScheduledRoomsAction } from "@/actions/rooms";
import { readUserPlanStatusAction } from "@/actions/dashboard";
import SalasClient from "./salas-client";

export default async function SalasPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;

  const [roomsResult, planRes] = await Promise.all([
    listScheduledRoomsAction(),
    readUserPlanStatusAction(userId),
  ]);

  const scheduledRooms = roomsResult.success ? (roomsResult.data as any[]) : [];
  const userPlan = (planRes as any).success ? (planRes as any).data : null;
  const viewType: 'student' | 'adult' | 'free' = userPlan?.view_type === 'student' ? 'student' : userPlan ? 'adult' : 'free';

  return (
    <SalasClient
      user={{
        id: userId,
        name: session.user.name || "Explorador",
        email: session.user.email || "",
        image: (session.user as any).image || null,
      }}
      viewType={viewType}
      adminEmail={process.env.ADMIN_EMAIL || ""}
      scheduledRooms={scheduledRooms}
    />
  );
}
