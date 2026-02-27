import { NextResponse } from "next/server";
import { createPlanAction, readPlanAction, deletePlanAction } from "@/actions/plans";

// POST: Criar novo plano de assinatura
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await createPlanAction(data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// GET: Listar plano por ID ou deletar
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const result = await readPlanAction(parseInt(id));

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json(result.data, { status: 200 });
}
