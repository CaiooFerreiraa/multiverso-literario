import { NextResponse } from "next/server";
import { neonClient } from "@/infrastructure/database/neon";
import { QuizDatabaseNeon } from "@/infrastructure/quiz/Quiz.databaseNeon";
import { CreateQuiz } from "@/application/quiz/usecases/CreateQuiz";
import { UpdateQuiz } from "@/application/quiz/usecases/UpdateQuiz";

const getQuizRepository = () => new QuizDatabaseNeon(neonClient);

// POST: Cria um Quiz/Questão (Admin)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const useCase = new CreateQuiz(getQuizRepository());
    const result = await useCase.execute(data);

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

// PUT: Atualiza um Quiz/Questão (Admin)
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const useCase = new UpdateQuiz(getQuizRepository());
    const result = await useCase.execute(data);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
