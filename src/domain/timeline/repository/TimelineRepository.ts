import { Timeline } from "../entities/Timeline";

export interface TimelineRepository {
  create(timeline: Timeline): Promise<any>;
  read(id_timeline: number): Promise<Timeline>;
  update(id_timeline: number, timeline: Timeline): Promise<any>;
  delete(id_timeline: number): Promise<any>
}