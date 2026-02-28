import { CreateContributionDTO } from "../../../application/contribution/dtos/CreateContributionDTO";

export class Contribution {
  public content: string;
  public id_user: number;
  public id_timeline_book: number;

  constructor(data: CreateContributionDTO) {
    this.content = data.content;
    this.id_user = data.id_user;
    this.id_timeline_book = data.id_timeline_book;
  }
}
