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
    revalidatePath("/home");
    revalidatePath("/home/cronograma");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar cronograma" };
  }
}

export async function createQuizAction(data: CreateQuizDTO) {
  try {
    const useCase = new CreateQuiz(getQuizRepository());
    const result = await useCase.execute(data);
    revalidatePath("/home/admin");
    revalidatePath("/home/quizzes");
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
    revalidatePath("/home/admin");
    revalidatePath("/home/quizzes");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar quiz" };
  }
}

export async function deleteQuizAction(id_quiz: number) {
  try {
    const repository = getQuizRepository();
    await repository.delete(id_quiz);
    revalidatePath("/home/admin");
    revalidatePath("/home/quizzes");
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
    await neonClient.transaction(async (tx) => {
      // 1. Delete user responses for any quizzes linked to this timeline_book
      await tx.query(`DELETE FROM response_quiz_user WHERE id_quiz IN (SELECT id_quiz FROM quiz WHERE id_timeline_book = $1)`, [id_timeline]);
      // 2. Delete the quizzes themselves
      await tx.query(`DELETE FROM quiz WHERE id_timeline_book = $1`, [id_timeline]);
      // 3. Delete from scheduled rooms if any
      await tx.query(`DELETE FROM scheduled_rooms WHERE id_timeline_book = $1`, [id_timeline]).catch(() => null);
      // 4. Finally delete the timeline (which normally cascades to timeline_book and timeline_belongs)
      await tx.query(`DELETE FROM timeline WHERE id_timeline = $1`, [id_timeline]);
    });
    revalidatePath("/home");
    revalidatePath("/home/admin");
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
    revalidatePath("/home");
    revalidatePath("/home/admin");
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
    revalidatePath("/home/admin");
    revalidatePath("/home/quizzes");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createBookAction(data: { name: string; pdf_url?: string; cover_url?: string; id_plan?: number }) {
  try {
    const result = await neonClient.query(
      `INSERT INTO book (name, pdf_url, cover_url, id_plan) VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.name, data.pdf_url || null, data.cover_url || null, data.id_plan || null]
    );
    revalidatePath("/home/admin");
    revalidatePath("/home/biblioteca");
    return { success: true, data: result[0] };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar livro" };
  }
}

export async function deleteBookAction(id_book: number) {
  try {
    await neonClient.query(
      `DELETE FROM book WHERE id_book = $1`,
      [id_book]
    );
    revalidatePath("/home/admin");
    revalidatePath("/home/biblioteca");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao deletar livro" };
  }
}

export async function readUsersAction(page: number = 1, limit: number = 10) {
  try {
    const offset = (page - 1) * limit;

    const [rows, countRows] = await Promise.all([
      neonClient.query<{
        id_user: number;
        name: string;
        email: string;
        image: string | null;
        created_at: string | null;
        plan_name: string | null;
        view_type: string | null;
      }>(
        `SELECT
          u.id_user,
          u.fullname AS name,
          u.email,
          u.image,
          NULL AS created_at,
          pe.title      AS plan_name,
          pe.view_type
         FROM users u
         LEFT JOIN member m ON u.id_user = m.id_user
         LEFT JOIN (
           SELECT id_user, id_plan, MAX(created_at) as last_buy
           FROM buy
           WHERE status = 'concluido'
           GROUP BY id_user, id_plan
         ) b ON b.id_user = u.id_user
         LEFT JOIN plan_expanded pe ON b.id_plan = pe.id_plan
         ORDER BY u.id_user DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      neonClient.query<{ total: string }>(`SELECT COUNT(*) AS total FROM users`),
    ]);

    const total = parseInt(countRows[0]?.total ?? "0", 10);

    return { success: true, data: rows, total, page, limit };
  } catch (error: any) {
    console.error("[readUsersAction] Error:", error);
    return { success: false, error: error.message || "Erro ao listar usuários", data: [], total: 0, page, limit };
  }
}
