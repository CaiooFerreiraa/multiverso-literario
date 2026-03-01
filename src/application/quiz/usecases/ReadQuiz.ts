import { QuizRepository } from "../../../domain/quiz/repository/QuizRepository";
import { ReadQuizDTO } from "../dtos/ReadQuizDTO";

export class ReadQuiz {
  constructor(private useRepo: QuizRepository) {};

  async execute(data: ReadQuizDTO) {
    const { id_quiz } = data;
    return await this.useRepo.read(id_quiz)
  }
}
