import { CreatePlanDTO } from "../../../application/plan/dtos/CreatePlanDTO";

type PlanDTO = CreatePlanDTO

export class Plan {
  public value: number;
  public duraction: string;

  constructor(plan: PlanDTO) {
    this.duraction = plan.duraction;
    this.value = plan.value
  }
}