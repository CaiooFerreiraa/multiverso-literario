import { CreateChallengeDTO } from "../../../application/challenge/dtos/CreateChallengeDTO";

export class Challenge {
  public title: string;
  public description: string;
  public points: number;
  public challenge_type: string;
  public is_premium: boolean;

  constructor(data: CreateChallengeDTO) {
    this.title = data.title;
    this.description = data.description;
    this.points = data.points;
    this.challenge_type = data.challenge_type;
    this.is_premium = data.is_premium;
  }
}
