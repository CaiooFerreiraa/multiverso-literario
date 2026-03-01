"use server";

import { neonClient } from "@/infrastructure/database/neon";

export async function readCurrentTimelineAction() {
  try {
    const result = await neonClient.query(
      `SELECT t.id_timeline, t.date_start, t.date_end,
              tb.id_timeline_book, tb.name, tb.author
       FROM timeline t
       JOIN timeline_book tb ON t.id_timeline = tb.id_timeline_book
       WHERE t.date_end >= CURRENT_DATE
       ORDER BY t.date_start ASC
       LIMIT 1`
    );
    return { success: true, data: result.length > 0 ? result[0] : null };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readAllTimelinesAction() {
  try {
    const result = await neonClient.query(
      `SELECT t.id_timeline, t.date_start, t.date_end,
              tb.id_timeline_book, tb.name, tb.author
       FROM timeline t
       JOIN timeline_book tb ON t.id_timeline = tb.id_timeline_book
       ORDER BY t.date_start DESC`
    );
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readUserSealsAction(id_user: number) {
  try {
    const result = await neonClient.query(
      `SELECT ls.*, us.awarded_at
       FROM literary_seals ls
       LEFT JOIN user_seals us ON ls.id_seal = us.id_seal AND us.id_user = $1
       ORDER BY ls.months_required ASC`,
      [id_user]
    );
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readUserPlanStatusAction(id_user: number) {
  try {
    const result = await neonClient.query(
      `SELECT b.*, pe.value, pe.duraction, pe.view_type
       FROM buy b
       JOIN plan_expanded pe ON b.id_plan = pe.id_plan
       WHERE b.id_user = $1 AND b.status = 'concluido'
       ORDER BY b.created_at DESC
       LIMIT 1`,
      [id_user]
    );
    return { success: true, data: result.length > 0 ? result[0] : null };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readGlobalRankingAction() {
  try {
    const result = await neonClient.query(
      `SELECT 
          u.id_user,
          u.fullname as name,
          u.image,
          (
              COALESCE((
                  SELECT SUM(uc.points_earned)
                  FROM user_challenges uc
                  WHERE uc.id_user = u.id_user
              ), 0) + 
              COALESCE((
                  SELECT SUM(q.points)
                  FROM response_quiz_user rqu
                  JOIN responses r ON rqu.id_response = r.id_response
                  JOIN alternatives a ON r.id_alternative = a.id_alternative
                  JOIN questions q ON r.id_question = q.id_question
                  WHERE rqu.id_user = u.id_user AND a.iscorrect = true
              ), 0)
          ) as total_points
       FROM users u
       ORDER BY total_points DESC
       LIMIT 10`
    );
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
import { QuizDatabaseNeon } from "@/infrastructure/quiz/Quiz.databaseNeon";
import { ReadQuiz } from "@/application/quiz/usecases/ReadQuiz";
import { ResponseQuiz } from "@/application/quiz/usecases/ResponseQuiz";
import { ResponseQuizDTO } from "@/application/quiz/dtos/ResponseQuizDTO";

const getQuizRepository = () => new QuizDatabaseNeon(neonClient);

export async function readQuizzesAction(id_timeline_book: number) {
  try {
    const result = await neonClient.query(
      `SELECT q.id_quiz, q.tittle, q.statement,
              (SELECT COUNT(*) FROM questions qst WHERE qst.id_quiz = q.id_quiz) as question_count,
              (SELECT SUM(qst.points) FROM questions qst WHERE qst.id_quiz = q.id_quiz) as total_points
       FROM quiz q
       WHERE q.id_timeline_book = $1 AND q.statement = 'ativo'
       ORDER BY q.id_quiz DESC`,
      [id_timeline_book]
    );
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readQuizAction(id_quiz: number) {
  try {
    const useCase = new ReadQuiz(getQuizRepository());
    const result = await useCase.execute({ id_quiz });
    // result from QuizDatabaseNeon.read is usually an array of one record from the query provided in the repo
    return { success: true, data: result.length > 0 ? result[0] : null };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function responseQuizAction(data: ResponseQuizDTO) {
  try {
    const useCase = new ResponseQuiz(getQuizRepository());
    const result = await useCase.execute(data);
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function checkQuizCompletionAction(id_user: number, id_quiz: number) {
  try {
    const result = await neonClient.query(
      `SELECT 1 FROM response_quiz_user WHERE id_user = $1 AND id_quiz = $2 LIMIT 1`,
      [id_user, id_quiz]
    );
    return { success: true, completed: result.length > 0 };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readLibraryBooksAction() {
  try {
    const result = await neonClient.query(
      `SELECT id_book, name, id_plan FROM book ORDER BY name ASC`
    );
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readLibraryBookAction(id_book: number) {
  try {
    const result = await neonClient.query(
      `SELECT id_book, name, text, id_plan FROM book WHERE id_book = $1`,
      [id_book]
    );
    return { success: true, data: result.length > 0 ? result[0] : null };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readUserTotalPointsAction(id_user: number) {
  try {
    const result = await neonClient.query(
      `SELECT 
        (
          COALESCE((SELECT SUM(points_earned) FROM user_challenges WHERE id_user = $1), 0) +
          COALESCE((
            SELECT SUM(q.points)
            FROM response_quiz_user rqu
            JOIN responses r ON rqu.id_response = r.id_response
            JOIN alternatives a ON r.id_alternative = a.id_alternative
            JOIN questions q ON r.id_question = q.id_question
            WHERE rqu.id_user = $1 AND a.iscorrect = true
          ), 0)
        ) as total_points,
        (SELECT COUNT(*) FROM user_challenges WHERE id_user = $1) as challenges_completed`,
      [id_user]
    );
    const data = result[0] || { total_points: 0, challenges_completed: 0 };
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
