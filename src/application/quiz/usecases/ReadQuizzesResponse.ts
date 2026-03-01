import { QuizRepository } from "../../../domain/quiz/repository/QuizRepository";
import { ReadQuizzesResponseDTO } from "../dtos/ReadQuizzesResponseDTO";

export class ReadQuizzesResponse {
  constructor(private useRepo: QuizRepository) { };

  async execute(data: ReadQuizzesResponseDTO) {
    const { id_user } = data;
    return await this.useRepo.readResponseQuiz(id_user);
  }
}
