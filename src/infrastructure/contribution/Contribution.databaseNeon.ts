import { Contribution } from "../../domain/contribution/entities/Contribution";
import { ContributionRepository } from "../../domain/contribution/repository/ContributionRepository";
import { Database } from "../database/neon";

export class ContributionDatabaseNeon implements ContributionRepository {
  constructor(private database: Database) { }

  async create(contribution: Contribution): Promise<any> {
    try {
      const [result] = await this.database.query(
        `INSERT INTO contributions (content, id_user, id_timeline_book)
         VALUES ($1, $2, $3)
         RETURNING id_contribution, content, id_user, id_timeline_book, created_at`,
        [contribution.content, contribution.id_user, contribution.id_timeline_book]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async readByBook(id_timeline_book: number): Promise<any> {
    try {
      return await this.database.query(
        `SELECT c.id_contribution, c.content, c.created_at, 
                u.fullname, u.email
         FROM contributions c
         JOIN member m ON c.id_user = m.id_user
         JOIN users u ON m.id_user = u.id_user
         WHERE c.id_timeline_book = $1
         ORDER BY c.created_at DESC`,
        [id_timeline_book]
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(id_contribution: number): Promise<any> {
    try {
      await this.database.query(
        `DELETE FROM contributions WHERE id_contribution = $1`,
        [id_contribution]
      );
    } catch (error) {
      throw error;
    }
  }
}
