import { NextResponse } from "next/server";
import { neonClient } from "@/infrastructure/database/neon";
import { QuizDatabaseNeon } from "@/infrastructure/quiz/Quiz.databaseNeon";
import { ReadQuizzesResponse } from "@/application/quiz/usecases/ReadQuizzesResponse";

const getQuizRepository = () => new QuizDatabaseNeon(neonClient);

export async function GET(
  request: Request,
  { params }: { params: { id_user: string } }
) {
  const idValue = parseInt(params.id_user, 10);

  if (isNaN(idValue)) {
    return NextResponse.json({ error: "Invalid ID type" }, { status: 400 });
  }

  try {
    const useCase = new ReadQuizzesResponse(getQuizRepository());
    const result = await useCase.execute({ id_user: idValue });
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 404 });
  }
}
