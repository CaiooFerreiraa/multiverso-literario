import { Timeline } from "../../domain/timeline/entities/Timeline";
import { TimelineRepository } from "../../domain/timeline/repository/TimelineRepository";
import { Database } from "../database/neon";

export class TimelineNeonDatabase implements TimelineRepository {
  constructor(private database: Database) { }

  async create(timeline: Timeline): Promise<any> {
    try {
      await this.database.transaction(async (tx: Database) => {
        await this.insertDatesTimeline(tx, timeline);
      }, { isolationLevel: "RepeatableRead" });
    } catch (error: unknown) {
      throw error;
    }
  }

  private async insertDatesTimeline(tx: Database, timeline: Timeline) {
    const [result] = await tx.query(
      `INSERT INTO timeline (date_start, date_end) VALUES (
        $1, $2
      ) RETURNING id_timeline`,
      [timeline.dateStart, timeline.dateEnd]
    );

    await this.insertBookTimeline(tx, result.id_timeline, timeline);
  }

  private async insertBookTimeline(tx: Database, id_timeline: number, timeline: Timeline) {
    await tx.query(
      `INSERT INTO timeline_book (id_timeline_book, author, name) VALUES (
        $1, $2, $3
      ) RETURNING id_timeline_book`,
      [id_timeline, timeline.authorBook, timeline.nameBook]
    );
  }

  private async addIdTimelineAndIdBookAndIdUserInTimelineBelongs(id_timeline: number, id_timeline_book: number, id_user: number): Promise<any> {
    try {
      await this.database.query(
        `INSERT INTO timeline_belongs (id_timeline, id_timeline_book, id_user) VALUES (
          $1, $2, $3
        )`,
        [id_timeline, id_timeline_book, id_user]
      );
    } catch (error) {
      throw error;
    }
  }

  async read(id_timeline: number): Promise<any> {
    try {
      const timeline = await this.database.query(
        `SELECT a.date_start, a.date_end, b.name, b.author
         FROM timeline a
         JOIN timeline_book b ON a.id_timeline = b.id_timeline_book
         WHERE a.id_timeline = $1;`,
        [id_timeline]
      );
      return timeline;
    } catch (error: unknown) {
      throw error;
    }
  }

  async update(id_timeline: number, timeline: Timeline): Promise<any> {
    try {
      await this.updateDatesTimeline(id_timeline, timeline);
    } catch (error) {
      throw error;
    }
  }

  private async updateDatesTimeline(id_timeline: number, timeline: Timeline): Promise<any> {
    try {
      await this.database.query(
        `UPDATE timeline
         SET date_start = $1, date_end = $2
         WHERE id_timeline = $3`,
        [timeline.dateStart, timeline.dateEnd, id_timeline]
      );

      await this.updateBookTimeline(id_timeline, timeline);
    } catch (error) {
      throw error;
    }
  }

  private async updateBookTimeline(id_timeline: number, timeline: Timeline): Promise<any> {
    try {
      await this.database.query(
        `UPDATE timeline_book
         SET name = $1, author = $2
         WHERE id_timeline_book = $3`,
        [timeline.nameBook, timeline.authorBook, id_timeline]
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(id_timeline: number): Promise<any> {
    try {
      await this.database.query(
        `DELETE FROM timeline
         WHERE id_timeline = $1`,
        [id_timeline]
      );
    } catch (error) {
      throw error;
    }
  }
}
