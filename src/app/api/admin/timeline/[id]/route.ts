import { NextResponse } from "next/server";
import { neonClient } from "@/infrastructure/database/neon";
import { TimelineNeonDatabase } from "@/infrastructure/timeline/Timeline.databaseNeon";
import { TimelineRead } from "@/application/timeline/usecases/TimelineRead";
import { TimelineDelete } from "@/application/timeline/usecases/TimelineDelete";

const getTimelineRepository = () => new TimelineNeonDatabase(neonClient);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const idValue = parseInt(params.id, 10);

  if (isNaN(idValue)) {
    return NextResponse.json({ error: "Invalid ID type" }, { status: 400 });
  }

  try {
    const useCase = new TimelineRead(getTimelineRepository());
    const result = await useCase.execute({ id_timeline: idValue });
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 404 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const idValue = parseInt(params.id, 10);

  if (isNaN(idValue)) {
    return NextResponse.json({ error: "Invalid ID type" }, { status: 400 });
  }

  try {
    const useCase = new TimelineDelete(getTimelineRepository());
    await useCase.execute({ id_timeline: idValue });
    return NextResponse.json({ message: "Timeline deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
