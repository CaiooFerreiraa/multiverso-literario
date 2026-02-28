import { Challenge } from "../../../domain/challenge/entities/Challenge";
import { ChallengeRepository } from "../../../domain/challenge/repository/ChallengeRepository";
import { CreateChallengeDTO } from "../dtos/CreateChallengeDTO";

export class CreateChallenge {
  constructor(private repo: ChallengeRepository) { }

  async execute(data: CreateChallengeDTO) {
    const challenge = new Challenge(data);
    return await this.repo.create(challenge);
  }
}
