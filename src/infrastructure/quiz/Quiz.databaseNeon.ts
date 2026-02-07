import { Quiz } from "../../domain/quiz/entities/Quiz";
import { QuizRepository } from "../../domain/quiz/repository/QuizRepository";
import { Question } from "../../domain/quiz/entities/Question";
import { Alternative } from "../../domain/quiz/entities/Alternative";
import { Database } from "../database/neon";
import { QuizResponse } from "../../domain/quiz/entities/QuizResponse";

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
          a.id_quiz,
          a.tittle,
          a.statement,
          a.id_timeline_book,
          COALESCE(
            json_agg(
              json_build_object(
                'id_question', b.id_question,
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
          a.id_timeline_book,
          a.id_quiz;

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
          WHERE id_quiz = ${id_quiz} and id_question = ${element.id_question}
          RETURNING id_question
        `;

        let id_question: number;

        if (typeof result == 'undefined') {
          id_question = await this.insertObjectQuestion(element, id_quiz, query);
        } else {
          id_question = result.id_question;
        }

        const alternatives: Alternative[] = element.alternatives;
        await this.updateArrayOfAlternatives(query, id_question, alternatives);
    }
  }

  private async insertObjectQuestion(question: Question, id_quiz: number | undefined, query: Database) {
    try {
      const [result] = await query`
        INSERT INTO questions (question_tittle, id_quiz) VALUES (
         ${question.question_tittle}, ${id_quiz}
        ) RETURNING id_question
      `
      return result.id_question;
    } catch (error) {
      throw error;
    }
  }

  private async updateArrayOfAlternatives(query: Database, id_question: number, alternatives: Alternative[]) {
    for (const element of alternatives) {
      const [ result ] = await query`
        UPDATE alternatives
        SET alternative = ${element.alternative},
            iscorrect = ${element.is_correct}
        WHERE id_alternative = ${element.id_alternative} 
        RETURNING id_alternative
      `

      if (typeof result == 'undefined') {
        await this.insertObjectOfAlternative(query, id_question, element)
      } 
    }    
  }

  private async insertObjectOfAlternative(query: Database, id_question: number, alternative: Alternative) {
    try {
      await query`
        INSERT INTO alternatives (id_alternative, alternative, iscorrect, id_question) VALUES (
          ${alternative.id_alternative}, ${alternative.alternative}, ${alternative.is_correct}, ${id_question}
        ) 
      `
    } catch (error) {
      throw error;
    }
  }

  async delete(id_quiz: number): Promise<any> {
    try {
      await this.database`
        DELETE FROM quiz
        WHERE id_quiz = ${id_quiz}
      `;

      return id_quiz;
    } catch (error) {
      throw error;
    }
  }

  async registerResponseQuiz(responseOfUser: QuizResponse) {
    try {
      await this.database.transaction(async (query) => {
        if (typeof responseOfUser.id_alternative != 'undefined') {
          await this.insertResponseMarkQuiz(query, responseOfUser);
        } else {
          await this.insertResponseTextQuiz(query, responseOfUser);
        }
      })
    } catch (error) {
      throw error;
    }
  }

  private async insertResponseMarkQuiz(query: Database, responseOfUser: QuizResponse) {
    const date = new Date()

    const [result] = await query`
      INSERT INTO responses (date, id_question, id_alternative) VALUES (
        ${date.toISOString()}, ${responseOfUser.id_question}, ${responseOfUser.id_alternative}
      ) RETURNING id_response
    `

    const id_response: number = result.id_response
    await this.registerResponseQuizUser(query, responseOfUser, id_response);
  }

  private async insertResponseTextQuiz(query: Database, responseOfUser: QuizResponse) {
    const date = new Date()

    const [result] = await query`
      INSERT INTO responses (date, id_question, response_text) VALUES (
        ${date.toISOString()}, ${responseOfUser.id_question}, ${responseOfUser.response_text}
      ) RETURNING id_response
    `

    const id_response: number = result.id_response
    await this.registerResponseQuizUser(query, responseOfUser, id_response);
  }

  private async registerResponseQuizUser(query: Database, responseOfUser: QuizResponse, id_response: number) {
    await query`
      INSERT INTO response_quiz_user (id_quiz, id_user, id_response) VALUES (
        ${responseOfUser.id_quiz}, ${responseOfUser.id_user}, ${id_response}
      )
    `
  }
}