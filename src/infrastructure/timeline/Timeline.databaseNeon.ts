import { Timeline } from "../../domain/timeline/entities/Timeline";
import { TimelineRepository } from "../../domain/timeline/repository/TimelineRepository";

export class TimelineNeonDatabase implements TimelineRepository {
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
        ) RETURNING id_timeline_book
      `
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  private async addIdTimelineAndIdBookAndIdUserInTimelineBelongs(id_timeline: number, id_timeline_book:number, id_user: number): Promise<any> {
    try {
      await this.database`
        INSERT INTO timeline_belongs (id_timeline, id_timeline_book, id_user) VALUES (
          ${id_timeline}, ${id_timeline_book}, ${id_user}
        )
      `
    } catch (error) {
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
      return timeline;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async update(id_timeline: number, timeline: Timeline): Promise<any> {
    try {
      await this.updateDatesTimeline(id_timeline, timeline);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  private async updateDatesTimeline(id_timeline: number, timeline: Timeline): Promise<any> {
    try {
      await this.database`
        UPDATE timeline
        SET date_start = ${timeline.dateStart}, date_end = ${timeline.dateEnd}
        WHERE id_timeline = ${id_timeline}
      `

      await this.updateBookTimeline(id_timeline, timeline)
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  private async updateBookTimeline(id_timeline: number, timeline: Timeline): Promise<any> {
    try {
      await this.database`
        UPDATE timeline_book
        SET name = ${timeline.nameBook}, author = ${timeline.authorBook}
        WHERE id_timeline_book = ${id_timeline}
      `
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  delete(id_timeline: number): Promise<any> {
    throw new Error("")
  }
}