import { Timeline } from "../../domain/timeline/entities/Timeline";
import { TimelineRepository } from "../../domain/timeline/repository/TimelineRepository";

export class TimelineDatabase implements TimelineRepository {
  constructor(private database: any) {}

  async create(timeline: Timeline): Promise<any> {
    try {
      
    } catch (error) {
      
    }
  }

  private async insertDatesTimeline(timeline: Timeline) {
    try {
      
    } catch (error) {
      
    }
  }

  read(id_timeline: number): Promise<Timeline> {
    throw new Error("")
  }

  update(id_timeline: number, timeline: Timeline): Promise<any> {
    throw new Error("")
  }

  delete(id_timeline: number): Promise<any> {
    throw new Error("")
  }
}