import { CreateTimelineDTO } from "../../../application/timeline/dtos/CreateTimelineDTO"

export class Timeline {
  public dateStart: string
  public dateEnd: string
  public authorBook: string
  public nameBook: string

  constructor(data: CreateTimelineDTO) {
    this.authorBook = data.authorBook.trim() || "Autor não informado";
    this.dateEnd = data.dateEnd;
    this.dateStart = data.dateStart;
    this.nameBook = data.nameBook.trim() || "Cronograma sem livro";
  }
}
