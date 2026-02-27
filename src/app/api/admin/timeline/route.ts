import { NextResponse } from "next/server";
import { neonClient } from "@/infrastructure/database/neon";
import { TimelineNeonDatabase } from "@/infrastructure/timeline/Timeline.databaseNeon";
import { TimelineCreate } from "@/application/timeline/usecases/TimelineCreate";
import { TimelineUpdate } from "@/application/timeline/usecases/TimelineUpdate";

const getTimelineRepository = () => new TimelineNeonDatabase(neonClient);

// POST: Cria uma entrada na Timeline (Admin)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const useCase = new TimelineCreate(getTimelineRepository());
    const result = await useCase.execute(data);

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

// PUT: Atualiza uma entrada na Timeline (Admin)
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const useCase = new TimelineUpdate(getTimelineRepository());
    const result = await useCase.execute(data);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
