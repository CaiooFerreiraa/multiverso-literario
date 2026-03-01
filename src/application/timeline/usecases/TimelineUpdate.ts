import { Timeline } from "../../../domain/timeline/entities/Timeline";
import { TimelineRepository } from "../../../domain/timeline/repository/TimelineRepository";
import { UpdateTimelineDTO } from "../dtos/UpdateTimelineDTO";

export class TimelineUpdate {
  constructor(private useRepo: TimelineRepository) {};

  async execute(data: UpdateTimelineDTO) {
    const { id_timeline, ...useData } = data;
    const timeline = new Timeline(useData);
    return await this.useRepo.update(id_timeline, timeline);
  }
}
