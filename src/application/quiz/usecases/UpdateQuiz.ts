import { Quiz } from '../../../domain/quiz/entities/Quiz';
import { QuizRepository } from '../../../domain/quiz/repository/QuizRepository'
import { UpdateQuizDTO } from '../dtos/UpdateQuizDTO';

export class UpdateQuiz {
  constructor(private useRepo: QuizRepository) {};

  async execute(data: UpdateQuizDTO) {
    const quiz = new Quiz(data);
    return await this.useRepo.update(quiz);
  }
}