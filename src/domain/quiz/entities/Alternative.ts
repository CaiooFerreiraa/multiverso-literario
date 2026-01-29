import { CreateQuizAlternativeDTO } from "../../../application/quiz/dtos/CreateQuizDTO"

export class Alternative {
  public alternative: string
  public is_correct: boolean

  constructor(data: CreateQuizAlternativeDTO) {
    this.alternative = data.alternative
    this.is_correct = data.is_correct
  }
}