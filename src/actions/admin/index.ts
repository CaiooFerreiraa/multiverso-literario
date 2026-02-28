"use server";

import { neonClient } from "@/infrastructure/database/neon";
import { TimelineNeonDatabase } from "@/infrastructure/timeline/Timeline.databaseNeon";
import { QuizDatabaseNeon } from "@/infrastructure/quiz/Quiz.databaseNeon";
import { TimelineCreate } from "@/application/timeline/usecases/TimelineCreate";
import { CreateQuiz } from "@/application/quiz/usecases/CreateQuiz";
import { CreateTimelineDTO } from "@/application/timeline/dtos/CreateTimelineDTO";
import { CreateQuizDTO } from "@/application/quiz/dtos/CreateQuizDTO";
import { revalidatePath } from "next/cache";

const getTimelineRepository = () => new TimelineNeonDatabase(neonClient);
const getQuizRepository = () => new QuizDatabaseNeon(neonClient);

export async function createTimelineAction(data: CreateTimelineDTO) {
  try {
    const useCase = new TimelineCreate(getTimelineRepository());
    const result = await useCase.execute(data);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/cronograma");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar cronograma" };
  }
}

export async function createQuizAction(data: CreateQuizDTO) {
  try {
    const useCase = new CreateQuiz(getQuizRepository());
    const result = await useCase.execute(data);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar quiz" };
  }
}

export async function readAllTimelinesAction() {
  try {
    const result = await neonClient.query(`
      SELECT b.name as name_book, b.author as author_book, t.date_start, t.date_end, t.id_timeline
      FROM timeline t
      JOIN timeline_book b ON t.id_timeline = b.id_timeline_book
      ORDER BY t.date_start DESC
    `);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
