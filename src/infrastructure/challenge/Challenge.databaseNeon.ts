import { Challenge } from "../../domain/challenge/entities/Challenge";
import { ChallengeRepository } from "../../domain/challenge/repository/ChallengeRepository";
import { Database } from "../database/neon";

export class ChallengeDatabaseNeon implements ChallengeRepository {
  constructor(private database: Database) { }

  async create(challenge: Challenge): Promise<any> {
    try {
      const [result] = await this.database.query(
        `INSERT INTO reading_challenges (title, description, points, challenge_type, is_premium)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id_challenge`,
        [challenge.title, challenge.description, challenge.points, challenge.challenge_type, challenge.is_premium]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async readAll(is_premium?: boolean): Promise<any> {
    try {
      if (typeof is_premium !== "undefined") {
        return await this.database.query(
          `SELECT * FROM reading_challenges WHERE is_premium = $1 ORDER BY created_at DESC`,
          [is_premium]
        );
      }
      return await this.database.query(
        `SELECT * FROM reading_challenges ORDER BY created_at DESC`
      );
    } catch (error) {
      throw error;
    }
  }

  async completeChallenge(id_user: number, id_challenge: number, points: number): Promise<any> {
    try {
      await this.database.query(
        `INSERT INTO user_challenges (id_user, id_challenge, points_earned)
         VALUES ($1, $2, $3)
         ON CONFLICT (id_user, id_challenge) DO NOTHING`,
        [id_user, id_challenge, points]
      );
    } catch (error) {
      throw error;
    }
  }

  async readUserChallenges(id_user: number): Promise<any> {
    try {
      return await this.database.query(
        `SELECT rc.*, uc.completed_at, uc.points_earned
         FROM reading_challenges rc
         LEFT JOIN user_challenges uc ON rc.id_challenge = uc.id_challenge AND uc.id_user = $1
         ORDER BY rc.created_at DESC`,
        [id_user]
      );
    } catch (error) {
      throw error;
    }
  }

  async readUserPoints(id_user: number): Promise<any> {
    try {
      const [result] = await this.database.query(
        `SELECT COALESCE(SUM(points_earned), 0) as total_points,
                COUNT(*) as challenges_completed
         FROM user_challenges
         WHERE id_user = $1`,
        [id_user]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async delete(id_challenge: number): Promise<any> {
    try {
      await this.database.query(
        `DELETE FROM reading_challenges WHERE id_challenge = $1`,
        [id_challenge]
      );
    } catch (error) {
      throw error;
    }
  }
}
