import { Contribution } from "../../../domain/contribution/entities/Contribution";
import { ContributionRepository } from "../../../domain/contribution/repository/ContributionRepository";
import { CreateContributionDTO } from "../dtos/CreateContributionDTO";

export class CreateContribution {
  constructor(private repo: ContributionRepository) { }

  async execute(data: CreateContributionDTO) {
    const contribution = new Contribution(data);
    return await this.repo.create(contribution);
  }
}
