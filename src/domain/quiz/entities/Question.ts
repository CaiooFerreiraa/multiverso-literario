import { CreateQuizQuestionsDTO } from "../../../application/quiz/dtos/CreateQuizDTO";
import { Alternative } from "./Alternative";

export class Question {
  public question: string
  public alternatives: Alternative[]

  constructor(data: CreateQuizQuestionsDTO) {
    this.question = data.question;
    this.alternatives = data.alternatives
  }
}