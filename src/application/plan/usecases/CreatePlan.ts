import { Plan } from "../../../domain/plan/entities/Plan";
import { PlanRepository } from "../../../domain/plan/repository/PlanRepository";
import { CreatePlanDTO } from "../dtos/CreatePlanDTO";

export class CreatePlan {
  constructor(private useRepo: PlanRepository) { }

  async execute(data: CreatePlanDTO) {
    const plan = new Plan(data);
    return await this.useRepo.create(plan);
  }
}
