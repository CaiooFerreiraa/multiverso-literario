import React from "react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { neonClient } from "@/infrastructure/database/neon";

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const [room] = await neonClient.query<{ meeting_url: string | null }>(
    "SELECT meeting_url FROM scheduled_rooms WHERE slug = $1 AND is_active = true",
    [id]
  );

  if (!room) notFound();

  if (room.meeting_url) {
    redirect(room.meeting_url);
  }

  redirect("/home/salas");
}
