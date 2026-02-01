import { Request, Response } from "express";
import { DeleteQuiz } from "../../../application/quiz/usecases/DeleteQuiz";
import { DeleteQuizDTO, DeleteQuizSchema } from "../../../application/quiz/dtos/DeleteQuizDTO";

export class DeleteQuizController {
  constructor(private useCase: DeleteQuiz) { };

  execute = async (req: Request, res: Response) => {
    const useData: DeleteQuizDTO = DeleteQuizSchema.parse(req.params);

    try {
      await this.useCase.execute(useData)
      res.status(200).json(useData)
    } catch (error) {
      console.log(error);
      error = error instanceof Error ? error.message : String(error);
      res.status(400).json(error)
    }
  }
}