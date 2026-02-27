import { NextResponse } from "next/server";
import { readAllPlansAction } from "@/actions/plans";

export async function GET() {
  const result = await readAllPlansAction();

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data, { status: 200 });
}
