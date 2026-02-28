import { Contribution } from "../entities/Contribution";

export interface ContributionRepository {
  create(contribution: Contribution): Promise<any>;
  readByBook(id_timeline_book: number): Promise<any>;
  delete(id_contribution: number): Promise<any>;
}
