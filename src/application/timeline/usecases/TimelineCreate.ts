import { Timeline } from "../../../domain/timeline/entities/Timeline";
import { TimelineRepository } from "../../../domain/timeline/repository/TimelineRepository";
import { CreateTimelineDTO } from "../dtos/CreateTimelineDTO";

export class TimelineCreate {
  constructor(private useRepo: TimelineRepository) {};

  async execute(data: CreateTimelineDTO) {
    const timeline = new Timeline(data)
    return await this.useRepo.create(timeline);
  }
}