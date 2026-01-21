import { Request, Response } from "express";
import { TimelineCreate } from "../../../application/timeline/usecases/TimelineCreate";
import { CreateTimelineDTO, CreateTimelineSchema } from "../../../application/timeline/dtos/CreateTimelineDTO";

export class CreateController {
  constructor(private useCase: TimelineCreate) {};

  execute = async (req: Request, res: Response) => {
    try {
      const useData: CreateTimelineDTO = CreateTimelineSchema.parse(req.body);
      await this.useCase.execute(useData);
      res.status(200).json(useData);
    } catch (error) {
      error = error instanceof Error ? error.message : String(error);
      console.log(error);
      res.status(400).json(error)
    }
  }
}