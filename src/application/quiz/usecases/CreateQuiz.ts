import { Quiz } from "../../../domain/quiz/entities/Quiz";
import { QuizRepository } from "../../../domain/quiz/repository/QuizRepository";

export class CreateQuiz {
  constructor(private useRepo: QuizRepository) {}

  async execute(quiz: Quiz): Promise<any> {
    const { questions, ...quizData } = quiz;
    const [ { question, alternatives } ] = questions;
    console.log(quizData);
    console.log(question);
    console.log(alternatives);
  }
}