import { Request, Response } from "express";
import { ReadQuiz } from "../../../application/quiz/usecases/ReadQuiz";
import { ReadQuizDTO, ReadQuizSchema } from "../../../application/quiz/dtos/ReadQuizDTO";

export class ReadQuizController {
  constructor(private useCase: ReadQuiz) {};

  execute = async (req: Request, res: Response) => {
    try {
      const useData: ReadQuizDTO = ReadQuizSchema.parse(req.params);
      const quiz = await this.useCase.execute(useData);
      res.status(200).json(quiz);
    } catch (error) {
      error = error instanceof Error ? error.message : String(error);
      console.log(error)
      res.status(400).json(error);
    }
  }
}