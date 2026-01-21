import { Timeline } from "../../domain/timeline/entities/Timeline";
import { TimelineRepository } from "../../domain/timeline/repository/TimelineRepository";

export class TimelineDatabase implements TimelineRepository {
  constructor(private database: any) {}

  async create(timeline: Timeline): Promise<any> {
    try {
      await this.insertDatesTimeline(timeline)
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  private async insertDatesTimeline(timeline: Timeline) {
    try {
      const [{id_timeline}] = await this.database<{
          id_timeline: number}[]>
        `
          INSERT INTO timeline (date_start, date_end) VALUES (
            ${timeline.dateStart}, ${timeline.dateEnd}
          ) RETURNING id_timeline
        `

        await this.insertBookTimeline(id_timeline, timeline);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  private async insertBookTimeline(id_timeline: number, timeline: Timeline) {
    try {
      await this.database`
        INSERT INTO timeline_book (id_timeline_book, author, name) VALUES (
          ${id_timeline}, ${timeline.authorBook}, ${timeline.nameBook}
        )
      `
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async read(id_timeline: number): Promise<Timeline> {
    try {
      const timeline = await this.database`
        SELECT a.date_start, a.date_end, b.name, b.author
        FROM timeline a
        JOIN timeline_book b ON a.id_timeline = b.id_timeline_book
        WHERE a.id_timeline = ${id_timeline};
      `
      console.log(timeline);

      return timeline;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  update(id_timeline: number, timeline: Timeline): Promise<any> {
    throw new Error("")
  }

  delete(id_timeline: number): Promise<any> {
    throw new Error("")
  }
}