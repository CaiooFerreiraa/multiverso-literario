import { CreatePlanDTO } from "../../../application/plan/dtos/CreatePlanDTO";

type PlanDTO = CreatePlanDTO

export class Plan {
  public value: number;
  public duraction: string;
  public title: string;
  public benefits: string[];
  public view_type: 'adult' | 'student';
  public features: string[];

  constructor(plan: PlanDTO) {
    this.value = plan.value
    this.duraction = plan.duraction;
    this.title = plan.title;
    this.benefits = plan.benefits || [];
    this.view_type = plan.view_type || 'adult';
    this.features = plan.features || [];
  }
}

