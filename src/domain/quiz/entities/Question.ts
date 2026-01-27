import { Alternative } from "./Alternative";

export class Question {
  constructor(
    public question: string,
    public id_quiz: number,
    public alternatives: Alternative[]
  ) {}
}