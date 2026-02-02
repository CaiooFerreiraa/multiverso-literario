import { ResponseQuizDTO } from "../../../application/quiz/dtos/ResponseQuizDTO";

export class QuizResponse {
  public id_quiz: number;
  public id_question: number;
  public id_alternative?: number
  public response_text?: string

  constructor(data: ResponseQuizDTO) {
    this.id_quiz = data.id_quiz;
    this.id_question = data.id_question;
    this.id_alternative = data.id_alternative
    this.response_text = data.response_text
  }
}