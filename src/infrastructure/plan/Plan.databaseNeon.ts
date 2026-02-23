import { Plan } from "../../domain/plan/entities/Plan";
import { PlanUser } from "../../domain/plan/entities/PlanUser";
import { PlanRepository } from "../../domain/plan/repository/PlanRepository";
import { Database } from "../database/neon";

export class PlanDatabaseNeon implements PlanRepository{
    constructor(private database: Database) { };

    create(plan: Plan): Promise<any> {
        
    }

    read(id_plan: number): Promise<any> {
        
    }

    readAll(): Promise<any> {
        
    }

    update(id_plan: number): Promise<any> {
        
    }

    delete(id_plan: number): Promise<any> {
        
    }


    contract(planUser: PlanUser): Promise<any> {
        
    }

    cancel(id_planUser: number): Promise<any> {
        
    }
}