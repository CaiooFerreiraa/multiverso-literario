import { NextResponse } from "next/server";
import { neonClient } from "@/infrastructure/database/neon";
import { QuizDatabaseNeon } from "@/infrastructure/quiz/Quiz.databaseNeon";
import { ResponseQuiz } from "@/application/quiz/usecases/ResponseQuiz";

const getQuizRepository = () => new QuizDatabaseNeon(neonClient);

// POST: O Usuário responde ao quiz
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const useCase = new ResponseQuiz(getQuizRepository());
    const result = await useCase.execute(data);

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
