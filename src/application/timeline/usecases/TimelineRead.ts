import { TimelineRepository } from "../../../domain/timeline/repository/TimelineRepository";
import { ReadTimelineDTO } from "../dtos/ReadTimelineDTO";

export class TimelineRead {
  constructor(private useRepo: TimelineRepository) {};

  async execute(data: ReadTimelineDTO) {
    const { id_timeline } = data;
    return await this.useRepo.read(id_timeline)
  }
}
