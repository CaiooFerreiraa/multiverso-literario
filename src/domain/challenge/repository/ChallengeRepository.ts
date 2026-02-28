import { Challenge } from "../entities/Challenge";

export interface ChallengeRepository {
  create(challenge: Challenge): Promise<any>;
  readAll(is_premium?: boolean): Promise<any>;
  completeChallenge(id_user: number, id_challenge: number, points: number): Promise<any>;
  readUserChallenges(id_user: number): Promise<any>;
  readUserPoints(id_user: number): Promise<any>;
  delete(id_challenge: number): Promise<any>;
}
