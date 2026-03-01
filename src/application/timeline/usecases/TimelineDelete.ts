import { TimelineRepository } from "../../../domain/timeline/repository/TimelineRepository";
import { DeleteTimelineDTO } from "../dtos/DeleteTimelineDTO";

export class TimelineDelete {
  constructor(private useRepo: TimelineRepository) {};

  async execute(data: DeleteTimelineDTO) {
    const { id_timeline } = data;
    return await this.useRepo.delete(id_timeline);
  }
}
