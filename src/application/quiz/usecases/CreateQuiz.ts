import { Quiz } from "../../../domain/quiz/entities/Quiz";
import { QuizRepository } from "../../../domain/quiz/repository/QuizRepository";
import { CreateQuizDTO } from "../dtos/CreateQuizDTO";

export class CreateQuiz {
  constructor(private useRepo: QuizRepository) {}

  async execute(data: CreateQuizDTO): Promise<any> {
    const quiz = new Quiz(data);
    return await this.useRepo.create(quiz)
  }
}