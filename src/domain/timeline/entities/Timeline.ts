import { CreateTimelineDTO } from "../../../application/timeline/dtos/CreateTimilineDTO"

export class Timeline {
  private dateStart: Date
  private dateEnd: Date
  private authorBook: string
  private nameBook: string

  constructor(data: CreateTimelineDTO) {
    this.authorBook = data.authorBook;
    this.dateEnd = data.dateEnd;
    this.dateStart = data.dateStart;
    this.nameBook = data.nameBook;
  }
}