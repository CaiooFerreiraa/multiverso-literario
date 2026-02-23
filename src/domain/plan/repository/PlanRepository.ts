import { Plan } from "../entities/Plan"
import { PlanUser } from "../entities/PlanUser"

export interface PlanRepository {
  create(plan: Plan): Promise<any>
  read(id_plan: number): Promise<any>
  readAll(): Promise<any>
  update(id_plan: number): Promise<any>
  delete(id_plan: number): Promise<any>
  contract(planUser: PlanUser): Promise<any>
  cancel(id_planUser: number): Promise<any>
}