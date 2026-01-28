import { Request, Response } from "express";
import { TimelineDelete } from "../../../application/timeline/usecases/TimelineDelete";
import { DeleteTimelineDTO, DeleteTimelineSchema } from "../../../application/timeline/dtos/DeleteTimelineDTO";

export class DeleteController {
  constructor(private useCase: TimelineDelete) {};

  execute = async (req: Request, res: Response) => {
    try {
      const useData: DeleteTimelineDTO = DeleteTimelineSchema.parse(req.params);
      await this.useCase.execute(useData);
      res.status(200).json(useData)
    } catch (error) {
      error = error instanceof Error ? error.message : String(error);
      console.log(error);
      res.status(400).json(error);
    }
  }
}