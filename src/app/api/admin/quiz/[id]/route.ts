import { NextResponse } from "next/server";
import { neonClient } from "@/infrastructure/database/neon";
import { QuizDatabaseNeon } from "@/infrastructure/quiz/Quiz.databaseNeon";
import { ReadQuiz } from "@/application/quiz/usecases/ReadQuiz";
import { DeleteQuiz } from "@/application/quiz/usecases/DeleteQuiz";

const getQuizRepository = () => new QuizDatabaseNeon(neonClient);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const idValue = parseInt(params.id, 10);

  if (isNaN(idValue)) {
    return NextResponse.json({ error: "Invalid ID type" }, { status: 400 });
  }

  try {
    const useCase = new ReadQuiz(getQuizRepository());
    const result = await useCase.execute({ id_quiz: idValue });
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
    const useCase = new DeleteQuiz(getQuizRepository());
    await useCase.execute({ id_quiz: idValue });
    return NextResponse.json({ message: "Quiz deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
