import { Quiz } from "../entities/Quiz";
import { QuizResponse } from "../entities/QuizResponse";

export interface QuizRepository {
  create(quiz: Quiz): Promise<any>;
  read(id_quiz: number): Promise<any>;
  update(quiz: Quiz): Promise<any>;
  delete(id_quiz: number): Promise<any>;
  registerResponseQuiz(response: QuizResponse): Promise<any>;
  readResponseQuiz(id_user: number): Promise<any>;
}
