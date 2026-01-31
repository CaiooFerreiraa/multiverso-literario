import { CreateQuizQuestionsDTO } from "../../../application/quiz/dtos/CreateQuizDTO";
import { Alternative } from "./Alternative";

export class Question {
  public question_tittle: string
  public alternatives: Alternative[]

  constructor(data: CreateQuizQuestionsDTO) {
    this.question_tittle = data.question_tittle;
    this.alternatives = data.alternatives
  }
}