import { QuizRepository } from "../../../domain/quiz/repository/QuizRepository";
import { DeleteQuizDTO } from "../dtos/DeleteQuizDTO";

export class DeleteQuiz {
  constructor(private useRepo: QuizRepository) { };

  async execute(data: DeleteQuizDTO) {
    const {id_quiz}: { id_quiz: number } = data;
    return await this.useRepo.delete(id_quiz);
  }
}
