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

function normalizeTimelineText(value: string | undefined, fallback: string): string {
  const normalized: string = (value ?? "").trim();
  return normalized.length > 0 ? normalized : fallback;
}

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
      SELECT
        COALESCE(NULLIF(b.name, ''), 'Cronograma sem livro') as name_book,
        COALESCE(NULLIF(b.author, ''), 'Autor não informado') as author_book,
        t.date_start,
        t.date_end,
        t.id_timeline
      FROM timeline t
      LEFT JOIN timeline_book b ON t.id_timeline = b.id_timeline_book
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
    revalidatePath("/home/cronograma");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTimelineAction(id_timeline: number, data: CreateTimelineDTO) {
  try {
    const nameBook: string = normalizeTimelineText(data.nameBook, "Cronograma sem livro");
    const authorBook: string = normalizeTimelineText(data.authorBook, "Autor não informado");

    await neonClient.transaction(async (tx) => {
      await tx.query(
        `UPDATE timeline SET date_start = $1, date_end = $2 WHERE id_timeline = $3`,
        [data.dateStart, data.dateEnd, id_timeline]
      );
      await tx.query(
        `INSERT INTO timeline_book (id_timeline_book, name, author)
         VALUES ($1, $2, $3)
         ON CONFLICT (id_timeline_book)
         DO UPDATE SET name = EXCLUDED.name, author = EXCLUDED.author`,
        [id_timeline, nameBook, authorBook]
      );
    });
    revalidatePath("/home");
    revalidatePath("/home/admin");
    revalidatePath("/home/cronograma");
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
         LEFT JOIN LATERAL (
           SELECT id_plan
           FROM buy
           WHERE id_user = u.id_user AND status = 'concluido'
           ORDER BY created_at DESC, id_buy DESC
           LIMIT 1
         ) b ON true
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

export async function assignAllUsersToStudentPlanAction() {
  try {
    const result = await neonClient.query<{ inserted_count: string }>(`
      WITH student_plan AS (
        SELECT id_plan, duraction, COALESCE(value, 0) AS value
        FROM plan_expanded
        WHERE title ILIKE 'Plano Meu Aluno'
          AND is_active = true
        ORDER BY id_plan DESC
        LIMIT 1
      ),
      latest_buy AS (
        SELECT DISTINCT ON (id_user) id_user, id_plan
        FROM buy
        WHERE status = 'concluido'
        ORDER BY id_user, created_at DESC, id_buy DESC
      ),
      inserted AS (
        INSERT INTO buy (
          id_plan,
          method_payment,
          price_paid,
          status,
          id_user,
          created_at,
          maturity
        )
        SELECT
          student_plan.id_plan,
          'pix',
          student_plan.value,
          'concluido',
          users.id_user,
          CURRENT_DATE,
          CURRENT_DATE + student_plan.duraction
        FROM users
        CROSS JOIN student_plan
        LEFT JOIN latest_buy ON latest_buy.id_user = users.id_user
        WHERE COALESCE(latest_buy.id_plan, 0) <> student_plan.id_plan
        RETURNING id_buy
      )
      SELECT COUNT(*)::text AS inserted_count FROM inserted
    `);

    revalidatePath("/home");
    revalidatePath("/home/admin");
    revalidatePath("/home/planos");

    return { success: true, count: Number(result[0]?.inserted_count ?? 0) };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar planos dos usuários" };
  }
}
