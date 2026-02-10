import { Request, Response } from "express";
import { ReadQuizzesResponse } from "../../../application/quiz/usecases/ReadQuizzesResponse";
import { ReadQuizzesResponseDTO, ReadQuizzesResponseSchema } from "../../../application/quiz/dtos/ReadQuizzesResponseDTO";

export class ReadQuizzesResponseController {
  constructor(private useCase: ReadQuizzesResponse) { };

  execute = async (req: Request, res: Response) => {
    const useData: ReadQuizzesResponseDTO = ReadQuizzesResponseSchema.parse(req.params);
    try {
      const quizzes = await this.useCase.execute(useData);
      res.status(200).json(quizzes);
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  }
}