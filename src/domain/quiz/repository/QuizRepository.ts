import { Quiz } from "../entities/Quiz";

export interface QuizRepository {
  create(quiz: Quiz): Promise<any>;
  read(id_quiz: number): Promise<any>;
  update(quiz: Quiz): Promise<any>;
  delete(id_quiz: number): Promise<any>;
}