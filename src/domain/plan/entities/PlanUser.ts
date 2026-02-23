import { CreatePlanDTO } from "../../../application/plan/dtos/CreatePlanDTO";

type PlanDTO = CreatePlanDTO

export class PlanUser {
  public value: number;
  public duraction: string;

  constructor(plan: PlanDTO) {
    this.duraction = plan.duraction;
    this.value = plan.value
  }
}