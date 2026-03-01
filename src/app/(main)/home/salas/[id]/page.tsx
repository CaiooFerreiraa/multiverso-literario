import React from "react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import RoomClient from "./room-client";
import { neonClient } from "@/infrastructure/database/neon";

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  // Encontrar a sala pelo slug no banco para obter o id_room numérico
  const [room] = await neonClient.query(
    "SELECT id_room FROM scheduled_rooms WHERE slug = $1 AND is_active = true",
    [id]
  );

  if (!room) notFound();

  return (
    <RoomClient
      roomData={{ id_room: room.id_room, slug: id }}
      user={{
        id: (session.user as any).id,
        name: session.user.name || "Explorador",
        email: session.user.email || "",
        image: (session.user as any).image || null,
      }}
    />
  );
}
