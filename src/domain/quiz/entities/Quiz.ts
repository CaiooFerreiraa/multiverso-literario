import { CreateQuizDTO } from "../../../application/quiz/dtos/CreateQuizDTO";
import { Question } from "./Question";

export class Quiz {
  public title: string;
  public statement: string;
  public id_timeline_book: number;
  public questions: Question[];

  constructor(data: CreateQuizDTO) {
    this.id_timeline_book = data.id_timeline_book;
    this.questions = data.questions;
    this.statement = data.statement;
    this.title = data.tittle;
  }
}