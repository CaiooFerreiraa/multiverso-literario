"use server";

import { neonClient } from "@/infrastructure/database/neon";
import { TimelineNeonDatabase } from "@/infrastructure/timeline/Timeline.databaseNeon";
import { QuizDatabaseNeon } from "@/infrastructure/quiz/Quiz.databaseNeon";
import { TimelineCreate } from "@/application/timeline/usecases/TimelineCreate";
import { CreateQuiz } from "@/application/quiz/usecases/CreateQuiz";
import { CreateTimelineDTO } from "@/application/timeline/dtos/CreateTimelineDTO";
import { CreateQuizDTO } from "@/application/quiz/dtos/CreateQuizDTO";
import { Quiz } from "@/domain/quiz/entities/Quiz";
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
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/quizzes");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar quiz" };
  }
}

export async function updateQuizAction(data: CreateQuizDTO & { id_quiz: number }) {
  try {
    const repository = getQuizRepository();
    const quizEntity = new Quiz(data);
    await repository.update(quizEntity);
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/quizzes");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar quiz" };
  }
}

export async function deleteQuizAction(id_quiz: number) {
  try {
    const repository = getQuizRepository();
    await repository.delete(id_quiz);
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/quizzes");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao deletar quiz" };
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

export async function readAllQuizzesAction() {
  try {
    const result = await neonClient.query(`
      SELECT q.*, b.name as name_book
      FROM quiz q
      JOIN timeline_book b ON q.id_timeline_book = b.id_timeline_book
      ORDER BY q.id_quiz DESC
    `);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTimelineAction(id_timeline: number) {
  try {
    // Delete from timeline (due to CASCADE or manual delete of books/quiz if needed)
    // Assuming schema handles CASCADE, but let's be safe if not.
    await neonClient.query(`DELETE FROM timeline WHERE id_timeline = $1`, [id_timeline]);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTimelineAction(id_timeline: number, data: CreateTimelineDTO) {
  try {
    await neonClient.transaction(async (tx) => {
      await tx.query(
        `UPDATE timeline SET date_start = $1, date_end = $2 WHERE id_timeline = $3`,
        [data.dateStart, data.dateEnd, id_timeline]
      );
      await tx.query(
        `UPDATE timeline_book SET name = $1, author = $2 WHERE id_timeline_book = $3`,
        [data.nameBook, data.authorBook, id_timeline]
      );
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleQuizStatusAction(id_quiz: number, status: 'ativo' | 'inativo') {
  try {
    await neonClient.query(
      `UPDATE quiz SET statement = $1 WHERE id_quiz = $2`,
      [status, id_quiz]
    );
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/quizzes");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
