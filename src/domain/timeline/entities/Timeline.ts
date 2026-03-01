import { CreateTimelineDTO } from "../../../application/timeline/dtos/CreateTimelineDTO"

export class Timeline {
  public dateStart: Date
  public dateEnd: Date
  public authorBook: string
  public nameBook: string

  constructor(data: CreateTimelineDTO) {
    this.authorBook = data.authorBook;
    this.dateEnd = new Date(data.dateEnd);
    this.dateStart = new Date(data.dateStart);
    this.nameBook = data.nameBook;
  }
}
