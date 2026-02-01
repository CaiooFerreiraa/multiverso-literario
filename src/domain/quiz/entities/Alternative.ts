import { CreateQuizAlternativeDTO } from "../../../application/quiz/dtos/CreateQuizDTO"
import { UpdateQuizAlternativeDTO } from "../../../application/quiz/dtos/UpdateQuizDTO"

type AlternativeDTO = CreateQuizAlternativeDTO | UpdateQuizAlternativeDTO;

export class Alternative {
  public alternative: string
  public is_correct: boolean
  public id_alternative?: number

  constructor(data: CreateQuizAlternativeDTO);
  constructor(data: UpdateQuizAlternativeDTO);

  constructor(data: AlternativeDTO) {
    this.alternative = data.alternative
    this.is_correct = data.is_correct

    if ("id_alternative" in data) {
      this.id_alternative = data.id_alternative;
    }
  }
}