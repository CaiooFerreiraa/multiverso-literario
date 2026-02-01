import { Request, Response } from "express";
import { UpdateQuiz } from "../../../application/quiz/usecases/UpdateQuiz";
import { UpdateQuizDTO, UpdateQuizSchema } from "../../../application/quiz/dtos/UpdateQuizDTO";

export class UpdateQuizController {
  constructor(private useCase: UpdateQuiz) {};

  execute = async (req: Request, res: Response) => {
    const useData: UpdateQuizDTO = UpdateQuizSchema.parse(req.body);
    console.log(useData)
    try {
      const quiz = await this.useCase.execute(useData);
      res.status(200).json(quiz);
    } catch (error) {
      error = error instanceof Error ? error.message : String(error);
      console.log(error)
      res.status(400).json(error);
    }
  }
}