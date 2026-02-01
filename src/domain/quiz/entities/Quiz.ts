import { CreateQuizDTO } from "../../../application/quiz/dtos/CreateQuizDTO";
import { UpdateQuizDTO } from "../../../application/quiz/dtos/UpdateQuizDTO";
import { Question } from "./Question";

type QuizDTO = CreateQuizDTO | UpdateQuizDTO

export class Quiz {
  public title: string;
  public statement: string;
  public id_timeline_book: number;
  public questions: Question[];
  public id_quiz?: number

  constructor(data: CreateQuizDTO);
  constructor(data: UpdateQuizDTO);

  constructor(data: QuizDTO) {
    this.id_timeline_book = data.id_timeline_book;
    this.questions = data.questions;
    this.statement = data.statement;
    this.title = data.tittle;

    if ("id_quiz" in data) {
      this.id_quiz = data.id_quiz
    }
  }
}