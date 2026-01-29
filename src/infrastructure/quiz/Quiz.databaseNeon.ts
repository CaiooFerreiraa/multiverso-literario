import { Quiz } from "../../domain/quiz/entities/Quiz";
import { QuizRepository } from "../../domain/quiz/repository/QuizRepository";
import { Database } from "../../core/database/Database";

export class QuizDatabaseNeon implements QuizRepository {
  constructor(private database: Database) {};

  async create(quiz: Quiz): Promise<any> {
    try {
      console.log(quiz);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  read(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(id_quiz: number, quiz: Quiz): Promise<any> {
    throw new Error("Method not implemented.");
  }
  delete(id_quiz: number): Promise<any> {
    throw new Error("Method not implemented.");
  }
}