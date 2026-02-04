import { QuizResponse } from "../../../domain/quiz/entities/QuizResponse";
import { QuizRepository } from "../../../domain/quiz/repository/QuizRepository";
import { ResponseQuizDTO } from "../dtos/ResponseQuizDTO";

export class ResponseQuiz {
  constructor(private useRepo: QuizRepository) { };

  async execute(data: ResponseQuizDTO) {
    const responseQuiz = new QuizResponse(data);
    return await this.useRepo.registerResponseQuiz(responseQuiz);
  }
}