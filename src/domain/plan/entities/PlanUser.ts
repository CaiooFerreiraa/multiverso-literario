import { CreateBuyPlanDTO } from "../../../application/plan/dtos/CreateBuyPlanDTO";

type PlanUserDTO = CreateBuyPlanDTO 

export class PlanUser {
  public id_user: number;
  public id_plan: number;
  public price_paid: number;
  public status: string;
  public method_payment: string;

  constructor(planUser: PlanUserDTO) {
    this.id_plan = planUser.id_plan;
    this.id_user = planUser.id_user;
    this.price_paid = planUser.price_paid;
    this.status = planUser.status;
    this.method_payment = planUser.method_payment;
  }
}