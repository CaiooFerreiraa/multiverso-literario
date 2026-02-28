import { ContributionRepository } from "../../../domain/contribution/repository/ContributionRepository";

export class ReadContributionsByBook {
  constructor(private repo: ContributionRepository) { }

  async execute(id_timeline_book: number) {
    return await this.repo.readByBook(id_timeline_book);
  }
}
