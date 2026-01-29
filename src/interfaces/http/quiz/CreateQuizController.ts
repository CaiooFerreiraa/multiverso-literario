import { Request, Response } from "express";
import { CreateQuiz } from "../../../application/quiz/usecases/CreateQuiz";
import { CreateQuizDTO, CreateQuizSchema } from "../../../application/quiz/dtos/CreateQuizDTO";

export class CreateQuizController {
  constructor(private useCase: CreateQuiz) {};

  execute = async (req: Request, res: Response) => {
    try {
      const useData: CreateQuizDTO = CreateQuizSchema.parse(req.body);
      await this.useCase.execute(useData);
      res.status(201).json(req.body);
    } catch (error) {
      error = error instanceof Error ? error.message : String(error);
      console.log(error);
      res.status(400).json(error);
    }
  }
}