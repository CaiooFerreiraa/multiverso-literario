import { Question } from "./Question";

export class Quiz {
  constructor(
    public title: string,
    public statement: string,
    public id_timeline_book: number,
    public questions: Question[]
  ) {}
}