import { Request, Response } from "express";
import { TimelineRead } from "../../../application/timeline/usecases/TimelineRead";
import { ReadTimelineDTO, ReadTimelineSchema } from "../../../application/timeline/dtos/ReadTimelineDTO";

export class ReadController {
  constructor (private useCase: TimelineRead) {};

  execute = async (req: Request, res: Response) => {
    try {
      const useData: ReadTimelineDTO = ReadTimelineSchema.parse(req.params); 
      const timeline = await this.useCase.execute(useData);
      res.status(200).json(timeline);
    } catch (error) {
      error = error instanceof Error ? error.message : String(error);
      console.log(error);
      res.status(400).json(error);
    }
  }
}