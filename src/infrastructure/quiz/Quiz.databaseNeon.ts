import { Quiz } from "../../domain/quiz/entities/Quiz";
import { QuizRepository } from "../../domain/quiz/repository/QuizRepository";
import { Question } from "../../domain/quiz/entities/Question";
import { Alternative } from "../../domain/quiz/entities/Alternative";
import { Database } from "../database/neon";

export class QuizDatabaseNeon implements QuizRepository {
  constructor(private database: Database) { };

  async create(quiz: Quiz) {
    try {
      await this.database.transaction(async (tx: Database) => {
        await this.insertDataQuiz(tx, quiz);    
      }, {
        isolationLevel: "RepeatableRead"
      });
    } catch (error) {
      throw error;
    }
  }

  private async insertDataQuiz(query: Database, quiz: Quiz) {
    const [result] = await query`
      INSERT INTO quiz (tittle, id_timeline_book, statement) VALUES (
      ${quiz.title}, ${quiz.id_timeline_book}, ${quiz.statement}
      ) RETURNING id_quiz
    `

    const id_quiz: number = result.id_quiz;
    const questions: Question[] = quiz.questions;

    await this.insertArrayOfQuestions(query, id_quiz, questions)
  }

  private async insertArrayOfQuestions(query: Database, id_quiz: number, questions: Question[]) {
    for (const element of questions) {
      const [result] = await query`
        INSERT INTO questions (id_quiz, question_tittle)
        VALUES (${id_quiz}, ${element.question_tittle})
        RETURNING id_question
      `;

      const id_question = result.id_question;
      await this.insertArrayOfAlternatives(query, id_question, element.alternatives);
    }
  }

  private async insertArrayOfAlternatives(
    query: Database,
    id_question: number,
    alternatives: Alternative[]
  ) {
    for (const element of alternatives) {
      await query`
        INSERT INTO alternatives (id_question, alternative, iscorrect) VALUES (
          ${id_question}, ${element.alternative}, ${element.is_correct}
        )
      `
    }
  }

  async read(id_quiz: number): Promise<any> {
    try {
      const quiz = await this.database`
        SELECT
          a.tittle,
          a.statement,
          a.id_timeline_book,
          COALESCE(
            json_agg(
              json_build_object(
                'question_tittle', b.question_tittle,
                'alternatives', (
                  SELECT COALESCE(
                    json_agg(
                      json_build_object(
                        'alternative', c.alternative,
                        'is_correct', c.iscorrect,
                        'id_alternative', c.id_alternative
                      )
                    ),
                    '[]'::json
                  )
                  FROM alternatives c
                  WHERE c.id_question = b.id_question
                )
              )
            ) FILTER (WHERE b.id_question IS NOT NULL),
            '[]'::json
          ) AS questions
        FROM quiz a
        LEFT JOIN questions b ON b.id_quiz = a.id_quiz
        WHERE a.id_quiz = ${id_quiz}
        GROUP BY
          a.tittle,
          a.statement,
          a.id_timeline_book;

      ` ;

      return quiz;
    } catch (error) {
      throw error;
    }
  }

  async update(quiz: Quiz): Promise<any> {
    try {
      await this.database.transaction(async (context) => {
        await this.updateDataQuiz(context, quiz)
      }, {isolationLevel: "RepeatableRead"});
    } catch (error) {
      throw error;
    }
  }

  private async updateDataQuiz(query: Database, quiz: Quiz) {
    const id_quiz: number | undefined = quiz.id_quiz;

    await query`
      UPDATE quiz
      SET tittle = ${quiz.title},
          id_timeline_book = ${quiz.id_timeline_book},
          statement = ${quiz.statement}
      WHERE id_quiz = ${id_quiz}
    `
    const questions: Question[] = quiz.questions;
    await this.updateArrayOfQuestions(query, questions, id_quiz)
  }

  private async updateArrayOfQuestions(query: Database, questions: Question[], id_quiz: number | undefined) {
      for (const element of questions) {
        const [result] = await query`
          UPDATE questions
          SET question_tittle = ${element.question_tittle}
          WHERE id_quiz = ${id_quiz}
          RETURNING id_question
        `;

        const id_question = result.id_question;
        const alternatives: Alternative[] = element.alternatives;

        await this.updateArrayOfAlternatives(query, id_question, alternatives);
    }
  }

  private async updateArrayOfAlternatives(query: Database, id_question: number, alternatives: Alternative[]) {
    for (const element of alternatives) {
      await query`
        UPDATE alternatives
        SET alternative = ${element.alternative},
            iscorrect = ${element.is_correct}
        WHERE id_alternative = ${element.id_alternative}
      `
    }    
  }

  delete(id_quiz: number): Promise<any> {
    throw new Error("Method not implemented.");
  }
}