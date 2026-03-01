import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RoomClient from "./room-client";

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  return (
    <RoomClient
      roomId={id}
      user={{
        id: (session.user as any).id,
        name: session.user.name || "Explorador",
        email: session.user.email || "",
        image: (session.user as any).image || null,
      }}
    />
  );
}
