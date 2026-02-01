import { Timeline } from "../../domain/timeline/entities/Timeline";
import { TimelineRepository } from "../../domain/timeline/repository/TimelineRepository";
import { Database } from "../database/neon";

export class TimelineNeonDatabase implements TimelineRepository {
  constructor(private database: Database) { }

  async create(timeline: Timeline): Promise<any> {
    try {
      await this.database.transaction(async (tx: Database) => {
        await this.insertDatesTimeline(tx, timeline)
      }, { isolationLevel: "RepeatableRead" })
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  private async insertDatesTimeline(tx: Database, timeline: Timeline) {
    const [result] = await tx`
        INSERT INTO timeline (date_start, date_end) VALUES (
          ${timeline.dateStart}, ${timeline.dateEnd}
        ) RETURNING id_timeline
      `

    await this.insertBookTimeline(tx, result.id_timeline, timeline);
  }

  private async insertBookTimeline(tx: Database, id_timeline: number, timeline: Timeline) {
    await tx`
      INSERT INTO timeline_book (id_timeline_book, author, name) VALUES (
        ${id_timeline}, ${timeline.authorBook}, ${timeline.nameBook}
      ) RETURNING id_timeline_book
    `
  }

  private async addIdTimelineAndIdBookAndIdUserInTimelineBelongs(id_timeline: number, id_timeline_book: number, id_user: number): Promise<any> {
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

  async read(id_timeline: number): Promise<any> {
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

  async delete(id_timeline: number): Promise<any> {
    try {
      await this.database`
        DELETE FROM timeline
        WHERE id_timeline = ${id_timeline}
      `;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(Error));
    }
  }
}