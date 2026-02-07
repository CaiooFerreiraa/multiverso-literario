import { CreateQuizQuestionsDTO } from "../../../application/quiz/dtos/CreateQuizDTO";
import { UpdateQuizQuestionsDTO } from "../../../application/quiz/dtos/UpdateQuizDTO";
import { Alternative } from "./Alternative";

type QuizDTO = CreateQuizQuestionsDTO | UpdateQuizQuestionsDTO

export class Question {
  public id_question?: number;
  public question_tittle: string
  public alternatives: Alternative[]



  constructor(data: CreateQuizQuestionsDTO);
  constructor(data: UpdateQuizQuestionsDTO);

  constructor(data: QuizDTO) {
    this.question_tittle = data.question_tittle;
    this.alternatives = data.alternatives

    if ('id_question' in data) {
      this.id_question = data.id_question
    }
  }
}