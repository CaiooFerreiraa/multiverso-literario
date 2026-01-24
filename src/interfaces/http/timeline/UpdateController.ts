import { Request, Response } from "express";
import { TimelineUpdate } from "../../../application/timeline/usecases/TimelineUpdate";
import { UpdateTimelineDTO, UpdateTimelineSchema } from "../../../application/timeline/dtos/UpdateTimelineDTO";

export class UpdateController {
  constructor(private useCase: TimelineUpdate) {};

  execute = async (req: Request, res: Response ) => {
    try {
      const useData: UpdateTimelineDTO = UpdateTimelineSchema.parse(req.body);
      await this.useCase.execute(useData);
      res.status(200).json(useData);
    } catch (error) {
      error = error instanceof Error ? error.message : String(error);
      console.log(error);
      res.status(400).json(error)
    }
  }
}