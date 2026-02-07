import { Request, Response } from "express";
import { ResponseQuizDTO, ResponseQuizSchema } from "../../../application/quiz/dtos/ResponseQuizDTO";
import { ResponseQuiz } from "../../../application/quiz/usecases/ResponseQuiz";

export class ResponseQuizController {
  constructor(private useCase: ResponseQuiz) { };
  
  execute = async (req: Request, res: Response) => {
    const useData: ResponseQuizDTO = ResponseQuizSchema.parse(req.body)

    try {
      await this.useCase.execute(useData);
      res.status(201).json(useData);
    } catch (error) {
      error = error instanceof Error ? error.message : String(error);
      console.log(error)
      res.status(400).json(error);
    }
  }
}