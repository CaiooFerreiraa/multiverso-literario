import { CreateTimelineDTO } from "../../../application/timeline/dtos/CreateTimilineDTO"

export class Timeline {
  public dateStart: Date
  public dateEnd: Date
  public authorBook: string
  public nameBook: string

  constructor(data: CreateTimelineDTO) {
    this.authorBook = data.authorBook;
    this.dateEnd = data.dateEnd;
    this.dateStart = data.dateStart;
    this.nameBook = data.nameBook;
  }
}