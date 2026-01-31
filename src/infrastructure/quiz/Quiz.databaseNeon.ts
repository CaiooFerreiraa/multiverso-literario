import { Quiz } from "../../domain/quiz/entities/Quiz";
import { QuizRepository } from "../../domain/quiz/repository/QuizRepository";
import { Database } from "../../core/database/Database";
import { Question } from "../../domain/quiz/entities/Question";
import { Alternative } from "../../domain/quiz/entities/Alternative";

export class QuizDatabaseNeon implements QuizRepository {
  constructor(private database: Database) {};

  async create(quiz: Quiz): Promise<void> {
    try {
      await this.insertDataQuiz(quiz);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  private async insertDataQuiz(quiz: Quiz) {
    const [ result ] = await this.database`
      INSERT INTO quiz (tittle, id_timeline_book, statement) VALUES (
        ${quiz.title}, ${quiz.id_timeline_book}, ${quiz.statement}
      ) RETURNING id_quiz
    `;

    console.log(result);
    const id_quiz: number = result.id_quiz;
    const questions: Question[] = quiz.questions;

    await this.insertArrayOfQuestions(id_quiz, questions)
  }

  private async insertArrayOfQuestions(id_quiz: number, questions: Question[]) {
    for (const element of questions) {
      const [result] = await this.database`
        INSERT INTO questions (id_quiz, question_tittle)
        VALUES (${id_quiz}, ${element.question_tittle})
        RETURNING id_question
      `;

      const id_question = result.id_question;
      await this.insertArrayOfAlternatives(id_question, element.alternatives);
    }
  }

  private async insertArrayOfAlternatives(id_question: number, alternatives: Alternative[]) {
    for (const element of alternatives) {
      await this.database`
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
                        'is_correct', c.iscorrect
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

      console.log(quiz)

      return quiz;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  private arrayOfQuizFormated(quiz: Record<string, any>[], id_quiz: number): Object[] {
    const prev = quiz.map(element => {
      
    })


    return [{}]
  }

  update(id_quiz: number, quiz: Quiz): Promise<any> {
    throw new Error("Method not implemented.");
  }
  delete(id_quiz: number): Promise<any> {
    throw new Error("Method not implemented.");
  }
}